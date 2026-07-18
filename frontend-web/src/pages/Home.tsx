import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div className="glass-container registration-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
        <h1 style={{ marginBottom: '1rem' }}>GN Déchet : Portail B2B</h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          La plateforme centralisée pour la gestion de l'assainissement en Guinée. 
          Destinée exclusivement aux Administrateurs de l'État et aux Gérants de PME partenaires.
        </p>
        
        <div className="form-grid">
          {/* Card Admin/Gérant */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Espace de Gestion</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Connectez-vous pour superviser les collectes, valider vos agents et suivre les statistiques.
            </p>
            <button onClick={() => navigate('/login')} style={{ background: 'var(--accent)' }}>
              Se connecter
            </button>
          </div>

          {/* Card Nouvelle PME */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Devenir Partenaire</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Enregistrez votre PME pour rejoindre le réseau national de collecte des ordures ménagères.
            </p>
            <button onClick={() => navigate('/register-pme')} style={{ background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' }}>
              Inscrire ma PME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
