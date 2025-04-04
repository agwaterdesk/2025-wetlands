<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Block from "$components/Block.svelte";
  import Map from "./Map.svelte";
  import Slide from "./Slides/Slide.svelte";
  import InlineLegend from "./InlineLegend.svelte";
  import LossMap from "$components/graphics/LossMap.svelte";
  import Chapters from "./Chapters.svelte";
  import { mount, unmount } from "svelte";
  import { fade } from "svelte/transition";

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
        mountedComponents.forEach((component) => {
          if (component) {
            unmount(component);
          }
        });
      },
    };
  }
</script>

<Block cls="full" id="scroller-block">
  <Scroller top={0} bottom={1} bind:index bind:offset bind:progress>
    <div id="scroller-background" slot="background">
      <Chapters current={index} numSlides={content.slides.length} />

      {#if controller.type == "graphic"}
        <div class="graphic-container" transition:fade>
          <LossMap />
        </div>
      {/if}

      <Map
        style="mapbox://styles/startribune/cm8hhq3e6017901s55dfi5dmn"
        mapId="wetlands-map"
        {controller}
        {content}
      />
    </div>

    <div id="scroller-foreground" slot="foreground">
      {#each content.slides as slide}
        <Slide {slide} {hydrateInlineLegends} />
      {/each}
    </div>
  </Scroller>
</Block>

<style lang="scss">
  /* // :global {
    //   html,
    //   body {
    //     margin: 0px;
    //     padding: 0px;
    //   }
    // } */

  :global {
    #scroller-block {
      margin-top: 4rem;
      overflow: hidden;
    }
  }

  #scroller-background {
    background: #ddd;
    height: 100svh;
    width: 100%;
  }

  .graphic-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #081521;
    z-index: 100;
  }
</style>
