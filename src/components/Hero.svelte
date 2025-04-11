<script>
  const base =
    "https://static.startribune.com/news/projects/all/20250414-wetlands-landing-page/";
  import Block from "./Block.svelte";

  let { copy } = $props();
</script>

<Block cls="full no-margin">
  <div class="hero">
    <div class="art">
      <img src="{base}images/webp/{copy.hero.src}" alt="" />
    </div>
    <figcaption class="font-utility-meta-reg-02 text-text-secondary">
      <span class="caption">{copy.hero.caption}</span>

      <span class="credit">{copy.hero.credit}</span>
    </figcaption>
  </div>
</Block>

<Block cls="content">
  <h1 class="font-editorial-news-heading-01 text-text-primary text-pretty">
    {@html copy.meta.title}
  </h1>

  <p class="byline font-utility-label-bold-02 text-text-primary mb-2">
    {@html copy.meta.byline}
  </p>

  <p class="pubdate font-utility-label-reg-caps-03 text-text-secondary">
    {@html copy.meta.pubdate}
  </p>
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

  :global {
    .byline {
      a {
        text-decoration: underline;
      }
    }
  }

  h1 {
    text-align: left;

    // font-size: 4rem;
    // font-weight: 700;
    margin-bottom: 2rem;
  }

  svg {
    width: 180px;
    margin: 2rem auto;
    opacity: 0.8;

    path {
      fill: var(--project-color-teal);
    }
  }

  // .byline {
  //   font-weight: bold;
  //   a {
  //     text-decoration: underline;
  //   }
  // }

  // .pubdate {
  //   font-size: 0.9rem;
  //   opacity: 0.6;
  // }
</style>
