import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { DeviceMotion, Magnetometer, ThreeAxisMeasurement } from 'expo-sensors';
import * as Location from 'expo-location';
import { Subscription } from '@unimodules/core';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { round, getAngle, getDirection, getDegree } from "../utils/calcs";

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
        setMagnetometer(getAngle(data));
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

  const degree = getDegree(magnetometer);
  const direction = getDirection(degree);

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