<script>
  const { current, numSlides } = $props();

  const onClick = (e) => {
    // current.slide = parseInt(e.target.id.split("-")[2], 10);
  };
</script>

<div class="chapters">
  {#each Array.from({ length: numSlides }, (_, i) => i) as i}
    <button id="go-to-{i}" onclick={onClick}>
      <div class="bar" class:active={current === i} />
    </button>
  {/each}
</div>

<style>
  .chapters {
    width: calc(100% - 2rem);
    margin: 0 auto;
    left: 0;
    right: 0;
    position: absolute;
    top: 0.5rem;
    display: flex;
    gap: 2px;
    z-index: 1000;

    padding: 0 1rem;
    height: 1rem;
  }

  button {
    background: none;
    padding: 0;
    border-radius: 0;
    flex: 1;
    height: 100%;
  }

  button:hover .bar {
    opacity: 0.5;
  }

  .bar {
    width: 100%;
    height: 8px;
    background: var(--project-color-yellow);
    opacity: 0.3;
    pointer-events: none;
  }

  .active {
    opacity: 1;
  }
</style>
