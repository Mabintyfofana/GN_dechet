package gn.gov.assainissement.security;

import gn.gov.assainissement.repository.UtilisateurRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifiant) throws UsernameNotFoundException {
        return utilisateurRepository.findByEmail(identifiant)
                .or(() -> utilisateurRepository.findFirstByTelephone(identifiant))
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'identifiant: " + identifiant));
    }
}
