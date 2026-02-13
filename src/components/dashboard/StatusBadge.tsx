interface StatusBadgeProps {
  status: 'compliant' | 'violation' | 'under-review' | 'vacant' | 'pending' | 'resolved' | 'escalated' | 'under-investigation';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = {
    compliant: 'bg-green-100 text-green-800 border-green-200',
    violation: 'bg-red-100 text-red-800 border-red-200',
    'under-review': 'bg-amber-100 text-amber-800 border-amber-200',
    vacant: 'bg-slate-100 text-slate-600 border-slate-200',
    pending: 'bg-orange-100 text-orange-800 border-orange-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    escalated: 'bg-red-100 text-red-800 border-red-200',
    'under-investigation': 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const labels = {
    compliant: 'Compliant',
    violation: 'Violation',
    'under-review': 'Under Review',
    vacant: 'Vacant',
    pending: 'Pending',
    resolved: 'Resolved',
    escalated: 'Escalated',
    'under-investigation': 'Under Investigation',
  };

  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center font-medium border rounded-full ${styles[status]} ${sizeStyles}`}>
      {labels[status]}
    </span>
  );
}
