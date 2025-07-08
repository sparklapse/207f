<script lang="ts">
  const UNSAFE_CHARS: Record<number, string> = {
    [0x202e]: "RTL",
  };

  function getCharacterCodes(text: string) {
    return Array.from(text).map((char) => {
      const code = char.codePointAt(0);
      const hex = code?.toString(16).toUpperCase() || "";
      const isInRange = code !== undefined && code >= 0x20 && code <= 0x7f;
      return {
        char: UNSAFE_CHARS[code ?? -1] ?? char,
        hex,
        isInRange,
      };
    });
  }
</script>

{#snippet example(title: string, description: string, original: string, processed: string)}
  <div class="rounded-lg border border-zinc-700 bg-zinc-800/50 p-6">
    <div class="mb-4">
      <h4 class="text-xl font-medium">{title}</h4>
      <p class="text-zinc-400">{description}</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-3">
        <p class="font-semibold text-red-400">Original:</p>
        <div class="rounded bg-zinc-900 p-4 font-mono text-lg">
          {original}
        </div>
        <div class="font-mono text-xs text-zinc-400">
          {#each getCharacterCodes(original) as { char, hex, isInRange }}
            <span class="mr-2 inline-block {isInRange ? 'text-green-400' : 'text-red-400'}">
              {char}: {hex}
            </span>
          {/each}
        </div>
      </div>
      <div class="space-y-3">
        <p class="font-semibold text-green-400">207f processed:</p>
        <div class="rounded bg-zinc-900 p-4 font-mono text-lg">
          {processed}
        </div>
        <div class="font-mono text-xs text-zinc-400">
          {#each getCharacterCodes(processed) as { char, hex, isInRange }}
            <span class="mr-2 inline-block {isInRange ? 'text-green-400' : 'text-red-400'}">
              {char}: {hex}
            </span>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/snippet}

<!-- Info -->
<section>
  <div>
    <h2 class="mt-2 flex flex-col text-4xl font-semibold">Read what people see</h2>
    <p class="mt-6 max-w-lg">
      207f is a processing library to not just strip unicode characters, but translate it back to an ascii representation that users will
      infer meaning from.
    </p>
  </div>

  <div class="mx-auto py-16">
    <div class="mb-8">
      <h2 class="mb-2 text-4xl font-semibold sm:text-right">The problem in action</h2>
      <p class="max-w-lg sm:ml-auto sm:text-right">
        Unicode has almost 150,000+ code points as of version 16. These are just some of the common "obfuscation" methods you'll see but
        there might even be some that aren't know yet.
      </p>
    </div>

    <!-- Examples -->
    <div class="flex flex-col gap-4">
      {@render example(
        "Identical characters & Diacritical Marks",
        "Characters sometimes look identical, but even if they have an accent, people know what the text is saying. However your blacklist has never seen it before.",
        "\u{4D1}sc\u{456}\u{456}",
        "ascii",
      )}

      <!-- svelte-ignore bidirectional_control_characters -->
      {@render example(
        "Direction Changes",
        "Languages are written in both Left to Right, and Right to Left. But nothing is stopping you from changing the text direction and then just writing your message in reverse.",
        "\u{202E}kcab",
        "back",
      )}
    </div>
  </div>
</section>
