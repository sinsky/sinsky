<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import "@/assets/index.css";
</script>

<template>
  <slot />
  <Toaster richColors closeButton />
</template>
