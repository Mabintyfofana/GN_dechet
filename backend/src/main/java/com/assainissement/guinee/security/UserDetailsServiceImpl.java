package com.assainissement.guinee.security;

import com.assainissement.guinee.model.Utilisateur;
import com.assainissement.guinee.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implémentation de UserDetailsService.
 * Spring Security appelle cette classe pour charger l'utilisateur lors de la connexion.
 * L'identifiant utilisé est le numéro de téléphone.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String telephone) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByTelephone(telephone)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Aucun utilisateur trouvé avec le téléphone : " + telephone
                ));

        if (!utilisateur.isActif()) {
            throw new UsernameNotFoundException("Compte désactivé : " + telephone);
        }

        return new User(
                utilisateur.getTelephone(),
                utilisateur.getMotDePasse(),
                List.of(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()))
        );
    }
}
