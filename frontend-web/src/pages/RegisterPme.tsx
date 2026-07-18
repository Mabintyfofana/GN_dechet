import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPme = () => {
  const [formData, setFormData] = useState({
    nomPme: '',
    descriptionPme: '',
    zoneCouverture: '',
    tarifMensuel: '',
    telephonePme: '',
    nomGerant: '',
    prenomGerant: '',
    emailGerant: '',
    motDePasseGerant: '',
    telephoneGerant: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Étape 1 : inscription de la PME + Gérant
      const response = await fetch('http://localhost:8080/api/v1/pme/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tarifMensuel: formData.tarifMensuel ? parseFloat(formData.tarifMensuel) : 0
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Erreur lors de l'inscription");
      }

      // Étape 2 : auto-connexion après inscription réussie
      const loginResponse = await fetch('http://localhost:8080/api/v1/auth/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.emailGerant,
          motDePasse: formData.motDePasseGerant
        }),
      });

      if (!loginResponse.ok) {
        // Inscription OK mais connexion auto échouée → on redirige vers login
        navigate('/login');
        return;
      }

      const loginData = await loginResponse.json();
      localStorage.setItem('adminToken', loginData.token);
      localStorage.setItem('adminUser', JSON.stringify(loginData.utilisateur));

      // Étape 3 : redirection directe vers le Dashboard
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Plus besoin de l'écran de succès statique
  // L'utilisateur est maintenant redirigé directement sur son dashboard

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {/* Colonne Entreprise */}
      <div>
        <h2 className="section-title">🏢 Informations de l'Entreprise</h2>
        
        <div className="form-group">
          <label>Nom de la PME *</label>
          <input required type="text" name="nomPme" value={formData.nomPme} onChange={handleChange} placeholder="Ex: Conakry Clean" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="descriptionPme" value={formData.descriptionPme} onChange={handleChange} placeholder="Décrivez votre activité de ramassage..." />
        </div>

        <div className="form-group">
          <label>Zone de Couverture *</label>
          <input required type="text" name="zoneCouverture" value={formData.zoneCouverture} onChange={handleChange} placeholder="Ex: Kaloum, Dixinn" />
        </div>

        <div className="form-group">
          <label>Tarif Mensuel (GNF) *</label>
          <input required type="number" name="tarifMensuel" value={formData.tarifMensuel} onChange={handleChange} placeholder="Ex: 50000" />
        </div>

        <div className="form-group">
          <label>Téléphone de l'entreprise</label>
          <input type="text" name="telephonePme" value={formData.telephonePme} onChange={handleChange} placeholder="Ex: 620 00 00 00" />
        </div>
      </div>

      {/* Colonne Gérant */}
      <div>
        <h2 className="section-title">👤 Profil du Gérant</h2>

        <div className="form-group">
          <label>Prénom du Gérant *</label>
          <input required type="text" name="prenomGerant" value={formData.prenomGerant} onChange={handleChange} placeholder="Ex: Amadou" />
        </div>

        <div className="form-group">
          <label>Nom du Gérant *</label>
          <input required type="text" name="nomGerant" value={formData.nomGerant} onChange={handleChange} placeholder="Ex: Diallo" />
        </div>

        <div className="form-group">
          <label>Email du Gérant *</label>
          <input required type="email" name="emailGerant" value={formData.emailGerant} onChange={handleChange} placeholder="Ex: amadou@email.com" />
        </div>

        <div className="form-group">
          <label>Mot de passe *</label>
          <input required type="password" name="motDePasseGerant" value={formData.motDePasseGerant} onChange={handleChange} placeholder="Créer un mot de passe sécurisé" minLength={6} />
        </div>

        <div className="form-group">
          <label>Téléphone du Gérant *</label>
          <input required type="text" name="telephoneGerant" value={formData.telephoneGerant} onChange={handleChange} placeholder="Ex: 622 11 22 33" />
        </div>
      </div>

      {/* Actions */}
      <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription en cours...' : 'Inscrire mon Entreprise'}
        </button>
      </div>
    </form>
  );
};

export default RegisterPme;
