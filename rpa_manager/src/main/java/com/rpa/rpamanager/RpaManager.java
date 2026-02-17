package com.rpa.rpamanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RpaManager {
	
	public static void main(String[] args) {
		SpringApplication.run(RpaManager.class, args);

	
	}
}