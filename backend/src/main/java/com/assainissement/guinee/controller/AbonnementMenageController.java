package com.assainissement.guinee.controller;

import com.assainissement.guinee.dto.AbonnementMenageRequest;
import com.assainissement.guinee.model.AbonnementMenage;
import com.assainissement.guinee.service.AbonnementMenageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Endpoints pour la gestion des abonnements des ménages.
 *
 * POST   /api/menages/{menageId}/abonnements          → Créer un abonnement
 * GET    /api/menages/{menageId}/abonnements/actif    → Abonnement actif
 * GET    /api/menages/{menageId}/abonnements          → Historique complet
 */
@RestController
@RequestMapping("/api/menages")
@RequiredArgsConstructor
public class AbonnementMenageController {

    private final AbonnementMenageService abonnementService;

    @PostMapping("/{menageId}/abonnements")
    public ResponseEntity<AbonnementMenage> creerAbonnement(
            @PathVariable UUID menageId,
            @Valid @RequestBody AbonnementMenageRequest request) {
        AbonnementMenage abonnement = abonnementService.creerAbonnement(menageId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(abonnement);
    }

    @GetMapping("/{menageId}/abonnements/actif")
    public ResponseEntity<AbonnementMenage> getAbonnementActif(@PathVariable UUID menageId) {
        return ResponseEntity.ok(abonnementService.getAbonnementActif(menageId));
    }

    @GetMapping("/{menageId}/abonnements")
    public ResponseEntity<List<AbonnementMenage>> getHistorique(@PathVariable UUID menageId) {
        return ResponseEntity.ok(abonnementService.getHistorique(menageId));
    }
}
