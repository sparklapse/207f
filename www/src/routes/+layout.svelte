<script lang="ts">
  import "@fontsource-variable/gabarito";
  import "$lib/styles/global.css";

  import S from "$lib/components/s.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <title>207f</title>
</svelte:head>

<div class="min-h-screen w-full max-w-4xl px-2">
  <header class="relative mt-4 mb-2 flex flex-col items-center gap-2 py-15 max-sm:py-12">
    <a href="/207f">
      <h1 class="flex w-fit flex-col border p-1 font-mono text-3xl max-sm:translate-x-[-50px] max-sm:text-5xl">
        <span>20</span>
        <span>7f</span>
      </h1>
    </a>
    <nav class="absolute ml-77 flex flex-col leading-snug max-sm:ml-20 max-sm:gap-0.5 max-sm:text-lg">
      <a class="text-zinc-400 transition-colors hover:text-white" href="/207f/contrib">Contribute</a>
      <a class="text-zinc-400 transition-colors hover:text-white" href="/207f/contrib/report">Report</a>
      <a class="text-zinc-400 transition-colors hover:text-white" href="/207f/docs">Docs</a>
      <S class="text-zinc-400 transition-colors hover:text-white" />
    </nav>
  </header>
  {@render children()}
</div>

<footer class="flex justify-center py-14">
  <div class="max-w-4xl">
    <p class="text-sm text-zinc-400">Made for you and the unvrs</p>
    <S />
  </div>
</footer>

<!-- background grid -->
<div class="absolute inset-x-0 top-[1rem] left-[13rem] -z-10 grid h-[64rem] justify-center">
  <svg
    class="h-[64rem] w-[175.5rem] [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)] stroke-white/20"
    aria-hidden="true"
  >
    <defs>
      <pattern id="e87443c8-56e4-4c20-9111-55b82fa704e3" width="200" height="200" patternUnits="userSpaceOnUse">
        <path d="M0.5 0V200M200 0.5L0 0.499983" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" stroke-width="0" fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)" />
  </svg>
</div>
