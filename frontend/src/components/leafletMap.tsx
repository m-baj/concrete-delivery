"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Flex} from "@chakra-ui/react";


L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MarkerType {
  lat: number;
  lon: number;
  popup: string;
}


interface LeafletMapProps {
  markers: MarkerType[];
  route: [number, number][]; // Tablica współrzędnych (lat, lon) dla Polyline
}

function calculateCenterAndZoom(markers: MarkerType[]) {
  if (markers.length === 0 || markers.length === 1 || markers.length === 2) {
    return { center: [52.224, 21.027] as [number, number], zoom: 12 };
  }
  console.log("Markers:");
  console.log(markers);

  let latSum = 0, lonSum = 0;
  let latMax = -Infinity, latMin = Infinity, lonMax = -Infinity, lonMin = Infinity;

  markers.forEach(({ lat, lon }) => {
    latSum += lat;
    lonSum += lon;
    if (lat > latMax) latMax = lat;
    if (lat < latMin) latMin = lat;
    if (lon > lonMax) lonMax = lon;
    if (lon < lonMin) lonMin = lon;
  });

  const latCenter = latSum / markers.length;
  const lonCenter = lonSum / markers.length;
  const zoom =
    -23 * (latMax - latMin + lonMax - lonMin) / 2 +
    17 -
    (latMax - latMin) / (lonMax - lonMin) -
    4;

  return {
    center: [latCenter, lonCenter] as [number, number],
    zoom,
  };
}

const routeOptions: L.PolylineOptions = {
  color: "blue",
  weight: 4,
  opacity: 0.8,
};

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MyLeafletMap({ markers, route }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const { center, zoom } = calculateCenterAndZoom(markers);

    leafletMapRef.current = L.map(mapRef.current).setView([52.2297, 21.0122], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(leafletMapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);

    routeLayerRef.current = L.polyline([], routeOptions).addTo(leafletMapRef.current);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((m, index) => {
      if (index === 0) {
        L.marker([m.lat, m.lon], { icon: redIcon })
          .bindPopup(m.popup)
          .addTo(markersLayerRef.current!);
      } else {
        // Reszta markerów: zielona kropka
        L.marker([m.lat, m.lon])
          .bindPopup(m.popup)
          .addTo(markersLayerRef.current!);
      }
    });

    const { center, zoom } = calculateCenterAndZoom(markers);

    leafletMapRef.current.setView(center, zoom);
  }, [markers]);

  useEffect(() => {
    if (!leafletMapRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.setLatLngs(route);

  }, [route]);

  return (
    <Flex
      ref={mapRef}
      style={{ width: "100%", height: "50vh", border: "1px solid #ccc" }}
    />
  );
}
