package controller;


import java.util.Scanner;

//Jackson/JAX-RS imports
import org.apache.cxf.jaxrs.JAXRSServerFactoryBean;
import org.apache.cxf.jaxrs.lifecycle.SingletonResourceProvider;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;

//Apache-cxf web server implementation
import org.apache.cxf.endpoint.Server;

public class ServerREST {

	static final String HOST = "http://localhost";	//TODO change with correct Hostname
	static final int 	PORT = 9000;
	static final String URL  = HOST + ":" + PORT;
	
	public static void main(String[] args) {
		
		//create a web server factory
		JAXRSServerFactoryBean sf = new JAXRSServerFactoryBean();
		
		//We provide our REST API to our web server and setup the web server
        sf.setResourceClasses(RESTAPI.class);
        sf.setResourceProvider(RESTAPI.class, new SingletonResourceProvider(new RESTAPI()));
        sf.setProvider(new JacksonJaxbJsonProvider());
        
        //We setup the address of the web server and then deploy it
        sf.setAddress(URL);
        Server server = sf.create();
        
        System.out.println("Press any key + return to stop the server");	
		System.out.println("Access this server at the address : " + URL);	

        Scanner sc = new Scanner(System.in);
        sc.next();
        
        System.out.println("server closed.");
        
        //We quit everything properly
		sc.close();
		server.stop();
		System.exit(0);
	}

}
