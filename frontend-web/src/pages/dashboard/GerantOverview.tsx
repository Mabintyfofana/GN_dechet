import React, { useState, useEffect } from 'react';
import { Users, Truck, AlertTriangle } from 'lucide-react';

const GerantOverview = () => {
  const [stats, setStats] = useState({
    totalAbonnes: 0,
    agentsActifs: 0,
    collectesMois: 0
  });

  useEffect(() => {
    // Simulons l'appel API pour l'instant
    // Plus tard: fetch(`/api/v1/pme/${pmeId}/stats`)
    setStats({
      totalAbonnes: 124,
      agentsActifs: 8,
      collectesMois: 342
    });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Vue d'ensemble</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Statistiques de votre coopérative PME.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-container" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px', color: '#3b82f6' }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.totalAbonnes}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Abonnés Actifs</div>
          </div>
        </div>

        <div className="glass-container" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', color: '#10b981' }}>
            <Truck size={28} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.agentsActifs}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Agents Déployés</div>
          </div>
        </div>

        <div className="glass-container" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '12px', color: '#f59e0b' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{stats.collectesMois}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Collectes ce mois</div>
          </div>
        </div>
      </div>

      <div className="glass-container" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>Dernières activités (Simulation)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Les graphiques de suivi des collectes seront affichés ici.</p>
      </div>
    </div>
  );
};

export default GerantOverview;
