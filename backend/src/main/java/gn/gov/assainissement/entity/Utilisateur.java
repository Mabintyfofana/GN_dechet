package gn.gov.assainissement.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@Entity
@Table(name = "utilisateurs")
@EntityListeners(AuditingEntityListener.class)
public class Utilisateur implements UserDetails {

    public enum SpecialisationAgent {
        ORDINAIRE,
        PLASTIQUE,
        NON_APPLICABLE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Column(length = 20)
    private String telephone;

    @Column(name = "point_de_repere")
    private String pointDeRepere;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @Column(nullable = false)
    private Boolean actif = true;

    public enum StatutValidationPme {
        EN_ATTENTE,
        VALIDE,
        REJETE
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_validation_pme", length = 20)
    private StatutValidationPme statutValidationPme = StatutValidationPme.VALIDE;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialisation", length = 30)
    private SpecialisationAgent specialisation = SpecialisationAgent.NON_APPLICABLE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pme_appartenance_id")
    private EntreprisePme pmeAppartenance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pme_abonnement_id")
    private EntreprisePme pmeAbonnement;

    @CreatedDate
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    @Column(name = "date_mise_a_jour")
    private LocalDateTime dateMiseAJour;

    public Utilisateur() {}

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.getNom().toUpperCase()));
    }

    @Override
    public String getPassword() {
        return this.motDePasse;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return this.actif; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return this.actif; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getPointDeRepere() { return pointDeRepere; }
    public void setPointDeRepere(String pointDeRepere) { this.pointDeRepere = pointDeRepere; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    public LocalDateTime getDateMiseAJour() { return dateMiseAJour; }
    public void setDateMiseAJour(LocalDateTime dateMiseAJour) { this.dateMiseAJour = dateMiseAJour; }
    public SpecialisationAgent getSpecialisation() { return specialisation; }
    public void setSpecialisation(SpecialisationAgent specialisation) { this.specialisation = specialisation; }
    public EntreprisePme getPmeAppartenance() { return pmeAppartenance; }
    public void setPmeAppartenance(EntreprisePme pmeAppartenance) { this.pmeAppartenance = pmeAppartenance; }
    public EntreprisePme getPmeAbonnement() { return pmeAbonnement; }
    public void setPmeAbonnement(EntreprisePme pmeAbonnement) { this.pmeAbonnement = pmeAbonnement; }
    public StatutValidationPme getStatutValidationPme() { return statutValidationPme; }
    public void setStatutValidationPme(StatutValidationPme statutValidationPme) { this.statutValidationPme = statutValidationPme; }
}
