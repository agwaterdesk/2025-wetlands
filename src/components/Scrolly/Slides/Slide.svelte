<script>
  import InlineImage from "./InlineImage.svelte";
  import { marked } from "marked";

  let { slide } = $props();

  // Split text into paragraphs
  let paragraphs = $derived(slide?.text?.split("\n") || []);

  $inspect(slide?.component?.type);
</script>

<section>
  <div class="g-text-box">
    {#each paragraphs as p}
      {@html marked(p)}
    {/each}

    {#if slide.controller.component}
      <div class="component-wrapper">
        {#if slide.controller.component.type === "image"}
          {@const component = slide.controller.component}

          <InlineImage
            src={component.src}
            alt={component.alt}
            caption={component.caption}
            credit={component.credit}
          />
        {/if}
        <!-- Add more component types here as needed -->
      </div>
    {/if}
  </div>
</section>

<style>
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

  .g-text-box {
    border: 1px solid #888;
    background: #fff;
    padding: 1rem;
    width: 100%;
    max-width: 600px;
    /* margin: 0 auto 100vh; */
  }

  .component-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  :global(h3) {
    line-height: 1.8;
    font-size: 1.5rem;
  }

  :global(p) {
    line-height: 1.8;
  }
</style>
