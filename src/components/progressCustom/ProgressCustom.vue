<script setup lang="ts">
const props = defineProps<{
  progress: { success: number; error: number; pending: number }
  customWidth?: string
  customHeight?: string
}>()
</script>
<template>
  <div
    class="progressCustom"
    :style="{ width: props.customWidth || '140px', height: props.customHeight || '12px' }"
  >
    <div
      class="success"
      :style="{
        width: `${
          (props.progress.success /
            (props.progress.success + props.progress.error + props.progress.pending)) *
          100
        }%`
      }"
    ></div>
    <div
      class="error"
      :style="{
        width: `${
          (props.progress.error /
            (props.progress.success + props.progress.error + props.progress.pending)) *
          100
        }%`
      }"
    ></div>
    <div
      class="pending"
      :style="{
        width: `${
          (props.progress.pending /
            (props.progress.success + props.progress.error + props.progress.pending)) *
          100
        }%`
      }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.progressCustom {
  display: flex;
  align-items: center;
  border-radius: 100px;
  border: 1px solid #ebe4e4;
  overflow: hidden;
  .success {
    background: rgba(104, 159, 56, 0.5);
    height: 100%;
  }
  .error {
    background: rgba(198, 40, 40, 0.5);
    height: 100%;
  }
  .pending {
    background: #b6b6b6;
    height: 100%;
  }
}
</style>
