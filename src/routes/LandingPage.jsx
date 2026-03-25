import { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

// Debounced navigation to prevent multiple rapid clicks
const useDebounceNavigation = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const debounceNavigation = useCallback((path) => {
    if (isNavigating) return; // Prevent multiple rapid navigations

    try {
      setIsNavigating(true);
      navigate(path);
      // Reset after 1.5s to allow retry if needed
      setTimeout(() => setIsNavigating(false), 1500);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  }, [navigate, isNavigating]);

  return debounceNavigation;
};

export default function LandingPage() {
  const debouncedNavigate = useDebounceNavigation();
  const { loginAsVisitor } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoized card data to prevent unnecessary re-renders
  const cardsData = useMemo(() => [
    {
      id: 'visitor',
      icon: '👤',
      title: 'Visitor',
      color: 'red',
      description: 'Check in as a visitor to any office location with ease',
      features: [
        'Select your office',
        'Fill in visitor form',
        'Get instant confirmation'
      ],
      cta: 'Get Started',
      ariaLabel: 'Start visitor check-in process',
      onClick: () => debouncedNavigate('/visitor-office-select')
    },
    {
      id: 'admin',
      icon: '🔐',
      title: 'Admin',
      color: 'blue',
      description: 'Login to manage locations, employees, and analytics',
      features: [
        'Manage offices',
        'Manage employees',
        'View visitor metrics'
      ],
      cta: 'Sign In',
      ariaLabel: 'Sign in to admin dashboard',
      onClick: () => debouncedNavigate('/admin-login')
    }
  ], [debouncedNavigate]);

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs - soft colors for light background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl w-full">
          {/* Hero Header */}
          <div className="text-center mb-16 sm:mb-20">
            {/* VMS Logo with Red-Blue Stripe Accent */}
            <div className="inline-block mb-6 animate-fade-in-up">
              <div className="relative">
                <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                  VMS
                </div>
                {/* Stripe accent under logo */}
                <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full" />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight drop-shadow-lg animate-fade-in-up animation-delay-200">
              Keep Your Visitors Welcome
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-up animation-delay-400">
              A simple, friendly way to welcome and manage visitors at your location. Real-time check-ins, no hassle.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12 animate-fade-in-up animation-delay-600">
            {cardsData.map((card) => (
              <RoleCard 
                key={card.id}
                card={card}
                isDisabled={false}
              />
            ))}
          </div>

          {/* Trust Section with Red-Blue Stripe Accent */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 animate-fade-in-up animation-delay-800 relative overflow-hidden shadow-md">
            {/* Stripe accent on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-purple-500 to-blue-500" />
            
            <h3 className="text-slate-900 font-semibold mb-6 text-lg">
              Why teams love VMS 💙
            </h3>
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-slate-900">Frictionless Check-in</p>
                  <p className="text-slate-600 text-sm mt-1">Guests in seconds, no paperwork</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-slate-900">Always On</p>
                  <p className="text-slate-600 text-sm mt-1">Works smoothly, every single day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-slate-900">Trusted & Safe</p>
                  <p className="text-slate-600 text-sm mt-1">Built by real people, not hype</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="text-center border-t border-gray-300 pt-8 animate-fade-in-up animation-delay-1000">
            <p className="text-slate-700 mb-3">
              Questions? <a href="#" className="text-red-600 hover:text-red-700 font-semibold transition-colors">Reach out to us</a> — we're here to help
            </p>
            <p className="text-xs text-slate-500">Made with care for real teams</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized Role Card Component
 * Prevents unnecessary re-renders and handles click errors gracefully
 */
const RoleCard = ({ card, isDisabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback(() => {
    if (isDisabled) return;
    try {
      card.onClick?.();
    } catch (error) {
      console.error('Card click error:', error);
    }
  }, [card, isDisabled]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  // Color mapping
  const colorMap = {
    red: {
      border: 'hover:border-red-400',
      gradient: 'from-red-100/40 to-transparent',
      badge: 'bg-red-100 text-red-700 border-red-300',
      icon: 'text-red-600',
      cta: 'bg-red-600 hover:bg-red-700 text-white',
    },
    blue: {
      border: 'hover:border-blue-400',
      gradient: 'from-blue-100/40 to-transparent',
      badge: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: 'text-blue-600',
      cta: 'bg-blue-600 hover:bg-blue-700 text-white',
    }
  };

  const colors = colorMap[card.color] || colorMap.red;

  return (
    <button
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      aria-label={card.ariaLabel}
      className={`group relative w-full text-left bg-white border border-gray-300 ${colors.border} rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 sm:p-10 cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* Top Stripe Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Gradient Overlay on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`text-6xl sm:text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300 ${colors.icon}`}>
          {card.icon}
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
          {card.title}
        </h2>

        {/* Description */}
        <p className="text-slate-700 mb-6 leading-relaxed text-base sm:text-lg">
          {card.description}
        </p>

        {/* Features List */}
        <div className="text-sm text-slate-600 space-y-3 mb-8">
          {card.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 group-hover:translate-x-2 transition-transform duration-200"
            >
              <span className={`font-semibold flex-shrink-0 ${colors.icon}`}>→</span>
              <p>{feature}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`inline-block px-6 py-3 ${colors.cta} rounded-lg font-semibold transition-all duration-200 border border-transparent hover:shadow-md`}
        >
          {card.cta} <span className="ml-2">→</span>
        </button>
      </div>
    </button>
  );
};
