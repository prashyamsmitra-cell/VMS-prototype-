import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const VMSContext = createContext();

export function VMSProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data from localStorage
  useEffect(() => {
    try {
      const savedLocations = localStorage.getItem('vms_locations');
      const savedEmployees = localStorage.getItem('vms_employees');

      // Default mock locations
      const defaultLocations = [
        {
          id: 1,
          name: 'Mumbai Office',
          address: '123 Business Park, Mumbai, MH 400001',
          country: 'India',
          city: 'Mumbai',
          capacity: 500,
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=location:1',
        },
        {
          id: 2,
          name: 'Bangalore Office',
          address: '456 Tech Hub, Bangalore, KA 560001',
          country: 'India',
          city: 'Bangalore',
          capacity: 300,
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=location:2',
        },
        {
          id: 3,
          name: 'Delhi Office',
          address: '789 Enterprise Drive, New Delhi, DL 110001',
          country: 'India',
          city: 'Delhi',
          capacity: 400,
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=location:3',
        },
      ];

      // Check if saved data has country field (schema validation)
      if (savedLocations) {
        const parsed = JSON.parse(savedLocations);
        const hasCountryField = parsed.length > 0 && parsed[0].hasOwnProperty('country');
        if (hasCountryField) {
          setLocations(parsed);
        } else {
          // Schema changed, use new defaults
          setLocations(defaultLocations);
          localStorage.setItem('vms_locations', JSON.stringify(defaultLocations));
        }
      } else {
        setLocations(defaultLocations);
        localStorage.setItem('vms_locations', JSON.stringify(defaultLocations));
      }

      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      } else {
        // Default mock employees
        const defaultEmployees = [
          { id: 1, name: 'Rajesh Kumar', emailId: 'rajesh@company.com', mobileNumber: '9876543210', department: 'Engineering', locationId: 1 },
          { id: 2, name: 'Priya Sharma', emailId: 'priya@company.com', mobileNumber: '9876543211', department: 'HR', locationId: 1 },
          { id: 3, name: 'Amit Patel', emailId: 'amit@company.com', mobileNumber: '9876543212', department: 'Sales', locationId: 2 },
          { id: 4, name: 'Neha Singh', emailId: 'neha@company.com', mobileNumber: '9876543213', department: 'Marketing', locationId: 2 },
          { id: 5, name: 'Vikas Gupta', emailId: 'vikas@company.com', mobileNumber: '9876543214', department: 'Engineering', locationId: 3 },
          { id: 6, name: 'Anjali Verma', emailId: 'anjali@company.com', mobileNumber: '9876543215', department: 'Finance', locationId: 3 },
        ];
        setEmployees(defaultEmployees);
        localStorage.setItem('vms_employees', JSON.stringify(defaultEmployees));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading VMS data:', error);
      setIsLoading(false);
    }
  }, []);

  // Persist locations to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('vms_locations', JSON.stringify(locations));
    }
  }, [locations, isLoading]);

  // Persist employees to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('vms_employees', JSON.stringify(employees));
    }
  }, [employees, isLoading]);

  const value = useMemo(
    () => ({
      locations,
      employees,
      isLoading,
      setLocations,
      setEmployees,
      addLocation: (location) => setLocations((prev) => [...prev, { ...location, id: Date.now() }]),
      updateLocation: (id, updates) =>
        setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc))),
      deleteLocation: (id) => setLocations((prev) => prev.filter((loc) => loc.id !== id)),
      addEmployee: (employee) => setEmployees((prev) => [...prev, { ...employee, id: Date.now() }]),
      updateEmployee: (id, updates) =>
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))),
      deleteEmployee: (id) => setEmployees((prev) => prev.filter((emp) => emp.id !== id)),
    }),
    [locations, employees, isLoading],
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
