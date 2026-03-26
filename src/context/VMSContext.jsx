import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { employeesApi, locationsApi } from '../services/api';

const VMSContext = createContext();

function normalizeLocation(location) {
  return {
    ...location,
    capacity: Number(location.capacity) || 0,
    qrCode: location.qrCode || location.qr_data || '',
  };
}

function normalizeEmployee(employee) {
  return {
    ...employee,
    emailId: employee.emailId || employee.email_id || '',
    mobileNumber: employee.mobileNumber || employee.mobile_number || '',
    locationId: employee.locationId || employee.location_id || '',
  };
}

export function VMSProvider({ children }) {
  const { isLoggedIn, user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);

      try {
        const nextLocations = await locationsApi.getAll();
        if (!isMounted) return;
        setLocations(nextLocations.map(normalizeLocation));

        if (isLoggedIn && user?.type === 'admin') {
          const nextEmployees = await employeesApi.getAll();
          if (!isMounted) return;
          setEmployees(nextEmployees.map(normalizeEmployee));
        } else if (isMounted) {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error loading VMS data:', error);
        if (!isMounted) return;
        setLocations([]);
        setEmployees([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user?.type]);

  const addLocation = useCallback(async (location) => {
    const createdLocation = await locationsApi.create(location);
    const normalizedLocation = normalizeLocation(createdLocation);
    setLocations((prev) => [normalizedLocation, ...prev]);
    return normalizedLocation;
  }, []);

  const updateLocation = useCallback(async (id, updates) => {
    const updatedLocation = await locationsApi.update(id, updates);
    const normalizedLocation = normalizeLocation(updatedLocation);
    setLocations((prev) => prev.map((location) => (
      location.id === id ? normalizedLocation : location
    )));
    return normalizedLocation;
  }, []);

  const deleteLocation = useCallback(async (id) => {
    await locationsApi.delete(id);
    setLocations((prev) => prev.filter((location) => location.id !== id));
  }, []);

  const addEmployee = useCallback(async (employee) => {
    const createdEmployee = await employeesApi.create(employee);
    const normalizedEmployee = normalizeEmployee(createdEmployee);
    setEmployees((prev) => [normalizedEmployee, ...prev]);
    return normalizedEmployee;
  }, []);

  const updateEmployee = useCallback(async (id, updates) => {
    const updatedEmployee = await employeesApi.update(id, updates);
    const normalizedEmployee = normalizeEmployee(updatedEmployee);
    setEmployees((prev) => prev.map((employee) => (
      employee.id === id ? normalizedEmployee : employee
    )));
    return normalizedEmployee;
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    await employeesApi.delete(id);
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      locations,
      employees,
      isLoading,
      setLocations,
      setEmployees,
      addLocation,
      updateLocation,
      deleteLocation,
      addEmployee,
      updateEmployee,
      deleteEmployee,
    }),
    [
      locations,
      employees,
      isLoading,
      addLocation,
      updateLocation,
      deleteLocation,
      addEmployee,
      updateEmployee,
      deleteEmployee,
    ],
  );

  return <VMSContext.Provider value={value}>{children}</VMSContext.Provider>;
}

export function useVMS() {
  const context = useContext(VMSContext);
  if (!context) {
    throw new Error('useVMS must be used within VMSProvider');
  }
  return context;
}
