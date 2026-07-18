package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("/{id}/profil")
    public ResponseEntity<gn.gov.assainissement.dto.UserResponse> getProfil(@PathVariable UUID id) {
        Utilisateur utilisateur = utilisateurService.recupererProfil(id);
        return ResponseEntity.ok(gn.gov.assainissement.dto.UserResponse.fromEntity(utilisateur));
    }

    @GetMapping("/agents")
    public ResponseEntity<java.util.List<gn.gov.assainissement.dto.UserResponse>> getAgents(
            @AuthenticationPrincipal Utilisateur utilisateurConnecte) {
        Integer zoneId = (utilisateurConnecte.getZone() != null) ? utilisateurConnecte.getZone().getId() : null;
        java.util.List<gn.gov.assainissement.dto.UserResponse> response = utilisateurService.getAgentsParZone(zoneId).stream()
                .map(gn.gov.assainissement.dto.UserResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }

    /**
     * Mise à jour du profil de l'utilisateur connecté.
     * L'ID est extrait du JWT — l'utilisateur ne peut modifier QUE son propre profil.
     */
    @PatchMapping("/profil")
    public ResponseEntity<?> mettreAjourProfil(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Utilisateur utilisateurConnecte) {

        if (utilisateurConnecte == null) {
            return ResponseEntity.status(401).body("Non authentifié");
        }

        try {
            String nom = body.get("nom");
            String telephone = body.get("telephone");
            String quartier = body.get("quartier");

            Utilisateur updated = utilisateurService.mettreAjourProfil(
                    utilisateurConnecte.getId(), nom, telephone, quartier);

            // Retourner uniquement les champs utiles (pas le mot de passe)
            return ResponseEntity.ok(Map.of(
                    "id", updated.getId().toString(),
                    "nom", updated.getNom(),
                    "prenom", updated.getPrenom() != null ? updated.getPrenom() : "",
                    "telephone", updated.getTelephone() != null ? updated.getTelephone() : "",
                    "email", updated.getEmail()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
