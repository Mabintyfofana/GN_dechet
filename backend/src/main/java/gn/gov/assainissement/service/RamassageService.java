package gn.gov.assainissement.service;

import gn.gov.assainissement.entity.SuiviRamassage;
import gn.gov.assainissement.entity.Utilisateur;
import java.math.BigDecimal;
import java.util.UUID;

public interface RamassageService {
    SuiviRamassage creerDemande(UUID menageId, String volumeText, String typeDechet);
    SuiviRamassage validerRamassage(UUID suiviId, BigDecimal poidsKg, BigDecimal volumeM3, String observations);

    org.springframework.data.domain.Page<SuiviRamassage> getDemandesEnAttente(Utilisateur agentConnecte, org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<SuiviRamassage> getHistorique(UUID menageId, org.springframework.data.domain.Pageable pageable);

    void annulerDemande(UUID suiviId, UUID menageId);
}
