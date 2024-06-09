<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  accountname?: string;
  name?: string;
  isShort?: boolean;
  array?: [];
}>();

const showTooltip = ref(false);
</script>

<template>
  <div @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
    <slot name="description"></slot>
    <div class="purchtable_div_tooltip" v-if="showTooltip && !isShort && name">
      {{ name }}
    </div>
    <div class="purchtable_div_tooltip" v-if="showTooltip && isShort && name">
      <p v-for="str in name.split(' ')" :key="str">
        {{ str }}
      </p>
    </div>
    <div class="purchtable_div_tooltip" v-if="showTooltip && array?.length">
      <h6 class="purchtable_h6_tooltip_desc" v-for="(el, i) in array" :key="i">
        {{ el }}
      </h6>
    </div>
    <img
      v-if="accountname"
      :src="'https://avatars.saber3d.net/?user=' + accountname"
      alt="face"
      class="purchtable_img_avatar"
    />
  </div>
</template>

<style></style>
