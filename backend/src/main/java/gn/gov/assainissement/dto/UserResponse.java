package gn.gov.assainissement.dto;

import gn.gov.assainissement.entity.Utilisateur;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String nom,
        String prenom,
        String email,
        String telephone,
        String role,
        String specialisation,
        UUID pmeId,
        Integer zoneId,
        String statutValidationPme
) {
    public static UserResponse fromEntity(Utilisateur u) {
        return new UserResponse(
                u.getId(),
                u.getNom(),
                u.getPrenom(),
                u.getEmail(),
                u.getTelephone(),
                u.getRole() != null ? u.getRole().getNom() : null,
                u.getSpecialisation() != null ? u.getSpecialisation().name() : null,
                u.getPmeAppartenance() != null ? u.getPmeAppartenance().getId() : null,
                u.getZone() != null ? u.getZone().getId() : null,
                u.getStatutValidationPme() != null ? u.getStatutValidationPme().name() : null
        );
    }
}
