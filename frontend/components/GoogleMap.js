import * as React from "react";
import MapboxMap from "./mapbox-map";
import MapLoadingHolder from "./map-loading-holder";

function App() {
  const [loading, setLoading] = React.useState(true);
  const handleMapLoading = () => setLoading(false);

  return (
      <div className="app-container">
        <div className="map-wrapper">
          <MapboxMap
            onLoaded={handleMapLoading}
          />
        </div>
        {loading && <MapLoadingHolder className="loading-holder" />}
      </div>
  );
}

export default App;
