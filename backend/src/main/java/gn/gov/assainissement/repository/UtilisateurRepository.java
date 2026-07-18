package gn.gov.assainissement.repository;

import gn.gov.assainissement.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository Spring Data JPA pour l'entité {@link Utilisateur}.
 */
@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, UUID> {

    /**
     * Recherche un utilisateur par son adresse e-mail.
     * Utilisé principalement par Spring Security pour l'authentification.
     *
     * @param email l'adresse e-mail de l'utilisateur
     * @return un Optional contenant l'utilisateur s'il existe
     */
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findFirstByTelephone(String telephone);

    /**
     * Vérifie si un e-mail est déjà utilisé dans le système.
     *
     * @param email l'e-mail à vérifier
     * @return true si l'e-mail existe déjà, false sinon
     */
    boolean existsByEmail(String email);

    java.util.List<Utilisateur> findByRoleNomAndZoneId(String roleNom, Integer zoneId);

    java.util.List<Utilisateur> findByRoleNom(String roleNom);

    java.util.List<Utilisateur> findByPmeAppartenanceIdAndStatutValidationPme(UUID pmeId, gn.gov.assainissement.entity.Utilisateur.StatutValidationPme statut);

    long countByRoleNom(String roleNom);
}
