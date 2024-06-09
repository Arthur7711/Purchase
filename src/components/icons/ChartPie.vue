<script setup lang="ts">
const props = defineProps({
  selected: Boolean
})
</script>
<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1060_108239)">
      <path
        d="M23.2219 11.25H12.75V0.777187C12.75 0.354141 13.0359 0 13.5 0C19.2984 0 24 4.70156 24 10.5C24 10.9219 23.6437 11.25 23.2219 11.25ZM8.91562 1.74281C9.76406 1.56375 10.5 2.25937 10.5 3.12656V13.5H20.8734C21.7406 13.5 22.4344 14.2359 22.2562 15.0844C21.1828 20.1797 16.6641 24 11.25 24C5.03906 24 0 18.9656 0 12.75C0 7.33594 3.82172 2.81813 8.91562 1.74281Z"
        :fill="props.selected ? '#1565C0' : '#999999'"
      />
    </g>
    <defs>
      <clipPath id="clip0_1060_108239">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>
