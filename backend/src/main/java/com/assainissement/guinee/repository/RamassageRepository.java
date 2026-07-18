package com.assainissement.guinee.repository;

import com.assainissement.guinee.model.SuiviRamassage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RamassageRepository extends JpaRepository<SuiviRamassage, UUID> {

    /** Historique de collectes d'un ménage (plus récent en premier) */
    List<SuiviRamassage> findByMenage_IdOrderByDateHeureDesc(UUID menageId);

    /** Collectes assignées à un collecteur */
    List<SuiviRamassage> findByCollecteur_IdOrderByDateHeureDesc(UUID collecteurId);

    /** Toutes les demandes EN_ATTENTE (pour les collecteurs qui cherchent du travail) */
    List<SuiviRamassage> findByStatutOrderByDateHeureAsc(String statut);

    /** Collectes en attente dans un quartier donné */
    @Query("SELECT r FROM SuiviRamassage r WHERE r.statut = 'EN_ATTENTE' " +
           "AND r.menage.quartier = :quartier ORDER BY r.dateHeure ASC")
    List<SuiviRamassage> findEnAttenteByQuartier(@Param("quartier") String quartier);

    /** Nombre de collectes effectuées par un collecteur */
    long countByCollecteur_IdAndStatut(UUID collecteurId, String statut);
}
