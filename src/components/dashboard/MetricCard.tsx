import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  suffix?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend, 
  suffix = '',
  variant = 'default' 
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-slate-50 border-slate-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
  };

  const iconStyles = {
    default: 'text-slate-700 bg-slate-100',
    success: 'text-green-700 bg-green-100',
    warning: 'text-amber-700 bg-amber-100',
    danger: 'text-red-700 bg-red-100',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';

  return (
    <Card className={`${variantStyles[variant]} border`}>
      <CardContent className="p-6">
        <div className="relative">
          {/* Icon - Top Right */}
          <div className={`absolute -top-2 -right-2 p-2 rounded-lg ${iconStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          
          {/* Content */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">
                {value}
              </p>
              {suffix && (
                <span className="text-lg font-medium text-slate-600">
                  {suffix}
                </span>
              )}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                <span className={`text-sm font-medium ${trendColor}`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-slate-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}