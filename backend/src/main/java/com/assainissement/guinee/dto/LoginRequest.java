package com.assainissement.guinee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Requête de connexion envoyée par l'application (React Native).
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String telephone;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit avoir au moins 6 caractères")
    private String motDePasse;
}
