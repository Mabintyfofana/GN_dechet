package com.assainissement.guinee.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * DTO pour mettre à jour le statut d'un ramassage et/ou noter le collecteur.
 */
@Data
public class RamassageStatutUpdate {

    @NotBlank(message = "Le statut est obligatoire")
    @Pattern(regexp = "CONFIRME|EN_COURS|FAIT|ANNULE",
             message = "Statut invalide. Valeurs possibles : CONFIRME, EN_COURS, FAIT, ANNULE")
    private String statut;

    /** Note de 1 à 5 (optionnelle, donnée par le ménage quand statut = FAIT) */
    @Min(value = 1, message = "La note minimum est 1")
    @Max(value = 5, message = "La note maximum est 5")
    private Short noteMenage;

    private String commentaire;
}
