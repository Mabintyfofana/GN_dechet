import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, ShieldCheck } from 'lucide-react';

const GerantAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const pmeId = user.pmeAppartenance ? user.pmeAppartenance.id : user.pmeId;

  const fetchAgents = async () => {
    if (!pmeId) {
      setError("Erreur : ID de la PME introuvable pour ce gérant.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/pme/${pmeId}/agents-en-attente`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur lors de la récupération des agents');
      const data = await res.json();
      setAgents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAction = async (agentId: string, action: 'valider' | 'rejeter') => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/pme/${pmeId}/agents/${agentId}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Erreur lors de l'action: ${action}`);
      
      // Update local state to remove the agent from the list
      setAgents(agents.filter(a => a.id !== agentId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Agents en attente</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Validez les collecteurs qui souhaitent rejoindre votre PME.</p>
        </div>
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Clock size={18} />
          {agents.length} en attente
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Chargement...</div>
      ) : agents.length === 0 ? (
        <div className="glass-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShieldCheck size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Tout est à jour !</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Il n'y a aucun agent en attente de validation pour le moment.</p>
        </div>
      ) : (
        <div className="glass-container" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>NOM COMPLET</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>TÉLÉPHONE</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>SPÉCIALISATION</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#fff' }}>
                    <div style={{ fontWeight: 600 }}>{agent.nom} {agent.prenom}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{agent.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#fff' }}>{agent.telephone}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.875rem' }}>
                      {agent.specialisation}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleAction(agent.id, 'valider')}
                      style={{ padding: '0.5rem', width: 'auto', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                      title="Valider l'agent"
                    >
                      <UserCheck size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(agent.id, 'rejeter')}
                      style={{ padding: '0.5rem', width: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      title="Rejeter l'agent"
                    >
                      <UserX size={20} />
                    </button>
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

export default GerantAgents;
