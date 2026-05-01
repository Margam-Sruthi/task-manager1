import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  LogOut, 
  Menu, 
  X,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  ];

  if (user?.role === 'admin') {
    // navItems.push({ name: 'Team', icon: Users, path: '/team' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <CheckSquare className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">TaskFlow</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-link ${
                isActive(item.path) ? 'sidebar-link-active' : ''
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-slate-50/80 rounded-2xl border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl font-bold text-slate-900 md:block hidden capitalize">
            {location.pathname.substring(1) || 'Dashboard'}
          </h1>
          <div className="md:hidden block">
            <span className="font-bold text-primary-600">TaskFlow</span>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <span className="text-xl font-bold text-primary-600">TaskFlow</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-6 border-t border-slate-100">
               <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-medium"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
