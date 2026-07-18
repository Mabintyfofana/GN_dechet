package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.Reclamation;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.ReclamationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reclamations")
public class ReclamationController {

    private final ReclamationRepository reclamationRepository;

    public ReclamationController(ReclamationRepository reclamationRepository) {
        this.reclamationRepository = reclamationRepository;
    }

    public record ReclamationRequest(Reclamation.TypeReclamation typeReclamation, String description, Reclamation.PrioriteReclamation priorite) {}

    @PostMapping
    public ResponseEntity<Reclamation> creerReclamation(
            @AuthenticationPrincipal Utilisateur menageConnecte,
            @RequestBody ReclamationRequest req) {
        
        if (menageConnecte == null) {
            return ResponseEntity.status(401).build();
        }

        Reclamation reclamation = new Reclamation();
        reclamation.setMenage(menageConnecte);
        reclamation.setTypeReclamation(req.typeReclamation());
        reclamation.setDescription(req.description());
        if (req.priorite() != null) {
            reclamation.setPriorite(req.priorite());
        }
        
        return ResponseEntity.ok(reclamationRepository.save(reclamation));
    }

    @GetMapping("/mes-reclamations")
    public ResponseEntity<Page<Reclamation>> mesReclamations(
            @AuthenticationPrincipal Utilisateur menageConnecte,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            
        if (menageConnecte == null) {
            return ResponseEntity.status(401).build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateSoumission"));
        return ResponseEntity.ok(reclamationRepository.findByMenageId(menageConnecte.getId(), pageable));
    }
}
