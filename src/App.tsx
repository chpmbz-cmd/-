import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Lectures from './pages/Lectures';
import Resources from './pages/Resources';
import Notices from './pages/Notices';
import QA from './pages/QA';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lectures" element={<Lectures />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
