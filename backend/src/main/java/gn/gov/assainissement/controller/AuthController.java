package gn.gov.assainissement.controller;

import gn.gov.assainissement.entity.RefreshToken;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.security.JwtService;
import gn.gov.assainissement.service.RefreshTokenService;
import gn.gov.assainissement.service.UtilisateurService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UtilisateurService utilisateurService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UtilisateurService utilisateurService, AuthenticationManager authenticationManager,
                          JwtService jwtService, UserDetailsService userDetailsService,
                          RefreshTokenService refreshTokenService) {
        this.utilisateurService = utilisateurService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.refreshTokenService = refreshTokenService;
    }

    public record InscriptionRequest(String nom, String prenom, String email, String motDePasse, String role, Integer zoneId, String telephone, String specialisation, java.util.UUID pmeId) {}
    public record LoginRequest(String email, String telephone, String identifiant, String motDePasse) {
        public String getUsername() {
            if (identifiant != null && !identifiant.isEmpty()) return identifiant;
            if (telephone != null && !telephone.isEmpty()) return telephone;
            return email;
        }
    }
    public record AuthResponse(String token, String refreshToken, String type, gn.gov.assainissement.dto.UserResponse utilisateur) {}
    public record RefreshTokenRequest(String refreshToken) {}
    public record TokenRefreshResponse(String accessToken, String refreshToken, String tokenType) {}

    @PostMapping("/inscription")
    public ResponseEntity<gn.gov.assainissement.dto.UserResponse> inscription(@RequestBody InscriptionRequest req) {
        Utilisateur utilisateur = utilisateurService.inscrireUtilisateur(
                req.nom(), req.prenom(), req.email(), req.motDePasse(), req.role(), req.zoneId(), req.telephone(), req.specialisation(), req.pmeId());
        return ResponseEntity.ok(gn.gov.assainissement.dto.UserResponse.fromEntity(utilisateur));
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody LoginRequest req) {
        try {
            String username = req.getUsername();
            // On log uniquement les 3 derniers caractères pour ne pas exposer l'identifiant complet
            log.info("[AUTH] Tentative de connexion (***{})", username.length() > 3 ? username.substring(username.length() - 3) : "***");

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, req.motDePasse())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Utilisateur utilisateur = utilisateurService.recupererProfil(((Utilisateur) userDetails).getId());
            
            if ("AGENT".equalsIgnoreCase(utilisateur.getRole().getNom())) {
                if (utilisateur.getStatutValidationPme() == Utilisateur.StatutValidationPme.EN_ATTENTE) {
                    return ResponseEntity.status(401).body(Map.of("error", "Votre compte est en attente de validation par votre PME."));
                } else if (utilisateur.getStatutValidationPme() == Utilisateur.StatutValidationPme.REJETE) {
                    return ResponseEntity.status(403).body(Map.of("error", "Votre demande d'inscription a été rejetée. Veuillez contacter un administrateur."));
                }
            }
            
            Map<String, Object> extraClaims = Map.of("role", utilisateur.getRole().getNom());
            String jwtToken = jwtService.generateToken(extraClaims, userDetails);

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(utilisateur.getId());

            return ResponseEntity.ok(new AuthResponse(jwtToken, refreshToken.getToken(), "Bearer", gn.gov.assainissement.dto.UserResponse.fromEntity(utilisateur)));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            log.warn("[AUTH] Échec d'authentification : mot de passe incorrect");
            return ResponseEntity.status(401).body(Map.of("error", "Mot de passe incorrect."));
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            log.warn("[AUTH] Échec d'authentification : identifiant introuvable");
            return ResponseEntity.status(404).body(Map.of("error", "Aucun compte trouvé avec cet identifiant."));
        } catch (Exception e) {
            log.error("[AUTH] Erreur inattendue lors de la connexion : {}", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(Map.of("error", "Erreur serveur."));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String requestRefreshToken = request.refreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUtilisateur)
                .map(utilisateur -> {
                    Map<String, Object> extraClaims = Map.of("role", utilisateur.getRole().getNom());
                    String token = jwtService.generateToken(extraClaims, utilisateur);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken, "Bearer"));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
