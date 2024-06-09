<script lang="ts" setup>
defineProps<{
  bankName?: string;
}>();

const getIconUrl = (name: any): string => {
  return new URL(`../../icons/${name}.svg`, import.meta.url).href;
};
</script>

<template>
  <div style="margin-bottom: -7px" v-if="bankName">
    <img class="bankimage_img" :src="getIconUrl(bankName)" :alt="bankName" />
  </div>
</template>

<style lang="scss">
.bankimage_img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
</style>
