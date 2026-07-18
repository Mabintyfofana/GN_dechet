package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.SuiviRamassage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SuiviRamassageRepository extends JpaRepository<SuiviRamassage, UUID> {

    // Utilise JPQL explicite pour éviter les problèmes de parsing
    // Utilise JPQL explicite pour éviter les problèmes de parsing
    @Query("SELECT s FROM SuiviRamassage s WHERE s.menage.id = :menageId ORDER BY s.datePrevue DESC")
    org.springframework.data.domain.Page<SuiviRamassage> findByMenageId(@Param("menageId") UUID menageId, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT s FROM SuiviRamassage s WHERE s.collecteur.id = :collecteurId")
    List<SuiviRamassage> findByCollecteurId(@Param("collecteurId") UUID collecteurId);

    @Query("SELECT s FROM SuiviRamassage s WHERE s.statut = :statut")
    org.springframework.data.domain.Page<SuiviRamassage> findByStatut(@Param("statut") SuiviRamassage.StatutCollecte statut, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT s FROM SuiviRamassage s WHERE s.statut = 'EN_ATTENTE' " +
           "AND s.menage.zone.id = :zoneId " +
           "AND s.typeDechet = :typeDechet " +
           "AND (:pmeId IS NULL OR s.menage.pmeAbonnement.id = :pmeId) " +
           "ORDER BY s.datePrevue ASC")
    org.springframework.data.domain.Page<SuiviRamassage> findDemandesEnAttenteFiltrees(
            @Param("zoneId") Integer zoneId,
            @Param("typeDechet") SuiviRamassage.TypeDechet typeDechet,
            @Param("pmeId") UUID pmeId,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT s FROM SuiviRamassage s WHERE s.dateEffective BETWEEN :start AND :end")
    List<SuiviRamassage> findByDateEffectiveBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    long countByStatut(SuiviRamassage.StatutCollecte statut);

    @Query("SELECT COUNT(s) FROM SuiviRamassage s WHERE s.datePrevue >= :debut")
    long countByDatePrevueAfter(@Param("debut") LocalDateTime debut);

    @Query("SELECT COALESCE(SUM(s.poidsKg), 0) FROM SuiviRamassage s WHERE s.statut = 'FAIT' AND s.dateEffective >= :debut")
    Double sumPoidsKgDepuis(@Param("debut") LocalDateTime debut);

    long countByTypeDechet(SuiviRamassage.TypeDechet typeDechet);

    org.springframework.data.domain.Page<SuiviRamassage> findAll(org.springframework.data.domain.Pageable pageable);
}
