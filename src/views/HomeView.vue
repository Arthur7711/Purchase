<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const route = useRouter()
onMounted(() => {
  route.push('/purchases')
})
</script>

<template>
  <!-- <main>
    <h1>Hello home</h1>
    <button
      @click="
        () => {
          increment()
          computed(() => count)
        }
      "
    >
      click {{ count }}
    </button>
    < label="Submit" @click="() => throwError()" />
  </main> -->
</template>
