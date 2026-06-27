export const Loader = ({ full = false, label = 'Loading...' }) => {
  if (full) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="spinner"></div>
        <p className="text-sm text-charcoal-400">{label}</p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-10 gap-3">
      <div className="spinner"></div>
      <p className="text-sm text-charcoal-400">{label}</p>
    </div>
  );
};

export const Alert = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    info: 'bg-gold-50 border-gold-300 text-charcoal-800',
  };

  return (
    <div className={`border rounded-md px-4 py-3 text-sm flex items-start justify-between gap-3 ${styles[type]}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="font-bold opacity-60 hover:opacity-100 leading-none">
          &times;
        </button>
      )}
    </div>
  );
};
