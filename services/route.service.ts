import { Coordinate, haversineDistanceKm, totalDistanceKm } from '../utils/distance';
import { Driver } from '../lib/supabase';

export const buildPolyline = (points: Coordinate[]) =>
  points.map((p) => ({ latitude: p.lat, longitude: p.lng }));

export const greedyRoute = (start: Coordinate, stops: Coordinate[]): Coordinate[] => {
  const remaining = [...stops];
  const path: Coordinate[] = [start];
  let current = start;

  while (remaining.length) {
    let idx = 0;
    let best = Number.MAX_SAFE_INTEGER;
    remaining.forEach((stop, index) => {
      const d = haversineDistanceKm(current, stop);
      if (d < best) {
        best = d;
        idx = index;
      }
    });
    const [next] = remaining.splice(idx, 1);
    path.push(next);
    current = next;
  }

  return path;
};

export const computeRouteDistance = (path: Coordinate[]) => totalDistanceKm(path);

export const chooseNearestDriver = (target: Coordinate, drivers: Driver[]): Driver | null => {
  if (!drivers.length) return null;
  let candidate: Driver | null = null;
  let min = Number.MAX_SAFE_INTEGER;

  drivers.forEach((driver) => {
    const d = haversineDistanceKm(target, { lat: driver.lat, lng: driver.lng });
    if (d < min) {
      min = d;
      candidate = driver;
    }
  });

  return candidate;
};
