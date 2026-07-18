package gn.gov.assainissement.service;

import gn.gov.assainissement.entity.RefreshToken;
import gn.gov.assainissement.entity.Utilisateur;
import gn.gov.assainissement.repository.RefreshTokenRepository;
import gn.gov.assainissement.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${application.security.jwt.refresh-token.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UtilisateurRepository utilisateurRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UtilisateurRepository utilisateurRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional
    public RefreshToken createRefreshToken(UUID utilisateurId) {
        // Supprime l'ancien token s'il existe et force le flush pour éviter la violation de contrainte unique (Insert avant Delete de Hibernate)
        refreshTokenRepository.deleteByUtilisateurId(utilisateurId);
        refreshTokenRepository.flush();

        RefreshToken refreshToken = new RefreshToken();

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        refreshToken.setUtilisateur(utilisateur);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token est expir�. Veuillez vous reconnecter.");
        }
        return token;
    }
}

