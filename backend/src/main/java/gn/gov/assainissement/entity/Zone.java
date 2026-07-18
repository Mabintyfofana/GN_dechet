package gn.gov.assainissement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "zones")
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String nom;

    @Column(nullable = false, length = 50)
    private String region;

    @Column(nullable = false, length = 50)
    private String prefecture;

    @Column(nullable = false, length = 50)
    private String commune;

    public Zone() {}

    public Zone(Integer id, String nom, String region, String prefecture, String commune) {
        this.id = id;
        this.nom = nom;
        this.region = region;
        this.prefecture = prefecture;
        this.commune = commune;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getPrefecture() { return prefecture; }
    public void setPrefecture(String prefecture) { this.prefecture = prefecture; }
    public String getCommune() { return commune; }
    public void setCommune(String commune) { this.commune = commune; }
}
