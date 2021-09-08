import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import useDeviceRotation from '../hooks/useDeviceMotion';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { round, getDirection, rad2deg, bearingBetweenPoints, relativeDirection, angleDownUsingDistance, distanceFromLatLonInKm } from "../utils/calcs";
import useMagnetometer from '../hooks/useMagnetometer';
import useLocation from '../hooks/useLocation';

const BEIJING_LAT = 39.9042;
const BEIJING_LON = 116.4074;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [alpha, beta, gamma] = useDeviceRotation();
  const compass = useMagnetometer();
  const [location, locationError] = useLocation();

  const alphaDeg = rad2deg(alpha),
    betaDeg = rad2deg(beta),
    gammaDeg = rad2deg(gamma);
  const alphaRounded = round(alphaDeg),
    betaRounded = round(betaDeg),
    gammaRounded = round(gammaDeg);
  const direction = getDirection(compass);

  let locationText = 'Waiting..';
  let bearingText = 'Waiting..';
  let angleText = 'Waiting..';
  if (locationError) {
    locationText = "Permission to access location was denied.";
    bearingText = "Permission to access location was denied.";
  } else if (location) {
    const { latitude, longitude } = location.coords;
    const latRounded = round(latitude),
      lngRounded = round(longitude);
      locationText = `lat: ${latRounded} lng: ${lngRounded}`;
    const bearing = round(bearingBetweenPoints(latitude, longitude, BEIJING_LAT, BEIJING_LON));
    const bearingDiff = round(relativeDirection(compass, bearing));
    bearingText = `Bearing: ${bearing} (${bearingDiff})`;
    const distance = round(distanceFromLatLonInKm(latitude, longitude, BEIJING_LAT, BEIJING_LON));
    const angleDown = round(angleDownUsingDistance(distance));
    angleText = `Distance: ${angleDown}° (${round(betaRounded - angleDown)})`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>alpha: {alphaRounded}</Text>
      <Text style={styles.title}>beta: {betaRounded}</Text>
      <Text style={styles.title}>gamma: {gammaRounded}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Coords: {locationText}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Direction: {compass}°({direction})</Text>
      <Text style={styles.title}>{bearingText}</Text>
      <Text style={styles.title}>{angleText}</Text>
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