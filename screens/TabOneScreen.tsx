import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { DeviceMotion, Magnetometer, ThreeAxisMeasurement } from 'expo-sensors';
import * as Location from 'expo-location';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Subscription } from '@unimodules/core';

DeviceMotion.setUpdateInterval(100);

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [data, setData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [deviceMotionSub, setDeviceMotionSub] = useState<Subscription | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [magnetometerSub, setMagnetometerSub] = useState<Subscription | null>(null);
  const [magnetometer, setMagnetometer] = useState(0);
  

  const _subToDeviceMotion = () => {
    setDeviceMotionSub(
      DeviceMotion.addListener(({ rotation }) => {
        setData(rotation);
      })
    );
  };

  const _unsubFromDeviceMotion = () => {
    deviceMotionSub && deviceMotionSub.remove();
    setDeviceMotionSub(null);
  };

  const _subToMagnetometer = () => {
    setMagnetometerSub(
      Magnetometer.addListener((data) => {
        setMagnetometer(_angle(data));
      })
    );
  };

  const _unsubFromMagnetometer = () => {
    magnetometerSub && magnetometerSub.remove();
    setMagnetometerSub(null);
  };

  useEffect(() => {
    _subToDeviceMotion();
    return () => _unsubFromDeviceMotion();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    _subToMagnetometer();
    return () => _unsubFromMagnetometer();
  }, []);

  const { alpha, beta, gamma } = data;
  const alphaRounded = round(alpha),
    betaRounded = round(beta),
    gammaRounded = round(gamma);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    const { latitude, longitude } = location.coords;
    const latRounded = round(latitude),
      lngRounded = round(longitude);
    text = `lat: ${latRounded} lng: ${lngRounded}`;
  }

  const degree = _degree(magnetometer);
  const direction = _direction(degree);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>alpha: {alphaRounded}</Text>
      <Text style={styles.title}>beta: {betaRounded}</Text>
      <Text style={styles.title}>gamma: {gammaRounded}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Coords: {text}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Direction: {degree}({direction})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

const round = (n: number | undefined) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const _angle = (magnetometer: ThreeAxisMeasurement) => {
  let { x, y, z } = magnetometer;
  let angle = 0;
  if (Math.atan2(y, x) >= 0) {
    angle = Math.atan2(y, x) * (180 / Math.PI);
  } else {
    angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
  }
  return Math.round(angle);
};

const _direction = (degree: number) => {
  if (degree >= 22.5 && degree < 67.5) {
    return 'NE';
  }
  else if (degree >= 67.5 && degree < 112.5) {
    return 'E';
  }
  else if (degree >= 112.5 && degree < 157.5) {
    return 'SE';
  }
  else if (degree >= 157.5 && degree < 202.5) {
    return 'S';
  }
  else if (degree >= 202.5 && degree < 247.5) {
    return 'SW';
  }
  else if (degree >= 247.5 && degree < 292.5) {
    return 'W';
  }
  else if (degree >= 292.5 && degree < 337.5) {
    return 'NW';
  }
  else {
    return 'N';
  }
};

// TODO: Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.) ?
const _degree = (magnetometer: number) => {
  return magnetometer;
  // return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
};