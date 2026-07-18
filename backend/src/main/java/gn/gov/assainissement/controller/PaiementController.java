package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.Paiement;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.PaiementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/paiements")
public class PaiementController {

    private final PaiementRepository paiementRepository;

    public PaiementController(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
    }

    public record PaiementRequest(BigDecimal montant, String devise, Paiement.ModePaiement modePaiement, String referenceTxn, LocalDate periodeDebut, LocalDate periodeFin) {}

    @PostMapping
    public ResponseEntity<Paiement> initierPaiement(
            @AuthenticationPrincipal Utilisateur menageConnecte,
            @RequestBody PaiementRequest req) {
        
        if (menageConnecte == null) {
            return ResponseEntity.status(401).build();
        }

        Paiement paiement = new Paiement();
        paiement.setMenage(menageConnecte);
        paiement.setMontant(req.montant());
        if (req.devise() != null) paiement.setDevise(req.devise());
        paiement.setModePaiement(req.modePaiement());
        paiement.setReferenceTxn(req.referenceTxn());
        paiement.setPeriodeDebut(req.periodeDebut());
        paiement.setPeriodeFin(req.periodeFin());
        
        return ResponseEntity.ok(paiementRepository.save(paiement));
    }

    @GetMapping("/mes-paiements")
    public ResponseEntity<Page<Paiement>> mesPaiements(
            @AuthenticationPrincipal Utilisateur menageConnecte,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            
        if (menageConnecte == null) {
            return ResponseEntity.status(401).build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(paiementRepository.findByMenageId(menageConnecte.getId(), pageable));
    }
}
