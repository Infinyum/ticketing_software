package model;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.ws.rs.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

@Path("/")
public class RESTAPI {

	DBManager db = new DBManager();

	@GET
	@Path("/hello")
	@Produces("application/json")
	public String sayHelloGet(@QueryParam("nom") String nom) throws IOException, SQLException {
		SQLQuery q = new SQLQuery("SELECT * FROM client WHERE nom LIKE ?", false);
		ResultSet rs = db.ExecuteSQLQuery(q, nom);
		
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String json = ow.writeValueAsString(db.convertToList(rs));
        
        return json;
	}

	/*
	 * @GET
	 * 
	 * @Path("/hello")
	 * 
	 * @Produces("application/json") public MyData sayHelloGet(@QueryParam("nom")
	 * String nom) { MyData d = new MyData(); d.setDate(LocalDate.now().toString());
	 * d.setMessage("Bonjour " + nom); return d; }
	 */

	/*
	 * @POST
	 * 
	 * @Path("/hello")
	 * 
	 * @Produces("application/json") public MyData sayHelloPost(@FormParam("nom")
	 * String nom) { MyData d = new MyData(); d.setDate(LocalDate.now().toString());
	 * d.setMessage("Bonjour " + nom); return d; }
	 * 
	 * @GET
	 * 
	 * @Path("/get/{id}")
	 * 
	 * @Produces("application/json") public Response getRessource(@PathParam("id")
	 * int id){ MyData d = database.get(id); if (d == null) { return
	 * Response.status(404, "Ressource not found").build(); } else { return
	 * Response.ok(d).build(); } }
	 * 
	 * @POST
	 * 
	 * @Path("/add")
	 * 
	 * @Consumes("application/json")
	 * 
	 * @Produces("text/plain") public Response createRessource(MyData res) {
	 * database.put(count, res); count = count + 1; return
	 * Response.ok("Successfully created ressource #" + (count - 1)).build(); }
	 * 
	 * @PUT
	 * 
	 * @Path("/update/{id}")
	 * 
	 * @Consumes("application/json")
	 * 
	 * @Produces("text/plain") public Response updateRessource(@PathParam("id") int
	 * id, MyData res) { if (database.containsKey(id)) { database.put(id, res);
	 * return Response.ok("Successfully updated ressource #" + id).build(); } else {
	 * return Response.status(404, "Ressource #" + id + " doesn't exist").build(); }
	 * 
	 * }
	 * 
	 * @DELETE
	 * 
	 * @Path("/delete/{id}")
	 * 
	 * @Produces("text/plain") public Response deleteRessource(@PathParam("id") int
	 * id) { if (database.containsKey(id)) { database.remove(id); return
	 * Response.ok("Successfully deleted ressource #" + id).build(); } else { return
	 * Response.status(404, "Ressource #" + id + " doesn't exist").build(); }
	 * 
	 * }
	 */
}
