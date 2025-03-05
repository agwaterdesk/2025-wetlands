<script>
  import Scroller from "@sveltejs/svelte-scroller";
  import Block from "$components/Block.svelte";
  import Map from "./Map.svelte";
  import Slide from "./Slides/Slide.svelte";

  let { content, index, offset, progress } = $props();

  let controller = $derived(content.slides[index]?.controller);
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
        <Slide {slide} />
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
