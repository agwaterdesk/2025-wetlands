<script>
  import { onMount } from "svelte";
  import usLower48 from "$data/us_lower_48.geo.json";
  import { geoAlbers, geoPath } from "d3-geo";

  let { map } = $props();

  let bounds = $state(null);
  let viewportRect = $state({ x1: 0, y1: 0, x2: 0, y2: 0 });
  let usPath = $state("");

  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 120;

  // Setup Albers projection
  const projection = geoAlbers()
    .scale(250)
    .translate([MINIMAP_WIDTH / 2, MINIMAP_HEIGHT / 2])
    .rotate([98, 0])
    .center([0, 38]);

  const pathGenerator = geoPath().projection(projection);

  // Generate SVG path from GeoJSON
  function generatePath() {
    usPath = pathGenerator(usLower48.features[0]);
  }

  // Project a single point using Albers projection
  function projectPoint(lon, lat) {
    return projection([lon, lat]);
  }

  // Update viewport rectangle when map moves
  function updateViewport() {
    if (!map) return;
    bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    // Project corners using Albers
    const [x1, y1] = projectPoint(sw.lng, sw.lat);
    const [x2, y2] = projectPoint(ne.lng, ne.lat);

    // Handle cases where the viewport crosses the projection boundary
    const width = x2 - x1;
    const height = y2 - y1;

    viewportRect = {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(width),
      height: Math.abs(height),
    };
  }

  onMount(() => {
    if (!map) return;
    generatePath();
    map.on("move", updateViewport);
    updateViewport();

    return () => {
      map.off("move", updateViewport);
    };
  });
</script>

<div class="minimap">
  <svg
    width={MINIMAP_WIDTH}
    height={MINIMAP_HEIGHT}
    viewBox="0 0 {MINIMAP_WIDTH} {MINIMAP_HEIGHT}"
  >
    <!-- US outline using Albers projection -->
    <path d={usPath} fill="#eee" stroke="#666" stroke-width="1" />

    <!-- Viewport rectangle -->
    {#if bounds}
      <rect
        x={viewportRect.x}
        y={viewportRect.y}
        width={viewportRect.width}
        height={viewportRect.height}
        fill="rgba(0,0,0,0.2)"
        stroke="#000"
        stroke-width="1"
        id="viewport-rect"
      />
    {/if}
  </svg>
</div>

<style>
  .minimap {
    position: absolute;
    bottom: 20px;
    right: 20px;

    z-index: 1;
  }
</style>
