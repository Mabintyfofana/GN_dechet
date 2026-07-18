package com.assainissement.guinee.service;

import com.assainissement.guinee.dto.RamassageStatutUpdate;
import com.assainissement.guinee.exception.ResourceNotFoundException;
import com.assainissement.guinee.model.SuiviRamassage;
import com.assainissement.guinee.model.Utilisateur;
import com.assainissement.guinee.repository.RamassageRepository;
import com.assainissement.guinee.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Logique métier pour le suivi des ramassages de déchets.
 */
@Service
@RequiredArgsConstructor
public class RamassageService {

    private final RamassageRepository ramassageRepo;
    private final UtilisateurRepository utilisateurRepo;

    /**
     * Un ménage crée une demande de ramassage (statut EN_ATTENTE).
     */
    @Transactional
    public SuiviRamassage demanderRamassage(UUID menageId) {
        Utilisateur menage = utilisateurRepo.findById(menageId)
                .orElseThrow(() -> new ResourceNotFoundException("Ménage", menageId.toString()));

        SuiviRamassage ramassage = new SuiviRamassage();
        ramassage.setMenage(menage);
        ramassage.setStatut("EN_ATTENTE");

        return ramassageRepo.save(ramassage);
    }

    /**
     * Un collecteur accepte une demande de ramassage.
     */
    @Transactional
    public SuiviRamassage accepterRamassage(UUID ramassageId, UUID collecteurId) {
        SuiviRamassage ramassage = ramassageRepo.findById(ramassageId)
                .orElseThrow(() -> new ResourceNotFoundException("Ramassage", ramassageId.toString()));

        if (!"EN_ATTENTE".equals(ramassage.getStatut())) {
            throw new IllegalStateException("Ce ramassage n'est plus en attente.");
        }

        Utilisateur collecteur = utilisateurRepo.findById(collecteurId)
                .orElseThrow(() -> new ResourceNotFoundException("Collecteur", collecteurId.toString()));

        ramassage.setCollecteur(collecteur);
        ramassage.setStatut("CONFIRME");

        return ramassageRepo.save(ramassage);
    }

    /**
     * Met à jour le statut d'un ramassage (EN_COURS, FAIT, ANNULE).
     * Le ménage peut noter le collecteur quand le statut passe à FAIT.
     */
    @Transactional
    public SuiviRamassage mettreAJourStatut(UUID ramassageId, RamassageStatutUpdate update) {
        SuiviRamassage ramassage = ramassageRepo.findById(ramassageId)
                .orElseThrow(() -> new ResourceNotFoundException("Ramassage", ramassageId.toString()));

        ramassage.setStatut(update.getStatut());
        if (update.getNoteMenage() != null) {
            ramassage.setNoteMenage(update.getNoteMenage());
        }
        if (update.getCommentaire() != null) {
            ramassage.setCommentaire(update.getCommentaire());
        }

        return ramassageRepo.save(ramassage);
    }

    /** Historique des ramassages d'un ménage */
    public List<SuiviRamassage> getHistoriqueMenage(UUID menageId) {
        return ramassageRepo.findByMenage_IdOrderByDateHeureDesc(menageId);
    }

    /** Liste des demandes assignées à un collecteur */
    public List<SuiviRamassage> getRamassagesCollecteur(UUID collecteurId) {
        return ramassageRepo.findByCollecteur_IdOrderByDateHeureDesc(collecteurId);
    }

    /** Toutes les demandes EN_ATTENTE dans un quartier (pour les collecteurs) */
    public List<SuiviRamassage> getDemandesEnAttenteParQuartier(String quartier) {
        return ramassageRepo.findEnAttenteByQuartier(quartier);
    }
}
