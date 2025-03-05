<script>
  let { cls = "" } = $props();
</script>

<div class="g-block {cls}">
  <div class="inner">
    <slot />
  </div>
</div>

<style>
  .g-block {
    margin-top: 1rem;
    margin-bottom: 1rem;
    position: relative;
  }

  .content .inner {
    width: 100%;
    max-width: 600px;
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
      width: calc(100% + 4rem);
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
