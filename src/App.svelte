<script>
  import copy from "$data/copy.json";
  import Block from "$components/Block.svelte";
  import Hero from "$components/Hero.svelte";
  import Scrolly from "$components/Scrolly/Scrolly.svelte";
  import Footer from "$components/Footer.svelte";
  import SeriesRefer from "./components/SeriesRefer.svelte";
  import LossMap from "./components/graphics/LossMap.svelte";
  import "$styles/styles.scss";

  let index, offset, progress;

  let viewportHeight = $state(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  const components = {
    SeriesRefer,
    Scrolly,
    LossMap
  };
</script>

<svelte:window bind:innerHeight={viewportHeight} />

{#if viewportHeight}
  <main class="px-4 lg:px-20 pt-8" style:--viewport-height="{viewportHeight}px">
    <Hero {copy} />
    {#each copy.content as content}
      {#if content.type == "text"}
        {#each content.value.split("\n") as p}
          <Block cls="content"><p>{@html p}</p></Block>
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
    <Footer {copy} />
  </main>
{/if}

<style lang="scss">
  :global {
    p {
      line-height: 1.7;
    }

  
  }
</style>
