<script lang="ts">
  import "$lib/styles/noto-fonts";
  import { onMount } from "svelte";
  import { authClient } from "$lib/auth";
  import { goto } from "$app/navigation";

  let { data } = $props();

  let codeInput = $state("0x133");
  let translatedInput = $state("ij");
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
    } else if (/^[0-9a-fA-F]+$/.test(codeInput)) {
      codeInput = codePoint.toString(16).toUpperCase();
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

  const getPixelValue = (x: number, y: number) => {
    if (!ctx) return 0;
    const [_r, _g, _b, a] = ctx.getImageData(x, y, 1, 1).data;
    return a / 255;
  };

  const getCanvasValue = () => {
    if (!canvas || !ctx) return 0;
    const { width, height } = canvas;

    let textValue = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        textValue += getPixelValue(x, y);
      }
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
    <div class="flex flex-col gap-2">
      <div>
        <label for="code-input" class="text-lg font-medium">Character Code</label>
        <input
          id="code-input"
          type="text"
          bind:value={codeInput}
          onkeydown={(ev) => {
            if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
              ev.preventDefault();

              const char = charFromCode(codeInput);
              if (!char) return null;
              const code = char.codePointAt(0);
              if (!code) return;

              const increment = ev.key === "ArrowUp" ? 1 : -1;
              const newCodePoint = code + increment;

              setCodeFromNumber(newCodePoint);
            }
          }}
          placeholder="e.g., 41, 0x41, U+0041"
          class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 font-mono focus:border-zinc-400 focus:outline-none"
        />
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
        <div class="flex justify-between">
          <span class="text-zinc-400">ASCII:</span>
          <span class={codeInfo === null ? "text-white" : codeInfo?.isAscii ? "text-green-400" : "text-red-400"}>
            {codeInfo === null ? "..." : codeInfo?.isAscii ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <div>
        <label for="code-input" class="text-lg font-medium">Translates To</label>
        <input
          id="similar-input"
          type="text"
          bind:value={translatedInput}
          placeholder="Type or paste a character"
          maxlength="4"
          class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 font-mono focus:border-zinc-400 focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-2 md:mt-auto">
        {#if data.user}
          <div class="flex justify-between text-sm">
            <p class="text-zinc-400">{data.user.email}</p>
            <button
              class="cursor-pointer text-red-400/70 transition-colors hover:text-red-400"
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
          <button class="cursor-pointer rounded bg-blue-600 py-2 transition-colors hover:bg-blue-700">Submit Translation</button>
        {:else}
          <button
            class="cursor-pointer rounded bg-blue-600 py-2 transition-colors hover:bg-blue-700"
            onclick={() => {
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/207f/contrib",
              });
            }}
          >
            Sign In to Submit
          </button>
        {/if}
      </div>
    </div>

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
    </div>
  </div>
</section>
