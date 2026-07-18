package com.assainissement.guinee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuration CORS pour autoriser les requêtes depuis l'application React Native / Expo.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // En développement : autoriser localhost Expo / React Native Web
        // En production : remplacer par le domaine réel de l'application
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",       // Expo Web / émulateur local
                "http://10.0.2.2:*",        // Android Emulator (accès au PC hôte)
                "https://*.gn-dechet.com"   // Domaine production (à adapter)
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // Cache la pré-requête OPTIONS pendant 1 heure

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
