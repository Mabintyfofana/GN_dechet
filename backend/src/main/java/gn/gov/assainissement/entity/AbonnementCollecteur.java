package gn.gov.assainissement.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "abonnements_collecteurs")
public class AbonnementCollecteur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collecteur_id", nullable = false)
    private Utilisateur collecteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_actuelle_id")
    private Zone zoneActuelle;

    public enum StatutAgent {
        ACTIF, INACTIF, SUSPENDU
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatutAgent statut = StatutAgent.ACTIF;

    public AbonnementCollecteur() {}

    public AbonnementCollecteur(UUID id, Utilisateur collecteur, Zone zoneActuelle, StatutAgent statut) {
        this.id = id;
        this.collecteur = collecteur;
        this.zoneActuelle = zoneActuelle;
        this.statut = statut;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Utilisateur getCollecteur() { return collecteur; }
    public void setCollecteur(Utilisateur collecteur) { this.collecteur = collecteur; }
    public Zone getZoneActuelle() { return zoneActuelle; }
    public void setZoneActuelle(Zone zoneActuelle) { this.zoneActuelle = zoneActuelle; }
    public StatutAgent getStatut() { return statut; }
    public void setStatut(StatutAgent statut) { this.statut = statut; }
}
