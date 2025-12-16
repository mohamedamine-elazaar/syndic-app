import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/payments');
        if (!cancelled) setPayments(data.payments ?? []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Failed to load payments');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-slate-600">Payment records.</p>
      </div>

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
