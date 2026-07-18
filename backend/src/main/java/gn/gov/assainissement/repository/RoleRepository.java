package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository Spring Data JPA pour l'entité {@link Role}.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    /**
     * Recherche un rôle par son nom unique.
     *
     * @param nom le nom du rôle (ex: "SUPER_ADMIN")
     * @return un Optional contenant le rôle s'il existe
     */
    Optional<Role> findByNom(String nom);
}
