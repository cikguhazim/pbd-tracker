import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Dashboard from './pages/Dashboard';
import RecordPerformance from './pages/RecordPerformance';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-blue-600">PBD English Tracker</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <p className="mb-6 text-gray-600">Please sign in to access the system.</p>
          <button 
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 w-full"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/record" element={<RecordPerformance />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
