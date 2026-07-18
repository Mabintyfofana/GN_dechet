package com.assainissement.guinee.repository;

import com.assainissement.guinee.model.AbonnementCollecteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AbonnementCollecteurRepository extends JpaRepository<AbonnementCollecteur, UUID> {

    /** Abonnement actif d'un collecteur */
    Optional<AbonnementCollecteur> findByCollecteur_IdAndStatut(UUID collecteurId, String statut);

    /** Tous les collecteurs actifs dans une zone donnée */
    List<AbonnementCollecteur> findByZoneAttribueeAndStatut(String zone, String statut);

    /** Historique d'un collecteur */
    List<AbonnementCollecteur> findByCollecteur_IdOrderByDateInscriptionDesc(UUID collecteurId);
}
