package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.Reclamation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, UUID> {
    Page<Reclamation> findByMenageId(UUID menageId, Pageable pageable);
    Page<Reclamation> findByStatut(Reclamation.StatutReclamation statut, Pageable pageable);
}
