package controller;

//Java standard lib imports
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.io.InputStream;
import java.io.FileInputStream;

//JAX-RS
import javax.ws.rs.*;

//JAX-RS (Java REST API implementation)
//Might be needed at some pointimport javax.inject.Singleton;
import javax.print.attribute.standard.Media;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//Jackson
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

//Home classes
import model.DBManager;
import model.SQLQuery;


@Path("/")
public class RESTAPI {

	private DBManager db = new DBManager();
	private static final String BASE = "./resources/Views/Common/";

	//TODO : Remove (testing purposes)
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

	
	 /**
     * Method with no path that serves the HTML content to the user
     * @return a FileInputStream with the content of the HTML page
     * @throws IOException, if failed to access the HTML file
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    public InputStream getIndex() throws IOException{
    	
    	//(index-2.html is the legacy name for the HTML main file)
    	return new FileInputStream("./resources/Views/Home.html");
    }
	
    /**
     * Method with "Common/filePath" path that serves all the common dependencies (CSS + JS content to serve to the user)
     * @return a FileInputStream with the content of the dependency (depends what the HTML page needs)
     * @throws IOException, if failed to access the file
     */
    @Path("Common/{path: .+}")
    @GET
    @Produces({"text/html", "text/css", "application/javascript", "image/png"})
    public InputStream getFile(@PathParam("path") String path) throws IOException{
    	
    	return new FileInputStream(BASE + path);
    	
    }
	
}
