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
    beta: pitch, // Pitch
    gamma: roll, // Roll
    location: userLocation,
    locationError,
  } = useContext(DeviceContext);


  // Approach: Use user's device rotation info, location to map positions of global landmarks on the screen

  // Input: User device rotation and coordinates, locations of coordinates
  
  // Get coordinate of location(s)

  // For each location
    // Get vertical position from 
    // Get horizontal position as offset
      // Bearing diff - roll diff?


  // Output: Element on screen with position relative to user's device
  

  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});