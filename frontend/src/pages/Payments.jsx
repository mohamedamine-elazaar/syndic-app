import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState('');

  // Form state
  const [apartmentId, setApartmentId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [paymentsRes, apartmentsRes] = await Promise.all([
          api.get('/payments'),
          api.get('/apartments')
        ]);
        if (!cancelled) {
          setPayments(paymentsRes.data.payments ?? []);
          setApartments(apartmentsRes.data.apartments ?? []);
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
    if (!apartmentId) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/payments', {
        apartment: apartmentId,
        amount: Number(amount),
        date: new Date(date).toISOString()
      });
      setPayments((prev) => [data.payment, ...prev]);
      setAmount('');
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Failed to create payment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-slate-600">Payment records.</p>
      </div>

      {user?.role === 'admin' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-medium mb-3">Record Payment</h2>
          <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Apartment</label>
              <select
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-48"
                value={apartmentId}
                onChange={(e) => setApartmentId(e.target.value)}
                required
              >
                <option value="">Select Apartment...</option>
                {apartments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.number} ({a.building?.name ?? 'Unknown'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-32"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                className="border border-slate-300 rounded-md px-3 py-2 text-sm w-36"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      ) : null}

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Apartment</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={3}>
                  No payments yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="p-3">
                    {p.apartment?.number ?? '-'} ({p.apartment?.building?.name ?? '-'})
                  </td>
                  <td className="p-3 font-medium">
                    {p.amount} {p.currency}
                  </td>
                  <td className="p-3 text-slate-600">{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
