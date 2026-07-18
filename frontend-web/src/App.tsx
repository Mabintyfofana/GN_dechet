import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPme from './pages/RegisterPme';
import Login from './pages/Login';
import Home from './pages/Home';
import DashboardLayout from './components/DashboardLayout';
import GerantOverview from './pages/dashboard/GerantOverview';
import GerantAgents from './pages/dashboard/GerantAgents';
import GerantAbonnes from './pages/dashboard/GerantAbonnes';
import AdminOverview from './pages/dashboard/AdminOverview';
import AdminPmes from './pages/dashboard/AdminPmes';

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="logo">♻️ GN Déchet <span style={{color: 'var(--accent)', fontSize: '1rem', marginLeft: '0.5rem'}}>Portail B2B</span></div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/register-pme" element={
          <main className="main-content">
            <div className="glass-container registration-card">
              <h1>Devenez Partenaire</h1>
              <p className="subtitle">Enregistrez votre PME de ramassage d'ordures et gérez vos abonnés.</p>
              <RegisterPme />
            </div>
          </main>
        } />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={
            (() => {
              const userStr = localStorage.getItem('adminUser');
              if (!userStr) return <GerantOverview />;
              const user = JSON.parse(userStr);
              const role = typeof user.role === 'string' ? user.role : user.role?.nom;
              return role === 'ADMIN' ? <AdminOverview /> : <GerantOverview />;
            })()
          } />
          
          {/* Routes Gérant */}
          <Route path="agents" element={<GerantAgents />} />
          <Route path="abonnes" element={<GerantAbonnes />} />
          
          {/* Routes Admin */}
          <Route path="pmes" element={<AdminPmes />} />
          <Route path="reclamations" element={<div style={{color: '#fff', fontSize: '1.5rem', padding: '2rem'}}>Page Réclamations (En construction)</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
