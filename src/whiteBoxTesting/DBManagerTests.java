package whiteBoxTesting;


import model.DBManager;
import model.SQLQuery;

import static org.junit.Assert.*;

/* Mockito if time
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;
*/

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.Before;
import org.junit.Test;



public class DBManagerTests {

	public DBManager dbm;
	public DBManager mock_dbm;	//mock database manager in order to test the SQL query methods without a data dependency (NOT IMPLEMENTED YET : need Mockito)
	
	@Before
	public void init_test() {
		try  {
			//Here we test the connection to the real db (no mock)
		   dbm = new DBManager();
		   
		   if(dbm==null) {
			   fail("Initialization failed");
		   }
		   
		   //We assert that the created object is valid => otherwise we can't test
		   assert(dbm.isValidObject());
		   
		} catch (Exception e) {
		    fail("Initialization failed : Exception raised in initialization");
		}
    }

	/**
	 * Objective : Verify the closure of a db (close correctly)
	 * Expected results : close() returns the correct value (true if succeed) and that the connection is really closed (can't query)
	 */
	@Test
	public void close() {
		
		//if return false => test fails
		if(!dbm.close()) {
			fail();
		}
		
		try {
			dbm.ExecuteSQLQuery(new SQLQuery("Select * from update_log", false));
			fail(); //should raise an exception => if here : failure
		}
		catch(SQLException e) {
			assert(true);	//test succeed !
		}
		catch(IOException ex) {
			fail();	//not suppose to raise an IOException because no file involved
		}
	}
	
	/**
	 * Objective : Ensure closing twice a db is impossible (and doesn't provoke issues)
	 * Expected results : DBManager "succeed" to close twice and returns true - here succeed mean it doesn't raise any exception nor returns false  
	 */
	@Test
	public void closeTwice() {
				
		try {
			if(dbm.close()) {
				assert(dbm.close()); //assert that we can close multiple times without any risk
			}
			else {
				//wrong : failed to close
				fail();
			}
		}
		catch(Exception e) {
			fail();	//unexpected exception
		}
	}

	/**
	 * Objective : Ensure a DBManager can query a DB without failing (no Exception) : version where the query is null
	 * Expected result : A null ResultSet with no exception raised (especially SQLException) 
	 */
	@Test
	public void nullQueryExecution() {
		try {
			ResultSet res = dbm.ExecuteSQLQuery(null);
			assert(res==null);	//res should be null
		} catch (SQLException e) {
			fail("Unexpected SQLexception ! " + e.getMessage());	//not suppose to raise a SQLException 
		} catch(Exception ex) {
			fail("Unexpected exception ! " + ex.getMessage());	//not suppose to raise an Exception 
		}
		
	}
	
	/**
	 * Objective : Ensure a DBManager can query a DB without failing (no Exception) : version where the query is without parameter in a string
	 * Expected result : A non-null ResultSet with no exception raised (especially SQLException) 
	 */
	@Test
	public void stringQueryExecutionSuccess() {
		//TODO (with mock db results)
		//cf mockitos
	}
	
	/**
	 * Objective : Ensure a DBManager raise the good SQL exception when an invalid query (wrong SQL syntax for instance) is executed 
	 * version where the query is without parameter in a string
	 * Expected result : DBManager raise a SQLException
	 */
	@Test
	public void stringQueryExecutionFails() {
		//TODO (with mock db results)
		//cf mockitos
	}
	
	/**
	 * Objective : Ensure a DBManager raise the good SQL exception when an invalid query (wrong SQL syntax for instance) is executed 
	 * version where the query is without parameter but one (or more) is provided in a string
	 * Expected result : DBManager raise a SQLException (can be precised but the spec says at least a SQLException)
	 */
	@Test
	public void stringQueryExecutionInvalidParamFails() {
		//TODO (with mock db results)
		//cf mockitos
	}
	
	/**
	 * Objective : Ensure a DBManager can query a DB without failing (no Exception) : version where the query having parameters and is directly in a string
	 * Expected result : A non-null ResultSet with no exception raised (especially SQLException) 
	 */
	@Test
	public void stringParamQueryExecutionSuccess() {
		//TODO (with mock db results)
		//cf mockitos
	}
	
	/**
	 * Objective : Ensure a DBManager can query a DB without failing (no Exception) : version where the query is without parameter in a file
	 * Expected result : A non-null ResultSet with no exception raised (especially SQLException nor IOException) 
	 */
	@Test
	public void fileQueryExecutionSuccess() {
		//TODO (with mock db results)
		//cf mockitos
	}
	
	/**
	 * Objective : Ensure a DBManager fails querying a DB with IOException if the query file is missing
	 * Expected result : An IOException is raised (because file is not found)
	 */
	@Test
	public void fileQueryExecutionFails() {
		//TODO (with mock db results)
		//cf mockitos
	}
	
	
}
