package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Integer> {

    // findByActifTrue() retiré car l'entité Zone n'a pas de champ 'actif'
    List<Zone> findByCommune(String commune);

    List<Zone> findByRegion(String region);
}
