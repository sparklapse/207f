<script>
  import { ChevronRight, ExternalLink } from "lucide-svelte";
  import { siGithub } from "simple-icons";
</script>

<svelte:head>
  <title>Contribute - 207f</title>
</svelte:head>

<section class="mx-auto max-w-4xl">
  <div class="mb-8">
    <h3 class="mb-4 text-2xl font-semibold">Help improve Unicode normalization</h3>
    <p class="text-lg/7">
      Unicode is large and the possible combination of characters infinite. Creating sytems and maps to bring it all back to ascii takes a
      lot of time and brain power. If this project interests you and you'd like to support it, below are a few things you can do to help.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-2">
    <!-- Translations Tool -->
    <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
      <div class="mb-4">
        <h4 class="mb-2 text-xl font-semibold">Character Translations</h4>
        <p class="text-zinc-300">
          Find characters that look similar or identical and let us know. Don't need to know how to code or anything. Just a game of spot
          the difference.
        </p>
      </div>

      <div class="mb-4 rounded bg-zinc-900 p-4">
        <div class="flex items-center justify-center gap-4 font-mono text-sm">
          <span>A</span>
          <span class="text-zinc-400">/</span>
          <span>А</span>
        </div>
      </div>

      <a
        href="/207f/contrib/translations"
        class="inline-flex items-center rounded bg-blue-600 px-4 py-2 font-medium transition-colors hover:bg-blue-700"
      >
        Open Translations Tool
        <ChevronRight class="ml-2 h-4 w-4" />
      </a>
    </div>

    <div class="flex flex-col rounded-lg border border-zinc-700 bg-zinc-800 p-6">
      <div class="mb-4">
        <h4 class="text-xl font-semibold">Total Contributions</h4>
        <a class="text-zinc-400 transition-colors hover:text-white" href="#contributors">Contributors</a>
      </div>
      <div class="my-auto">
        <p class="text-center text-7xl">0</p>
      </div>
    </div>

    <div class="flex flex-col rounded-lg border border-zinc-700 bg-zinc-800 p-6">
      <div class="mb-4">
        <h4 class="mb-2 text-xl font-semibold">Report Findings</h4>
        <p class="text-zinc-300">
          Found a message in your Twitch chat, YouTube comments, or anywhere and it's getting past your moderation? Report it to us here and
          we'll use it to understand how it's getting past and if it's using and unicode trickery.
        </p>
      </div>

      <a
        href="/207f/contrib/report"
        class="mt-auto inline-flex w-fit items-center rounded bg-red-600 px-4 py-2 font-medium transition-colors hover:bg-red-700"
      >
        Report Text
        <ChevronRight class="ml-2 h-4 w-4" />
      </a>
    </div>

    <!-- Library Contributions -->
    <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
      <div class="mb-4">
        <h4 class="mb-2 text-xl font-semibold">Code Contributions</h4>
        <p class="text-zinc-300">
          Got some code knowledge or ideas for patterns, algorithms, or implementations? Come chat with us on GitHub.
        </p>
      </div>

      <div class="mb-4 rounded bg-zinc-900 p-4">
        <div class="flex items-center gap-2 font-mono text-sm text-zinc-400">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d={siGithub.path} />
          </svg>
          <span>github.com/sparklapse/207f</span>
        </div>
      </div>

      <a
        href="https://github.com/sparklapse/207f"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center rounded bg-zinc-700 px-4 py-2 font-medium transition-colors hover:bg-zinc-600"
      >
        View on GitHub
        <ExternalLink class="ml-2 h-4 w-4" />
      </a>
    </div>
  </div>
</section>
