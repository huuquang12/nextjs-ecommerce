import * as React from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";



function MapboxMap({
  initialOptions = {},
  onCreated,
  onLoaded,
  onRemoved,
}) {
  const [map, setMap] = React.useState();
  const [locationClick, setLocationClick] = React.useState([
    105.85009963133263, 20.99773467489078,
  ]);

  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    // Ha Noi - Viet Nam
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.85009963133263, 20.99773467489078],
      zoom: 15,
      ...initialOptions,
    });

    //config for location
    const location = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      // showUserHeading: true
    });
    mapboxMap.addControl(location);

    //control search map
    mapboxMap.addControl(
      new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
      })
    );
    //create marker
    const marker1 = new mapboxgl.Marker({ color: "red" })
      .setLngLat([105.85009963133263, 20.99773467489078])
      .addTo(mapboxMap);
    mapboxMap.on("click", (e) =>
      marker1.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(mapboxMap)
    );

    setMap(mapboxMap);
    if (onCreated) onCreated(mapboxMap);

    if (onLoaded) mapboxMap.once("load", () => onLoaded(mapboxMap));

    return () => {
      mapboxMap.remove();
      setMap(undefined);
      if (onRemoved) onRemoved();
    };
  }, []);

  return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap;
