package gn.gov.assainissement.service;

import gn.gov.assainissement.entity.AbonnementCollecteur;
import java.util.UUID;

public interface AbonnementCollecteurService {
    AbonnementCollecteur affecterZone(UUID collecteurId, Integer zoneId);
}
