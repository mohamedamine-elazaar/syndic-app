import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/apartments');
        if (!cancelled) setApartments(data.apartments ?? []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load apartments');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Apartments</h1>
        <p className="text-slate-600">Apartments across all buildings.</p>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Building</th>
              <th className="text-left p-3">Number</th>
              <th className="text-left p-3">Owner</th>
            </tr>
          </thead>
          <tbody>
            {apartments.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={3}>
                  No apartments yet.
                </td>
              </tr>
            ) : (
              apartments.map((a) => (
                <tr key={a._id} className="border-t border-slate-100">
                  <td className="p-3">{a.building?.name ?? '-'}</td>
                  <td className="p-3 font-medium">{a.number}</td>
                  <td className="p-3 text-slate-600">{a.owner?.email ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
