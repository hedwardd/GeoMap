import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

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
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const _subscribe = () => {
    setSubscription(
      DeviceMotion.addListener(({ rotation }) => {
        setData(rotation);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { alpha, beta, gamma } = data;
  const alphaRounded = round(alpha),
    betaRounded = round(beta),
    gammaRounded = round(gamma);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>alpha: {alphaRounded}</Text>
      <Text style={styles.title}>beta: {betaRounded}</Text>
      <Text style={styles.title}>gamma: {gammaRounded}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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