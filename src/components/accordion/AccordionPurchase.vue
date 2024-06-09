<template>
  <Panel :collapsed="close" class="accordion-purchase" :header="props.header" toggleable>
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #togglericon="{ collapsed }">
      <div :style="{ rotate: collapsed ? '0deg' : '180deg' }">
        <PanelIcon />
      </div>
    </template>
    <div>
      <slot name="content"></slot>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import PanelIcon from "../icons/PanelIcon.vue";

const props = defineProps<{
  header?: string;
  close?: boolean;
}>();
</script>

<style lang="scss">
.accordion-purchase {
  & > .p-panel-header {
    height: auto;
    padding: 0 !important;
    margin: 0;
    border: none;
    background: none;
    color: #000000;
    font-size: 18px;
    & > .p-panel-icons {
      & > button.p-panel-header-icon {
        width: auto;
        height: auto;
        &:hover {
          background-color: white;
        }
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  .p-toggleable-content {
    .p-panel-content {
      padding: 0;
      margin-top: 16px;
      border: none;
    }
  }
}
</style>
