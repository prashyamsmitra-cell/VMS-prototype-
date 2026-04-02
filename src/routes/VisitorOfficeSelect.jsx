import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVMS } from '../context/VMSContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

export default function VisitorOfficeSelect() {
  const navigate = useNavigate();
  const { locations, isLoading, loadError } = useVMS();
  const { showToast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const countries = useMemo(
    () => [...new Set(locations.map((location) => location.country).filter(Boolean))].sort(),
    [locations],
  );

  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    return [
      ...new Set(
        locations
          .filter((location) => location.country === selectedCountry)
          .map((location) => location.city),
      ),
    ].sort();
  }, [locations, selectedCountry]);

  const filteredLocations = useMemo(() => {
    let filtered = locations;
    if (selectedCountry) {
      filtered = filtered.filter((location) => location.country === selectedCountry);
    }
    if (selectedCity) {
      filtered = filtered.filter((location) => location.city === selectedCity);
    }
    return filtered;
  }, [locations, selectedCountry, selectedCity]);

  const handleSelectLocation = useCallback((location) => {
    showToast(`Selected ${location.name}. Proceed to check-in.`, 'success');
    navigate(`/location/${location.id}`);
  }, [navigate, showToast]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity('');
  };

  const handleResetSelection = useCallback(() => {
    setSelectedCountry('');
    setSelectedCity('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Navigation Buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
          {selectedCountry && (
            <Button type="button" variant="outline" onClick={handleResetSelection}>
              Reset Selection
            </Button>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            Select Your Office
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Choose your location to check in as a visitor
          </p>
        </div>

        {/* Search & Filter Card */}
        <div className="card-base card-hover p-6 sm:p-8 mb-10 relative overflow-hidden">
          {/* Accent Strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600" />

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>🔍</span>
            Find Your Office
          </h2>

          {loadError && (
            <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-bold mb-1">Unable to load office locations</p>
              <p className="text-xs">Check that <code className="bg-red-100 px-1 rounded">VITE_API_URL</code> environment variable is set correctly.</p>
              {loadError && <p className="text-xs mt-1 opacity-75">{loadError}</p>}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(event) => handleCountryChange(event.target.value)}
                disabled={isLoading || locations.length === 0}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-gray-300 font-medium"
              >
                <option value="">
                  {isLoading ? '⏳ Loading countries...' : 'Select a country...'}
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                disabled={!selectedCountry}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-250 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-gray-300 font-medium"
              >
                <option value="">Select a city...</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCountry && (
            <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span>
                  Found <span className="font-bold">{filteredLocations.length}</span> office{filteredLocations.length !== 1 ? 's' : ''}
                  {selectedCity && ` in ${selectedCity}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCity && (
                  <Button type="button" variant="secondary_ghost" size="sm" onClick={() => setSelectedCity('')}>
                    Clear City
                  </Button>
                )}
                <Button type="button" variant="secondary_ghost" size="sm" onClick={handleResetSelection}>
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Locations Grid */}
        {selectedCountry ? (
          <>
            {filteredLocations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelectLocation(location)}
                    className="card-base card-hover group p-6 sm:p-8 text-left cursor-pointer relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col h-full relative z-10">
                      {/* Icon & Capacity */}
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-3xl">📍</span>
                        <span className="text-xs font-bold text-slate-600 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-red-100 group-hover:text-red-700 transition-all duration-250">
                          {location.capacity} people
                        </span>
                      </div>

                      {/* Location Name */}
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors duration-250">
                        {location.name}
                      </h3>

                      {/* Address */}
                      <p className="text-sm text-slate-600 mb-4 flex-grow leading-relaxed">
                        {location.address}
                      </p>

                      {/* City Info */}
                      <div className="text-xs text-slate-500 mb-6 font-medium">
                        📍 {location.city}
                      </div>

                      {/* CTA Button */}
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        Check In Here →
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-card">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-700 text-lg font-semibold mb-2">No offices available</p>
                <p className="text-slate-600 text-sm">Try selecting a different city or country.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="text-5xl mb-4">
              {isLoading ? '⏳' : '📍'}
            </div>
            <p className="text-slate-700 text-lg font-semibold mb-2">
              {isLoading ? 'Loading office locations...' : 'Select a country to get started'}
            </p>
            <p className="text-slate-600 text-sm">
              {locations.length === 0 && !isLoading
                ? 'No locations found. Please try again later.'
                : 'Then choose your city to see available offices'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
