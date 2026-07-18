package com.assainissement.guinee.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant un abonnement payant d'un ménage.
 * Table PostgreSQL : abonnements_menages
 */
@Entity
@Table(name = "abonnements_menages")
@Getter
@Setter
@NoArgsConstructor
public class AbonnementMenage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /** Référence vers le ménage concerné */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_menage", nullable = false)
    private Utilisateur menage;

    @Column(nullable = false)
    private LocalDate datePaiement;

    @Column(nullable = false)
    private LocalDate dateExpiration;

    /** Montant en Francs Guinéens (GNF) */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    /** Référence de transaction Orange Money / MTN Mobile Money */
    @Column(nullable = false, unique = true, length = 100)
    private String referenceMobileMoney;

    @Column(nullable = false, length = 20)
    private String statut = "ACTIF"; // ACTIF | EXPIRE | SUSPENDU | EN_ATTENTE

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (datePaiement == null) datePaiement = LocalDate.now();
    }
}
