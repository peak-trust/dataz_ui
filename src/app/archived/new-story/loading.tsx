export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-black z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground-secondary">Loading your journey through time...</p>
      </div>
    </div>
  );
}

