<script>
  import { onMount } from "svelte";
  import copy from "$data/copy.json";
  import Block from "$components/Block.svelte";
  import Hero from "$components/Hero.svelte";
  import Scrolly from "$components/Scrolly/Scrolly.svelte";
  import Footer from "$components/Footer.svelte";
  import SeriesRefer from "./components/SeriesRefer.svelte";
  import LossMap from "./components/graphics/LossMap.svelte";
  import Credits from "$components/Credits.svelte";
  import "$styles/styles.scss";

  let index, offset, progress;

  let viewportHeight = $state(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  onMount(() => {
    setTimeout(() => {
      document.querySelector("#proj-container .pt-8").style.paddingTop = "0rem";
    }, 500);
  });

  const components = {
    SeriesRefer,
    Scrolly,
    LossMap,
  };
</script>

<svelte:window bind:innerHeight={viewportHeight} />

<!-- For testing purposes -->
<!-- <header id="global-header"></header> -->

{#if viewportHeight}
  <main class="px-4 lg:px-20 pt-8" style:--viewport-height="{viewportHeight}px">
    <Hero {copy} />
    {#each copy.content as content}
      {#if content.type == "text"}
        {#each content.value.split("\n") as p}
          <Block cls="content"
            ><p class="font-graphik-regular text-text-primary">
              {@html p}
            </p></Block
          >
        {/each}
      {:else if content.type == "component"}
        <svelte:component
          this={components[content.id]}
          {content}
          {index}
          {offset}
          {progress}
        />
      {/if}
    {/each}
    <Credits {copy} />
    <Footer {copy} />
  </main>
{/if}

<style lang="scss">
  #global-header {
    height: 80px;
    background-color: var(--project-color-teal);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    width: 100%;
  }
  :global {
    p {
      line-height: 1.7;
      b {
        font-family: "graphik-bold";
        font-weight: 500;
      }

      strong {
        font-family: "graphik-bold";
        font-weight: 500;
      }
    }
  }
</style>
