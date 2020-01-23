package whiteBoxTesting;

import static org.junit.Assert.fail;

import java.io.IOException;
import org.junit.Test;
import model.SQLQuery;

public class SQLQueryTests {

	/**
	 * Objective : Verify the creation of a SQLquery object (string)
	 * Expected results : No exception raised and the created object is valid (not null)
	 */
	@Test
	public void initStringQuery() {
		try  {
		   SQLQuery q = new SQLQuery("Select * From update_logs", false);
		  
		   if(q==null) {
			   fail("Initialization failed");
		   }
		   
		} catch (Exception e) {
			//Unexpected : not suppose to throw any exception
		    fail("Initialization failed : Exception raised in initialization");
		}
    }
	
	/**
	 * Objective : Verify the creation of a SQLquery object (file)
	 * Expected results : No exception raised and the created object is valid (not null)
	 */
	@Test
	public void initFileQuery() {
		SQLQuery q = null;
		try  {
		   q = new SQLQuery(".\\Resources\\SQL\\SelectUpdateLog.sql",true);
		  
		   if(q==null) {
			   fail("Initialization failed");
		   }
		   
		   //verify that the link is done
		   assert(q.getPath().equals(".\\Resources\\SQL\\SelectUpdateLog.sql"));
		   
		} catch (IOException e) {
			//Unexpected : valid path should not fail
		    fail("Initialization failed : Exception raised in initialization");
		} catch (Exception e) {
			//Unexpected : not suppose to throw another type of exception
		    fail("Initialization failed : Unexpected Exception raised in initialization");
		}
    }
	
	/**
	 * Objective : Verify the raise of the right exception if a SQLquery object fails (file)
	 * Expected results : IOException raised and the created object is not valid
	 */
	@Test
	public void failInitFileQuery() {
		SQLQuery q = null;
		
		try  {
		   q = new SQLQuery("BadPathToSQLQuery/inexistent.sql",true);
		   
		   fail("Bad Path should raise an exception !");
		   
		} catch (IOException e) {
			//Expected : invalid path should not fail
			//assert that it fails to create object
		    assert(q==null);
		} catch (Exception e) {
			//Unexpected : not suppose to throw another type of exception
		    fail("Initialization failed : Unexpected Exception raised in initialization");
		}
    }


	/**
	 * Objective : Verify that the content of the query is the same as the file it refers to
	 * Expected results : content of the file and the query is the same (+ other informations are up to date in the object)
	 */
	@Test
	public void verifyContent() {
		SQLQuery q = null;
		
		try  {
		   q = new SQLQuery(".\\Resources\\SQL\\SelectUpdateLog.sql",true);
		   assert(q.getValue().equals("select * from update_log where update_datetime > ? ;"));
		   assert(q.getPath().equals(".\\Resources\\SQL\\SelectUpdateLog.sql"));
		   
		} catch (IOException e) {
			//Unexpected : valid path should not fail
		    fail("Loading failed : Exception raised in initialization");
		    
		} catch (Exception e) {
			//Unexpected : not suppose to throw another type of exception
		    fail("Loading failed : Unexpected Exception raised in initialization");
		}
    }
	
	
	/**
	 * Objective : Verify that the content of the query is the same as the file it refers to (after using load method)
	 * Expected results : content of the file and the query is the same (+ other informations are up to date in the object)
	 */
	@Test
	public void verifyLoadContent() {
		SQLQuery q = null;
		
		try  {
			//verify that the query is normally created
			q = new SQLQuery("Select * from update_logs",false);
		    assert(q.getValue().equals("Select * from update_logs"));
		    assert(q.getPath().equals(""));
		   
		    //Verify loading
		    q.loadQuery(".\\Resources\\SQL\\SelectUpdateLog.sql");
		    assert(q.getValue().equals("select * from update_log where update_datetime > ? ;"));	//value hardcoded : should be read from file
		    assert(q.getPath().equals(".\\Resources\\SQL\\SelectUpdateLog.sql"));
		   
		} catch (IOException e) {
			//Unexpected : valid path should not fail
		    fail("Loading failed : Exception raised in initialization");
		    
		} catch (Exception e) {
			//Unexpected : not suppose to throw another type of exception
		    fail("Loading failed : Unexpected Exception raised in initialization !" + e.getMessage());
		}
    }

}
