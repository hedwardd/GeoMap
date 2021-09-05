import React, { useState, useEffect } from 'react';
import { Subscription } from '@unimodules/core';
import { DeviceMotion } from 'expo-sensors';

const useDeviceRotation = (): [number, number, number] => {
  const [data, setData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [deviceMotionSub, setDeviceMotionSub] = useState<Subscription | null>(null);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(100);
    setDeviceMotionSub(
      DeviceMotion.addListener(({ rotation }) => {
        setData(rotation);
      })
    );
    return () => {
      deviceMotionSub && deviceMotionSub.remove();
      setDeviceMotionSub(null);
    };
  }, []);

  const { alpha, beta, gamma } = data;

  return [alpha, beta, gamma];
};

export default useDeviceRotation;