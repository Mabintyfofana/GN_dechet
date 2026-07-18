package com.assainissement.guinee.service;

import com.assainissement.guinee.dto.AbonnementMenageRequest;
import com.assainissement.guinee.exception.ResourceNotFoundException;
import com.assainissement.guinee.model.AbonnementMenage;
import com.assainissement.guinee.model.Utilisateur;
import com.assainissement.guinee.repository.AbonnementMenageRepository;
import com.assainissement.guinee.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Logique métier pour les abonnements des ménages.
 */
@Service
@RequiredArgsConstructor
public class AbonnementMenageService {

    private final AbonnementMenageRepository abonnementRepo;
    private final UtilisateurRepository utilisateurRepo;

    /**
     * Crée un abonnement pour un ménage après paiement Mobile Money.
     */
    @Transactional
    public AbonnementMenage creerAbonnement(UUID menageId, AbonnementMenageRequest request) {
        // Vérifier que la référence Mobile Money n'est pas déjà enregistrée
        if (abonnementRepo.existsByReferenceMobileMoney(request.getReferenceMobileMoney())) {
            throw new IllegalStateException(
                "Référence Mobile Money déjà utilisée : " + request.getReferenceMobileMoney()
            );
        }

        Utilisateur menage = utilisateurRepo.findById(menageId)
                .orElseThrow(() -> new ResourceNotFoundException("Ménage", menageId.toString()));

        AbonnementMenage abonnement = new AbonnementMenage();
        abonnement.setMenage(menage);
        abonnement.setMontant(request.getMontant());
        abonnement.setReferenceMobileMoney(request.getReferenceMobileMoney());
        abonnement.setDateExpiration(request.getDateExpiration());
        abonnement.setStatut("ACTIF");

        return abonnementRepo.save(abonnement);
    }

    /**
     * Récupère l'abonnement actif d'un ménage.
     */
    public AbonnementMenage getAbonnementActif(UUID menageId) {
        return abonnementRepo.findByMenage_IdAndStatut(menageId, "ACTIF")
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Aucun abonnement actif pour le ménage : " + menageId
                ));
    }

    /**
     * Historique de tous les abonnements d'un ménage.
     */
    public List<AbonnementMenage> getHistorique(UUID menageId) {
        return abonnementRepo.findByMenage_IdOrderByDatePaiementDesc(menageId);
    }
}
