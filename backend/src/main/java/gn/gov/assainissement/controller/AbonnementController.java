package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.AbonnementCollecteur;
import gn.gov.assainissement.service.AbonnementCollecteurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/abonnements")
public class AbonnementController {

    private final AbonnementCollecteurService collecteurService;

    public AbonnementController(AbonnementCollecteurService collecteurService) {
        this.collecteurService = collecteurService;
    }

    public record ActivationRequest(String referenceMobileMoney) {}
    public record AffectationRequest(Integer zoneId) {}


    @PostMapping("/collecteurs/{collecteurId}/affecter")
    public ResponseEntity<AbonnementCollecteur> affecterZone(
            @PathVariable UUID collecteurId,
            @RequestBody AffectationRequest req) {
        AbonnementCollecteur collecteur = collecteurService.affecterZone(collecteurId, req.zoneId());
        return ResponseEntity.ok(collecteur);
    }
}
