<script>
  import Block from "$components/Block.svelte";
  let { copy } = $props();

  let relatedStories = copy.footer.relatedStories;
</script>

<Block cls="full no-margin">
  <footer>
    <div class="container">
      <div class="about-section">
        <div class="text">
          <h2>About this series</h2>
          <p>{copy.footer.about}</p>
        </div>

        <img src="images/Down the Drain Logo Composite.png" alt="" />
      </div>

      {#if relatedStories.length > 0}
        <div class="related-section">
          <h2>More in this series</h2>
          <div class="related-grid">
            {#each relatedStories as story}
              <a href={story.url} class="story-card">
                {#if story.thumbnail}
                  <img src={story.thumbnail} alt={story.title} />
                {/if}
                <h3>{story.title}</h3>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </footer>
</Block>

<style lang="scss">
  footer {
    background-color: var(--bg-color);
    padding: 2rem 0;

    z-index: 1;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .about-section {
    margin-bottom: 3rem;
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
    color: #666;
  }

  .related-section {
    margin-top: 2rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .story-card {
    text-decoration: none;
    color: inherit;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }

  .story-card:hover {
    transform: translateY(-4px);
  }

  .story-card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }

  .story-card h3 {
    padding: 1rem;
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  @media (max-width: 768px) {
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
