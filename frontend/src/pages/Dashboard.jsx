import { useAuth } from '../hooks/useAuth.js';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {user?.name}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat title="Role" value={user?.role} />
        <Stat title="Email" value={user?.email} />
        <Stat title="Status" value="Authenticated" />
        <Stat title="Module" value="Syndic" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="font-medium">Next steps</div>
        <ul className="list-disc ml-5 text-slate-600 text-sm mt-2 space-y-1">
          <li>Create buildings (admin role).</li>
          <li>Add apartments and assign owners.</li>
          <li>Track payments and maintenance tickets.</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-semibold mt-1">{value ?? '-'}</div>
    </div>
  );
}
