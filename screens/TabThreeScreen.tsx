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
import { DeviceContext } from '../context/DeviceContext';
import LOCATIONS from '../constants/Locations'


export default function TabThreeScreen({ navigation }: RootTabScreenProps<'TabThree'>) {
  // Get heading, pitch, roll from device
  // Get coordinates of user's device
  const {
    alpha: heading, // Heading
    beta: pitchInRad, // Pitch
    gamma: roll, // Roll
    location: userLocation,
    compass,
    locationError,
  } = useContext(DeviceContext);

  // Wait for location to be set
  if (!userLocation) return null;

  // Approach: Use user's device rotation info, location to map positions of global landmarks on the screen

  // Input: User device rotation and coordinates, locations of coordinates
  const {
    latitude: userLat,
    longitude: userLon,
  } = userLocation.coords;
  
  // Get coordinate of location(s)
  const [lat, lng] = LOCATIONS[0].coordinates;

  
  // TODO: For each location
  // Get vertical position from 
  const pitch = rad2deg(pitchInRad);
  const distanceFromPoint = round(distanceFromLatLonInKm(userLat, userLon, lat, lng));
  const angleDownToPoint = round(angleDownUsingDistance(distanceFromPoint));
  const upDownAngle = (pitch - angleDownToPoint);
  const upDownPercentOffScreen = (upDownAngle / 90);
  
  // Get horizontal position as offset
  const bearingFromUserToPoint = bearingBetweenPoints(userLat, userLon, lat, lng);
  const leftRightAngle = relativeDirection(compass, bearingFromUserToPoint);
  const leftRightPercentOffScreen = (leftRightAngle / 90);

  const center = 0.5;
  const leftPosition = center - leftRightPercentOffScreen;
  const topPosition = center - upDownPercentOffScreen;
  
  // Output: Element on screen with position relative to user's device
  

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text>upDownAngle: {upDownAngle.toFixed()}</Text>
        <Text>leftRightAngle: {leftRightAngle.toFixed()}</Text>
      </View>
      <View>
        <Text
          style={{
            ...styles.location,
            left: leftPosition * 100 + '%',
            top: topPosition * 100 + '%',
          }}
        >Beijing</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contentWrapper: {
    height: '45%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    fontSize: 20,
    position: 'absolute',
  }
});