package model;

import java.sql.*;

/**
 * DBManager class : This class provides an easy to use interface for managing databases
 * It behaves mostly as a wrapper for the jdbc library (Make it easier to query databases)
 * @author Thomas von Ascheberg
 */
public class DBManager {
	
	private String url="";
	private Connection conn = null;
	
	//state if the object is usable or not (if failed to init)
	private boolean isValidObject = true;	//Warning : invalid objects might lead to undefined behaviors
	
	/**
	 * Constructor for the DB manager => initialize connection to the DB
	 * WARNING : this constructor may fail ! => ensure that the object is valid after it's creation if you want an extra safety
	 */
	public DBManager() {
		
		try {
			url = "jdbc:mysql:///software?cloudSqlInstance=vivid-art-264709:europe-west1:ticketing-software&socketFactory=com.google.cloud.sql.mysql.SocketFactory&useSSL=false&user=client&password=client"; //Database URL
			conn = DriverManager.getConnection(url);
			isValidObject = true;
		}
		catch (SQLException e) {
			System.err.println("ERROR ! FAILED TO CONNECT TO THE DATABASE ! " + e.getMessage());
			isValidObject = false;
		}
	}
	
	/**
	 * Getter method that states if the current instance is a valid object
	 * @return the boolean that states if the current instance is a valid object
	 */
	public boolean isValidObject() {
		return isValidObject;
	}
	
	/**
	 * Method to close the connection to the database
	 * @return result of the operation (true or false = success or failure)
	 */
	public boolean close() {
		try {
			
			//test if the Object is valid
			if(isValidObject()) {
				rollback();		//We rollback if we were in the middle of a transaction
				conn.close();
				return true;
			}
			else {
				return false;
			}
			
		} catch (SQLException e) {
			System.err.println("ERROR ! FAILED TO CLOSE THE CONNECTION ! " + e.getMessage());
			return false;
		}
	}
	
	/**
	 * Method that execute a SQL query (object)
	 * @param s, the sql query to execute
	 * @param queryParameters, the list of parameters of the s SQL query
	 * @return the result of the query : a ResultSet type. (null if the SQLQuery is null)
	 * @throws SQLException if the query fails
	 */
	public ResultSet ExecuteSQLQuery(SQLQuery s, Object... queryParameters) throws SQLException {
		
		//if no query => no result
		if(s==null) {
			return null;
		}
		
		//if the object is invalid => get out !
		if(!isValidObject()) {
			throw new SQLException("INVALID OBJECT! OBJECT HAS NOT BEEN PROPERLY CREATED (DATABASE CONNECTION FAILED!) AND THUS CAN NOT BE USED!");
		}
		
		//Prepared statement instead of statement : 1/ prevent SQL injection + 2/ proper way to handle parameters
		PreparedStatement pst = conn.prepareStatement(s.getValue());
		
		//We insert all the parameters the user has passed us to the SQL Query (just make a difference for string to double-prevent from SQL injections)
		int i = 1;
		for(Object param : queryParameters) {
			
			if(param instanceof String) {
				pst.setString(i, (String)param);
			}
			else {
				pst.setObject(i, param);
			}
						
			i++;
		}
		
		//execute the query and close the prepared statement
		//System.out.println(pst.toString()); //display the query : useful for debugging
		ResultSet res = pst.executeQuery();
		pst.close();
		
		return res;
		
	}
	
