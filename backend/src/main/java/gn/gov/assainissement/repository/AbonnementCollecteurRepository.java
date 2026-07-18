package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.AbonnementCollecteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AbonnementCollecteurRepository extends JpaRepository<AbonnementCollecteur, UUID> {

    @Query("SELECT a FROM AbonnementCollecteur a WHERE a.collecteur.id = :collecteurId")
    Optional<AbonnementCollecteur> findByCollecteurId(@Param("collecteurId") UUID collecteurId);

    @Query("SELECT a FROM AbonnementCollecteur a WHERE a.zoneActuelle.id = :zoneId AND a.statut = :statut")
    List<AbonnementCollecteur> findByZoneActuelleIdAndStatut(@Param("zoneId") Integer zoneId, @Param("statut") AbonnementCollecteur.StatutAgent statut);
}
