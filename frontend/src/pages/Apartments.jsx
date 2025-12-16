import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function ApartmentsPage() {
  const { user } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Form state
  const [buildingId, setBuildingId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [number, setNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [apartmentsRes, buildingsRes, usersRes] = await Promise.all([
          api.get('/apartments'),
          api.get('/buildings'),
          user?.role === 'admin' ? api.get('/auth/users') : Promise.resolve({ data: { users: [] } })
        ]);
        if (!cancelled) {
          setApartments(apartmentsRes.data.apartments ?? []);
          setBuildings(buildingsRes.data.buildings ?? []);
          setUsers(usersRes.data.users ?? []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load data');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!buildingId) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/apartments', {
        building: buildingId,
        number,
        floor: floor ? Number(floor) : undefined,
        owner: ownerId || undefined
      });
      setApartments((prev) => [...prev, data.apartment]);
      setNumber('');
      setFloor('');
      setOwnerId('');
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Failed to create apartment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Apartments</h1>
          <p className="text-slate-600">Apartments across all buildings.</p>
        </div>
      </div>

      {user?.role === 'admin' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-medium mb-3">Add Apartment</h2>
          <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Building</label>
              <select
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-48"
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Number</label>
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-32"
                placeholder="e.g. A-101"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Floor</label>
              <input
                type="number"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-24"
                placeholder="0"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Owner</label>
              <select
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-48"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                <option value="">No Owner</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
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
