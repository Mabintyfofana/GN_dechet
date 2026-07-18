package com.assainissement.guinee.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant une opération de collecte de déchets.
 * Table PostgreSQL : suivi_ramassages
 */
@Entity
@Table(name = "suivi_ramassages")
@Getter
@Setter
@NoArgsConstructor
public class SuiviRamassage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /** Ménage qui a demandé le ramassage */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_menage", nullable = false)
    private Utilisateur menage;

    /**
     * Collecteur assigné — peut être null si pas encore assigné.
     * Si le collecteur est supprimé, l'historique est conservé (SET NULL).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_collecteur")
    private Utilisateur collecteur;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    /**
     * Statut du ramassage :
     * EN_ATTENTE → CONFIRME → EN_COURS → FAIT
     *                       ↘ ANNULE
     */
    @Column(nullable = false, length = 20)
    private String statut = "EN_ATTENTE"; // EN_ATTENTE | CONFIRME | EN_COURS | FAIT | ANNULE

    /** Note de 1 à 5 étoiles donnée par le ménage au collecteur */
    @Column
    private Short noteMenage;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(nullable = false)
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        if (dateHeure == null) dateHeure = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
