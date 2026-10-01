import { Link, useLocation } from 'react-router-dom';
import { signOut, auth } from '../firebase';
import { Home, Edit3, BarChart2, Settings as SettingsIcon, LogOut } from 'lucide-react';

const Layout = ({ children, user }) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Record PL', path: '/record', icon: <Edit3 className="w-5 h-5 mr-2" /> },
    { name: 'Analysis', path: '/analysis', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl tracking-wider">PBD Tracker</span>
              <div className="hidden md:flex ml-10 space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center text-sm font-medium mr-4">
                <img src={user.photoURL || 'https://via.placeholder.com/32'} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
                <span className="hidden md:block">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-blue-200 hover:text-white p-2 rounded-md hover:bg-blue-700"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
