import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Factory, AlertTriangle, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('adminUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = typeof user?.role === 'string' ? user.role : user?.role?.nom;

  if (!user || (role !== 'ADMIN' && role !== 'GERANT_PME')) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="logo" style={{ fontSize: '1.25rem' }}>♻️ GN Déchet</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--accent)', fontWeight: '600' }}>
            {role === 'ADMIN' ? 'Administrateur État' : 'Gérant PME'}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink 
            to="/dashboard"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}
          >
            <LayoutDashboard size={20} />
            Vue d'ensemble
          </NavLink>

          {role === 'GERANT_PME' && (
            <>
              <NavLink 
                to="/dashboard/agents"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}
              >
                <UserPlus size={20} />
                Agents en attente
              </NavLink>
              <NavLink 
                to="/dashboard/abonnes"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}
              >
                <Users size={20} />
                Mes abonnés (Ménages)
              </NavLink>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <NavLink 
                to="/dashboard/pmes"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}
              >
                <Factory size={20} />
                Coopératives / PME
              </NavLink>
              <NavLink 
                to="/dashboard/reclamations"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}
              >
                <AlertTriangle size={20} />
                Réclamations
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Connecté en tant que:<br/>
            <strong style={{ color: '#fff' }}>{user.nom} {user.prenom}</strong>
          </div>
          <button onClick={handleLogout} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <header style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Portail B2B</h2>
        </header>
        <div style={{ padding: '2.5rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>
      
      {/* Add inline styles for the active state to index.css later or just use style prop */}
      <style>{`
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .sidebar-link.active {
          background-color: rgba(16, 185, 129, 0.15);
          color: var(--accent) !important;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
