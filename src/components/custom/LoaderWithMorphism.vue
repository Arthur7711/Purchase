<script lang="ts" setup>
import ProgressSpinner from 'primevue/progressspinner'
defineProps<{
  show: boolean
  withMorphism?: boolean
}>()
</script>

<template>
  <div v-if="show" class="offices_loader_container">
    <div :class="withMorphism ? 'with_glassmorphism' : ''" class="offices_loader">
      <ProgressSpinner />
    </div>
  </div>
</template>

<style lang="scss">
.offices_loader {
  width: 20vw;
  height: 35vh;
  position: fixed;
  border-radius: 20%;
  top: 40%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s ease-in;
}

.with_glassmorphism {
  box-shadow: inset 3px 3px 3px 4px rgba(255, 255, 255, 0.849), 5px 5px 5px 5px rgba(0, 0, 0, 0.048);
  background-color: #bbbbbb3d;
}

.offices_loader_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
