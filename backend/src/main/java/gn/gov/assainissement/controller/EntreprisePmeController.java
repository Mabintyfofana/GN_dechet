package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.EntreprisePme;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.EntreprisePmeRepository;
import gn.gov.assainissement.repository.UtilisateurRepository;
import gn.gov.assainissement.service.UtilisateurService;
import gn.gov.assainissement.dto.PmeRegistrationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pme")
public class EntreprisePmeController {

    private static final Logger log = LoggerFactory.getLogger(EntreprisePmeController.class);

    private final EntreprisePmeRepository pmeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurService utilisateurService;

    public EntreprisePmeController(EntreprisePmeRepository pmeRepository, UtilisateurRepository utilisateurRepository, UtilisateurService utilisateurService) {
        this.pmeRepository = pmeRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public ResponseEntity<List<EntreprisePme>> listerPme() {
        return ResponseEntity.ok(pmeRepository.findAll());
    }

    @PostMapping("/inscription")
    public ResponseEntity<?> inscrirePme(@RequestBody PmeRegistrationRequest request) {
        try {
            // 1. Créer la PME
            EntreprisePme pme = new EntreprisePme();
            pme.setNom(request.getNomPme());
            pme.setDescription(request.getDescriptionPme());
            pme.setTelephone(request.getTelephonePme());
            pme.setTarifMensuel(request.getTarifMensuel());
            pme.setZoneCouverture(request.getZoneCouverture());
            EntreprisePme savedPme = pmeRepository.save(pme);

            // 2. Créer l'utilisateur gérant et l'associer à la PME
            // On utilise la méthode existante d'inscription (qui gère l'encodage du mot de passe)
            Utilisateur gerant = utilisateurService.inscrireUtilisateur(
                request.getNomGerant(),
                request.getPrenomGerant(),
                request.getEmailGerant(),
                request.getMotDePasseGerant(),
                "GERANT_PME", // Rôle
                null, // zoneId
                request.getTelephoneGerant(),
                null, // specialisation
                savedPme.getId() // pmeId (sera stocké soit en pmeAbonnement soit en pmeAppartenance, selon l'implémentation. On va l'associer manuellement juste après pour être sûr)
            );

            // Force l'appartenance à la PME (car UtilisateurServiceImpl ne gère peut-être pas "GERANT_PME")
            gerant.setPmeAppartenance(savedPme);
            utilisateurRepository.save(gerant);

            return ResponseEntity.ok(savedPme);
        } catch (IllegalArgumentException e) {
            log.warn("[PME] Erreur validation inscription PME: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        } catch (Exception e) {
            log.error("[PME] Erreur inattendue lors de l'inscription PME", e);
            return ResponseEntity.badRequest().body("Une erreur est survenue. Veuillez réessayer.");
        }
    }

    @PostMapping("/{pmeId}/abonner")
    public ResponseEntity<String> sAbonner(@PathVariable UUID pmeId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Non authentifié");
        }
        
        Utilisateur menage = (Utilisateur) authentication.getPrincipal();
        // Rafraîchir depuis la base pour être sûr
        menage = utilisateurRepository.findById(menage.getId()).orElseThrow();
        
        EntreprisePme pme = pmeRepository.findById(pmeId)
                .orElseThrow(() -> new IllegalArgumentException("PME introuvable"));
                
        menage.setPmeAbonnement(pme);
        utilisateurRepository.save(menage);
        
        return ResponseEntity.ok("Abonnement réussi à " + pme.getNom());
    }

    @GetMapping("/{pmeId}/agents-en-attente")
    public ResponseEntity<?> getAgentsEnAttente(@PathVariable UUID pmeId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return ResponseEntity.status(401).body("Non authentifié");
        
        Utilisateur gerant = (Utilisateur) authentication.getPrincipal();
        if (gerant.getPmeAppartenance() == null || !gerant.getPmeAppartenance().getId().equals(pmeId)) {
            return ResponseEntity.status(403).body("Accès refusé : vous n'êtes pas le gérant de cette PME.");
        }
        
        List<Utilisateur> agents = utilisateurRepository.findByPmeAppartenanceIdAndStatutValidationPme(pmeId, Utilisateur.StatutValidationPme.EN_ATTENTE);
        List<gn.gov.assainissement.dto.UserResponse> response = agents.stream()
                .map(gn.gov.assainissement.dto.UserResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{pmeId}/agents/{agentId}/valider")
    public ResponseEntity<?> validerAgent(@PathVariable UUID pmeId, @PathVariable UUID agentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return ResponseEntity.status(401).body("Non authentifié");
        
        Utilisateur gerant = (Utilisateur) authentication.getPrincipal();
        if (gerant.getPmeAppartenance() == null || !gerant.getPmeAppartenance().getId().equals(pmeId)) {
            return ResponseEntity.status(403).body("Accès refusé : vous n'êtes pas le gérant de cette PME.");
        }
        
        Utilisateur agent = utilisateurRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent introuvable"));
                
        if (agent.getPmeAppartenance() == null || !agent.getPmeAppartenance().getId().equals(pmeId)) {
            return ResponseEntity.badRequest().body("Cet agent n'appartient pas à cette PME");
        }
        
        agent.setStatutValidationPme(Utilisateur.StatutValidationPme.VALIDE);
        utilisateurRepository.save(agent);
        return ResponseEntity.ok("Agent validé avec succès.");
    }

    @PutMapping("/{pmeId}/agents/{agentId}/rejeter")
    public ResponseEntity<?> rejeterAgent(@PathVariable UUID pmeId, @PathVariable UUID agentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return ResponseEntity.status(401).body("Non authentifié");
        
        Utilisateur gerant = (Utilisateur) authentication.getPrincipal();
        if (gerant.getPmeAppartenance() == null || !gerant.getPmeAppartenance().getId().equals(pmeId)) {
            return ResponseEntity.status(403).body("Accès refusé : vous n'êtes pas le gérant de cette PME.");
        }
        
        Utilisateur agent = utilisateurRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent introuvable"));
                
        if (agent.getPmeAppartenance() == null || !agent.getPmeAppartenance().getId().equals(pmeId)) {
            return ResponseEntity.badRequest().body("Cet agent n'appartient pas à cette PME");
        }
        
        agent.setStatutValidationPme(Utilisateur.StatutValidationPme.REJETE);
        agent.setActif(false); // On désactive également le compte comme demandé par l'utilisateur
        utilisateurRepository.save(agent);
        return ResponseEntity.ok("Agent rejeté et compte bloqué.");
    }
}
