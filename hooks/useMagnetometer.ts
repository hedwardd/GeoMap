import React, { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';
import { Subscription } from '@unimodules/core';
import {
  getAngle,
  getCompassDirection,
} from '../utils/calcs';

const useMagnetometer = () => {
  const [magnetometerSub, setMagnetometerSub] = useState<Subscription | null>(null);
  const [angle, setAngle] = useState(0);

  const _subToMagnetometer = () => {
    setMagnetometerSub(
      Magnetometer.addListener((data) => {
        setAngle(getCompassDirection(getAngle(data)));
      })
    );
  };

  const _unsubFromMagnetometer = () => {
    magnetometerSub && magnetometerSub.remove();
    setMagnetometerSub(null);
  };

  useEffect(() => {
    _subToMagnetometer();
    return () => _unsubFromMagnetometer();
  }, []);

  return angle;
}

export default useMagnetometer;
