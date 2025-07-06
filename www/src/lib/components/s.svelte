<script lang="ts">
  let { truncated = true, class: classes } = $props<{ truncated?: boolean; class?: string }>();
</script>

<div class="relative {classes}">
  <span class="opacity-0" role="separator">sparklapse &lt;</span>
  <a class="absolute inset-0 group inline-flex font-bold" href="https://spkl.app">
    <span
      class="truncate text-clip transition-[max-width] delay-200 duration-200 group-hover:max-w-full {truncated
        ? 'max-w-[0.45em]'
        : 'max-w-full'}">sparklapse</span
    >
    <span>&lt;</span>
  </a>
</div>
