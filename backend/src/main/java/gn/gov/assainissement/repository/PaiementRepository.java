package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.Paiement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, UUID> {
    Page<Paiement> findByMenageId(UUID menageId, Pageable pageable);
    Page<Paiement> findByStatut(Paiement.StatutPaiement statut, Pageable pageable);
}
