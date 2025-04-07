<script>
  import { layers } from "../../utils/map-layers";

  let { id, text } = $props();

  // Find the matching layer config
  const layerConfig = $derived(layers.find((layer) => layer.source.id === id));
  const coordinates = $derived(
    layerConfig?.source.data.features?.flatMap((feature) => {
      // Handle both single and multi-polygon geometries
      const coords = feature.geometry.coordinates;
      if (feature.geometry.type === "MultiPolygon") {
        return coords.flat(2); // Flatten to get all coordinate pairs
      } else {
        return coords[0]; // For single polygons, get the first ring
      }
    }) || []
  );
  const fillColor = $derived(
    layerConfig?.layers.find((l) => l.type === "fill")?.paint["fill-color"] ||
      layerConfig?.layers.find((l) => l.type === "circle")?.paint["circle-color"] ||
      "#ccc"
  );
  const strokeColor = $derived(
    layerConfig?.layers.find((l) => l.type === "line")?.paint["line-color"] ||
      "#666"
  );

  // Constants for the mini visualization
  const WIDTH = 40;
  const HEIGHT = 40;

  // Find the bounds
  const bounds = $derived(
    coordinates.reduce(
      (acc, coord) => {
        const x = coord[0];
        const y = coord[1];
        return {
          minX: Math.min(acc.minX, x),
          maxX: Math.max(acc.maxX, x),
          minY: Math.min(acc.minY, y),
          maxY: Math.max(acc.maxY, y),
        };
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    )
  );

  // Create SVG path from coordinates
  const points = $derived(
    coordinates.map(([x, y]) => {
      // Scale and translate points to fit in our SVG
      const xScale = WIDTH / (bounds.maxX - bounds.minX);
      const yScale = HEIGHT / (bounds.maxY - bounds.minY);
      const scale = Math.min(xScale, yScale) * 0.8; // 80% to add more padding

      // Center the shape
      const xOffset = (WIDTH - (bounds.maxX - bounds.minX) * scale) / 2;
      const yOffset = (HEIGHT - (bounds.maxY - bounds.minY) * scale) / 2;

      const px = (x - bounds.minX) * scale + xOffset;
      const py = HEIGHT - ((y - bounds.minY) * scale + yOffset); // Flip Y coordinates

      return `${px},${py}`;
    })
  );

  const svgPath = $derived(`M${points.join("L")}Z`);
</script>

<span class="legend-wrapper">
  <svg
    class="mini-map"
    width={WIDTH}
    height={HEIGHT}
    viewBox="0 0 {WIDTH} {HEIGHT}"
  >
    {#if id === "peat-bogs"}
      <!-- Show scattered circles for peat bogs -->
      <g>
        <circle cx="10" cy="20" r="3" fill={fillColor} stroke="black"/>
        <circle cx="20" cy="15" r="3" fill={fillColor} stroke="black"/>
        <circle cx="30" cy="25" r="3" fill={fillColor} stroke="black"/>
        <circle cx="15" cy="30" r="3" fill={fillColor} stroke="black"/>
        <circle cx="25" cy="10" r="3" fill={fillColor} stroke="black"/>
      </g>
    {:else}
      <path
        d={svgPath}
        fill={fillColor}
        fill-opacity="1"
        stroke="black"
        stroke-width="1"
      />
    {/if}
  </svg>
  <span class="text">{text}</span>
</span>

<style lang="scss">
  :global {
    span.legend-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background-color: #00000010;
      font-weight: 600;

      &.column {
        flex-direction: column;
        align-items: flex-start;

        .legend-item {
          display: grid;
          grid-template-columns: 40px 1fr;
          align-items: center;
          justify-items: end;
          gap: 0.5rem;

          .original-wetlands-leg {
            width: 40px;
            height: 20px;
            background-color: #f1b82daa;
            border: 1px solid #f1b82d;
          }

          .remaining-wetlands-leg {
            width: 30px;
            height: 10px;
            background-color: #66666650;
            border: 1px solid #666666;
          }
        }
      }
    }
  }

  .mini-map {
    display: inline-block;
    vertical-align: middle;
  }

  .text {
    display: inline-block;
    vertical-align: middle;
  }
</style>
