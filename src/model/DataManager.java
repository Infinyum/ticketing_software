package model;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

public class DataManager {

	public DBManager db;

	public DataManager() {
		db = new DBManager();
	}

	public String getMyTechTickets(int id) throws SQLException, IOException {
		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getTicketByTechnician.sql", true), id);

		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String outputJSON = ow.writeValueAsString(db.convertToList(rs));

		return outputJSON;
	}

	public String getAllTickets() throws SQLException, IOException {
		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getAllTickets.sql", true));

		// Get the results of the first query as a Java object
		List<HashMap<String, Object>> rl = db.convertToList(rs);

		// For each "JSON" object from the results
		for (HashMap<String, Object> jsonObj : rl) {
			String ticketID = (String) jsonObj.get("id");

			// Get the skills related to this ticket
			ResultSet rs2 = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getCompetenceByTicket.sql", true),
					ticketID);
			List<HashMap<String, Object>> rl2 = db.convertToList(rs2);
			// Add the results to this JSON object
			jsonObj.put("required_skills", rl2);

			// Get the comments related to this ticket
			rs2 = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getCommentaireByTicket.sql", true), ticketID);
			rl2 = db.convertToList(rs2);
			// Add the results to this JSON object
			jsonObj.put("comments", rl2);
		}

		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String outputJSON = ow.writeValueAsString(rl);

		return outputJSON;
	}

	public String connectUser(String id, String inputPwd) throws SQLException, IOException, NoSuchAlgorithmException {
		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getUserInfo.sql", true), id);

		// Get the results of the first query as a Java object
		List<HashMap<String, Object>> rl = db.convertToList(rs);
		// Getting the password and the account type
		String dbPwd = (String) rl.get(0).get("mot_de_passe");
		String type_compte = (String) rl.get(0).get("type_compte");

		MessageDigest digest = MessageDigest.getInstance("SHA-256");
		byte[] encodedHash = digest.digest(dbPwd.getBytes(StandardCharsets.UTF_8));
		dbPwd = bytesToHex(encodedHash);

		// TODO: change exception mechanism
		if (!inputPwd.equals(dbPwd)) {
			throw new IOException("Wrong password");
		}

		// Create the response from scratch
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		HashMap<String, Object> testMap = new HashMap<>();

		switch (type_compte) {
		case "Technicien":
			testMap.put("token", "montoken");
			testMap.put("page", "technicien");
			break;
		case "Opérateur d'appel":
			testMap.put("token", "montoken");
			testMap.put("page", "operator");
			break;
		case "Responsable technique":
			testMap.put("token", "montoken");
			testMap.put("page", "responsable");
			break;
		case "Administrateur":
			testMap.put("token", "montoken");
			testMap.put("page", "admin");
			break;
		default:
			testMap.put("token", "erreur");
			testMap.put("page", "erreur");
		}

		return ow.writeValueAsString(testMap);
	}

	private static String bytesToHex(byte[] hash) {
		StringBuffer hexString = new StringBuffer();
		for (int i = 0; i < hash.length; i++) {
			String hex = Integer.toHexString(0xff & hash[i]);
			if (hex.length() == 1)
				hexString.append('0');
			hexString.append(hex);
		}
		return hexString.toString();
	}
}
