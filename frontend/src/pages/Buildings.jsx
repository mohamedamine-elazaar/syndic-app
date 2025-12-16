import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Buildings</h1>
        <p className="text-slate-600">List of managed buildings.</p>
      </div>

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
