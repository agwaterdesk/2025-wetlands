<script>
  import InlineMedia from "./InlineMedia.svelte";
  import { marked } from "marked";

  let { slide, hydrateInlineLegends } = $props();

  // Split text into paragraphs
  let paragraphs = $derived(slide?.text?.split("\n") || []);


  let status = slide?.status?.split(":");

</script>

<section>
  <div
    class="slide-content {slide.layout || 'default'}"
    use:hydrateInlineLegends
  >

    {#if status}
      <div class="status level-{status[0]} text-text-primary">{status[1]}</div>
    {/if}

    {#each paragraphs as p}
      <p class="font-graphik-regular text-text-primary">{@html p}</p>
      <!-- {@html marked(p)} -->
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
    min-height: 100lvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 1rem;
    padding-top: 50vh;
    padding-bottom: 50vh;
    position: relative;
    // border-top: 1px solid #fff;

    &::after {
      content: "";
      position: absolute;
      bottom: 50dvh;
      right: 1px;
      width: 10px;
      height: 10px;
      background: white;
      opacity: 0.5;
      border-radius: 50%;
    }
  }

  .slide-content {
    // border: 4px solid #fff;
    background: var(--bg-color);
    padding: 2rem;
    width: 100%;
    margin-left: 2rem;
    /* margin: 0 auto 100vh; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);

    @media (max-width: 768px) {
      margin-left: 0.5rem;
      width: calc(100% - 1rem);
    }

    &.default {
      max-width: 450px;
    }

    &.wide {
      max-width: 1200px;
    }
  }

  .status {
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    display: inline-block;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    z-index: 20;

    &.level-1 {
      --status-bg-fill: #6da34d;
    }

    &.level-2 {
      --status-bg-fill: #f1b82d;
    }
    &.level-3 {
      --status-bg-fill: #e76f51;
    }

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      background: var(--status-bg-fill);
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.5;
      z-index: -1;
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


  :global(p strong) {
    font-family: "graphik-bold";
  }

  :global(figcaption span) {
    font-family: graphik-regular, sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.2;
    color: #434343;

  }

  :global {
    .slide-content {
      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .original-wetlands {

        border-bottom: 2px solid var(--project-color-yellow);;
        // border: 2px solid var(--project-color-yellow);
      }

      .remaining-wetlands {
        border-bottom: 2px solid #333333;
        // border: 2px solid #666;
      }
    }

  }
</style>
