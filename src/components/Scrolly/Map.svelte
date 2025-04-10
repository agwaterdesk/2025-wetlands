<script>
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import Minimap from "./Minimap.svelte";

  import { flyToLocation, showLayer, hideLayer } from "../../utils/mapbox";
  import { layers } from "../../utils/map-layers";

  let { mapId, style, controller, content } = $props();
  let map = $state(null);
  let mapRef = $state(null);

  // $inspect(controller);

  const defaultDuration = 4000;

  onMount(() => {
    setTimeout(() => {
      createMap(mapRef);
    }, 0);
  });

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
      interactive: false,
      style,
    });

    updateMap({ init: true });
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
    if (!map || !map.isStyleLoaded()) return;

    // Get all layer IDs from our layer configurations
    const allLayerIds = layers.flatMap((config) =>
      config.layers.map((layer) => `${config.source.id}-${layer.type}`)
    );

    // Handle navigation
    if (activeController.flyTo) {
      try {
        await flyToLocation({
          map,
          target: activeController.flyTo,
          duration: init ? 0 : defaultDuration,
        });
      } catch (err) {}
    }

    // Hide all other layers first
    const layersToHide = allLayerIds.filter((id) => {
      if (activeController.showLayer?.includes(',')) {
        return !activeController.showLayer.split(',').some(layerId => id.startsWith(layerId));
      }
      return !id.startsWith(activeController.showLayer);
    });
    
    for (const id of layersToHide) {
      try {
        await hideLayer({
          map,
          layerId: id,
          duration: init ? 0 : defaultDuration,
        });
      } catch (err) {}
    }

    // Layer visibility
    if (activeController.showLayer) {
      const layerIds = activeController.showLayer.split(',');
      
      for (const layerId of layerIds) {
        const sourceConfig = layers.find(l => l.source.id === layerId.trim());
        if (sourceConfig) {
          for (const layer of sourceConfig.layers) {
            const fullLayerId = `${layerId.trim()}-${layer.type}`;
            try {
              await showLayer({
                map,
                layerId: fullLayerId,
                duration: init ? 0 : defaultDuration,
              });
            } catch (err) {}
          }
        }
      }
    }
  }

  // Create a more robust effect for handling map updates
  let lastUpdateId = $state(null);

  $effect(() => {
    if (!map || !controller) return;
    
    if (lastUpdateId === controller.id) return;

    // console.log('Map update:', controller.id);
    lastUpdateId = controller.id;
    
    // Ensure the map is ready before updating
    if (!map.isStyleLoaded()) {
      const checkStyle = () => {
        if (map.isStyleLoaded()) {
          updateMap({});
        } else {
          setTimeout(checkStyle, 100);
        }
      };
      checkStyle();
    } else {
      updateMap({});
    }
  });
</script>

<div class="map-container" aria-hidden="true">
  <div
    id={mapId}
    class="map"

    bind:this={mapRef}
    aria-hidden="true"
  ></div>
  {#if map}
    <Minimap
      {map}
      activePoint={controller.id}
      points={content.slides.map((slide) => ({
        id: slide.controller?.id,
        center: slide.controller?.center?.split(","),
      }))}
    />
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
