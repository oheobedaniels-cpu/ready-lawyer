import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Escrow from './pages/Escrow';
import Fundraising from './pages/Fundraising';
import Marketplace from './pages/Marketplace';
import Verification from './pages/Verification';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/escrow" element={<Escrow />} />
            <Route path="/fundraising" element={<Fundraising />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/verification" element={<Verification />} />
          </Routes>
        </Layout>
      </Router>
    </Web3Provider>
  );
}

export default App;
