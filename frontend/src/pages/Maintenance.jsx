import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function MaintenancePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState('');

  // Form state
  const [buildingId, setBuildingId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [maintRes, buildRes] = await Promise.all([
          api.get('/maintenance'),
          api.get('/buildings')
        ]);
        if (!cancelled) {
          setItems(maintRes.data.items ?? []);
          setBuildings(buildRes.data.buildings ?? []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load data');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!buildingId) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/maintenance', {
        building: buildingId,
        title,
        description,
        status: 'open'
      });
      setItems((prev) => [data.item, ...prev]);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Maintenance</h1>
        <p className="text-slate-600">Maintenance tickets.</p>
      </div>

      {user?.role === 'admin' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-medium mb-3">Report Issue</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Building</label>
                <select
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  required
                >
                  <option value="">Select Building...</option>
                  {buildings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Issue title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                rows={2}
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      ) : null}

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
