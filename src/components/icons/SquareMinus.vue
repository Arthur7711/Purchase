<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="34" viewBox="0 0 30 34" fill="none">
    <g clip-path="url(#clip0_2807_187338)">
      <path
        d="M25.5 2.125C27.8441 2.125 29.75 4.02754 29.75 6.375V27.625C29.75 29.9691 27.8441 31.875 25.5 31.875H4.25C1.90254 31.875 0 29.9691 0 27.625V6.375C0 4.02754 1.90254 2.125 4.25 2.125H25.5ZM9.03125 15.4062C8.14805 15.4062 7.4375 16.1168 7.4375 17C7.4375 17.8832 8.14805 18.5938 9.03125 18.5938H20.7188C21.602 18.5938 22.3125 17.8832 22.3125 17C22.3125 16.1168 21.602 15.4062 20.7188 15.4062H9.03125Z"
        :fill="disabled ? '#999999' : '#1565C0'"
      />
    </g>
    <defs>
      <clipPath id="clip0_2807_187338">
        <rect width="29.75" height="34" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
}>()
</script>
