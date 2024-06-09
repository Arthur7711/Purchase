<script setup lang="ts">
import DropdownArrow from '../../components/icons/DropdownArrow.vue';
const props = defineProps<{ isOpen: boolean; bg?: string }>();
const emit = defineEmits<{ (e: 'dropdown_control', value: boolean): void }>();
const controleDropdown = () => {
  emit('dropdown_control', !props.isOpen);
};
</script>
<template>
  <div
    class="custom_dropdown"
    :style="{
      background: bg || 'none',
      borderColor: bg ? 'var(--vt-c-white)' : 'var(--vt-c-editable-gray)'
    }"
  >
    <div class="head">
      <slot name="head"></slot>
      <div :style="{ rotate: !isOpen ? '180deg' : '0deg' }" @click="controleDropdown">
        <DropdownArrow />
      </div>
    </div>
    <div :style="{ transition: '1', display: isOpen ? 'block' : 'none' }">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
.custom_dropdown {
  box-shadow: 0px 0px 22px 7px #d8dae066;
  padding: 18px 24px 22px 24px;
  border-radius: 15px;
  border: 1px solid;
  width: 100%;
  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}

@media only screen and (max-width: 650px) {
  .custom_dropdown {
    width: 98vw;
  }
}
</style>
