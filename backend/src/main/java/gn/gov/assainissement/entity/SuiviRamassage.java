package gn.gov.assainissement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "suivi_ramassages")
public class SuiviRamassage {

    public enum TypeDechet {
        PLASTIQUE,
        AUTRES_DECHETS
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menage_id", nullable = false)
    private Utilisateur menage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "collecteur_id")
    private Utilisateur collecteur;

    @Column(name = "date_prevue", nullable = false)
    private LocalDateTime datePrevue;

    @Column(name = "date_effective")
    private LocalDateTime dateEffective;

    @Column(name = "poids_kg", precision = 10, scale = 2)
    private BigDecimal poidsKg;

    @Column(name = "volume_m3", precision = 10, scale = 2)
    private BigDecimal volumeM3;

    public enum StatutCollecte {
        EN_ATTENTE, EN_COURS, PLANIFIE, FAIT, ANNULE
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatutCollecte statut; // EN_ATTENTE, EN_COURS, FAIT, ANNULE

    @Enumerated(EnumType.STRING)
    @Column(name = "type_dechet", length = 30)
    private TypeDechet typeDechet = TypeDechet.PLASTIQUE;

    @Column(columnDefinition = "TEXT")
    private String observations;

    public SuiviRamassage() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Utilisateur getMenage() { return menage; }
    public void setMenage(Utilisateur menage) { this.menage = menage; }
    public Utilisateur getCollecteur() { return collecteur; }
    public void setCollecteur(Utilisateur collecteur) { this.collecteur = collecteur; }
    public LocalDateTime getDatePrevue() { return datePrevue; }
    public void setDatePrevue(LocalDateTime datePrevue) { this.datePrevue = datePrevue; }
    public LocalDateTime getDateEffective() { return dateEffective; }
    public void setDateEffective(LocalDateTime dateEffective) { this.dateEffective = dateEffective; }
    public BigDecimal getPoidsKg() { return poidsKg; }
    public void setPoidsKg(BigDecimal poidsKg) { this.poidsKg = poidsKg; }
    public BigDecimal getVolumeM3() { return volumeM3; }
    public void setVolumeM3(BigDecimal volumeM3) { this.volumeM3 = volumeM3; }
    public StatutCollecte getStatut() { return statut; }
    public void setStatut(StatutCollecte statut) { this.statut = statut; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public TypeDechet getTypeDechet() { return typeDechet; }
    public void setTypeDechet(TypeDechet typeDechet) { this.typeDechet = typeDechet; }
}
