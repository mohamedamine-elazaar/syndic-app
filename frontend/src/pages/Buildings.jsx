import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function BuildingsPage() {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/buildings');
        if (!cancelled) setBuildings(data.buildings ?? []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load buildings');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/buildings', { name, address });
      setBuildings((prev) => [...prev, data.building]);
      setName('');
      setAddress('');
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Failed to create building');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Buildings</h1>
        <p className="text-slate-600">List of managed buildings.</p>
      </div>

      {user?.role === 'admin' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-medium mb-3">Add Building</h2>
          <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-48"
                placeholder="Building Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-64"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      ) : null}

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {buildings.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={2}>
                  No buildings yet.
                </td>
              </tr>
            ) : (
              buildings.map((b) => (
                <tr key={b._id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3 text-slate-600">{b.address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        Creating/editing buildings is enabled on the API for the <span className="font-medium">admin</span>{' '}
        role.
      </div>
    </div>
  );
}
