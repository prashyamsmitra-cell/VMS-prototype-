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
    <div className="relative min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs - soft colors for light background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section - Full Screen */}
      <section className={`relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl w-full text-center">
          {/* VMS Logo with Red-Blue Stripe Accent */}
          <div className="mb-10 sm:mb-12 animate-fade-in-up">
            <div className="relative inline-block">
              <div className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                VMS
              </div>
              {/* Stripe accent under logo */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-full w-24" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight drop-shadow-lg animate-fade-in-up animation-delay-200">
            Visitor Management<br className="hidden sm:block" /> System
          </h1>

          {/* Project Description */}
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-400">
            Streamline your workplace visitor experience with our comprehensive management solution. Welcome guests efficiently, maintain security, and keep track of everyone on your premises.
          </p>

          {/* Service Description */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 sm:p-8 mb-12 animate-fade-in-up animation-delay-600 shadow-lg relative overflow-hidden">
            {/* Stripe accent on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-purple-500 to-blue-500" />

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">What We Offer</h2>
            <p className="text-slate-700 leading-relaxed mb-6 text-sm sm:text-base">
              A seamless way to handle guest check-ins, employee management, and location administration. Whether you're welcoming a single visitor or managing multiple office locations, VMS makes it simple and secure.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-red-500 text-2xl flex-shrink-0">🏢</span>
                <span className="font-semibold text-slate-900">Multi-Location Support</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-blue-500 text-2xl flex-shrink-0">📊</span>
                <span className="font-semibold text-slate-900">Real-Time Analytics</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-red-400 text-2xl flex-shrink-0">🔒</span>
                <span className="font-semibold text-slate-900">Secure & Compliant</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-fade-in-up animation-delay-800">
            <p className="text-slate-600 mb-4 text-sm">Scroll down to get started</p>
            <div className="flex justify-center">
              <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section - Below Scroll */}
      <section className="relative z-10 bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Access
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Select how you'd like to use the Visitor Management System
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-20">
            {cardsData.map((card) => (
              <RoleCard
                key={card.id}
                card={card}
                isDisabled={false}
              />
            ))}
          </div>

          {/* Trust Section with Red-Blue Stripe Accent */}
          <div className="card-base card-hover p-8 sm:p-10 relative overflow-hidden mb-12 sm:mb-16">
            {/* Stripe accent on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 via-purple-500 to-blue-500" />

            <h3 className="text-slate-900 font-semibold mb-8 text-lg sm:text-xl">
              Why teams love VMS 💙
            </h3>
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-2xl flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-slate-900 text-base">Frictionless Check-in</p>
                  <p className="text-slate-600 text-sm mt-2">Guests in seconds, no paperwork hassles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-2xl flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-slate-900 text-base">Always On</p>
                  <p className="text-slate-600 text-sm mt-2">Works smoothly, every single day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-2xl flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-slate-900 text-base">Trusted & Safe</p>
                  <p className="text-slate-600 text-sm mt-2">Built by real people, not hype</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="text-center border-t border-gray-200 pt-12 sm:pt-14">
            <p className="text-slate-700 mb-3 text-sm sm:text-base">
              Questions? <a href="#" className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-250">Reach out to us</a> — we're here to help
            </p>
            <p className="text-xs text-slate-500">Made with care for teams of all sizes</p>
          </div>
        </div>
      </section>
    </div>
  );
}

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
      border: 'hover:border-red-300',
      icon: 'text-red-600',
      accent: 'from-red-500 to-red-600',
    },
    blue: {
      border: 'hover:border-blue-300',
      icon: 'text-blue-600',
      accent: 'from-blue-500 to-blue-600',
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
      className={`group relative w-full text-left card-base card-hover p-8 sm:p-10 cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${colors.border}`}
    >
      {/* Top Accent Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent} opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`text-6xl sm:text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left`}>
          {card.icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors duration-250">
          {card.title}
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-6 leading-relaxed text-base sm:text-lg">
          {card.description}
        </p>

        {/* Features List */}
        <div className="text-sm text-slate-600 space-y-3 mb-8">
          {card.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 group-hover:translate-x-2 transition-transform duration-250"
            >
              <span className={`font-semibold flex-shrink-0 ${colors.icon}`}>→</span>
              <p className="font-medium">{feature}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.accent} text-white rounded-lg font-semibold transition-all duration-250 hover:shadow-lg hover:scale-105 active:scale-95`}
        >
          {card.cta}
          <span className="text-lg">→</span>
        </button>
      </div>
    </button>
  );
};
