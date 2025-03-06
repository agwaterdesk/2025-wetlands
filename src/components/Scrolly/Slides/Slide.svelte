<script>
  import InlineMedia from "./InlineMedia.svelte";
  import { marked } from "marked";

  let { slide, hydrateInlineLegends } = $props();

  // Split text into paragraphs
  let paragraphs = $derived(slide?.text?.split("\n") || []);

  $inspect(slide?.component?.type);
</script>

<section>
  <div
    class="slide-content {slide.layout || 'default'}"
    use:hydrateInlineLegends
  >
    {#each paragraphs as p}
      {@html marked(p)}
    {/each}

    {#if slide.component}
      <div class="component-wrapper">
        {#if slide.component.type === "image" || slide.component.type === "video"}
          {@const component = slide.component}

          <InlineMedia
            src={component.src}
            alt={component.alt}
            caption={component.caption}
            credit={component.credit}
            type={component.type}
          />
        {:else if slide.component.type === "array"}
          <div class="flex-wrapper">
            {#each slide.component.images as item}
              <InlineMedia
                src={item.src}
                alt={item.alt}
                caption={item.caption}
                credit={item.credit}
                type={item.type}
              />
            {/each}
          </div>
        {/if}
        <!-- Add more component types here as needed -->
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding-top: 50vh;
    padding-bottom: 50vh;
  }

  .slide-content {
    border: 4px solid #fff;
    background: var(--bg-blue);
    padding: 2rem;
    width: 100%;
    /* margin: 0 auto 100vh; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);

    &.default {
      max-width: 650px;
    }

    &.wide {
      max-width: 1200px;
    }
  }

  .component-wrapper {
    width: 100%;
    margin: 0 auto;

    .flex-wrapper {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  }

  :global(h3) {
    line-height: 1.8;
    font-size: 1.5rem;
  }

  :global(p) {
    line-height: 1.8;
  }
</style>
