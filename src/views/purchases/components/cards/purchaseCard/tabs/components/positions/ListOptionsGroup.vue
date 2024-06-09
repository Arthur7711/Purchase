<template>
  <div
    :class="['purchase-action', { readonly: readonly }]"
    v-if="type === 'action'"
    @click="toggle"
  >
    <p>{{ name }}</p>
    <div class="purchase-action_icon">
      <i class="mdi mdi-chevron-right"></i>
    </div>
  </div>
  <div v-else class="group-table_header">
    <div class="group-table_header__title">
      <p @click="toggle">{{ name }}</p>
      <div @click="toggle" class="group-table_header__title_icon">
        <img alt="triangle" :src="btnTriangle" />
      </div>
    </div>
  </div>
  <Menu
    ref="menu"
    id="overlay_menu"
    class="group-table_header__menu menu-list"
    :model="items"
    :popup="true"
  >
    <template #item="{ item }">
      <p
        class="menu-list_item"
        @click="selectValue(item.id)"
        :style="{
          color: isColored
            ? colorizeProductStatus(item.id).color
            : colorizeProductStatus(1).color,
        }"
      >
        {{ item.name.toLowerCase() }}
      </p>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";

import { colorizeProductStatus } from "@/helpers/colorize_paying_status";
import usePurchasesInfo from "@/store/purchases_store/purchases";

import btnTriangle from "@/components/icons/triangleDownGrey.svg";
import i18n_config from "@/locales/i18n_config";

const props = defineProps<{
  name: string;
  list: { id: number; name: string }[] | any[] | undefined;
  value: number | null;
  isColored?: boolean;
  clearable?: boolean;
  type?: string;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  (e: "dataChange", value: number | null): void;
}>();

const menu = ref();
const items = ref<{ id: number; name: string }[] | any[] | undefined>();
const { locale, messages } = i18n_config.global;
const selectedValue = computed<number | null>({
  get() {
    return props.value;
  },
  set(value) {
    emit("dataChange", value);
  },
});

const toggle = (event: Event) => {
  if (!props.readonly) {
    menu.value.toggle(event);
  }
};

watch(
  () => props.list,
  (value) => {
    const newArr = value && [...value];

    if (newArr && props.clearable) {
      newArr.unshift({
        id: null,
        name: messages[locale].no,
      });
    }
    items.value = newArr;
  },
  { deep: true }
);

const selectValue = (value: number | null) => {
  if (props.type === "action") {
    selectedValue.value = value;
  } else {
    selectedValue.value = -1;

    setTimeout(() => {
      selectedValue.value = value;
    });
  }
};

onMounted(() => {
  const newArr = props.list && [...props.list];

  if (newArr && props.clearable && props.type !== "action") {
    newArr.unshift({
      id: null,
      name: messages[locale].no,
    });
  }
  items.value = newArr;
});
</script>

<style lang="scss" scoped>
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
</style>
