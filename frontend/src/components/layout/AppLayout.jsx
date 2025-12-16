import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/buildings', label: 'Buildings' },
  { to: '/apartments', label: 'Apartments' },
  { to: '/owners', label: 'Owners' },
  { to: '/payments', label: 'Payments' },
  { to: '/maintenance', label: 'Maintenance' }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200">
          <div className="h-16 flex items-center px-4 border-b border-slate-200 font-semibold">
            Syndic
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200 text-xs text-slate-600">
            Logged in as <span className="font-medium">{user?.email}</span>
          </div>
        </aside>

        <div className="flex-1 md:pl-64">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
            <div className="font-semibold">Syndic Management</div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 hidden sm:inline">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
