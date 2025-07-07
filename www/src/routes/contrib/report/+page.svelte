<script>
  import { Send, Check, AlertTriangle } from "lucide-svelte";
</script>

<svelte:head>
  <title>Report Text - 207f</title>
</svelte:head>

<section class="mx-auto max-w-4xl">
  <div class="mb-8">
    <h3 class="mb-4 text-2xl font-semibold">Report Problematic Text</h3>
    <p class="text-lg/7">
      Found text that's bypassing moderation or using Unicode trickery? Report it here to help us improve our normalization algorithms. Your
      reports help us identify new patterns and edge cases.
    </p>
  </div>

  <div class="grid gap-6 lg:grid-cols-3">
    <!-- Main Report Form -->
    <div class="lg:col-span-2">
      <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
        <h4 class="mb-4 text-xl font-semibold">Submit Report</h4>

        <form class="space-y-6">
          <!-- Text Input -->
          <div>
            <label for="reported-text" class="mb-2 block text-sm font-medium">
              Problematic Text <span class="text-red-400">*</span>
            </label>
            <textarea
              id="reported-text"
              rows="4"
              class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste the text that's causing issues..."
              required
            ></textarea>
          </div>

          <!-- Context -->
          <div>
            <label for="context" class="mb-2 block text-sm font-medium">
              Context <span class="text-zinc-400">(optional)</span>
            </label>
            <textarea
              id="context"
              rows="3"
              class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Where did you encounter this? What was it trying to bypass?"
            ></textarea>
          </div>

          <!-- Platform -->
          <div>
            <label for="platform" class="mb-2 block text-sm font-medium">Platform</label>
            <select
              id="platform"
              class="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select platform (optional)</option>
              <option value="twitch">Twitch</option>
              <option value="youtube">YouTube</option>
              <option value="discord">Discord</option>
              <option value="twitter">Twitter/X</option>
              <option value="reddit">Reddit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Category -->
          <fieldset>
            <legend class="mb-2 block text-sm font-medium">Issue Type</legend>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="category" value="lookalike" class="mr-2 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Lookalike characters (visual spoofing)</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="category" value="invisible" class="mr-2 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Invisible/zero-width characters</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="category" value="normalization" class="mr-2 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Normalization bypass</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="category" value="other" class="mr-2 text-blue-600 focus:ring-blue-500" />
                <span class="text-sm">Other Unicode trickery</span>
              </label>
            </div>
          </fieldset>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="inline-flex items-center rounded bg-red-600 px-6 py-2 font-medium transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:outline-none"
            >
              Submit Report
              <Send class="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sidebar Info -->
    <div class="space-y-6">
      <!-- Guidelines -->
      <div class="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
        <h4 class="mb-4 text-lg font-semibold">Reporting Guidelines</h4>
        <ul class="space-y-2 text-sm text-zinc-300">
          <li class="flex items-start gap-2">
            <Check class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
            <span>Include the exact text that's problematic</span>
          </li>
          <li class="flex items-start gap-2">
            <Check class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
            <span>Provide context about where you found it</span>
          </li>
          <li class="flex items-start gap-2">
            <Check class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
            <span>Explain what it was trying to bypass</span>
          </li>
          <li class="flex items-start gap-2">
            <AlertTriangle class="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
            <span>Don't include personal information</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
