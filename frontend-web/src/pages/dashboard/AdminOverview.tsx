import React, { useState, useEffect } from 'react';
import { Factory, Map, AlertOctagon, TrendingUp } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalPmes: 0,
    totalZones: 0,
    reclamationsOuvertes: 0,
    collectesMois: 0
  });

  useEffect(() => {
    // API Call simulation
    setStats({
      totalPmes: 12,
      totalZones: 5,
      reclamationsOuvertes: 3,
      collectesMois: 15420
    });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Supervision Nationale</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Aperçu global du réseau GN Déchet.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-container" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>COOPÉRATIVES PME</div>
            <Factory size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{stats.totalPmes}</div>
        </div>

        <div className="glass-container" style={{ padding: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>ZONES COUVERTES</div>
            <Map size={20} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{stats.totalZones}</div>
        </div>

        <div className="glass-container" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>COLLECTES (MOIS)</div>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{stats.collectesMois}</div>
        </div>

        <div className="glass-container" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>URGENCES</div>
            <AlertOctagon size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{stats.reclamationsOuvertes}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-container" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>Évolution des collectes</h2>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Graphique (Chart.js ou Recharts) à intégrer</span>
          </div>
        </div>
        <div className="glass-container" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>Alertes Récentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.25rem' }}>Dépôt sauvage - Kaloum</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Signalé il y a 2h</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '0.25rem' }}>Retard collecte - Dixinn</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Signalé hier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
