package com.assainissement.guinee.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité représentant un utilisateur (Ménage, Collecteur ou Admin).
 * Table PostgreSQL : utilisateurs
 */
@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nom;

    /** Numéro de téléphone = identifiant de connexion unique */
    @Column(nullable = false, unique = true, length = 20)
    private String telephone;

    /** Mot de passe hashé avec BCrypt — jamais en clair */
    @Column(nullable = false, length = 255)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false, length = 100)
    private String quartier;

    /** Description textuelle du domicile (ex: "Près de la mosquée centrale") */
    @Column(columnDefinition = "TEXT")
    private String pointDeRepere;

    @Column(nullable = false)
    private boolean actif = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(nullable = false)
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
