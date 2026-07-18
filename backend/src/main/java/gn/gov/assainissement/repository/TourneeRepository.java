package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.Tournee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TourneeRepository extends JpaRepository<Tournee, UUID> {
    Page<Tournee> findByAgentId(UUID agentId, Pageable pageable);
    Page<Tournee> findByStatut(Tournee.StatutTournee statut, Pageable pageable);
}
