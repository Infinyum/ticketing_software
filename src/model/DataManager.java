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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
		String nom_utilisateur = (String) rl.get(0).get("nom");

		// TODO: change exception mechanism
		if (!inputPwd.equals(dbPwd)) {
			throw new IOException("Wrong password");
		}

		// Create the response from scratch
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		HashMap<String, Object> testMap = new HashMap<>();

		testMap.put("nom", nom_utilisateur);
		testMap.put("id", id);
		
		switch (type_compte) {
		case "Technicien":
			testMap.put("page", "technicien");
			break;
		case "Opérateur d'appel":
			testMap.put("page", "operator");
			break;
		case "Responsable technique":
			testMap.put("page", "responsable");
			break;
		case "Administrateur":
			testMap.put("page", "admin");
			break;
		default:
			// TODO: change exception mechanism
			throw new IOException("Switch default");
		}

		return ow.writeValueAsString(testMap);
	}

	public void updateDureeTicket(String id, String statut, String duree) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\updateDureeTicket.sql", true), statut, duree, id);
	}
	
	public void addDemandeur(String email, String client, String nom, String telephone) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addDemandeur.sql", true), email, client, nom, telephone);
	}
	
	public void addCategorie(String categorie) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addCategorie.sql", true), categorie);
	}
	
	public void removeCategorie(String categorie) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\removeCategorie.sql", true), categorie);
	}
	
	public void addCompetence(String competence) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addCompetence.sql", true), competence);
	}
	
	public void removeCompetence(String categorie) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\removeCompetence.sql", true), categorie);
	}
	
	public void changePriority(String client, String prioritaire) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\changePriorityClient.sql", true), prioritaire, client);
	}
	
	public void updateTicket(Map<String, Object> ticket) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\updateTicket.sql", true),
				ticket.get("object"), ticket.get("weight"), ticket.get("address"),
				ticket.get("latitude"), ticket.get("longitude"), ticket.get("asker_email"),
				ticket.get("asker_name"), ticket.get("category"), ticket.get("status"),
				ticket.get("call_date"), ticket.get("description"), ticket.get("type"),
				ticket.get("client"), ticket.get("planned_duration"), ticket.get("actual_duration"),
				ticket.get("intervention_datetime"), ticket.get("technician_id"), ticket.get("id"));
	}
	
	public void createTicket(Map<String, Object> ticket) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\createTicket.sql", true),
				ticket.get("id"), ticket.get("id_parent"), ticket.get("created_by"),
				ticket.get("asker_email"), ticket.get("address"), ticket.get("weight"),
				ticket.get("creation_date"), ticket.get("status"), ticket.get("type"),
				ticket.get("object"), ticket.get("description"), ticket.get("call_date"), 
				ticket.get("planned_duration"), ticket.get("actual_duration"));
		
		// Insert an intervention if not null!
		if (ticket.get("intervention_datetime") != null && ticket.get("technician_id") != null) {
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\createIntervention.sql", true),
					ticket.get("technician_id"), ticket.get("id"), ticket.get("intervention_datetime"));
		}
		
		// Insert all the categories
		ArrayList<String> categories = (ArrayList<String>) ticket.get("categories");
		for (String cat : categories) {
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\createCategorieTicket.sql", true), ticket.get("id"), cat);
		}
		
		// Insert all the competences
		ArrayList<String> competences = (ArrayList<String>) ticket.get("skills");
		for (String com : competences) {
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\createCompetenceTicket.sql", true), ticket.get("id"), com);
		}
		
		// Insert all the comments
		ArrayList<Map<String, Object>> comments = (ArrayList<Map<String, Object>>) ticket.get("comments");
		for (Map<String, Object> c : comments) {
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\createCommentaireTicket.sql", true), ticket.get("id"), c.get("id"), c.get("commentaire"));
		}
	}
	
	public void createCompte(Map<String, Object> input) throws SQLException, IOException {
		db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\createCompte.sql", true),
				input.get("id"), input.get("name"), input.get("email"),
				input.get("phone"), input.get("pwd"), input.get("acctype"));
		String accType = (String) input.get("acctype");
		
		switch (accType) {
		case "Technicien":
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addTechnicien.sql", true),
					input.get("id"), input.get("id_resp"));
			break;
		case "Opérateur d'appel":
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addOperateur.sql", true),
					input.get("id"));
			break;
		case "Responsable technique":
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addRespTech.sql", true),
					input.get("id"));
			break;
		case "Administrateur":
			db.UpdateSQLQuery(new SQLQuery(".\\resources\\sql\\addAdmin.sql", true),
					input.get("id"));
			break;
		default:
			throw new IOException("IN THE DEFAULT!");
		}
	}

	public String getTechniciansFromCompetences(ArrayList<String> competences, String respId) throws SQLException, IOException {
		// Launch request and get result
		
		
		/*String competencesStr = "(";
		for (int i = 0 ; i < competences.size() ; i++) {
			// Last item : no comma
			if (i == competences.size() - 1) {
				competencesStr += "'" + competences.get(i) + "'";
			}
			else {
				competencesStr += "'" + competences.get(i) + "',";
			}
		}
		competencesStr += ")";*/
		
		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getTechniciansFromCompetences.sql", true), respId, competences);

		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String outputJSON = ow.writeValueAsString(db.convertToList(rs));

		return outputJSON;
	}
	
	public String getCompetences() throws SQLException, IOException {
		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getExistingCompetences.sql", true));
		
		// Get the results of the first query as a Java object
		List<HashMap<String, Object>> rl = db.convertToList(rs);

		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String outputJSON = ow.writeValueAsString(rl);

		return outputJSON;
	}
	
	public String getCategories() throws SQLException, IOException {
		ResultSet rs = db.ExecuteSQLQuery(new SQLQuery(".\\resources\\sql\\getExistingCategories.sql", true));
		
		// Get the results of the first query as a Java object
		List<HashMap<String, Object>> rl = db.convertToList(rs);

		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String outputJSON = ow.writeValueAsString(rl);

		return outputJSON;
	}
}
