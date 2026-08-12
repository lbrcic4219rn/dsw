package raf.rs.domaci3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class Domaci3Application {

	public static void main(String[] args) {
		SpringApplication.run(Domaci3Application.class, args);
	}

}
