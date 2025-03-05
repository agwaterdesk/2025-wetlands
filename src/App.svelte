<script>
  import copy from "$data/copy.json";
  import Block from "$components/Block.svelte";
  import Scrolly from "$components/Scrolly/Scrolly.svelte";
  import Scroller from "@sveltejs/svelte-scroller";
  import Background from "./components/Scrolly/Map.svelte";

  let index, offset, progress;

  let viewportHeight = $state(window?.innerHeight ?? 0);

</script>

<svelte:window bind:innerHeight={viewportHeight} />

{#if viewportHeight}
  <main class="px-4 lg:px-20 pt-8" style:--viewport-height="{viewportHeight}px">
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

<style>
  main {
  }

  p {
    line-height: 1.4;
  }
</style>
