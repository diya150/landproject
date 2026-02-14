import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 z-50 border-b border-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* CSIDC Logo */}
            <img
              src="/csidc-logo.svg"
              alt="CSIDC"
              className="h-16 w-16 object-contain"
            />

            {/* Text */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">
                Industrial Land Monitoring
              </span>
              <span className="text-xs text-blue-100">
                Powered by Blockchain
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-blue-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-white hover:text-blue-200 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-blue-200 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-blue-200 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button onClick={() => scrollToSection('contact')}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700 bg-blue-600">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="text-white hover:text-blue-200 transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-white hover:text-blue-200 transition-colors text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-blue-200 transition-colors text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-blue-200 transition-colors text-left"
              >
                Contact
              </button>
              <Button
                onClick={() => scrollToSection('contact')}
                className="w-full"
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}