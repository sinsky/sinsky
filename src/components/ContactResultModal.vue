<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";
import FormButton from "@/components/form/FormButton.vue";
import AlertCircleIcon from "~icons/line-md/alert-circle-twotone?width=48px&height=48px";
import ConfirmCircleIcon from "~icons/line-md/confirm-circle-twotone?width=48px&height=48px";

const props = defineProps<{ type: "success" | "error" }>();
const emit = defineEmits<{ (e: "close"): void }>();

const id = useId();
const titleId = `${id}-title`;
const descriptionId = `${id}-description`;

const panel = ref<HTMLElement | null>(null);

const meta = computed(() =>
  props.type === "success"
    ? {
        icon: ConfirmCircleIcon,
        iconClass: "text-emerald-500",
        title: "送信完了",
        description: "確認後、返答いたします。",
      }
    : {
        icon: AlertCircleIcon,
        iconClass: "text-rose-500",
        title: "送信エラー",
        description: "お手数ですが、再度送信してください。",
      },
);

onMounted(() => {
  panel.value?.focus();
});
</script>

<template>
  <Teleport to="body">
    <Transition appear name="modal">
      <div
        data-modal-backdrop
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-6 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descriptionId"
          tabindex="-1"
          class="bubble-shape w-full max-w-sm bg-white/90 px-8 py-10 text-center shadow-md outline-none md:px-10"
          style="--bubble-duration: 16s"
          @keydown.escape="emit('close')"
        >
          <component
            :is="meta.icon"
            class="mx-auto mb-4"
            :class="meta.iconClass"
            aria-hidden="true"
          />
          <h3 :id="titleId" class="text-lg font-semibold text-slate-800">
            {{ meta.title }}
          </h3>
          <p :id="descriptionId" class="mt-2 text-sm leading-6 text-slate-600">
            {{ meta.description }}
          </p>
          <div class="mt-6">
            <FormButton type="button" @click="emit('close')">閉じる</FormButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
