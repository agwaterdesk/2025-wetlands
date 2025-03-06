<script>
  let { src, alt, caption, credit, type } = $props();

  $inspect(src);
</script>

<figure>
  {#if type === "image"}
    <img src={`images/${src}`} {alt} />
  {:else if type === "video"}
    <video src={`videos/${src}`} {alt} autoplay muted  />
  {/if}
  {#if caption || credit}
    <figcaption>
      {#if caption}
        <span class="caption">{caption}</span>
      {/if}
      {#if credit}
        <span class="credit">{credit}</span>
      {/if}
    </figcaption>
  {/if}
</figure>

<style>
  figure {
    margin: 0;
    margin-top: 1rem;
    width: 100%;

    /* padding: 1rem 0px; */
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    border: 1px solid #ddd;
  }

  figcaption {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: #666;
  }

  .caption {
    display: block;
    margin-bottom: 0.25rem;
  }

  .credit {
    display: block;
    font-style: italic;
    font-size: 0.8125rem;
  }
</style>
