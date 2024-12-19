// src/MapPage.tsx
import React, { useEffect, useState, useRef } from "react";

interface Location {
  lat: number | null;
  lng: number | null;
}

const MapPage: React.FC = () => {
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const mapRef = useRef<HTMLDivElement | null>(null); // Use ref to store map container
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Load the Google Maps script
  const loadGoogleMapsScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google) {
        resolve(); // Google Maps already loaded
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCvJxtDCiWgsUUOLCwLJQYMWUMVdfvbnZk`;
        script.async = true;
        script.onload = () => resolve(); // Resolve when script is loaded
        script.onerror = () =>
          reject(new Error("Failed to load Google Maps script"));
        document.body.appendChild(script);
      }
    });
  };

  useEffect(() => {
    // Get the user's location using the Geolocation API
    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location", error);
        },
        { enableHighAccuracy: true }
      );
    };

    getCurrentLocation();
    loadGoogleMapsScript()
      .then(() => {
        if (location.lat !== null && location.lng !== null && !mapLoaded) {
          const mapOptions: google.maps.MapOptions = {
            center: { lat: location.lat, lng: location.lng },
            zoom: 15,
          };

          if (mapRef.current) {
            const googleMap = new window.google.maps.Map(
              mapRef.current,
              mapOptions
            );
            new window.google.maps.Marker({
              position: { lat: location.lat, lng: location.lng },
              map: googleMap,
              title: "You are here!",
            });
            setMapLoaded(true); // Update map loaded status
          }
        }
      })
      .catch((error) => console.error(error));
  }, [location, mapLoaded]);

  return (
    <div>
      <h1>Your Current Location</h1>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default MapPage;
