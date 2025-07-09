<script lang="ts">
  import "$lib/styles/noto-fonts";
  import { onMount } from "svelte";
  import { authClient } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import toast from "svelte-french-toast";

  const unicode = import("$lib/unicode");

  let { data } = $props();

  let codeInput = $state(data.progress.last.toString());
  let translatedInput = $state("");
  let difference = $state(0);

  function charFromCode(code: string) {
    if (!code) return "";

    // Handle different input formats
    let codePoint: number;

    if (code.startsWith("U+") || code.startsWith("u+")) {
      codePoint = parseInt(code.slice(2), 16);
    } else if (code.startsWith("0x") || code.startsWith("0X")) {
      codePoint = parseInt(code.slice(2), 16);
    } else {
      codePoint = parseInt(code, 10);
    }

    if (isNaN(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
      return "";
    }

    return String.fromCodePoint(codePoint);
  }

  function getCharacterInfo(char: string) {
    if (!char) return null;

    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) return null;

    return {
      char,
      decimal: codePoint,
      hex: codePoint.toString(16).toUpperCase(),
      isAscii: codePoint >= 0x20 && codePoint <= 0x7f,
    };
  }

  function setCodeFromNumber(codePoint: number) {
    if (codePoint < 0 || codePoint > 0x10ffff) return;

    // Preserve the input format if possible
    if (codeInput.startsWith("U+") || codeInput.startsWith("u+")) {
      codeInput = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
    } else if (codeInput.startsWith("0x") || codeInput.startsWith("0X")) {
      codeInput = `0x${codePoint.toString(16).toUpperCase()}`;
    } else {
      codeInput = codePoint.toString(10);
    }
  }

  let char = $derived(charFromCode(codeInput));
  let codeInfo = $derived(char ? getCharacterInfo(char) : null);

  let canvas = $state<HTMLCanvasElement>();
  let ctx = $state<CanvasRenderingContext2D>();
  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d") ?? undefined;
  });

  const getCanvasValue = () => {
    if (!canvas || !ctx) return 0;
    const { width, height } = canvas;

    const [_r, _g, _b, ...pixels] = ctx.getImageData(0, 0, width, height).data;

    let textValue = 0;
    for (let p = 0; p + 3 < width * height * 4; p += 4) {
      textValue += pixels[p] / 255;
    }
    return textValue;
  };

  $effect(() => {
    if (!canvas || !ctx) return;

    const fonts = getComputedStyle(canvas).fontFamily;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `74px ${fonts}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = false;

    if (!char || !translatedInput) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillText(char, width / 2, height / 2);
    const textValue = getCanvasValue();
    ctx.globalCompositeOperation = "xor";
    ctx.fillText(translatedInput, width / 2, height / 2);
    const xorValue = getCanvasValue();

    difference = xorValue / textValue;
  });
</script>

<section class="mx-auto max-w-6xl">
  <header class="mb-4">
    <h2 class="text-xl">Contribute Translations</h2>
    <p>Help us know what characters look similar and can be directly translated.</p>
  </header>

  <div class="grid gap-4 rounded-lg border border-zinc-700 bg-zinc-800 p-6 md:grid-cols-2">
    <!-- Input Section -->
    <form
      class="flex flex-col gap-2"
      action="?/translate"
      method="post"
      use:enhance={() => {
        const id = toast.loading("Submitting translation...", { duration: Infinity });
        return ({ result }) => {
          if (result.type === "success") {
            toast.success("Translation submitted!", { id, duration: 7000 });
            if (codeInfo) {
              setCodeFromNumber(codeInfo.decimal + 1);
              translatedInput = "";
            }
          } else {
            toast.error("Failed to submit translation. Please try again or open an issue on GitHub.", { id, duration: 7000 });
          }
        };
      }}
    >
      <div>
        <label for="code-input" class="text-lg font-medium">Character Code</label>
        <input
          id="code-input"
          type="text"
          bind:value={codeInput}
          autocomplete="off"
          onkeydown={(ev) => {
            if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
              ev.preventDefault();
              if (!codeInfo) return;

              const increment = ev.key === "ArrowUp" ? 1 : -1;
              const newCodePoint = codeInfo.decimal + increment;

              setCodeFromNumber(newCodePoint);
            }
          }}
          placeholder="e.g., 41, 0x41, U+0041"
          class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 font-mono focus:border-zinc-400 focus:outline-none"
          required
        />
        <input name="code" type="hidden" value={codeInfo?.decimal} />
      </div>

      <div class="space-y-2 font-mono text-sm">
        <div class="flex justify-between">
          <span class="text-zinc-400">Hex:</span>
          <span>{codeInfo?.hex ?? "..."}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">Decimal:</span>
          <span>{codeInfo?.decimal ?? "..."}</span>
        </div>
      </div>

      <div>
        <label for="code-input" class="text-lg font-medium">Translates To</label>
        <input
          id="similar-input"
          name="translation"
          type="text"
          bind:value={translatedInput}
          placeholder="Type or paste a character"
          maxlength="4"
          class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 font-mono focus:border-zinc-400 focus:outline-none"
          required
          onkeydown={(ev) => {
            if (ev.key === "Tab" && codeInfo) {
              ev.preventDefault();
              setCodeFromNumber(codeInfo.decimal + 1);
            }
          }}
        />
      </div>

      <input type="hidden" name="difference" value={difference} />

      <div class="flex flex-col gap-2 md:mt-auto">
        {#if data.user}
          <div class="flex justify-between text-sm">
            <p class="text-zinc-400">{data.user.email}</p>
            <button
              class="cursor-pointer text-red-400/70 transition-colors hover:text-red-400"
              type="button"
              onclick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      goto("/207f/contrib", { invalidateAll: true });
                    },
                  },
                });
              }}
            >
              Sign out
            </button>
          </div>
          <button class="cursor-pointer rounded bg-blue-600 py-2 transition-colors hover:bg-blue-700" type="submit"
            >Submit Translation</button
          >
        {:else}
          <button
            class="cursor-pointer rounded bg-blue-600 py-2 transition-colors hover:bg-blue-700"
            type="button"
            onclick={() => {
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/207f/contrib/translations",
              });
            }}
          >
            Sign In to Submit
          </button>
        {/if}
      </div>
    </form>

    <!-- Comparison Section -->
    <div class="flex flex-col gap-2">
      <div class="grid grid-cols-2 gap-2">
        <div>
          <p class="font-semibold text-red-400">Character</p>
          <div class="rounded bg-zinc-900 p-6 text-center">
            <div class="font-noto mb-2 text-6xl">{char || "_"}</div>
          </div>
        </div>
        <div>
          <p class="font-semibold text-green-400">Translated</p>
          <div class="rounded bg-zinc-900 p-6 text-center">
            <div class="font-noto mb-2 text-6xl">{translatedInput || "_"}</div>
          </div>
        </div>
      </div>
      <div>
        <p class="font-semibold text-blue-400">Difference ({difference.toFixed(2)})</p>
        <canvas class="font-noto w-full rounded bg-zinc-900 p-6 text-center" height="100" bind:this={canvas}></canvas>
      </div>
      <div class="text-zinc-400">
        {#await unicode}
          <p class="text-sm">...</p>
          <p>Loading...</p>
        {:then unicode}
          <p class="text-sm">{codeInfo ? unicode.getBlockForCode(codeInfo.decimal)?.label : "NULL"}</p>
          <p class="truncate" title={codeInfo ? (unicode.characters.get(codeInfo.decimal) ?? "UNAMED CODE") : "NO CODE"}>
            {codeInfo ? (unicode.characters.get(codeInfo.decimal) ?? "UNAMED CODE") : "NO CODE"}
          </p>
        {/await}
      </div>
    </div>
  </div>

  <!-- Translation Progress -->
  {#await unicode}
    <p>Loading...</p>
  {:then unicode}
    {@const contribPercent = Math.min((data.progress.contrib / unicode.TOTAL_CODES) * 100, 100)}
    {@const confirmedPercent = Math.min((data.progress.confirmed / unicode.TOTAL_CODES) * 100, 100)}
    <div class="mt-7 flex flex-col gap-2">
      <h3 class="text-xl">Translation Progress <span class="text-zinc-400">(out of {unicode.TOTAL_CODES})</span></h3>
      <p class="sr-only">{contribPercent.toFixed(1)}%</p>
      <div aria-hidden="true">
        <div class="relative h-2 overflow-hidden rounded-full bg-zinc-800">
          <div class="absolute inset-y-0 left-0 rounded-full bg-blue-400" style="width: {Math.max(1, contribPercent)}%"></div>
          <div class="absolute inset-y-0 left-0 rounded-full bg-green-400" style="width: {Math.max(1, confirmedPercent)}%"></div>
        </div>
        <div class="flex text-sm font-medium">
          <div style="width: {contribPercent}%"></div>
          <p class="text-blue-400">{contribPercent.toFixed(4)}% contributed</p>
        </div>
        <div class="flex text-sm font-medium">
          <div style="width: {confirmedPercent}%"></div>
          <p class="text-green-400">{confirmedPercent.toFixed(4)}% confirmed</p>
        </div>
      </div>
    </div>
  {/await}
</section>
