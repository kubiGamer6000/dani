<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  export let path: string;
  let crumbs: Array<{ label: string; href: string }> = [];

  $: {
    // Remove zero-length tokens.
    const tokens = path.split("/").filter((t) => t !== "");

    // Create { label, href } pairs for each token.
    let tokenPath = "";
    crumbs = tokens.map((t) => {
      tokenPath += "/" + t;
      t = t.charAt(0).toUpperCase() + t.slice(1);
      return { label: t, href: tokenPath };
    });

    // // Add a way to get home too.
    // crumbs.unshift({ label: "Home", href: "/" });
  }
</script>

<div class="breadcrumb">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      {#each crumbs as c, i}
        {#if i == crumbs.length - 1}
          <Breadcrumb.Item>
            <Breadcrumb.Page>{c.label}</Breadcrumb.Page>
          </Breadcrumb.Item>
        {:else}
          <Breadcrumb.Item>
            <Breadcrumb.Link href={c.href}>{c.label}</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
        {/if}
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>
