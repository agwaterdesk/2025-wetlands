<script>
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import Minimap from "./Minimap.svelte";

  import { flyToLocation, showLayer, hideLayer } from "../../utils/mapbox";
  import { layers } from "../../utils/map-layers";

  export let mapId;
  export let style;
  export let controller;
  let map;
  let mapRef;

  // Map layer action
  function mapLayer(map, { source, layers }) {
    // Wait for style to load
    if (!map.isStyleLoaded()) {
      const listener = () => {
        addLayer();
        map.off("style.load", listener);
      };
      map.on("style.load", listener);
      return;
    }

    function addLayer() {
      // Add source if it doesn't exist
      if (!map.getSource(source.id)) {
        map.addSource(source.id, {
          type: "geojson",
          data: source.data,
        });
      }

      // Add each layer configuration
      layers.forEach((layer) => {
        const layerId = `${source.id}-${layer.type}`;
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: layer.type,
            source: source.id,
            paint: layer.paint,
            layout: {
              visibility: "none",
              ...layer.layout,
            },
          });
        }
      });
    }

    addLayer();

    return {
      update(newConfig) {
        // Handle updates if needed
      },
      destroy() {
        // Cleanup if needed
      },
    };
  }

  function createMap(container) {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    map = new mapboxgl.Map({
      container: mapId,
      interactive: true,
      center: [-95.646, 38.924],
      zoom: 8,
      style,
    });

    // Add all layers using the action
    layers.forEach((layerConfig) => {
      mapLayer(map, layerConfig);
    });
  }

  async function updateMap({
    init = false,
    activeController = controller,
    preloadTiles = false,
  }) {
    if (!map.isStyleLoaded()) return;

    // Get all layer IDs from our layer configurations
    const allLayerIds = layers.flatMap(config => 
      config.layers.map(layer => `${config.source.id}-${layer.type}`)
    );

    // Handle navigation
    if (activeController.flyTo) {
      flyToLocation({
        map,
        target: activeController.flyTo,
        duration: init ? 0 : activeController.duration,
      });
    }

    // Layer visibility
    if (activeController.showLayer) {
      // Hide all other layers first
      allLayerIds
        .filter(id => !id.startsWith(activeController.showLayer))
        .forEach(id => {
          hideLayer({
            map,
            layerId: id,
            duration: init ? 0 : activeController.duration,
          });
        });

      // Show the active layer
      showLayer({
        map,
        layerId: activeController.showLayer,
        duration: init ? 0 : activeController.duration,
      });
    }

    if (preloadTiles) return;
  }

  // Reactive statement to update map when controller changes
  $: if (map && controller) {
    updateMap({});
  }
</script>

<div class="map-container" aria-hidden="true">
  <div
    id={mapId}
    class="map"
    use:createMap
    bind:this={mapRef}
    aria-hidden="true"
  ></div>
  {#if map}
    <Minimap {map} />
  {/if}
</div>

<style>
  .map-container {
    position: relative;
    height: var(--viewport-height);
    width: 100%;
    max-width: 100%;
  }

  .map {
    width: 100%;
    min-height: var(--viewport-height);
  }
</style>
