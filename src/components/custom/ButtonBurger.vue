<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
}>();
const visible = ref(props.isVisible);

watch(
  () => props.isVisible,
  () => {
    visible.value = props.isVisible;
  }
);
</script>

<template>
  <button
    class="burger_button"
    :class="visible ? 'burger_button_active' : 'burger_button'"
    @click="
      () => {
        visible = !visible;
        $emit('change', visible);
      }
    "
  >
    <div class="burger_slash"></div>
    <div class="burger_slash"></div>
    <div class="burger_slash"></div>
  </button>
</template>

<style lang="scss" scoped>
.burger_button {
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  transition: all 0.5s;
}
.burger_slash {
  border-bottom: 1px black solid;
  width: 22px;
  transition: all 0.8s;
}
.burger_button_active {
  display: flex;
  transition: all 0.5s;
  gap: 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  .burger_slash:nth-child(1) {
    display: none !important;
  }
  .burger_slash:nth-child(2) {
    transform: rotate(45deg) translateX(1px);
    border-bottom: 1px red solid;
  }
  .burger_slash:nth-child(3) {
    transform: rotate(-45deg);
    border-bottom: 1px red solid;
  }
}
</style>
