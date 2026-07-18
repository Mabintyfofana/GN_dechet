package gn.gov.assainissement.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "paiements")
@EntityListeners(AuditingEntityListener.class)
public class Paiement {

    public enum ModePaiement {
        ESPECE, MOBILE_MONEY, VIREMENT, CARTE
    }

    public enum StatutPaiement {
        EN_ATTENTE, VALIDE, REFUSE, REMBOURSE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menage_id", nullable = false)
    private Utilisateur menage;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montant;

    @Column(nullable = false, length = 5)
    private String devise = "GNF";

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_paiement", nullable = false, length = 30)
    private ModePaiement modePaiement;

    @Column(name = "reference_txn", unique = true, length = 100)
    private String referenceTxn;

    @Column(name = "periode_debut", nullable = false)
    private LocalDate periodeDebut;

    @Column(name = "periode_fin", nullable = false)
    private LocalDate periodeFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutPaiement statut = StatutPaiement.EN_ATTENTE;

    @CreatedDate
    @Column(name = "date_paiement", updatable = false)
    private LocalDateTime datePaiement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "valide_par")
    private Utilisateur validePar;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Utilisateur getMenage() { return menage; }
    public void setMenage(Utilisateur menage) { this.menage = menage; }
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    public String getDevise() { return devise; }
    public void setDevise(String devise) { this.devise = devise; }
    public ModePaiement getModePaiement() { return modePaiement; }
    public void setModePaiement(ModePaiement modePaiement) { this.modePaiement = modePaiement; }
    public String getReferenceTxn() { return referenceTxn; }
    public void setReferenceTxn(String referenceTxn) { this.referenceTxn = referenceTxn; }
    public LocalDate getPeriodeDebut() { return periodeDebut; }
    public void setPeriodeDebut(LocalDate periodeDebut) { this.periodeDebut = periodeDebut; }
    public LocalDate getPeriodeFin() { return periodeFin; }
    public void setPeriodeFin(LocalDate periodeFin) { this.periodeFin = periodeFin; }
    public StatutPaiement getStatut() { return statut; }
    public void setStatut(StatutPaiement statut) { this.statut = statut; }
    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }
    public Utilisateur getValidePar() { return validePar; }
    public void setValidePar(Utilisateur validePar) { this.validePar = validePar; }
    public LocalDateTime getDateValidation() { return dateValidation; }
    public void setDateValidation(LocalDateTime dateValidation) { this.dateValidation = dateValidation; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
