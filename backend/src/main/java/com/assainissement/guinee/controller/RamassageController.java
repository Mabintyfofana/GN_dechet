package com.assainissement.guinee.controller;

import com.assainissement.guinee.dto.RamassageStatutUpdate;
import com.assainissement.guinee.model.SuiviRamassage;
import com.assainissement.guinee.service.RamassageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Endpoints pour le suivi des ramassages de déchets.
 *
 * POST   /api/ramassages                              → Ménage crée une demande
 * POST   /api/ramassages/{id}/accepter/{collecteurId} → Collecteur accepte
 * PATCH  /api/ramassages/{id}/statut                 → Mise à jour statut
 * GET    /api/ramassages/menage/{menageId}            → Historique ménage
 * GET    /api/ramassages/collecteur/{collecteurId}    → Liste collecteur
 * GET    /api/ramassages/en-attente?quartier=Kaloum  → Demandes en attente par quartier
 */
@RestController
@RequestMapping("/api/ramassages")
@RequiredArgsConstructor
public class RamassageController {

    private final RamassageService ramassageService;

    @PostMapping
    public ResponseEntity<SuiviRamassage> demanderRamassage(@RequestParam UUID menageId) {
        SuiviRamassage ramassage = ramassageService.demanderRamassage(menageId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ramassage);
    }

    @PostMapping("/{ramassageId}/accepter/{collecteurId}")
    public ResponseEntity<SuiviRamassage> accepterRamassage(
            @PathVariable UUID ramassageId,
            @PathVariable UUID collecteurId) {
        return ResponseEntity.ok(ramassageService.accepterRamassage(ramassageId, collecteurId));
    }

    @PatchMapping("/{ramassageId}/statut")
    public ResponseEntity<SuiviRamassage> mettreAJourStatut(
            @PathVariable UUID ramassageId,
            @Valid @RequestBody RamassageStatutUpdate update) {
        return ResponseEntity.ok(ramassageService.mettreAJourStatut(ramassageId, update));
    }

    @GetMapping("/menage/{menageId}")
    public ResponseEntity<List<SuiviRamassage>> getHistoriqueMenage(@PathVariable UUID menageId) {
        return ResponseEntity.ok(ramassageService.getHistoriqueMenage(menageId));
    }

    @GetMapping("/collecteur/{collecteurId}")
    public ResponseEntity<List<SuiviRamassage>> getRamassagesCollecteur(@PathVariable UUID collecteurId) {
        return ResponseEntity.ok(ramassageService.getRamassagesCollecteur(collecteurId));
    }

    @GetMapping("/en-attente")
    public ResponseEntity<List<SuiviRamassage>> getDemandesEnAttente(@RequestParam String quartier) {
        return ResponseEntity.ok(ramassageService.getDemandesEnAttenteParQuartier(quartier));
    }
}
