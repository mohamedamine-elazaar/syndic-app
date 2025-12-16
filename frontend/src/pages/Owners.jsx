export default function OwnersPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Owners</h1>
      <p className="text-slate-600">
        Owners management UI can be added next (API provides users via auth, and apartment owner assignment).
      </p>
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
        Suggested next step: create an admin-only endpoint to list owners, then add a table + filters here.
      </div>
    </div>
  );
}
