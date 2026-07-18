package com.assainissement.guinee.service;

import com.assainissement.guinee.dto.InscriptionRequest;
import com.assainissement.guinee.dto.LoginRequest;
import com.assainissement.guinee.dto.LoginResponse;
import com.assainissement.guinee.model.Role;
import com.assainissement.guinee.model.Utilisateur;
import com.assainissement.guinee.repository.UtilisateurRepository;
import com.assainissement.guinee.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service d'authentification : inscription et connexion.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    /**
     * Inscrit un nouvel utilisateur (Ménage ou Collecteur).
     */
    @Transactional
    public void inscrire(InscriptionRequest request) {
        // Vérifier que le téléphone n'est pas déjà utilisé
        if (utilisateurRepository.existsByTelephone(request.getTelephone())) {
            throw new IllegalStateException(
                "Ce numéro de téléphone est déjà associé à un compte : " + request.getTelephone()
            );
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setRole(Role.valueOf(request.getRole()));
        utilisateur.setQuartier(request.getQuartier());
        utilisateur.setPointDeRepere(request.getPointDeRepere());

        utilisateurRepository.save(utilisateur);
    }

    /**
     * Connecte un utilisateur et retourne un token JWT.
     */
    public LoginResponse connecter(LoginRequest request) {
        // Spring Security vérifie téléphone + mot de passe
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getTelephone(), request.getMotDePasse())
        );

        Utilisateur utilisateur = utilisateurRepository.findByTelephone(request.getTelephone())
                .orElseThrow();

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getTelephone());
        String token = jwtUtil.generateToken(
                userDetails,
                utilisateur.getRole().name(),
                utilisateur.getId().toString()
        );

        return new LoginResponse(
                token,
                utilisateur.getId().toString(),
                utilisateur.getNom(),
                utilisateur.getTelephone(),
                utilisateur.getRole().name(),
                utilisateur.getQuartier()
        );
    }
}
