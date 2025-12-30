export const estimateDurationMinutes = (
  distanceKm: number,
  speedKph = 35
): number => {
  const hours = distanceKm / speedKph;
  return Math.max(1, Math.round(hours * 60));
};

export const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
};



