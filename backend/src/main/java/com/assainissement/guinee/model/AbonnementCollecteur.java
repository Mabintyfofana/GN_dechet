package com.assainissement.guinee.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant l'inscription et la zone d'un collecteur.
 * Table PostgreSQL : abonnements_collecteurs
 */
@Entity
@Table(name = "abonnements_collecteurs")
@Getter
@Setter
@NoArgsConstructor
public class AbonnementCollecteur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /** Référence vers le collecteur concerné */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_collecteur", nullable = false)
    private Utilisateur collecteur;

    @Column(nullable = false)
    private LocalDate dateInscription;

    /** Zone / secteur géographique assigné au collecteur */
    @Column(nullable = false, length = 150)
    private String zoneAttribuee;

    @Column(nullable = false, length = 30)
    private String statut = "EN_ATTENTE_VALIDATION"; // ACTIF | SUSPENDU | INACTIF | EN_ATTENTE_VALIDATION

    /** Notes de l'administrateur sur ce collecteur */
    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(nullable = false)
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        if (dateInscription == null) dateInscription = LocalDate.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
