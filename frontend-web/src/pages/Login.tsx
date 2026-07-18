import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/connexion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errText = await response.json().catch(() => null);
        throw new Error(errText?.error || "Identifiants incorrects");
      }

      const data = await response.json();
      
      // Store user data securely in localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.utilisateur));

      // Navigate based on role
      const role = typeof data.utilisateur.role === 'string' ? data.utilisateur.role : data.utilisateur.role?.nom;
      
      if (role === 'ADMIN' || role === 'GERANT_PME') {
        navigate('/dashboard');
      } else {
        throw new Error("Accès refusé. Vous n'êtes pas administrateur ou gérant.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="glass-container registration-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Connexion Backoffice</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>Accédez à votre espace administrateur ou gérant PME.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Email ou Identifiant administratif</label>
            <input 
              required 
              type="text" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="admin@gndechet.gn ou ID..." 
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              required 
              type="password" 
              name="motDePasse" 
              value={formData.motDePasse} 
              onChange={handleChange} 
              placeholder="••••••••" 
            />
          </div>

          {error && (
            <div style={{ color: 'var(--error)', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Pas encore partenaire ? <a href="/register-pme" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Inscrivez votre PME</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
