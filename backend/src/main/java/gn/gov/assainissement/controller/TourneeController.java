package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.Tournee;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.TourneeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tournees")
public class TourneeController {

    private final TourneeRepository tourneeRepository;

    public TourneeController(TourneeRepository tourneeRepository) {
        this.tourneeRepository = tourneeRepository;
    }

    @GetMapping("/mes-tournees")
    public ResponseEntity<Page<Tournee>> mesTournees(
            @AuthenticationPrincipal Utilisateur agentConnecte,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            
        if (agentConnecte == null) {
            return ResponseEntity.status(401).build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "datePrevue"));
        return ResponseEntity.ok(tourneeRepository.findByAgentId(agentConnecte.getId(), pageable));
    }
}
