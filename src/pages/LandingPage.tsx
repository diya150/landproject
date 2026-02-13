import { Link } from 'react-router';
import { 
  Shield, 
  Satellite, 
  AlertTriangle, 
  BarChart3, 
  Globe, 
  CheckCircle, 
  TrendingDown, 
  Clock, 
  Target,
  Lock,
  Database,
  ArrowRight,
  Image as ImageIcon,
  ExternalLink,
  Headphones
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import heroBackground from 'figma:asset/2e2829f5cc2b66c14a45b719ec03af68c66a6375.png';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600/90 backdrop-blur border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Placeholder - Replace with your logo */}
            <div className="h-10 w-10 bg-gradient-to-br from-[#059669] to-[#047857] rounded-lg flex items-center justify-center relative group">
              <ImageIcon className="h-5 w-5 text-white" />
              <div className="absolute -bottom-8 left-0 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Add logo here
              </div>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight text-white">CSIDC</h1>
              <p className="text-xs text-slate-200">Industrial Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#capabilities" className="text-sm font-medium text-white hover:text-blue-200">
              Capabilities
            </a>
            <a href="#benefits" className="text-sm font-medium text-white hover:text-blue-200">
              Benefits
            </a>
            <a href="#security" className="text-sm font-medium text-white hover:text-blue-200">
              Security
            </a>
            <Link to="/dashboard">
              <Button className="bg-[#059669] hover:bg-[#059669]/90">
                Access System
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-[#059669] to-[#047857]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroBackground}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            {/* Government Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9933]/20 border border-[#FF9933]/30 rounded-full mb-8">
              <Shield className="h-4 w-4 text-[#FF9933]" />
              <span className="text-sm font-medium text-white">
                Government of India | Industrial Development Authority
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Intelligent Monitoring & Compliance for Industrial Land Management
            </h1>

            {/* Subheading */}
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl">
              Leverage Satellite Imagery, GIS Intelligence, and AI Analytics to Detect Encroachments, 
              Violations, and Land-Use Deviations in Near Real-Time.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white h-12 px-8">
                  <Lock className="h-5 w-5 mr-2" />
                  Access System
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Capabilities
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white mb-1">247+</p>
                <p className="text-sm text-slate-400">Plots Monitored</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">92.4%</p>
                <p className="text-sm text-slate-400">Compliance Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">24/7</p>
                <p className="text-sm text-slate-400">Automated Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#059669]/5 border border-[#059669]/10 rounded-full mb-4">
              <span className="text-sm font-semibold text-[#059669] uppercase tracking-wide">
                Value Proposition
              </span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Operational Efficiency & Governance
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transform land administration with data-driven intelligence and automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Reduce Costly Drone Surveys
                </h3>
                <p className="text-slate-600">
                  Eliminate expensive manual aerial surveys with automated satellite monitoring, 
                  reducing operational costs by up to 70% while increasing coverage.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Enable Near Real-Time Monitoring
                </h3>
                <p className="text-slate-600">
                  Continuous 24/7 surveillance with automated change detection alerts, 
                  enabling rapid response to violations and unauthorized activities.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Minimize Manual Inspections
                </h3>
                <p className="text-slate-600">
                  AI-driven risk prioritization focuses field inspection resources on 
                  high-confidence violations, optimizing administrative capacity.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-[#FF9933]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Improve Compliance & Revenue Efficiency
                </h3>
                <p className="text-slate-600">
                  Enhance compliance rates through systematic monitoring and reduce revenue 
                  leakage from unauthorized land use and encroachments.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Data-Driven Administrative Decisions
                </h3>
                <p className="text-slate-600">
                  Executive dashboards and analytical reports provide actionable insights 
                  for policy formulation and resource allocation.
                </p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Transparent Governance & Accountability
                </h3>
                <p className="text-slate-600">
                  Comprehensive audit trails and documented evidence support transparent 
                  enforcement actions and administrative accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority / Trust Section */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#059669] to-[#047857] rounded-2xl p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6">
                  <Shield className="h-4 w-4 text-[#FF9933]" />
                  <span className="text-sm font-semibold text-white uppercase tracking-wide">
                    Enterprise Security
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Secure & Reliable Monitoring Infrastructure
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Designed for administrative and regulatory use with government-grade 
                  security protocols and high-accuracy GIS intelligence.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Government-Grade Security</p>
                      <p className="text-sm text-slate-400">
                        End-to-end encryption, role-based access control, and compliance 
                        with national data protection standards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">High-Accuracy Satellite Intelligence</p>
                      <p className="text-sm text-slate-400">
                        Sub-meter resolution imagery from multiple satellite sources with 
                        AI-validated change detection algorithms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Regulatory Compliance Framework</p>
                      <p className="text-sm text-slate-400">
                        Built for administrative enforcement with complete audit trails 
                        and evidential documentation standards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">24/7 System Reliability</p>
                      <p className="text-sm text-slate-400">
                        99.9% uptime with redundant infrastructure and continuous 
                        monitoring capabilities
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <Lock className="h-8 w-8 text-[#FF9933] mx-auto mb-3" />
                    <p className="text-2xl font-bold text-white mb-1">256-bit</p>
                    <p className="text-sm text-slate-400">AES Encryption</p>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <Database className="h-8 w-8 text-green-400 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-white mb-1">99.9%</p>
                    <p className="text-sm text-slate-400">Uptime SLA</p>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <Satellite className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-white mb-1">&lt;1m</p>
                    <p className="text-sm text-slate-400">Image Resolution</p>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-white mb-1">ISO</p>
                    <p className="text-sm text-slate-400">Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-[#059669] to-[#047857] text-slate-300 py-12 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Head Office */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-base">Head Office</h4>
              <p className="text-sm leading-relaxed text-slate-200">
                Udyog Bhawan, No -1, Telibandha, Raipur,<br />
                492008 Chhattisgarh, India
              </p>
            </div>

            {/* Important Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-base">Important Links</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-[#FF9933]" />
                  <a href="https://cgstate.gov.in/" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white transition-colors">
                    Government of Chhattisgarh
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-[#FF9933]" />
                  <a href="https://industry.cg.gov.in/" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white transition-colors">
                    Chhattisgarh Department of Commerce and Industries
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-[#FF9933]" />
                  <a href="#" className="text-slate-200 hover:text-white transition-colors">
                    Electronics Manufacturing Cluster
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-[#FF9933]" />
                  <a href="https://www.chhattisgarhtourism.in/" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white transition-colors">
                    Chhattisgarh Tourism
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-[#FF9933]" />
                  <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white transition-colors">
                    Government of India
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-[#FF9933]" />
                  <a href="#" className="text-slate-200 hover:text-white transition-colors">
                    Chhattisgarh Infotech Promotion Society
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-base">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="h-3 w-3 text-[#FF9933]" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="1.5" />
                  </svg>
                  <a href="#" className="text-slate-200 hover:text-white transition-colors">Sitemap</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-3 w-3 text-[#FF9933]" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="1.5" />
                  </svg>
                  <a href="#" className="text-slate-200 hover:text-white transition-colors">Disclaimer and Policies</a>
                </li>
              </ul>
            </div>

            {/* Total Visitor */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-base">Total Visitor</h4>
              <div className="flex gap-1 mb-6">
                {['0', '1', '1', '2', '8', '5', '5'].map((digit, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-2 py-1 rounded text-lg min-w-[32px] text-center">
                    {digit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Headphones className="h-5 w-5 text-[#FF9933]" />
              <div>
                <p className="text-sm font-medium text-white">Toll Free: 1800-233-3443</p>
                <p className="text-xs text-slate-300">Timing: 10:30 Am to 5 pm</p>
              </div>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="pt-6 border-t border-white/20 text-center space-y-2">
            <p className="text-sm text-slate-200">
              Copyright © - All Rights Reserved – Official Website of CSIDC
            </p>
            <p className="text-xs text-slate-300">
              Note: Content on this website is published and managed by CSIDC
            </p>
            <p className="text-xs text-slate-300">
              For any query regarding this website please contact{' '}
              <a href="mailto:csidc.org@gov.in" className="text-[#FF9933] hover:underline">
                csidc.org@gov.in
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}