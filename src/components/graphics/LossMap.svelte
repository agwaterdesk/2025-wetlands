<script>
  import { onMount } from "svelte";
  import { feature } from "topojson-client";
  import Block from "$components/Block.svelte";
  import { geoAlbersUsa, geoPath, geoCentroid } from "d3-geo";
  import statesData from "../../data/states-10m.json";
  import stateAbbreviations from "../../data/state-names.json";

  let us = feature(statesData, statesData.objects.states);
  let stateNames = stateAbbreviations;

  const boxes = [
    {
      name: "Original Wetlands (1780s)",
      color: "#548687",
      strokeWidth: 0,

      coords: [
        [-102, 37],
        [-83.06, 42],
      ],
    },
    {
      name: "Remaining Wetlands (1980s)",
      color: "#333333CC",
      strokeDasharray: "1 1",
      strokeWidth: 1,
      coords: [
        [-102, 37],
        [-93.14, 42],
      ],
    },
  ];

  let projection;
  let container;
  let width = 0;
  let height = 0;
  let currentProjection;

  // Reset projection when size changes
  $: {
    if (width && height) {
      projection = null; // Force recalculation of projection
      currentProjection = getProjection(); // Get new projection with new dimensions
    }
  }

  $: if (container) {
    width = container.clientWidth;
    height = container.clientHeight || width * 0.6;
  }

  onMount(() => {
    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (container) {
        width = container.clientWidth;
        height = container.clientHeight || width * 0.6;
      }
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  });

  function getProjection() {
    if (!projection) {
      projection = geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(Math.min(width, height) * 2);
    }
    return projection;
  }

  // Calculate viewBox for Midwest region
  function getMidwestViewBox() {
    if (!width || !height) return "0 0 800 500";
    const proj = currentProjection;
    const sw = proj([-102, 37]);
    const ne = proj([-83.06, 42]);
    if (!sw || !ne) return "0 0 800 500";

    const padding = Math.min(width, height) * 0.04;
    const x = sw[0] - padding;
    const y = ne[1] - padding;
    const w = ne[0] - sw[0] + padding * 2;
    const h = sw[1] - ne[1] + padding * 2;

    return `${x} ${y} ${w} ${h}`;
  }

  function project(coord) {
    return currentProjection(coord);
  }
</script>

<Block cls="medium">
  <div class="graphic-wrapper">
    <div class="graphic-text">
      <h3 class="font-utility-heading-04 text-text-primary mb-2">
        Visualizing the shrinking footprint of U.S. wetlands
      </h3>
      <p class="font-graphik-regular text-text-primary">
        More than half of the United State's wetlands have since been drained,
        filled, or altered—reshaping ecosystems and affecting everything from
        flood control to biodiversity. This map uses representative rectangles
        to illustrate the dramatic loss of wetlands over the past two centuries.
        The
        <span class="original-wetlands">larger&nbsp;rectangle</span>
        shows an area similar in size to the estimated extent of wetlands around
        the 1780s—before widespread development and agricultural expansion—covering
        about
        <b>221 million acres</b>. The
        <span class="remaining-wetlands">smaller&nbsp;rectangle</span>
        represents how much remained by the 1980s: just
        <b>103 million acres</b>.
      </p>
    </div>
    <div class="viz" bind:this={container}>
      <svg {width} {height} viewBox={getMidwestViewBox()}>
        {#if us && currentProjection}
          {#key us}
            <g>
              {@html us.features
                .map(
                  (f) =>
                    `<path d="${geoPath().projection(currentProjection)(f)}" fill="none" stroke="#F7F2DE" stroke-width="0.5"/>`
                )
                .join("")}

              {#each us.features as feature}
                {@const centroid = geoCentroid(feature)}
                {@const projected = currentProjection(centroid)}
                {@const stateName = stateNames[feature.id]}
                {#if stateName && projected}
                  <text
                    x={projected[0]}
                    y={projected[1]}
                    class="state-name"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="5px"
                    font-weight="light"
                    fill="#777"
                  >
                    {stateName}
                  </text>
                {/if}
              {/each}

              {#each boxes as box}
                {@const start = currentProjection(box.coords[0])}
                {@const end = currentProjection(box.coords[1])}
                <rect
                  x={start[0]}
                  y={end[1]}
                  width={end[0] - start[0]}
                  height={start[1] - end[1]}
                  fill={box.color}
                  fill-opacity="0.3"
                  stroke={box.color}
                  stroke-width={box.strokeWidth}
                  stroke-dasharray={box.strokeDasharray}
                />
                {#if box.name === "Remaining Wetlands (1980s)"}
                  <text
                    x={start[0] + (end[0] - start[0]) / 2}
                    y={end[1] + (start[1] - end[1]) / 2}
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="6px"
                    font-weight="bold"
                    fill="#333"
                  >
                    <tspan x={start[0] + (end[0] - start[0]) / 2} dy="-4"
                      >Equivalent area of</tspan
                    >
                    <tspan x={start[0] + (end[0] - start[0]) / 2} dy="8"
                      >remaining wetlands</tspan
                    >
                  </text>
                {/if}
              {/each}
            </g>
          {/key}
        {/if}
      </svg>
    </div>
    <figcaption>
      <span class="credit font-utility-meta-reg-02 text-text-secondary"
        >Data: <a
          href="https://water.usgs.gov/nwsum/WSP2425/history.html"
          target="_blank">USGS</a
        >
      </span>
    </figcaption>
  </div>
</Block>

<style lang="scss">
  .graphic-text {
    margin-bottom: 1rem;
    span {
      border: 3px solid;
      padding: 1px 0.25rem;
    }
    // h3 {
    //   font-weight: bold;
    // }

    .original-wetlands {
      border-color: var(--project-color-teal);
    }

    .remaining-wetlands {
      border-color: #666;
      border-style: dotted;
    }
  }

  .viz {
    width: 100%;
    height: 100%;
    aspect-ratio: 1.6;
  }

  svg {
    width: 100%;
    height: 100%;

    text.state-name {
      text-transform: uppercase;
    }
  }

  figcaption {
    text-align: right;
    float: right;
  }
</style>
