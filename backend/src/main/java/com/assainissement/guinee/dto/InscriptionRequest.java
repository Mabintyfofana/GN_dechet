package com.assainissement.guinee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Requête d'inscription d'un nouvel utilisateur (Ménage ou Collecteur).
 */
@Data
public class InscriptionRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    private String nom;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "Format de téléphone invalide")
    private String telephone;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit avoir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "Le rôle est obligatoire")
    @Pattern(regexp = "MENAGE|COLLECTEUR", message = "Le rôle doit être MENAGE ou COLLECTEUR")
    private String role;

    @NotBlank(message = "Le quartier est obligatoire")
    private String quartier;

    private String pointDeRepere; // Optionnel
}
