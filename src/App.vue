<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <router-view></router-view>
  <Toaster richColors closeButton />
</template>