	/**
	 * Method to print the result of a SQL query
	 * @param result, the result of the SQL query
	 */
	public void printQueryResult(ResultSet result) {
		
		//if the object is invalid => get out !
		if(!isValidObject()) {
			System.err.println("INVALID OBJECT => CANNOT BE USED!");
			return;
		}
		
		if(result==null) {
			//empty result...
			System.out.println("empty result");
			return;
		}
		
		try {
			
			int rowNum = 0;
						
			//get the metadata of the table
			ResultSetMetaData rsmd = result.getMetaData();  
			
			while(result.next()){

				//format each row for display
				StringBuilder row = new StringBuilder();
				
				for(int i=0; i<rsmd.getColumnCount(); i++) {
					Object val = result.getObject(i+1);
					
					if(val==null) {
						val = "null";
					}
					
					row.append(val.toString()).append("\t|\t");
				}
				
				System.out.println(row); 
				rowNum++;
				
			}
			
			System.out.println("\n"+rowNum+" row(s) returned.");
			
		} catch (SQLException e) {
			System.err.println("ERROR ! FAILED TO DISPLAY RESULT OF QUERY ! " + e.getMessage());
		}
	}
	
	/**
	 * Method that print a DB (all the tables and columns)
	 */
	public void printDBScheme() {
		
		try {
			
			//if the object is invalid => get out !
			if(!isValidObject()) {
				throw new SQLException("INVALID OBJECT! OBJECT HAS NOT BEEN PROPERLY CREATED (DATABASE CONNECTION FAILED!) AND THUS CAN NOT BE USED!");
			}
			
			//Grab metadata from the DB connection
			DatabaseMetaData dmdTab = conn.getMetaData(); 
			
			//grab info about the tables
			ResultSet tables = dmdTab.getTables(conn.getCatalog(),null,"%",null);
		
			//display all the informations
			while(tables.next()){ 
			    
				String tableName = tables.getObject(3).toString();
				System.out.println("################################### " + tableName + " ###################################"); 
			   
				//Get Metadata from the connection
				DatabaseMetaData dmd = conn.getMetaData(); 
			    ResultSet res = dmd.getColumns(conn.getCatalog(),null,tableName.toString(), "%"); 
			     
			    while(res.next()){ 

				    String val = res.getObject(4).toString(); //column name is attribute #4
			    	String type = res.getObject(6).toString() + "(" + res.getObject(7).toString() + ")";
			    	System.out.printf("\t%-35s |\t\t%-35s\n", val.toString(), type);	
			    }   			   
			    System.out.println("\n");
			}
		} catch (SQLException e) {
			System.err.println("ERROR ! CONNECTION TO DATABASE FAILED ! " + e.getMessage());
		} 
	}
		
	/**
	 * Method to commit a transaction
	 * @throws SQLException if commit fails (connection issue)
	 */
	public void commit() throws SQLException {
		
		//if the object is invalid => get out !
		if(!isValidObject()) {
			throw new SQLException("INVALID OBJECT! OBJECT HAS NOT BEEN PROPERLY CREATED (DATABASE CONNECTION FAILED!) AND THUS CAN NOT BE USED!");
		}
		
		conn.commit();
	}
	
	/**
	 * Method to rollback a transaction
	 * @throws SQLException, if the rollback fails (connection issue)
	 */
	public void rollback() throws SQLException {
		
		//if the object is invalid => get out !
		if(!isValidObject()) {
			throw new SQLException("INVALID OBJECT! OBJECT HAS NOT BEEN PROPERLY CREATED (DATABASE CONNECTION FAILED!) AND THUS CAN NOT BE USED!");
		}
		
		conn.rollback();
	}
	
	//TODO main for debugging purposes (will be removed) 
	public static void main(String[] args) {
		try {
			//Query from a SQL file
			//SQLQuery s = new SQLQuery(".\\Resources\\SQLQueries\\SelectUpdateLog.sql",true);
			
			//Manual Query
			//SQLQuery q2 = new SQLQuery("Select * from lh_root_causes_mapping",false);
			
			DBManager db = new DBManager();
			db.printDBScheme();
			
			//works with different types (as long as it is expected in the SQL Query)
			//db.printQueryResult(db.ExecuteSQLQuery(s, LocalDateTime.of(2019, 07, 11, 10, 0) ));
			//db.printQueryResult(db.ExecuteSQLQuery(s, "2019-07-11 10:00"));
			
			//db.printQueryResult(db.ExecuteSQLQuery(q2));
			
			db.close();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
