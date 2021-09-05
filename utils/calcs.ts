import { ThreeAxisMeasurement } from "expo-sensors";

const EARTH_RADIUS = 6371; // Radius of the earth in km

export const round = (n: number | undefined) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

export const getAngle = (magnetometer: ThreeAxisMeasurement) => {
  let { x, y, z } = magnetometer;
  let angle = 0;
  if (Math.atan2(y, x) >= 0) {
    angle = Math.atan2(y, x) * (180 / Math.PI);
  } else {
    angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
  }
  return Math.round(angle);
};

export const getDirection = (degree: number) => {
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
export const getDegree = (magnetometer: number) => {
  return magnetometer;
  // return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
};

export const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
}

export const rad2deg = (rad: number) => {
  return rad * (180 / Math.PI);
}

export const distanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = EARTH_RADIUS * c; // Distance in km
  return d;
};

export const angleDownUsingDistance = (distance: number) => {
  const maxDistance = Math.PI * EARTH_RADIUS;
  const angle = distance / maxDistance * 90;
  return angle;
}

export const angleUpUsingDistance = (distance: number) => {
  const angleDown = angleDownUsingDistance(distance);
  return Math.abs(angleDown - 90);
}

export const bearingBetweenPoints = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const dLon = deg2rad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(deg2rad(lat2));
  const x = Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) - Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  // const inRad = (brng + 2 * Math.PI) % (2 * Math.PI);
  const inDeg = (brng * 180 / Math.PI + 360) % 360; // in degrees
  return inDeg;
};
