package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.SuiviRamassage;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.service.RamassageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/ramassages")
public class RamassageController {

    private final RamassageService ramassageService;

    public RamassageController(RamassageService ramassageService) {
        this.ramassageService = ramassageService;
    }

    // Le menageId vient du corps uniquement comme fallback — le backend ignore
    // ce champ et utilise l'identité extraite du JWT pour la sécurité.
    public record DemandeRequest(String volumeText, String typeDechet) {}
    public record ValidationRequest(BigDecimal poidsKg, BigDecimal volumeM3, String observations) {}

    /**
     * SÉCURITÉ : menageId est extrait du JWT (@AuthenticationPrincipal),
     * jamais depuis le body de la requête pour éviter toute usurpation d'identité.
     */
    @PostMapping("/demande")
    public ResponseEntity<?> creerDemande(
            @RequestBody DemandeRequest req,
            @AuthenticationPrincipal Utilisateur menageConnecte) {
        if (menageConnecte == null) {
            return ResponseEntity.status(401).body("Non authentifié");
        }
        SuiviRamassage suivi = ramassageService.creerDemande(
                menageConnecte.getId(), req.volumeText(), req.typeDechet());
        return ResponseEntity.ok(suivi);
    }

    @GetMapping("/en-attente")
    public ResponseEntity<Page<SuiviRamassage>> getDemandesEnAttente(
            @AuthenticationPrincipal Utilisateur agent,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ramassageService.getDemandesEnAttente(agent, pageable));
    }

    @PutMapping("/{suiviId}/valider")
    public ResponseEntity<SuiviRamassage> validerRamassage(
            @PathVariable UUID suiviId,
            @RequestBody ValidationRequest req) {
        SuiviRamassage suivi = ramassageService.validerRamassage(
                suiviId, req.poidsKg(), req.volumeM3(), req.observations());
        return ResponseEntity.ok(suivi);
    }

    @GetMapping("/historique")
    public ResponseEntity<Page<SuiviRamassage>> getHistorique(
            @AuthenticationPrincipal Utilisateur menage,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ramassageService.getHistorique(menage.getId(), pageable));
    }

    /**
     * Annulation d'une demande de ramassage par le ménage qui l'a créée.
     * Vérifie que l'utilisateur connecté est bien le propriétaire de la demande.
     */
    @DeleteMapping("/{suiviId}/annuler")
    public ResponseEntity<?> annulerDemande(
            @PathVariable UUID suiviId,
            @AuthenticationPrincipal Utilisateur menageConnecte) {
        if (menageConnecte == null) {
            return ResponseEntity.status(401).body("Non authentifié");
        }
        try {
            ramassageService.annulerDemande(suiviId, menageConnecte.getId());
            return ResponseEntity.ok("Demande annulée avec succès.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
