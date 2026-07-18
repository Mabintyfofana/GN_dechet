package com.assainissement.guinee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée principal de la plateforme GN_Dechet.
 * Application de pré-collecte des déchets en Guinée.
 */
@SpringBootApplication
public class AssainissementApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssainissementApplication.class, args);
    }
}
