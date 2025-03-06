<script>
  import copy from "$data/copy.json";
  import Block from "$components/Block.svelte";
  import Scrolly from "$components/Scrolly/Scrolly.svelte";
  import Scroller from "@sveltejs/svelte-scroller";
  import Background from "./components/Scrolly/Map.svelte";
  import "$styles/styles.scss";

  let index, offset, progress;

  let viewportHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 0);
</script>

<svelte:window bind:innerHeight={viewportHeight} />

{#if viewportHeight}
  <main class="px-4 lg:px-20 pt-8" style:--viewport-height="{viewportHeight}px">

    <h1>TKTK</h1>

    {#each copy.content as content}
      {#if content.type == "text"}
        {#each content.value.split("\n") as p}
          <Block cls="content"><p>{p}</p></Block>
        {/each}
      {:else if content.type == "scrolly"}
        <Scrolly {content} {index} {offset} {progress} />
      {/if}
    {/each}
  </main>
{/if}

<style lang="scss">
  main {

    h1  {
      text-align: center;
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }
  }

  :global {
    p {
      line-height: 1.7;
    }
  }
</style>
