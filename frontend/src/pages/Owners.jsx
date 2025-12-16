import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function OwnersPage() {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/auth/users');
        if (!cancelled) setOwners(data.users ?? []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load owners');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="p-4 text-slate-600">
        Only admins can view the owners list.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Owners</h1>
        <p className="text-slate-600">List of registered users.</p>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {owners.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={4}>
                  No owners found.
                </td>
              </tr>
            ) : (
              owners.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
