package gn.gov.assainissement.service.impl;

import gn.gov.assainissement.entity.Role;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.RoleRepository;
import gn.gov.assainissement.repository.UtilisateurRepository;
import gn.gov.assainissement.service.UtilisateurService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final gn.gov.assainissement.repository.EntreprisePmeRepository pmeRepository;

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, gn.gov.assainissement.repository.EntreprisePmeRepository pmeRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.pmeRepository = pmeRepository;
    }

    @Override
    @Transactional
    public Utilisateur inscrireUtilisateur(String nom, String prenom, String email, String motDePasse, String nomRole, Integer zoneId, String telephone, String specialisation, UUID pmeId) {
        if (utilisateurRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Cet e-mail est déjà utilisé.");
        }
        // Fix doublon téléphone : un seul compte par numéro
        if (telephone != null && !telephone.isBlank()) {
            utilisateurRepository.findFirstByTelephone(telephone).ifPresent(u -> {
                throw new IllegalArgumentException("Ce numéro de téléphone est déjà associé à un compte.");
            });
        }

        Role role = roleRepository.findByNom(nomRole)
                .orElseThrow(() -> new IllegalArgumentException("Rôle introuvable : " + nomRole));

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(nom);
        utilisateur.setPrenom(prenom);
        utilisateur.setEmail(email);
        utilisateur.setMotDePasse(passwordEncoder.encode(motDePasse));
        utilisateur.setRole(role);
        utilisateur.setActif(true);
        utilisateur.setTelephone(telephone);

        if (specialisation != null && !specialisation.isEmpty()) {
            try {
                utilisateur.setSpecialisation(Utilisateur.SpecialisationAgent.valueOf(specialisation));
            } catch (IllegalArgumentException e) {
                utilisateur.setSpecialisation(Utilisateur.SpecialisationAgent.NON_APPLICABLE);
            }
        } else if ("AGENT".equalsIgnoreCase(nomRole)) {
            utilisateur.setSpecialisation(Utilisateur.SpecialisationAgent.PLASTIQUE); // Valeur par défaut pour Agent (rétrocompatibilité)
        } else {
            utilisateur.setSpecialisation(Utilisateur.SpecialisationAgent.NON_APPLICABLE);
        }

        if (zoneId != null) {
            gn.gov.assainissement.entity.Zone zone = new gn.gov.assainissement.entity.Zone();
            zone.setId(zoneId);
            utilisateur.setZone(zone);
        }

        if ("MENAGE".equalsIgnoreCase(nomRole) && pmeId != null) {
            gn.gov.assainissement.entity.EntreprisePme pme = pmeRepository.findById(pmeId).orElse(null);
            if (pme != null) {
                utilisateur.setPmeAbonnement(pme);
            }
        } else if ("AGENT".equalsIgnoreCase(nomRole)) {
            if (pmeId != null) {
                gn.gov.assainissement.entity.EntreprisePme pme = pmeRepository.findById(pmeId).orElse(null);
                if (pme != null) {
                    utilisateur.setPmeAppartenance(pme);
                    utilisateur.setStatutValidationPme(gn.gov.assainissement.entity.Utilisateur.StatutValidationPme.EN_ATTENTE);
                } else {
                    utilisateur.setStatutValidationPme(gn.gov.assainissement.entity.Utilisateur.StatutValidationPme.VALIDE);
                }
            } else {
                utilisateur.setStatutValidationPme(gn.gov.assainissement.entity.Utilisateur.StatutValidationPme.VALIDE);
            }
        }

        return utilisateurRepository.save(utilisateur);
    }

    @Override
    @Transactional(readOnly = true)
    public Utilisateur recupererProfil(UUID utilisateurId) {
        return utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable."));
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<Utilisateur> getAgentsParZone(Integer zoneId) {
        if (zoneId != null) {
            return utilisateurRepository.findByRoleNomAndZoneId("AGENT", zoneId);
        } else {
            return utilisateurRepository.findByRoleNom("AGENT");
        }
    }

    @Override
    @Transactional
    public Utilisateur mettreAjourProfil(UUID utilisateurId, String nom, String telephone, String quartier) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable."));

        if (nom != null && !nom.isBlank()) {
            // Séparer nom et prénom si l'utilisateur envoie le nom complet
            String[] parts = nom.trim().split(" ", 2);
            utilisateur.setNom(parts[0]);
            if (parts.length > 1) utilisateur.setPrenom(parts[1]);
        }

        // Vérification unicité téléphone si le numéro change
        if (telephone != null && !telephone.isBlank() && !telephone.equals(utilisateur.getTelephone())) {
            utilisateurRepository.findFirstByTelephone(telephone).ifPresent(u -> {
                if (!u.getId().equals(utilisateurId)) {
                    throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé par un autre compte.");
                }
            });
            utilisateur.setTelephone(telephone);
        }

        if (quartier != null && !quartier.isBlank()) {
            utilisateur.setPointDeRepere(quartier);
        }

        return utilisateurRepository.save(utilisateur);
    }
}
