<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
</script>

<template>
  <section class="flex flex-col items-center justify-center h-screen">
    <Avatar size="lg">
      <AvatarImage src="https://github.com/sinsky.png" alt="@sinsky" />
      <AvatarFallback>SS</AvatarFallback>
    </Avatar>
    <h1 class="text-3xl font-bold">sinsky.me</h1>
  </section>
</template>
