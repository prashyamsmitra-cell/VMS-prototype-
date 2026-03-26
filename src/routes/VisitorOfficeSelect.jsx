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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Select Your Office
          </h1>
          <p className="text-lg text-slate-600">
            Choose your location to check in as a visitor
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-300 p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Find Your Office</h2>

          {loadError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Unable to load office locations. Check that `VITE_API_URL` points to your Railway backend and that the backend has seeded locations.
              <div className="mt-1 text-xs text-red-600">{loadError}</div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(event) => handleCountryChange(event.target.value)}
                disabled={isLoading || locations.length === 0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoading ? 'Loading countries...' : 'Select a country...'}
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
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

          {selectedCountry && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              Found <span className="font-semibold">{filteredLocations.length}</span> office{filteredLocations.length !== 1 ? 's' : ''}
              {selectedCity && ` in ${selectedCity}`}
            </div>
          )}
        </div>

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
                        {location.address}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>Capacity: {location.capacity}</span>
                        <span>{location.city}</span>
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
                <p className="text-slate-400 text-sm">Try selecting a different city or country.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-300 shadow-md">
            <p className="text-slate-500 text-lg mb-2">
              {isLoading ? 'Loading office locations...' : 'Select a country to get started'}
            </p>
            <p className="text-slate-400 text-sm">
              {locations.length === 0 && !isLoading
                ? 'No locations were returned by the backend yet.'
                : 'Then choose your city to see available offices'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
