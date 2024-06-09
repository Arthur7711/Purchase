<script setup lang="ts">
import Success from '../icons/Success.vue'

const props = defineProps<{
  title: string
}>()
</script>
<template>
  <div class="success_box">
    <Success />
    <p>{{ props.title }}</p>
  </div>
</template>
<style scoped lang="scss">
.success_box {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid rgba(104, 159, 56, 0.3);
  background: linear-gradient(0deg, rgba(104, 159, 56, 0.3), rgba(104, 159, 56, 0.3)),
    linear-gradient(0deg, rgba(104, 159, 56, 0.1), rgba(104, 159, 56, 0.1)),
    linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95));
  position: absolute;
  bottom: 0;
  right: 25px;
  height: 48px;
  width: 226px;
  p {
    color: var(--vt-c-progress-green);
    font-size: 15px;
    line-height: 20px;
  }
}
</style>
