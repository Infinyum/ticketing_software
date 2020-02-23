package model;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
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

		List<HashMap<String, Object>> rl = db.convertToList(rs);
		
		for (HashMap<String, Object> jsonObj : rl) {
			String id = (String)jsonObj.get("id");
			
			ResultSet rs2 = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getCompetenceByTicket.sql", true), id);
			List<HashMap<String, Object>> rl2 = db.convertToList(rs2);
			
			jsonObj.put("required_skills", rl2);
			
			rs2 = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getCommentaireByTicket.sql", true), id);
			rl2 = db.convertToList(rs2);
			
			jsonObj.put("comments", rl2);
		}
		
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String outputJSON = ow.writeValueAsString(rl);

		return outputJSON;
	}
	
	public String connectUser(String id, String inputPwd) throws SQLException, IOException {

		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getUserInfo.sql", true), id);

		List<HashMap<String, Object>> rl = db.convertToList(rs);
		String dbPwd = (String) rl.get(0).get("mot_de_passe");
		String type_compte = (String) rl.get(0).get("type_compte");

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
		
		String outputJSON = ow.writeValueAsString(testMap);
		
		/*String outputJSON = "";
		
		if (inputPwd.equals(dbPwd)) {
			outputJSON = ow.writeValueAsString(rl);
		} else {
			 HashMap<String,Object> outMap = new HashMap<>(); outMap.put("message", "Mauvais mot de passe"); outputJSON = ow.writeValueAsString(outMap);
		}*/

		return outputJSON;
	}
}
