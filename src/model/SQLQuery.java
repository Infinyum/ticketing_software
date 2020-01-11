package model;
import java.io.*;
import java.util.Scanner;


/**
 * SQLQuery class: class representing a SQL query for our DBManager class
 * @author Thomas von Ascheberg
 */
public class SQLQuery {
	
	//The query as a string
	private String value;
	
	//If we query from a sql file
	private boolean isInFile;
	private String path;

	
	/**
	 * Constructor of a SQL Query
	 * @param value: String containing either the query itself or the path to the sql query
	 * @param isFilePath : is value parameter the path (isFilePath=true) or the sql query itself (isFilePath=false)
	 * @throws IOException if the sql query file is missing or an IO problem occurred while working with the file
	 */
	public SQLQuery(String value, boolean isFilePath) throws IOException {
		
		this.isInFile = isFilePath;
		
		//Check for file .sql file
		if(isFilePath) {
			this.path = value;
			loadQuery(path);
		}
		//Otherwise we assume the query is in the "value" string
		else {
			this.value = value;
			path = "";
		}
		
	}
	
	/**
	 * getter on the value of the SQL query
	 * @return the string representing the SQL query
	 */
	public String getValue() {
		return value;
	}
	
	/**
	 * setter on the value of the SQL query
	 * @param val, the new string representing the SQL query
	 */
	public void setValue(String val) {
		//update the value manually => not from a file anymore
		isInFile = false;
		path = "";
		
		value = val ;
	}
	
	/**
	 * getter on the path value
	 * @return the string representing the path to the sql query file
	 */
	public String getPath() {
		return path;
	}
	
	/**
	 * Method to load a SQL query from a file
	 * @param path, the string representing the path to the sql file
	 * @throws IOException if the sql query file is missing or an IO problem occurred while working with the file
	 */
	public void loadQuery(String path) throws IOException{
			
		//We read each line of the file and add it to the current value of the query
		File file = new File(path); 
		Scanner sc = new Scanner(file); 
		StringBuilder res = new StringBuilder();	//StringBuilder is better than string concat in Java

		while(sc.hasNextLine()) {
			res.append(sc.nextLine());
		}

		//We update the object's state
		this.value = res.toString();
		this.path = path;
		isInFile = true;
		
		sc.close();
	}

	/**
	 * Override the toString method in order to only display the value of the query (witch is what matters in the query)
	 * @return the query's content (the SQL string)
	 */
	@Override
	public String toString() {
		return value;
	}

}
