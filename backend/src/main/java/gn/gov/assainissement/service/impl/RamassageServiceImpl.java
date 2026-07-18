package gn.gov.assainissement.service.impl;

import gn.gov.assainissement.entity.SuiviRamassage;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.SuiviRamassageRepository;
import gn.gov.assainissement.repository.UtilisateurRepository;
import gn.gov.assainissement.service.RamassageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RamassageServiceImpl implements RamassageService {

    private final SuiviRamassageRepository suiviRamassageRepository;
    private final UtilisateurRepository utilisateurRepository;

    public RamassageServiceImpl(SuiviRamassageRepository suiviRamassageRepository,
                                UtilisateurRepository utilisateurRepository) {
        this.suiviRamassageRepository = suiviRamassageRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    @Transactional
    public SuiviRamassage creerDemande(UUID menageId, String volumeText, String typeDechetStr) {
        Utilisateur menage = utilisateurRepository.findById(menageId)
                .orElseThrow(() -> new IllegalArgumentException("Ménage introuvable"));

        SuiviRamassage demande = new SuiviRamassage();
        demande.setMenage(menage);
        demande.setDatePrevue(LocalDateTime.now().plusDays(1));
        demande.setStatut(SuiviRamassage.StatutCollecte.EN_ATTENTE);
        demande.setObservations(volumeText);

        try {
            if (typeDechetStr != null && !typeDechetStr.isEmpty()) {
                demande.setTypeDechet(SuiviRamassage.TypeDechet.valueOf(typeDechetStr.toUpperCase()));
            } else {
                demande.setTypeDechet(SuiviRamassage.TypeDechet.PLASTIQUE); // Valeur par défaut (rétrocompatibilité)
            }
        } catch (IllegalArgumentException e) {
            demande.setTypeDechet(SuiviRamassage.TypeDechet.PLASTIQUE);
        }

        SuiviRamassage saved = suiviRamassageRepository.save(demande);

        return saved;
    }

    @Override
    @Transactional
    public SuiviRamassage validerRamassage(UUID suiviId, BigDecimal poidsKg, BigDecimal volumeM3, String observations) {
        SuiviRamassage suivi = suiviRamassageRepository.findById(suiviId)
                .orElseThrow(() -> new IllegalArgumentException("Demande de ramassage introuvable"));

        suivi.setStatut(SuiviRamassage.StatutCollecte.FAIT);
        suivi.setDateEffective(LocalDateTime.now());
        suivi.setPoidsKg(poidsKg);
        suivi.setVolumeM3(volumeM3);
        suivi.setObservations(observations);

        SuiviRamassage saved = suiviRamassageRepository.save(suivi);

        return saved;
    }
    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<SuiviRamassage> getDemandesEnAttente(Utilisateur agentConnecte, org.springframework.data.domain.Pageable pageable) {
        Integer agentZoneId = (agentConnecte.getZone() != null) ? agentConnecte.getZone().getId() : null;
        
        if (agentZoneId == null) {
            return suiviRamassageRepository.findByStatut(SuiviRamassage.StatutCollecte.EN_ATTENTE, pageable);
        }

        SuiviRamassage.TypeDechet typeFiltre = (agentConnecte.getSpecialisation() == Utilisateur.SpecialisationAgent.ORDINAIRE)
                ? SuiviRamassage.TypeDechet.AUTRES_DECHETS
                : SuiviRamassage.TypeDechet.PLASTIQUE;

        UUID pmeId = null;
        if (typeFiltre == SuiviRamassage.TypeDechet.AUTRES_DECHETS && agentConnecte.getPmeAppartenance() != null) {
            pmeId = agentConnecte.getPmeAppartenance().getId();
        }

        return suiviRamassageRepository.findDemandesEnAttenteFiltrees(agentZoneId, typeFiltre, pmeId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<SuiviRamassage> getHistorique(UUID menageId, org.springframework.data.domain.Pageable pageable) {
        return suiviRamassageRepository.findByMenageId(menageId, pageable);
    }

    @Override
    @Transactional
    public void annulerDemande(UUID suiviId, UUID menageId) {
        SuiviRamassage suivi = suiviRamassageRepository.findById(suiviId)
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable."));

        // Vérification de propriété : seul le ménage qui a créé la demande peut l'annuler
        if (!suivi.getMenage().getId().equals(menageId)) {
            throw new SecurityException("Accès refusé : cette demande ne vous appartient pas.");
        }

        if (suivi.getStatut() != SuiviRamassage.StatutCollecte.EN_ATTENTE) {
            throw new IllegalArgumentException("Impossible d'annuler une collecte déjà traitée.");
        }

        suivi.setStatut(SuiviRamassage.StatutCollecte.ANNULE);
        suiviRamassageRepository.save(suivi);
    }
}
