<template>
  <div
    :class="['purchase-action', { readonly: readonly }]"
    v-if="type === 'action'"
    @click="toggle"
  >
    <p>{{ $t("note short") }}</p>
    <div class="purchase-action_icon">
      <i class="mdi mdi-chevron-right"></i>
    </div>
  </div>
  <div v-else @click="toggle" class="group-table_header">
    <div class="group-table_header__title">
      <p>{{ $t("note short") }}</p>
      <div class="group-table_header__title_icon">
        <img alt="triangle" :src="btnTriangle" />
      </div>
    </div>
  </div>
  <Menu
    ref="menu"
    id="overlay_menu"
    class="group-table_header__menu menu-list task-id"
    :model="[]"
    :popup="true"
  >
    <template #start>
      <div class="task-modal">
        <TextLabelIcon
          :is-integer="true"
          :title="$t('note')"
          :value="note"
          @data-change="note = $event"
        />
        <button class="task-modal_btn" @click="assignedTask">{{ $t("apply") }}</button>
      </div>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import btnTriangle from "@/components/icons/triangleDownGrey.svg";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";

const props = defineProps<{
  value: string | null;
  type?: string;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  (e: "dataChange", value: string | null): void;
}>();

const menu = ref();
const note = ref<string | null>(null);
const selectedValue = ref<string | null>(props.value);

const assignedTask = (): void => {
  selectedValue.value = note.value;
  menu.value.toggle(false);
};

const toggle = (event: Event): void => {
  menu.value.toggle(event);
};

watch(
  () => selectedValue.value,
  (value) => {
    emit("dataChange", value);
  }
);
</script>

<style lang="scss">
.purchase-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  padding: 5px 0;
  cursor: pointer;
  &.readonly {
    cursor: auto;
    opacity: 0.7;
  }
  &_icon {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
.task-modal {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  &_btn {
    border: none;
    outline: none;
    width: 100%;
    display: flex;
    padding: 5px 14px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    border-radius: 10px;
    background: #b6b6b6;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }
}
.task-id {
  .group-table_header__menu.menu-list {
    height: auto;
  }
  #overlay_menu_list {
    display: none !important;
  }
}
</style>
