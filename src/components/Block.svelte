<script>
  let { cls = "", id = "" } = $props();
</script>

<div class="g-block {cls}" {id}>
  <div class="inner">
    <slot />
  </div>
</div>

<style>
  .g-block {
    margin-top: 2rem;
    margin-bottom: 2rem;
    position: relative;

    &.no-margin {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .content .inner {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .medium {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  /* Default (mobile) */
  .full {
    margin-left: -1rem;
    margin-right: -1rem;
    width: calc(100% + 2rem);
  }

  /* Medium screens */
  @media (min-width: 768px) {
    .full {
      margin-left: -2rem;
      margin-right: -2rem;
      width: calc(100% + 3rem);
    }
  }

  /* Large screens */
  @media (min-width: 1024px) {
    .full {
      margin-left: -5rem;
      margin-right: -5rem;
      width: calc(100% + 10rem);
    }
  }
</style>
