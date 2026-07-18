package com.assainissement.guinee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Réponse envoyée à l'application (React Native) après une connexion réussie.
 * Contient le token JWT et les infos essentielles de l'utilisateur.
 */
@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String userId;
    private String nom;
    private String telephone;
    private String role;
    private String quartier;
}
