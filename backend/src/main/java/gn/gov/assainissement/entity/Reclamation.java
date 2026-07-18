package gn.gov.assainissement.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reclamations")
@EntityListeners(AuditingEntityListener.class)
public class Reclamation {

    public enum TypeReclamation {
        COLLECTE_NON_EFFECTUEE, RETARD_COLLECTE, COMPORTEMENT_AGENT, BRUIT, DEVERSEMENT_ILLEGAL, AUTRE
    }

    public enum StatutReclamation {
        OUVERT, EN_COURS, RESOLU, FERME, REJETE
    }

    public enum PrioriteReclamation {
        BASSE, NORMALE, HAUTE, URGENTE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menage_id", nullable = false)
    private Utilisateur menage;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_reclamation", nullable = false, length = 50)
    private TypeReclamation typeReclamation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutReclamation statut = StatutReclamation.OUVERT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PrioriteReclamation priorite = PrioriteReclamation.NORMALE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collecte_id")
    private SuiviRamassage collecte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_responsable")
    private Utilisateur agentResponsable;

    @CreatedDate
    @Column(name = "date_soumission", updatable = false)
    private LocalDateTime dateSoumission;

    @Column(name = "date_resolution")
    private LocalDateTime dateResolution;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Utilisateur getMenage() { return menage; }
    public void setMenage(Utilisateur menage) { this.menage = menage; }
    public TypeReclamation getTypeReclamation() { return typeReclamation; }
    public void setTypeReclamation(TypeReclamation typeReclamation) { this.typeReclamation = typeReclamation; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public StatutReclamation getStatut() { return statut; }
    public void setStatut(StatutReclamation statut) { this.statut = statut; }
    public PrioriteReclamation getPriorite() { return priorite; }
    public void setPriorite(PrioriteReclamation priorite) { this.priorite = priorite; }
    public SuiviRamassage getCollecte() { return collecte; }
    public void setCollecte(SuiviRamassage collecte) { this.collecte = collecte; }
    public Utilisateur getAgentResponsable() { return agentResponsable; }
    public void setAgentResponsable(Utilisateur agentResponsable) { this.agentResponsable = agentResponsable; }
    public LocalDateTime getDateSoumission() { return dateSoumission; }
    public void setDateSoumission(LocalDateTime dateSoumission) { this.dateSoumission = dateSoumission; }
    public LocalDateTime getDateResolution() { return dateResolution; }
    public void setDateResolution(LocalDateTime dateResolution) { this.dateResolution = dateResolution; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
