import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import useDeviceRotation from '../hooks/useDeviceMotion';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { 
  round,
  angleDownUsingDistance,
  bearingBetweenPoints,
  distanceFromLatLonInKm,
  getCompassDirection,
  getDirection,
  rad2deg,
  relativeDirection,
} from "../utils/calcs";
import useMagnetometer from '../hooks/useMagnetometer';
import useLocation from '../hooks/useLocation';
import { DeviceContext } from '../context/DeviceContext';

const BEIJING_LAT = 39.9042;
const BEIJING_LON = 116.4074;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const {
    alpha,
    beta,
    gamma,
    compass,
    location: userLocation,
    locationError,
  } = useContext(DeviceContext);

  const alphaDeg = rad2deg(alpha),
    betaDeg = rad2deg(beta),
    gammaDeg = rad2deg(gamma);
  const alphaRounded = round(alphaDeg),
    betaRounded = round(betaDeg),
    gammaRounded = round(gammaDeg);
  const compassDirection = getCompassDirection(alphaRounded);
  const direction = getDirection(compassDirection);

  let locationText = 'Waiting..';
  let bearingText = 'Waiting..';
  let angleText = 'Waiting..';
  if (locationError) {
    locationText = "Permission to access location was denied.";
    bearingText = "Permission to access location was denied.";
  } else if (userLocation) {
    const {
      latitude: userLat,
      longitude: userLon,
    } = userLocation.coords;
    const latRounded = round(userLat),
      lngRounded = round(userLon);
      locationText = `lat: ${latRounded} lng: ${lngRounded}`;
    const bearingFromUserToPoint = round(bearingBetweenPoints(userLat, userLon, BEIJING_LAT, BEIJING_LON));
    const diffCurrentBearingAndBearingToPoint = round(relativeDirection(compass, bearingFromUserToPoint));
    bearingText = `${bearingFromUserToPoint} (${diffCurrentBearingAndBearingToPoint})`;
    const distanceFromPoint = round(distanceFromLatLonInKm(userLat, userLon, BEIJING_LAT, BEIJING_LON));
    const angleDownToPoint = round(angleDownUsingDistance(distanceFromPoint));
    angleText = `${angleDownToPoint}° (${round(betaRounded - angleDownToPoint)})`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Heading:</Text>
        <Text style={styles.title}>{alphaRounded}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Pitch:</Text>
        <Text style={styles.title}>{betaRounded}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Roll:</Text>
        <Text style={styles.title}>{gammaRounded}</Text>
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.row}>
        <Text style={styles.title}>Coords:</Text>
        <Text style={styles.title}>{locationText}</Text>
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.row}>
        <Text style={styles.title}>Direction:</Text>
        <Text style={styles.title}>{compassDirection}°({direction})</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Bearing To Beijing:</Text>
        <Text style={styles.title}>{bearingText}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Angle Down:</Text>
        <Text style={styles.title}>{angleText}</Text>
      </View>
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
  row: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});