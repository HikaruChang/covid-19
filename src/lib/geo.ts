export function locate(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 180_000,
      maximumAge: 5_000,
    });
  });
}

/** Haversine distance in km */
export function distance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const rad = Math.PI / 180;
  const rLat1 = lat1 * rad;
  const rLat2 = lat2 * rad;
  const a = rLat1 - rLat2;
  const b = (lng1 - lng2) * rad;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(a / 2) ** 2 +
        Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(b / 2) ** 2,
      ),
    );
  s *= 6378.137;
  return Math.round(s * 10000) / 10000;
}
