<script>
  import Block from "./Block.svelte";
  let { copy } = $props();

  // Group by section title
  let grouped = {};

  console.log(copy.credits);

  copy.credits.forEach((entry) => {
    if (!grouped[entry.title]) {
      grouped[entry.title] = [];
    }
    grouped[entry.title].push({
      name: entry.people,
      org: entry.organization,
    });
  });
</script>

<Block cls="wide">
  <div class="credits">
    {#each Object.entries(grouped) as [title, people]}
      <div class="credit-section">
        <h3>{title}</h3>
        <ul>
          {#each people as person}
            <li>{person.name}, <em>{person.org}</em></li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</Block>

<style>
  .credits {
    font-family: sans-serif;
    margin: 5rem 0 2.5rem;
    font-size: 0.9rem;
    padding: 0 1rem;
  }
  .credit-section {
    margin-bottom: 1rem;
  }
  h3 {
    margin: 0 0 0.25rem;
    font-size: 0.9rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  ul {
    padding-left: 0;
    margin: 0;
  }
  li {
    list-style: none;
    margin-bottom: 0.5rem;
    font-weight: normal;
  }
  li em {
    font-style: normal;
    color: #666;
  }
</style>
