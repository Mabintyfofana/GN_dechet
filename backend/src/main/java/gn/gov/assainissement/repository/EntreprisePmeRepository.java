package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.EntreprisePme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EntreprisePmeRepository extends JpaRepository<EntreprisePme, UUID> {
}
