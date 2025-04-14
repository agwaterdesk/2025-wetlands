<script>
  import { base } from '$utils/constants';
  import Block from "$components/Block.svelte";
</script>

<Block cls="medium">
  <div class="series-refer">
    <img
      src="{base}icons/ag-water-logo.webp"
      alt="Mississippi River Ag & Water Desk logo"
    />
    <p class="">
      Published in collaboration with the <a
        href="https://agwaterdesk.org/"
        target="_blank">Mississippi River Ag & Water Desk</a
      >
      as part of their series
      <a href="https://agwaterdesk.org/2025/04/14/down-the-drain/" target="_blank"
        >"Down the Drain: A watershed moment for America's greatest wetlands."</a
      >
    </p>
  </div>
</Block>

<style lang="scss">
  .series-refer {
    height: 100%;
    padding: 1rem 0px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--project-color-teal);
    border-bottom: 1px solid var(--project-color-teal);
    gap: 2rem;
    align-items: center;
    text-align: left;
    font-family: "graphik-regular";

    img {
      width: 100%;
      max-width: 300px;
      height: auto;
      object-fit: contain;
    }

    p {
      max-width: 600px;
      line-height: 1.5;
      font-size: 0.9rem;
      color: var(--project-color-teal);

      a {
        text-decoration: underline;
      }
    }

    @media (min-width: 580px) {
      flex-direction: row;
      text-align: left;
    }
  }
</style>
