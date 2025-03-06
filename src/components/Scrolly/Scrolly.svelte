<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Block from "$components/Block.svelte";
  import Map from "./Map.svelte";
  import Slide from "./Slides/Slide.svelte";
  import InlineLegend from "./InlineLegend.svelte";
  import { mount, unmount } from "svelte";

  let { content, index, offset, progress } = $props();

  let controller = $derived(content.slides[index]?.controller);

  function hydrateInlineLegends(node) {
    const legendSpans = node.querySelectorAll("span[data-inline-legend-id]");
    // Keep track of all mounted components
    const mountedComponents = [];

    legendSpans.forEach((span) => {
      const id = span.getAttribute("data-inline-legend-id");
      const text = span.textContent;

      // Clear the original span content
      span.textContent = "";

      // Mount the InlineLegend component
      const component = mount(InlineLegend, {
        target: span,
        
        props: {
          id,
          text,
        },
      });
      mountedComponents.push(component);
    });

    return {
      destroy() {
        // We should unmount components when the node is removed
        mountedComponents.forEach(component => {
          if (component) {
            unmount(component);
          }
        });
      },
    };
  }
</script>

<Block cls="full">
  <Scroller top={0} bottom={0} bind:index bind:offset bind:progress>
    <div id="scroller-background" slot="background">
      <Map
        style="mapbox://styles/agwaterdesk/cm0fohozg00kr01qrc7pthcln"
        mapId="wetlands"
        {controller}
      />
    </div>

    <div id="scroller-foreground" slot="foreground">
      {#each content.slides as slide}
        <Slide {slide} {hydrateInlineLegends} />
      {/each}
    </div>
  </Scroller>
</Block>

<style>
  /* // :global {
    //   html,
    //   body {
    //     margin: 0px;
    //     padding: 0px;
    //   }
    // } */

  #scroller-background {
    background: #ddd;
    height: 100svh;
    width: 100%;
  }
</style>
