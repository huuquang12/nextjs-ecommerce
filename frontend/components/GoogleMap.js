import * as React from "react";
import MapboxMap from "./mapbox-map";
import MapLoadingHolder from "./map-loading-holder";

function App({setValue}) {
  const [loading, setLoading] = React.useState(true);
  const handleMapLoading = () => setLoading(false);

  return (
      <div className="app-container">
        <div className="map-wrapper">
          <MapboxMap
            onLoaded={handleMapLoading}
            handleClickMarker = {(value) => setValue(value)}
          />
        </div>
        {loading && <MapLoadingHolder className="loading-holder" />}
      </div>
  );
}

export default App;
