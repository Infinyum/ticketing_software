package controller;

//Java standard lib imports
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.io.InputStream;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Map;

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

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
	
    
    /**
	 * Provide the JSON data to display according to the queries argument (in the JSONdata parameter)
	 * @param JSONdata, information coming from the UI under JSON format : parameters for the SQL query that grabs data
	 *      JSONparam, one JSON paraam
	 * @return data to display (might be empty if failed or nothing matches the SQL query)
	 */
	public ResultSet getData(String JSONdata){
		
		
		ObjectMapper mapper = new ObjectMapper();
    	
		//!\\-----------------------------------------------------------------WARNING----------------------------------------------------------------//!\\
    	//  The map created below is actually non generic : Map<Object, Object> => provoke implicit conversions (witch can lead to ClassCastException)  \\
		//  					This is due to Jackson's way of converting JSON data into a Java Map (because of the strong type checking) 				\\
    	// 								We type the first attribute because we know for sure that this is a string (JSON format)						\\
		//!\\----------------------------------------------------------------------------------------------------------------------------------------//!\\
    	Map<String, Object> dataMap = null;
    	
		try {
			dataMap = mapper.readValue(JSONdata, Map.class);	//try to read the data from the JSON into a map
		} catch (JsonParseException e) {
			System.err.println("ERROR ! UNABLE TO PARSE THE JSON PROVIDED !\n" + e.getMessage());
			return null;
		} catch (JsonMappingException e) {
			System.err.println("ERROR ! UNABLE TO MAP AND STORE THE JSON PROVIDED !\n" + e.getMessage());
			return null;
		} catch (IOException e) {
			System.err.println("ERROR ! UNABLE TO READ THE JSON PROVIDED !\n" + e.getMessage());
			return null;
		}
			
		//Result containers
		ResultSet SQLres = null;
		
		//As you retrieve "Object" type from the map => need to cast according to what you want/what you have
		String start_search_date		= (String)dataMap.get("start");
    	String end_search_date			= (String)dataMap.get("end");
    	String flag 					= (String)dataMap.get("flag");
    	Object repeated_misses_filter 	= dataMap.get("repeat_misses");	//CAUTION ! The type of this might vary (depending on how the JS view is passing the argument) => safe way here
    	String view_type				= (String)dataMap.get("view_type");
    	
    	/* USEFUL FOR DEBUGGING 
    	
    	//start_search_date = "2019-07-20";
    	
    	System.out.println( "\n\n---------------------------\n\nATS_org : " + ATS_org +
				"\nstart_date : " + start_search_date + 
				"\nend_date : " + end_search_date +
				"\nflag : " + flag + 
				"\norg filter : " + org_specific_filter +
				"\nview type : " + view_type + 
				"\n\n---------------------------\n\n");
    	*/
    	
    	//if no filter on flag
    	if(flag.toLowerCase().equals("all")) {
    		flag = "%";
    	}
    	
    	try {
    		
    		//Do your DB calls
			
    	} catch (SQLException e) {
			//e.printStackTrace();
			System.err.println("ERROR ! FAILED TO LOAD DATA FROM THE DATABASE !\n" + e.getMessage());
		}
    	//we return the result of the SQL query
		return SQLres;
	}
    
}
