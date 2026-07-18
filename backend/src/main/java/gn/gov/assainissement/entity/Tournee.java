package gn.gov.assainissement.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tournees")
@EntityListeners(AuditingEntityListener.class)
public class Tournee {

    public enum StatutTournee {
        PROGRAMMEE, EN_COURS, TERMINEE, ANNULEE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Utilisateur agent;

    @Column(name = "date_prevue", nullable = false)
    private LocalDateTime datePrevue;

    @Column(name = "date_debut")
    private LocalDateTime dateDebut;

    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutTournee statut = StatutTournee.PROGRAMMEE;

    @Column(name = "capacite_disponible_kg")
    private Double capaciteDisponibleKg;

    @Column(name = "capacite_disponible_m3")
    private Double capaciteDisponibleM3;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }
    public Utilisateur getAgent() { return agent; }
    public void setAgent(Utilisateur agent) { this.agent = agent; }
    public LocalDateTime getDatePrevue() { return datePrevue; }
    public void setDatePrevue(LocalDateTime datePrevue) { this.datePrevue = datePrevue; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
    public StatutTournee getStatut() { return statut; }
    public void setStatut(StatutTournee statut) { this.statut = statut; }
    public Double getCapaciteDisponibleKg() { return capaciteDisponibleKg; }
    public void setCapaciteDisponibleKg(Double capaciteDisponibleKg) { this.capaciteDisponibleKg = capaciteDisponibleKg; }
    public Double getCapaciteDisponibleM3() { return capaciteDisponibleM3; }
    public void setCapaciteDisponibleM3(Double capaciteDisponibleM3) { this.capaciteDisponibleM3 = capaciteDisponibleM3; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
