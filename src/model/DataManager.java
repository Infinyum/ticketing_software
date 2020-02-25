package model;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
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
		ResultSetMetaData rsm = rs.getMetaData();
		
		// Get the results of the first query as a Java object
		List<HashMap<String, Object>> rl = db.convertToList(rs);

		// For each "JSON" object from the results
		for (HashMap<String, Object> jsonObj : rl) {
			String ticketID = (String) jsonObj.get("id");

			for (int i = 1 ; i <= rsm.getColumnCount() ; i++) {
				jsonObj.put(rs.getMetaData().getColumnLabel(i), jsonObj.remove(rs.getMetaData().getColumnName(i)));
			}

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
			break;
		}

		return ow.writeValueAsString(testMap);
	}

	public void updateDureeTicket(String id, String statut, String duree) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\updateDureeTicket.sql", true), statut, duree, id);
	}
	
	public void addDemandeur(String email, String client, String nom, String telephone) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addDemandeur.sql", true), email, client, nom, telephone);
	}
}
