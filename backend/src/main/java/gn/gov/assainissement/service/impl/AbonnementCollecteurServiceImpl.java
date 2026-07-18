package gn.gov.assainissement.service.impl;

import gn.gov.assainissement.entity.AbonnementCollecteur;
import gn.gov.assainissement.entity.Zone;
import gn.gov.assainissement.repository.AbonnementCollecteurRepository;
import gn.gov.assainissement.repository.ZoneRepository;
import gn.gov.assainissement.service.AbonnementCollecteurService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AbonnementCollecteurServiceImpl implements AbonnementCollecteurService {

    private final AbonnementCollecteurRepository abonnementCollecteurRepository;
    private final ZoneRepository zoneRepository;

    public AbonnementCollecteurServiceImpl(AbonnementCollecteurRepository abonnementCollecteurRepository, ZoneRepository zoneRepository) {
        this.abonnementCollecteurRepository = abonnementCollecteurRepository;
        this.zoneRepository = zoneRepository;
    }

    @Override
    @Transactional
    public AbonnementCollecteur affecterZone(UUID collecteurId, Integer zoneId) {
        AbonnementCollecteur abonnement = abonnementCollecteurRepository.findByCollecteurId(collecteurId)
                .orElseThrow(() -> new IllegalArgumentException("Dossier collecteur introuvable"));

        Zone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new IllegalArgumentException("Zone introuvable"));

        abonnement.setZoneActuelle(zone);
        abonnement.setStatut(AbonnementCollecteur.StatutAgent.ACTIF);

        return abonnementCollecteurRepository.save(abonnement);
    }
}
