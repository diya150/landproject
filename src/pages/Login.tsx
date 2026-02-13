import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Lock, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

export function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#059669] to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1574169208383-fb087432973a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBtYXAlMjBlYXJ0aCUyMHZpZXd8ZW58MXx8fHwxNzcwODk3NjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 shadow-2xl border-slate-700 bg-white/95 backdrop-blur relative z-10">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-[#FF9933] rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-9 w-9 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              CSIDC Portal
            </h1>
            <p className="text-slate-600 font-medium">
              Automated Industrial Land Monitoring
            </p>
            <p className="text-sm text-slate-500 mt-1">
              & Compliance System
            </p>
          </div>

          {/* Government Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-amber-900 text-center font-medium">
              🔒 Authorized Government Personnel Only
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="officer@csidc.gov.in"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-[#FF9933] hover:underline font-medium">
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold"
            >
              Secure Login
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              Protected by Government of India cyber security protocols
            </p>
            <p className="text-xs text-center text-slate-400 mt-1">
              © 2026 CSIDC. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}