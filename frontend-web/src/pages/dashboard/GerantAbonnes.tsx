import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const GerantAbonnes = () => {
  const [abonnes, setAbonnes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dans une implémentation réelle avec API:
    // const pmeId = user.pmeAppartenance ? user.pmeAppartenance.id : user.pmeId;
    // fetch(`/api/v1/pme/${pmeId}/abonnes`)
    
    // Simulation
    setTimeout(() => {
      setAbonnes([
        { id: '1', nom: 'Diallo', prenom: 'Mamadou', telephone: '622001122', quartier: 'Kaloum', statut: 'Actif' },
        { id: '2', nom: 'Sylla', prenom: 'Fanta', telephone: '620334455', quartier: 'Dixinn', statut: 'Actif' },
        { id: '3', nom: 'Barry', prenom: 'Ibrahima', telephone: '621998877', quartier: 'Matam', statut: 'En attente paiement' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Mes Abonnés</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Liste des ménages ayant souscrit à votre coopérative.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Rechercher un abonné..." 
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(15,23,42,0.6)', color: '#fff' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Chargement...</div>
      ) : (
        <div className="glass-container" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>MÉNAGE</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>TÉLÉPHONE</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>QUARTIER</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {abonnes.map(abonne => (
                <tr key={abonne.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#fff', fontWeight: 500 }}>
                    {abonne.prenom} {abonne.nom}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{abonne.telephone}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{abonne.quartier}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      backgroundColor: abonne.statut === 'Actif' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                      color: abonne.statut === 'Actif' ? '#10b981' : '#f59e0b',
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      {abonne.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GerantAbonnes;
