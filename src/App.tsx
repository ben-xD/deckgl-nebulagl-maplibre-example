import { useEffect, useRef, useState } from "react";
import { Map } from "maplibre-gl";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
// import type { Layer } from "@deck.gl/core/typed";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { DrawPolygonMode } from "@nebula.gl/edit-modes";
import type { FeatureCollection } from "geojson";
// Started from https://github.com/visgl/deck.gl/blob/8.9-release/examples/get-started/pure-js/mapbox/app.js
// MapboxOverlay vs MapboxLayer? Layer is just a layer. Overlay

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
// const AIRPORTS =
// "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

function App() {
  const mapContainer = useRef<HTMLDivElement>(null);

  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState<
    number[]
  >([]);
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>(
    {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-3.24481898415803, 53.07589656487383],
                [-3.9538920354414984, 50.02381515527125],
                [0.6924470242123846, 49.670907578310306],
                [4.827539042028292, 53.005294785865715],
                [-3.24481898415803, 53.07589656487383],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    }
  );
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
    map.dragPan.disable();
    // new types can't set the type anymore...
    // const editableGeojsonLayerInMapboxLayer = new MapboxLayer({type: EditableGeoJsonLayer});
    // Also not possible:
    // editableGeojsonLayerInMapboxLayer.type = EditableGeoJsonLayer;

    // adapted from https://nebula.gl/docs/api-reference/layers/editable-geojson-layer
    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: "editable-geojson-layer-1",
      data: featureCollection,
      pickable: true,
      selectedFeatureIndexes,
      mode: new DrawPolygonMode(),
      onClick: (pickInfo, hammerInput) => {
        console.log("click", { pickInfo, hammerInput });
      },
      onEdit: (updatedData, editType, featureIndexes, editContext) => {
        console.log("onEdit called", { editType, featureIndexes, editContext });
        setFeatureCollection(updatedData);
      },
    });
    // docs: https://deck.gl/docs/api-reference/mapbox/mapbox-overlay
    const deckOverlay = new MapboxOverlay({
      layers: [
        editableGeoJsonLayer,
        // new GeoJsonLayer({
        //   id: "airports",
        //   data: AIRPORTS,
        //   // Styles
        //   filled: true,
        //   pointRadiusMinPixels: 2,
        //   pointRadiusScale: 2000,
        //   getPointRadius: (f) => 11 - f?.properties?.scalerank,
        //   getFillColor: [200, 0, 80, 180],
        //   // Interactive props
        //   pickable: true,
        //   autoHighlight: true,
        //   onClick: (info) =>
        //     // eslint-disable-next-line
        //     info.object &&
        //     alert(
        //       `${info.object.properties.name} (${info.object.properties.abbrev})`
        //     ),
        // }),
        // new ArcLayer({
        //   id: "arcs",
        //   data: AIR_PORTS,
        //   dataTransform: (d) =>
        //     d.features.filter((f) => f.properties.scalerank < 4),
        //   // Styles
        //   getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
        //   getTargetPosition: (f) => f.geometry.coordinates,
        //   getSourceColor: [0, 128, 200],
        //   getTargetColor: [200, 0, 80],
        //   getWidth: 1,
        // }),
      ],
    });
    // We can also setProps later
    // deckOverlay.setProps({ layers: [editableGeoJsonLayer] });

    // Interesting alternative: await map.once('load');
    map.on("load", () => {
      // maplibre (Map#addControl's parameter IControl) and deck.gl (MapboxOverlay) don't 100% agree
      map.addControl(deckOverlay);
      // How to add EditableGeojsonLayer to maplibre? Can't use the addLayer anymore.
      // map.addLayer();
      // Use addControl and MapboxOverlay, following https://maplibre.org/maplibre-gl-js/docs/examples/add-deckgl-layer-using-rest-api/
      // editableGeoJsonLayer.updateState({
      //   props: {
      //     mode: new DrawPolygonMode(),
      //   },
      // });
      // map.addControl(editableGeojsonLayerOverlay);
      // addLayer takes an object, like in https://github.com/maplibre/maplibre-gl-js/pull/3429/files
      // map.addLayer(editableGeoJsonLayer);
    });
    return () => {
      map.remove();
    };
  }, []);

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
