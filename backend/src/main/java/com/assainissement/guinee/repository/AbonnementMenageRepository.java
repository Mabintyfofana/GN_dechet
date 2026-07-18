package com.assainissement.guinee.repository;

import com.assainissement.guinee.model.AbonnementMenage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AbonnementMenageRepository extends JpaRepository<AbonnementMenage, UUID> {

    /** Récupère l'abonnement ACTIF d'un ménage */
    Optional<AbonnementMenage> findByMenage_IdAndStatut(UUID menageId, String statut);

    /** Tous les abonnements d'un ménage (historique) */
    List<AbonnementMenage> findByMenage_IdOrderByDatePaiementDesc(UUID menageId);

    /** Abonnements expirant bientôt (pour envoi de rappels) */
    List<AbonnementMenage> findByStatutAndDateExpirationBefore(String statut, LocalDate date);

    /** Vérifier si une référence Mobile Money existe déjà */
    boolean existsByReferenceMobileMoney(String reference);
}
