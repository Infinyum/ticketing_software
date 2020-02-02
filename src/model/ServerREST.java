package model;

import java.util.Scanner;
import org.apache.cxf.jaxrs.JAXRSServerFactoryBean;
import org.apache.cxf.jaxrs.lifecycle.SingletonResourceProvider;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;

public class ServerREST {

	
	
	public static void main(String[] args) {
		JAXRSServerFactoryBean sf = new JAXRSServerFactoryBean();
        sf.setResourceClasses(RESTAPI.class);
        sf.setResourceProvider(RESTAPI.class, new SingletonResourceProvider(new RESTAPI()));
        sf.setProvider(new JacksonJaxbJsonProvider());
        sf.setAddress("http://localhost:9000/");
        sf.create();

        Scanner sc = new Scanner(System.in);
        sc.next();
        
        System.out.println("Closed");
        
        sc.close();
	}

}
