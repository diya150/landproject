interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info' | 'warning';
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const styles = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-slate-100 text-slate-800 border-slate-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    info: 'Info',
    warning: 'Warning',
  };

  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-semibold border rounded ${styles[severity]} ${sizeStyles}`}>
      {labels[severity]}
    </span>
  );
}
