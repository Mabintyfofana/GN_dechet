package gn.gov.assainissement.service;

import gn.gov.assainissement.entity.Utilisateur;
import java.util.UUID;

public interface UtilisateurService {
    Utilisateur inscrireUtilisateur(String nom, String prenom, String email, String motDePasse, String nomRole, Integer zoneId, String telephone, String specialisation, UUID pmeId);
    Utilisateur recupererProfil(UUID utilisateurId);
    java.util.List<Utilisateur> getAgentsParZone(Integer zoneId);
    Utilisateur mettreAjourProfil(UUID utilisateurId, String nom, String telephone, String quartier);
}
