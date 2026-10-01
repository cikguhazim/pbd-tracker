import { Link } from 'react-router-dom';
import { Edit3, BarChart2, Settings } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/record" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition-all group">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
            <Edit3 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Record Performance</h2>
          <p className="text-gray-500">Assess and input students' Performance Level (PL) for various learning standards.</p>
        </Link>

        <Link to="/analysis" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:green-400 transition-all group">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors text-green-600">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis</h2>
          <p className="text-gray-500">View automated calculations and average PLs for Reading, Writing, Listening, and Speaking.</p>
        </Link>

        <Link to="/settings" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-400 transition-all group">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
            <Settings className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-500">Manage students, classes, and learning standards. Import data via Excel templates.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
