<script>
  import Block from "./Block.svelte";

  let { copy } = $props();
</script>

<Block cls="full no-margin">
  <div class="hero">
    <div class="art">
      <img src="images/webp/{copy.hero.src}" alt="" />
    </div>
    <figcaption>
      <span class="caption">{copy.hero.caption}</span>

      <span class="credit">{copy.hero.credit}</span>
    </figcaption>
  </div>
</Block>

<Block cls="content">
  <h1>{copy.meta.title}</h1>

  <p class="byline">
    By <a href="" target="_blank">James Eli Shiffer</a> and
    <a href="" target="_blank">Jared Whalen</a>
  </p>

  <p class="pubdate">April XX, 2025</p>
</Block>

<style lang="scss">
  .hero {
    .art {
      width: 100%;
      max-height: 800px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: bottom;
        display: block;
      }
    }

    figcaption {
      margin-top: 0.5rem;
      margin-right: 1rem;
      text-align: right;
    }
  }

  h1 {
    text-align: left;
    font-size: 2.6rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .byline {
    font-weight: bold;
    a {
      text-decoration: underline;
    }
  }

  .pubdate {
    font-size: 0.9rem;
    opacity: 0.6;
  }
</style>
