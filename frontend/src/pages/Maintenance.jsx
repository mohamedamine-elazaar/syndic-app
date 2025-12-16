import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function MaintenancePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/maintenance');
        if (!cancelled) setItems(data.items ?? []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load maintenance');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Maintenance</h1>
        <p className="text-slate-600">Maintenance tickets.</p>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            No maintenance tickets.
          </div>
        ) : (
          items.map((i) => (
            <div key={i._id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{i.title}</div>
                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">
                  {i.status}
                </span>
              </div>
              <div className="text-sm text-slate-600 mt-1">{i.building?.name ?? '-'}</div>
              {i.description ? <div className="text-sm mt-2">{i.description}</div> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
