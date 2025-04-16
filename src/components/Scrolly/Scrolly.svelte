<script>
  import { onMount } from "svelte";
  import Scroller from "@sveltejs/svelte-scroller";
  import Block from "$components/Block.svelte";
  import Map from "./Map.svelte";
  import Slide from "./Slides/Slide.svelte";
  import InlineLegend from "./InlineLegend.svelte";
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

  let headerHeight = $state(0);
  const windowHeight = $derived(window.innerHeight || 0);

  onMount(() => {
    headerHeight = document.querySelector("#global-header")?.clientHeight || 0;
  });
</script>

<Block cls="full" id="scroller-block">
  <Scroller
    top={headerHeight / windowHeight}
    bottom={1}
    bind:index
    bind:offset
    bind:progress
  >
    <div
      id="scroller-background"
      slot="background"
      style:--header-height="{headerHeight}px"
    >
      <Chapters current={index} numSlides={content.slides.length} />

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
</style>
