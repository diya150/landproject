import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Bell,
  Shield,
  Settings,
  LogOut,
  Building2,
  MapPin
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Land Monitoring', href: '/land-monitoring', icon: MapPin },
  { name: 'Industries Registry', href: '/industries-registry', icon: Building2 },
  { name: 'Plot Monitoring', href: '/plots', icon: Map },
  { name: 'Violations', href: '/violations', icon: AlertTriangle },
  { name: 'Change Detection', href: '/change-detection', icon: FileText },
  { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-[#059669] text-white w-64 fixed left-0 top-0">
      {/* Logo & Title */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-[#FF9933] rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">CSIDC</h1>
            <p className="text-xs text-slate-300">Industrial Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#FF9933] text-white' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}