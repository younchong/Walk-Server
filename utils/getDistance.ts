type Location = {
  lat: number,
  lng: number,
}

type Props = {
  userLocation: Location,
  signalLocation: Location,
}

export default function getDistance({ userLocation, signalLocation }: Props) {
  const degToRad = (deg: number) => deg * (Math.PI / 180);

  const RADIUS = 6371;
  const lat = degToRad(userLocation.lat - signalLocation.lat);
  const lon = degToRad(userLocation.lng- signalLocation.lng);
  const a = Math.sin(lat/2) * Math.sin(lat/2) + Math.cos(degToRad(userLocation.lat)) * Math.cos(signalLocation.lat) * Math.sin(lon/2) * Math.sin(lon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = RADIUS * c; // Distance in km

  return d;
};
