import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVMS } from '../context/VMSContext';
import { useLoginHistory } from '../context/LoginHistoryContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

export default function VisitorOfficeSelect() {
  const navigate = useNavigate();
  const { locations } = useVMS();
  const { recordLogin } = useLoginHistory();
  const { showToast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Get unique countries
  const countries = useMemo(() => {
    const unique = [...new Set(locations.map((loc) => loc.country))].sort();
    return unique;
  }, [locations]);

  // Get cities for selected country
  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    const unique = [
      ...new Set(
        locations
          .filter((loc) => loc.country === selectedCountry)
          .map((loc) => loc.city),
      ),
    ].sort();
    return unique;
  }, [locations, selectedCountry]);

  // Get offices for selected country and city
  const filteredLocations = useMemo(() => {
    let filtered = locations;
    if (selectedCountry) {
      filtered = filtered.filter((loc) => loc.country === selectedCountry);
    }
    if (selectedCity) {
      filtered = filtered.filter((loc) => loc.city === selectedCity);
    }
    return filtered;
  }, [locations, selectedCountry, selectedCity]);

  const handleSelectLocation = useCallback(
    (location) => {
      recordLogin('visitor', 'Visitor', location.name);
      showToast(`Selected ${location.name}. Proceed to check-in.`, 'success');
      navigate(`/location/${location.id}`);
    },
    [navigate, recordLogin, showToast],
  );

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity(''); // Reset city when country changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Select Your Office
          </h1>
          <p className="text-lg text-slate-600">
            Choose your location to check in as a visitor
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-300 p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Find Your Office</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Country Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                🌍 Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              >
                <option value="">Select a country...</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                🏙️ City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

          {/* Filter Info */}
          {selectedCountry && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              📍 Found <span className="font-semibold">{filteredLocations.length}</span> office{filteredLocations.length !== 1 ? 's' : ''}
              {selectedCity && ` in ${selectedCity}`}
            </div>
          )}
        </div>

        {/* Location Cards */}
        {selectedCountry ? (
          <>
            {filteredLocations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="bg-white rounded-2xl border border-gray-300 shadow-md p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex flex-col h-full">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 flex-grow">
                        📍 {location.address}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>👥 Capacity: {location.capacity}</span>
                        <span>🏢 {location.city}</span>
                      </div>
                      <Button
                        onClick={() => handleSelectLocation(location)}
                        variant="primary"
                        className="w-full"
                      >
                        Check In Here
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-300 shadow-md">
                <p className="text-slate-500 text-lg mb-2">No offices available</p>
                <p className="text-slate-400 text-sm">Try selecting a different city or country</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-300 shadow-md">
            <p className="text-slate-500 text-lg mb-2">👉 Select a country to get started</p>
            <p className="text-slate-400 text-sm">Then choose your city to see available offices</p>
          </div>
        )}
      </div>
    </div>
  );
}
