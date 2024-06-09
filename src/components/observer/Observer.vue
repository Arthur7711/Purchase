<template>
  <div ref="root" class="observer" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  options?: IntersectionObserverInit;
}>();

const emit = defineEmits<{
  (e: 'intersect'): void;
}>();

const observer = ref<IntersectionObserver | null>(null);
const root = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const options = props.options || {};

  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit('intersect');
    }
  }, options);

  if (root.value) observer.value.observe(root.value);
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});
</script>
