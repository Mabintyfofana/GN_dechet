package gn.gov.assainissement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "entreprise_pme")
@EntityListeners(AuditingEntityListener.class)
public class EntreprisePme {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 500)
    private String description;

    @Column(length = 20)
    private String telephone;

    @Column(name = "tarif_mensuel")
    private Double tarifMensuel;

    @Column(name = "zone_couverture")
    private String zoneCouverture;

    @CreatedDate
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @JsonIgnore
    @OneToMany(mappedBy = "pmeAppartenance")
    private List<Utilisateur> agents;

    @JsonIgnore
    @OneToMany(mappedBy = "pmeAbonnement")
    private List<Utilisateur> menagesAbonnes;

    public EntreprisePme() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Double getTarifMensuel() { return tarifMensuel; }
    public void setTarifMensuel(Double tarifMensuel) { this.tarifMensuel = tarifMensuel; }

    public String getZoneCouverture() { return zoneCouverture; }
    public void setZoneCouverture(String zoneCouverture) { this.zoneCouverture = zoneCouverture; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public List<Utilisateur> getAgents() { return agents; }
    public void setAgents(List<Utilisateur> agents) { this.agents = agents; }

    public List<Utilisateur> getMenagesAbonnes() { return menagesAbonnes; }
    public void setMenagesAbonnes(List<Utilisateur> menagesAbonnes) { this.menagesAbonnes = menagesAbonnes; }
}
