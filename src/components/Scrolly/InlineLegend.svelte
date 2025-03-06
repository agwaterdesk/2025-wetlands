<script>
  import { layers } from "../../utils/map-layers";

  let { id, text } = $props();

  // Find the matching layer config
  const layerConfig = $derived(layers.find((layer) => layer.source.id === id));
  const coordinates = $derived(layerConfig?.source.data.features[0].geometry.coordinates[0] || []);
  const fillColor = $derived(
    layerConfig?.layers.find((l) => l.type === "fill")?.paint["fill-color"] || "#ccc"
  );
  const strokeColor = $derived(
    layerConfig?.layers.find((l) => l.type === "line")?.paint["line-color"] || "#666"
  );

  // Constants for the mini visualization
  const WIDTH = 40;
  const HEIGHT = 40;

  // Find the bounds
  const bounds = $derived(coordinates.reduce(
    (acc, [x, y]) => ({
      minX: Math.min(acc.minX, x),
      maxX: Math.max(acc.maxX, x),
      minY: Math.min(acc.minY, y),
      maxY: Math.max(acc.maxY, y)
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  ));

  // Create SVG path from coordinates
  const points = $derived(coordinates.map(([x, y]) => {
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
  }));

  const svgPath = $derived(`M${points.join('L')}Z`);
</script>

<span class="legend-wrapper">
  <svg
    class="mini-map"
    width={WIDTH}
    height={HEIGHT}
    viewBox="0 0 {WIDTH} {HEIGHT}"
  >
    <path
      d={svgPath}
      fill={fillColor}
      fill-opacity="0.3"
      stroke={strokeColor}
      stroke-width="1"
    />
  </svg>
  <span class="text">{text}</span>
</span>

<style lang="scss">
  .legend-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: #00000020;
    font-weight: 600;
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
