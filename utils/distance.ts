export interface Coordinate {
  lat: number;
  lng: number;
}

const toRad = (value: number) => (value * Math.PI) / 180;

export const haversineDistanceKm = (a: Coordinate, b: Coordinate): number => {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
};

export const totalDistanceKm = (points: Coordinate[]): number => {
  if (points.length < 2) return 0;
  return points.reduce((sum, point, idx) => {
    if (idx === 0) return sum;
    return sum + haversineDistanceKm(points[idx - 1], point);
  }, 0);
};

export const formatKm = (distance: number) => `${distance.toFixed(2)} km`;
