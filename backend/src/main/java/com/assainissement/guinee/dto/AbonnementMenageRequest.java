package com.assainissement.guinee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO pour créer un abonnement ménage via paiement Mobile Money.
 */
@Data
public class AbonnementMenageRequest {

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private BigDecimal montant;

    @NotBlank(message = "La référence Mobile Money est obligatoire")
    private String referenceMobileMoney;

    @NotNull(message = "La date d'expiration est obligatoire")
    private LocalDate dateExpiration;
}
