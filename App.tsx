
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Mining from './pages/Mining';
import Tasks from './pages/Tasks';
import Referrals from './pages/Referrals';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Mining />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
