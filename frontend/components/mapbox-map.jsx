import * as React from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Shipping from "../pages/shipping";
import { useForm } from "react-hook-form";
import  Googlemap from '../components/GoogleMap';
import { Store } from "../utils/Store";


function MapboxMap({
  initialOptions = {},
  onCreated,
  handleClickMarker,
  onLoaded,
  onRemoved,
  markerOptions
}) {
  const [map, setMap] = React.useState();
  const [locationClick, setLocationClick] = React.useState([
    105.800880, 20.994040,
  ]);
  const { state, dispatch } = React.useContext(Store);
  const {
    userInfo,
  } = state;
  console.log("user : " , userInfo)
  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    // Center
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userInfo?.coordinate?.lng || 105.800880,userInfo?.coordinate?.lat ||  20.994040],
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
    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([userInfo?.coordinate?.lng || 105.800880,userInfo?.coordinate?.lat ||  20.994040])
      .addTo(mapboxMap);
      // const element = marker.getElement();
    // element.addEventListener("click", (e) => {
    //   // handleClickMarker && handleClickMarker("Thanh Xuân");
    // });
    mapboxMap.on("click", (e) =>{
      handleClickMarker && handleClickMarker(e.lngLat);
      marker.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(mapboxMap)

    }
    );

    setMap(mapboxMap);
    if (onCreated) onCreated(mapboxMap);

    if (onLoaded) mapboxMap.once("load", () => onLoaded(mapboxMap));

    return () => {
      mapboxMap.remove();
      setMap(undefined);
      if (onRemoved) onRemoved();
    };
  }, [userInfo]);

  return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap;
