<script setup lang="ts">
const props = defineProps({
  selected: Boolean
})
</script>
<template>
  <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1020_104894)">
      <path
        d="M0 4.45045C0 4.24514 0.0605531 4.04545 0.174038 3.87389L2.29922 0.686481C2.54953 0.31104 2.97 0.0854492 3.42281 0.0854492H14.5772C15.03 0.0854492 15.4491 0.31104 15.6994 0.686481L17.8256 3.87389C17.9381 4.04545 18 4.24514 18 4.45045C18 5.02139 17.5359 5.48545 16.965 5.48545H1.03612C0.464062 5.48545 8.4375e-06 5.02139 8.4375e-06 4.45045H0ZM1.8 6.38545H3.6V10.8854H9V6.38545H10.8V13.1354C10.8 13.8808 10.1953 14.4854 9.45 14.4854H3.15C2.40441 14.4854 1.8 13.8808 1.8 13.1354V6.38545ZM14.4 6.38545H16.2V13.5855C16.2 14.0833 15.7978 14.4854 15.3 14.4854C14.8022 14.4854 14.4 14.0833 14.4 13.5855V6.38545Z"
        :fill="props.selected ? '#1565C0' : '#666666'"
      />
    </g>
    <defs>
      <clipPath id="clip0_1020_104894">
        <rect width="18" height="14.4" fill="white" transform="translate(0 0.0854492)" />
      </clipPath>
    </defs>
  </svg>
</template>
