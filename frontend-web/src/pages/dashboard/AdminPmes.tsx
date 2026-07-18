import React, { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle2, XCircle } from 'lucide-react';

const AdminPmes = () => {
  const [pmes, setPmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchPmes = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/pme`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des PME');
        const data = await res.json();
        setPmes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPmes();
  }, [token]);

  const filteredPmes = pmes.filter(pme => 
    pme.nomEntreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pme.zoneCouverture?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Coopératives PME</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Annuaire de toutes les entreprises de ramassage agréées.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Rechercher une PME..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(15,23,42,0.6)', color: '#fff' }}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Chargement...</div>
      ) : filteredPmes.length === 0 ? (
        <div className="glass-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Building2 size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Aucune PME trouvée</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Vérifiez vos termes de recherche.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredPmes.map(pme => (
            <div key={pme.id} className="glass-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>{pme.nomEntreprise}</h3>
                  <div style={{ color: 'var(--accent)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={14} /> Agrément Valide
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                  <Building2 size={24} color="#fff" />
                </div>
              </div>
              
              <div style={{ flex: 1, marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {pme.description || "Aucune description fournie par l'entreprise."}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Zone de couverture</div>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{pme.zoneCouverture}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Tarif mensuel</div>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{pme.tarifMensuel} GNF</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Contact</div>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{pme.telephone}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <button style={{ padding: '0.5rem 1rem', width: 'auto', backgroundColor: 'transparent', border: '1px solid var(--border)', color: '#fff', fontSize: '0.875rem' }}>
                  Détails
                </button>
                <button style={{ padding: '0.5rem 1rem', width: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <XCircle size={14} />
                  Suspendre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPmes;
