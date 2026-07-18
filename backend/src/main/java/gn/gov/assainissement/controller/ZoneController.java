package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.Zone;
import gn.gov.assainissement.repository.ZoneRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/zones")
public class ZoneController {

    private final ZoneRepository zoneRepository;

    public ZoneController(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    @GetMapping
    public ResponseEntity<List<Zone>> getZones() {
        return ResponseEntity.ok(zoneRepository.findAll());
    }
}
