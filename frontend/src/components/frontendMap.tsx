"use client"
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MarkerType {
  lat: number;
  lon: number;
  popup: string;
}

function calculateCenterAndZoom(markers: MarkerType[]) {
  let latSum = 0, lonSum = 0;
  let latMax = -Infinity, latMin = Infinity, lonMax = -Infinity, lonMin = Infinity;

  markers.forEach(( {lat, lon}) => {
    latSum += lat;
    lonSum += lon;
    if (lat > latMax) latMax = lat;
    if (lat < latMin) latMin = lat;
    if (lon > lonMax) lonMax = lon;
    if (lon < lonMin) lonMin = lon;
  });

  const latCenter = latSum / markers.length;
  const lonCenter = lonSum / markers.length;
  const zoom = -23 * (latMax - latMin + lonMax - lonMin) / 2 + 17 - (latMax - latMin) / (lonMax - lonMin) - 1;

  return { center: [latCenter, lonCenter], zoom: Math.round(zoom) };
}

async function fetchRoute(markers: any) {
  const osrmUrl = "https://router.project-osrm.org/route/v1/driving/";
  const waypoints = markers.map(({ lat, lon }: { lat: number; lon: number }) => `${lon},${lat}`).join(";");
  const query = `${osrmUrl}${waypoints}?overview=full&geometries=geojson&alternatives=false`;

  const response = await fetch(query);
  if (response.ok) {
    const data = await response.json();
    return data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
  }
  throw new Error("Nie udało się pobrać trasy z OSRM.");
}

export default function Map({markers}: any) {
  const [route, setRoute] = useState([]);
  const { center, zoom } = calculateCenterAndZoom(markers);
  const [mapmarkers, setMapMarkers] = useState([]);

    // useEffect(() => {
    //     const fetchMarkers = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8000/courier/markers/{courier_id}");
    //         if (!response.ok) {
    //         throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
    //         }
    //         const data = await response.json();
    //         setMarkers(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     };
    //     fetchOrders();
    //     const interval = setInterval(fetchOrders, 60000); // Fetch orders every 60 seconds
    //
    //     return () => clearInterval(interval);
    // }, []);
    useEffect(() => {
    setMapMarkers(markers);
  }, []);


  useEffect(() => {
    fetchRoute(markers)
      .then((route) => setRoute(route))
      .catch((error) => console.error(error));
  }, []);

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={zoom}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers.map((marker: MarkerType, index: number) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lon]}
        >
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}

      {route.length > 0 && (
        <Polyline
          positions={route}
          color="red"
          weight={4}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}
