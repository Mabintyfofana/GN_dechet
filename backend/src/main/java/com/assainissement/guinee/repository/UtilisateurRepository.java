package com.assainissement.guinee.repository;

import com.assainissement.guinee.model.Role;
import com.assainissement.guinee.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, UUID> {

    /** Utilisé pour la connexion (téléphone = identifiant unique) */
    Optional<Utilisateur> findByTelephone(String telephone);

    /** Vérifie si un numéro de téléphone est déjà enregistré */
    boolean existsByTelephone(String telephone);

    /** Récupérer tous les utilisateurs actifs d'un rôle donné */
    List<Utilisateur> findByRoleAndActifTrue(Role role);

    /** Recherche par quartier pour affecter des collecteurs */
    List<Utilisateur> findByQuartierAndRoleAndActifTrue(String quartier, Role role);
}
