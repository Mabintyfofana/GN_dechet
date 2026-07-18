package gn.gov.assainissement.service;

import gn.gov.assainissement.entity.SuiviRamassage;
import gn.gov.assainissement.repository.SuiviRamassageRepository;
import gn.gov.assainissement.repository.UtilisateurRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Service de calcul des statistiques globales et du journal des flux
 * pour la console d'administration (pilier "anti-gravité").
 *
 * Chaque collecte validée par un agent terrain est ici agrégée pour
 * constituer la preuve numérique qui déclenche le financement.
 */
@Service
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final SuiviRamassageRepository ramassageRepository;

    public AdminService(UtilisateurRepository utilisateurRepository,
                        SuiviRamassageRepository ramassageRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.ramassageRepository = ramassageRepository;
    }

    /**
     * Record de réponse des statistiques globales du dashboard admin.
     */
    public record AdminDashboardStats(
            long totalMenages,
            long totalAgents,
            long alertesEnAttente,
            long collectesAujourdHui,
            long collectesCeMois,
            double kgCollecteCeMois,
            double tauxValidation
    ) {}

    /**
     * Calcule les KPIs globaux du système en temps réel.
     */
    @Transactional(readOnly = true)
    public AdminDashboardStats getGlobalStats() {
        long totalMenages = utilisateurRepository.countByRoleNom("MENAGE");
        long totalAgents  = utilisateurRepository.countByRoleNom("AGENT");
        long enAttente    = ramassageRepository.countByStatut(SuiviRamassage.StatutCollecte.EN_ATTENTE);

        LocalDateTime debutJour  = LocalDate.now().atStartOfDay();
        LocalDateTime debutMois  = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        long collectesAujourdHui = ramassageRepository.countByDatePrevueAfter(debutJour);
        long collectesCeMois     = ramassageRepository.countByDatePrevueAfter(debutMois);

        Double totalKgRaw = ramassageRepository.sumPoidsKgDepuis(debutMois);
        double kgCollecte = (totalKgRaw != null) ? totalKgRaw : 0.0;

        long totalHistorique = ramassageRepository.count();
        long totalFaits      = ramassageRepository.countByStatut(SuiviRamassage.StatutCollecte.FAIT);
        double taux = (totalHistorique > 0) ? ((double) totalFaits / totalHistorique) * 100.0 : 0.0;
        double tauxArrondi = Math.round(taux * 10.0) / 10.0;

        return new AdminDashboardStats(
                totalMenages,
                totalAgents,
                enAttente,
                collectesAujourdHui,
                collectesCeMois,
                kgCollecte,
                tauxArrondi
        );
    }

    /**
     * Retourne le journal paginé de toutes les collectes (tri par date décroissante).
     */
    @Transactional(readOnly = true)
    public Page<SuiviRamassage> getJournal(Pageable pageable) {
        return ramassageRepository.findAll(pageable);
    }
}
