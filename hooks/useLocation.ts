import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = (): [Location.LocationObject | null, boolean] => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return [location, locationError];
};

export default useLocation;
