import { useEffect, useRef, useState } from "react";
import { Map } from "maplibre-gl";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import type { FeatureCollection } from "geojson";
import { DrawPolygonMode, ViewMode } from "@nebula.gl/edit-modes";
import { circleOverIreland, polygonOverEngland } from "./features";
import { polygonOverScotlandCollection } from "./featureCollections";
import type { IControl } from "maplibre-gl";

// When using the @deck.gl/mapbox module, and MapboxLayer and MapboxOverlay https://deck.gl/docs/api-reference/mapbox/overview
// Mapbox is the root element and deck.gl is the child, with Mapbox handling all user inputs
// it is recommended that you use deck.gl as the root element, so we are doing the opposite.

// To debug deck.gl, run the following in the browser console, as per https://deck.gl/docs/developer-guide/debugging.
// However, it makes the shapes dissapear and an error (`luma.gl: assertion failed.`)
// deck.log.enable();
// deck.log.level = 3; // or 1 or 2

function App() {
  console.log("render");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapboxOverlayRef = useRef<MapboxOverlay>();
  // const [getMode, setMode] = useState(() => DrawPolygonMode);
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState<
    number[]
  >([]);
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>(
    {
      type: "FeatureCollection",
      features: [circleOverIreland, polygonOverEngland],
    }
  );

  const mapRef = useRef<Map>();
  useEffect(() => {
    const map = new Map({
      container: mapContainer.current!,
      // style: "https://demotiles.maplibre.org/style.json",
      // https://cloud.maptiler.com/maps/outdoor-v2/
      style:
        "https://api.maptiler.com/maps/outdoor-v2/style.json?key=LlETYKEJwgxoM6pCNChm",
      center: [-0.08648816636906795, 51.519898434555685],
      // attributionControl: false,
      zoom: 5,
    });
    mapRef.current = map;
    map.dragPan.disable();
    map.on("load", () => {
      const mapboxOverlayControl = new MapboxOverlay({
        // TYPEERROR 2:
        layers: [editableGeojsonLayer, geojsonLayer],
      });
      // TYPEERROR 1: mapboxOverlayControl implements IControl from mapbox. But Maplibre's map.addControl() wants a IControl from maplibre. 👇🏼️
      map.addControl(mapboxOverlayControl as unknown as IControl);
      mapboxOverlayRef.current = mapboxOverlayControl;

      mapboxOverlayControl;
    });
    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const geojsonLayer = new GeoJsonLayer({
    opacity: 0.1,
    data: polygonOverScotlandCollection,
    id: "geojson-layer-ben",
    getFillColor: [255, 0, 0],
    pickable: true,
    mode: ViewMode,
    onClick: (pickInfo, hammerInput) => {
      console.log("click", { pickInfo, hammerInput, featureCollection });
    },
  });

  // TYPEERROR 3: EditableGeoJsonLayer constructor Expected 0 arguments, but got 1.
  const editableGeojsonLayer = new EditableGeoJsonLayer({
    opacity: 0.1,
    id: "editable-geojson-layer-ben",
    data: featureCollection,
    getFillColor: [0, 255, 0],
    pickable: true,
    selectedFeatureIndexes: selectedFeatureIndexes,
    mode: DrawPolygonMode,
    onClick: (pickInfo, hammerInput) => {
      console.log("click", { pickInfo, hammerInput, featureCollection });
      setSelectedFeatureIndexes([pickInfo.index]);
    },
    onEdit: (
      updatedData: any | undefined,
      editType: string | undefined,
      featureIndexes: number[] | undefined,
      editContext: any | undefined
      // updatedData: FeatureCollection,
      // editType: string,
      // featureIndexes: number[],
      // editContext: any | null
    ) => {
      console.log(`onEdit`);
      if (updatedData && updatedData.features) {
        console.log("onEdit called with features", {
          updatedData,
          editType,
          featureIndexes,
          editContext,
        });
        setFeatureCollection(updatedData);
      } else {
        console.error("onEdit called with no features", {
          updatedData,
          editType,
          featureIndexes,
          editContext,
        });
      }
    },
  });

  mapboxOverlayRef.current?.setProps({
    layers: [editableGeojsonLayer, geojsonLayer],
  });

  return (
    <>
      {/* <h1 className="text-3xl">Map</h1> */}
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full" ref={mapContainer} />
      </div>
    </>
  );
}

export default App;
