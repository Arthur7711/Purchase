<script setup lang="ts">
import ErrorIcon from '../icons/ErrorIcon.vue'

const props = defineProps<{
  title: string
}>()
</script>
<template>
  <div class="success_box">
    <ErrorIcon />
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
  border: 1px solid rgba(180, 57, 57, 0.3);
  background-color: rgba(240, 8, 8, 0.5);
  position: fixed;
  bottom: 10px;
  right: 25px;
  height: 48px;
  width: 226px;
  p {
    color: #fff;
    font-size: 16px;
    line-height: 20px;
  }
}
</style>
