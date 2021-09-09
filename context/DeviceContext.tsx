import { LocationObject } from 'expo-location';
import React, { createContext } from 'react';
import useDeviceRotation from '../hooks/useDeviceMotion';
import useLocation from '../hooks/useLocation';
import useMagnetometer from '../hooks/useMagnetometer';

interface IDeviceContext {
  alpha: number;
  beta: number;
  gamma: number;
  compass: number;
  location: LocationObject | null;
  locationError: boolean;
}

const DeviceContext = createContext<IDeviceContext>({
  alpha: 0,
  beta: 0,
  gamma: 0,
  compass: 0,
  location: null,
  locationError: false,
});

interface IDeviceProviderProps {
  children: React.ReactNode;
}

const DeviceProvider = ({ children }: IDeviceProviderProps) => {
  const [alpha, beta, gamma] = useDeviceRotation();
  const compass = useMagnetometer();
  const [location, locationError] = useLocation();

  return (
    <DeviceContext.Provider
      value={{
        alpha,
        beta,
        gamma,
        compass,
        location,
        locationError,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export { DeviceContext, DeviceProvider };
