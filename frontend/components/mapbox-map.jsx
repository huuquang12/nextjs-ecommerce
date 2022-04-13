import * as React from "react";
import mapboxgl, { Popup } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Shipping from "../pages/shipping";
import { useForm } from "react-hook-form";
import  Googlemap from '../components/GoogleMap';


function MapboxMap({
  initialOptions = {},
  onCreated,
  handleClickMarker,
  onLoaded,
  onRemoved,
}) {
  const [map, setMap] = React.useState();
  const [locationClick, setLocationClick] = React.useState([
    105.800880, 20.994040,
  ]);

  const mapNode = React.useRef(null);
  //creat popup
  var popup = new mapboxgl.Popup({ offset: 25 }).setText(
    'Thanh Xuân');
  var popup1 = new mapboxgl.Popup({ offset: 25 }).setText(
    'Đống Đa');
var popup2 = new mapboxgl.Popup({ offset: 25 }).setText(
      'Cầu Giấy');
var popup3 = new mapboxgl.Popup({ offset: 25 }).setText(
        'Hà Đông');


  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    // Thanh Xuan - Ha Noi
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.800880, 20.994040],
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
    //create marker Thanh Xuan
    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([105.800880, 20.994040])
      .setPopup(popup)
      .addTo(mapboxMap);
      const element = marker.getElement();
    element.addEventListener("click", (e) => {
      handleClickMarker && handleClickMarker("Thanh Xuân");
    });
    // mapboxMap.on("click", (e) =>
    //   marker1.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(mapboxMap)
    // );
    //Dong Da
    const marker1 = new mapboxgl.Marker({ color: "black" })
    .setLngLat([105.827618, 21.017536])
    .setPopup(popup1)
    .addTo(mapboxMap);
    const element1 = marker1.getElement();
    element1.addEventListener("click", (e) => {
      handleClickMarker && handleClickMarker("Đống Đa");
    });
    //Cau Giay
    const marker2 = new mapboxgl.Marker({ color: "green" })
    .setLngLat([105.791677, 21.032448])
    .setPopup(popup2)
    .addTo(mapboxMap);
    const element2 = marker2.getElement();
    element2.addEventListener("click", (e) => {
      handleClickMarker && handleClickMarker("Cầu Giấy");
    });
    //Ha Dong - VietNam
    const marker3 = new mapboxgl.Marker({ color: "yellow" })
    .setLngLat([105.768202, 20.973854])
    .setPopup(popup3)
    .addTo(mapboxMap);
    const element3 = marker3.getElement();
    element3.addEventListener("click", (e) => {
      handleClickMarker && handleClickMarker("Hà Đông");
    });

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
