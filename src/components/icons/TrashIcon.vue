<script setup lang="ts">
defineProps({
  color: String
})
</script>
<template>
  <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1218_101116)">
      <path
        d="M2.1125 0.776406C2.19687 0.607 2.37031 0.5 2.55938 0.5H4.44063C4.62969 0.5 4.80312 0.607 4.8875 0.776406L5 1H6.5C6.77656 1 7 1.22391 7 1.5C7 1.77609 6.77656 2 6.5 2H0.5C0.223906 2 0 1.77609 0 1.5C0 1.22391 0.223906 1 0.5 1H2L2.1125 0.776406ZM6.16875 7.78281C6.14375 8.19219 5.81719 8.5 5.42031 8.5H1.57969C1.18359 8.5 0.855781 8.19219 0.831094 7.78281L0.485938 2.5H6.5L6.16875 7.78281Z"
        :fill="color"
      />
    </g>
    <defs>
      <clipPath id="clip0_1218_101116">
        <rect width="7" height="8" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
</template>
