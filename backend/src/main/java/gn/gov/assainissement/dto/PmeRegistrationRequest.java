package gn.gov.assainissement.dto;

public class PmeRegistrationRequest {
    // PME Info
    private String nomPme;
    private String descriptionPme;
    private String telephonePme;
    private Double tarifMensuel;
    private String zoneCouverture;

    // Gerant Info
    private String nomGerant;
    private String prenomGerant;
    private String emailGerant;
    private String motDePasseGerant;
    private String telephoneGerant;

    // Getters and Setters
    public String getNomPme() { return nomPme; }
    public void setNomPme(String nomPme) { this.nomPme = nomPme; }

    public String getDescriptionPme() { return descriptionPme; }
    public void setDescriptionPme(String descriptionPme) { this.descriptionPme = descriptionPme; }

    public String getTelephonePme() { return telephonePme; }
    public void setTelephonePme(String telephonePme) { this.telephonePme = telephonePme; }

    public Double getTarifMensuel() { return tarifMensuel; }
    public void setTarifMensuel(Double tarifMensuel) { this.tarifMensuel = tarifMensuel; }

    public String getZoneCouverture() { return zoneCouverture; }
    public void setZoneCouverture(String zoneCouverture) { this.zoneCouverture = zoneCouverture; }

    public String getNomGerant() { return nomGerant; }
    public void setNomGerant(String nomGerant) { this.nomGerant = nomGerant; }

    public String getPrenomGerant() { return prenomGerant; }
    public void setPrenomGerant(String prenomGerant) { this.prenomGerant = prenomGerant; }

    public String getEmailGerant() { return emailGerant; }
    public void setEmailGerant(String emailGerant) { this.emailGerant = emailGerant; }

    public String getMotDePasseGerant() { return motDePasseGerant; }
    public void setMotDePasseGerant(String motDePasseGerant) { this.motDePasseGerant = motDePasseGerant; }

    public String getTelephoneGerant() { return telephoneGerant; }
    public void setTelephoneGerant(String telephoneGerant) { this.telephoneGerant = telephoneGerant; }
}
