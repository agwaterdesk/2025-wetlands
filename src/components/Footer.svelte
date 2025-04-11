<script>
  import Block from "$components/Block.svelte";
  import { base } from '$utils/constants';
  let { copy } = $props();

  let relatedStories = copy.footer.relatedStories;
</script>

<Block cls="full no-margin">
  <footer>
    <div class="container">
      {#if relatedStories.length > 0}
        <div class="related-section">
          <h2 class="font-utility-heading-06 text-text-secondary">
            More in this series
          </h2>

          <div class="related-grid">
            {#each relatedStories as story}
              <a href={story.url} class="story-card">
                {#if story.thumbnail}
                  <img src={base + story.thumbnail} alt={story.title} />
                {/if}
                <div class="text"> 
                  <h3 class="font-utility-body-reg-03 text-text-primary">
                    {story.title}
                  </h3>
                  <span
                    class="font-utility-label-reg-caps-03 text-text-secondary"
                  >
                    {story.outlet}
                  </span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <div class="about-section section">
        <div class="text">
          <h2 class="font-utility-heading-06 text-text-secondary">
            About this series
          </h2>
          <p>{@html copy.footer.about}</p>
        </div>

        <img src="images/Down the Drain Logo Composite.png" alt="" />
      </div>
    </div>
  </footer>
</Block>

<style lang="scss">
  footer {
    background-color: var(--bg-color);
    padding: 2rem 0 6rem;
    margin: 0 2rem;
    z-index: 1;
    @media (max-width: 768px) {
      margin: 0px 1rem;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    @media (max-width: 768px) {
      padding: 0px;
    }
  }

  h2 {
    // font-size: 1.5rem;
    margin-bottom: 1rem;
    // color: #333;
  }

  .about-section {
    display: flex;
    gap: 2rem;

    img {
      width: 100%;
      object-fit: contain;
      max-width: 50%;
    }

    @media (max-width: 580px) {
      flex-direction: column;

      img {
        max-width: 100%;
      }
    }
  }

  .about-section p {
    line-height: 1.6;
    // color: #666;
  }

  .related-section {
    margin-top: 2rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .story-card {
    text-decoration: none;
    color: inherit;
    background: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .story-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: top center;
  }

  .story-card .text {
    padding: 1rem;
    margin: 0;
    line-height: 1.75;
    // font-size: 1.1rem;
    // color: #333;
  }

  @media (max-width: 768px) {
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
