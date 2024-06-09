<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useFilters from "../../store/purchases_store/filters";
import usePositionFilters from "../../store/purchases_store/positionsFilter";
import ScreenParams from "@/store/screen";

const props = defineProps<{
  active: boolean;
  positions?: { id: number; name: string }[];
  name: string;
}>();
const setFilters = ref<number[]>([]);
const mounted = ref(false);
const scroll = ref(0);
let el = document.getElementById("scrollable");

onMounted(() => {
  setTimeout(() => {
    mounted.value = true;
    el = document.getElementById("scrollable");
  }, 350);
});

const handleHorizontalScroll = (e: any) => {
  if (e.deltaY > 0 || e.deltaX > 0) {
    if (el) {
      el.scrollLeft += 20;
    }
  } else {
    if (el) {
      el.scrollLeft -= 20;
    }
  }
};

watch(
  () => props.active,
  () => {
    if (props.name === "purchase") {
      mounted.value = false;
      setFilters.value = [];
      useFilters.setFiltersPurch({ val: [], name: "product_status_ids" });
      useFilters.setFiltersPurch({ val: [], name: "type_document_ids" });
      setTimeout(() => {
        mounted.value = true;
      }, 650);
    } else if (props.name === "favourite") {
      mounted.value = false;
      setFilters.value = [];
      useFilters.setFiltersFav({ val: [], name: "types_ids" });
      setTimeout(() => {
        mounted.value = true;
      }, 650);
    } else if (props.name === "positions") {
      mounted.value = false;
      setFilters.value = [];
      usePositionFilters.setPositionsFilters({ val: [], name: "warehouse_ids" });
      setTimeout(() => {
        mounted.value = true;
      }, 650);
    }
  }
);

const handleUpperFilters = (val: number) => {
  if (props.name === "purchase") {
    switch (val) {
      case 0:
        if (useFilters.filtersPurch.value.product_status_ids.toString() !== "1,2") {
          setFilters.value?.push(val);
          useFilters.setFiltersPurch({ val: [1, 2], name: "product_status_ids" });
        } else {
          setFilters.value = setFilters.value
            ? setFilters.value?.filter((el) => el !== val)
            : [];
          useFilters.setFiltersPurch({ val: [], name: "product_status_ids" });
        }

        break;
      case 1:
        if (useFilters.filtersPurch.value.type_document_ids.toString() !== "-3") {
          setFilters.value?.push(val);
          useFilters.setFiltersPurch({ val: [-3], name: "type_document_ids" });
        } else {
          setFilters.value = setFilters.value
            ? setFilters.value?.filter((el) => el !== val)
            : [];
          useFilters.setFiltersPurch({ val: [], name: "type_document_ids" });
        }
        break;
      default:
        break;
    }
  } else if (props.name === "favourite") {
    let filter = useFilters.filtersFavourite.value.types_ids as number[];
    if (filter.includes(val)) {
      setFilters.value = setFilters.value.filter((el) => el !== val);
      useFilters.setFiltersFav({
        val: setFilters.value.map((el) => el),
        name: "types_ids",
      });
    } else {
      setFilters.value.push(val);
      useFilters.setFiltersFav({
        val: setFilters.value.map((el) => el),
        name: "types_ids",
      });
    }
  } else if (props.name === "positions") {
    let filter = usePositionFilters.filters.value.warehouse_ids as number[];
    if (filter.includes(val)) {
      setFilters.value = setFilters.value.filter((el) => el !== val);
      usePositionFilters.setPositionsFilters({
        val: setFilters.value.map((el) => el),
        name: "warehouse_ids",
      });
    } else {
      setFilters.value.push(val);
      usePositionFilters.setPositionsFilters({
        val: setFilters.value.map((el) => el),
        name: "warehouse_ids",
      });
    }
  }
};
</script>

<template>
  <div
    :class="
      props.active
        ? props.name === 'favourite'
          ? 'purchase_upper_label_active_favourite'
          : props.name === 'positions'
          ? 'purchase_upper_label_active_positions'
          : 'purchase_upper_label_active'
        : 'purchase_upper_label'
    "
  >
    <slot name="title"></slot>
    <div
      v-if="props.positions"
      style="display: flex"
      class="purchase_upper_label_div_mapping"
      :id="name === 'favourite' ? 'scrollable' : ''"
      v-on:wheel="handleHorizontalScroll"
    >
      <div v-for="(item, i) in props.positions" :key="item.id">
        <div
          @click="mounted ? handleUpperFilters(item.id) : null"
          :class="
            setFilters.includes(item.id)
              ? 'purchase_upper_label_mapping_active purchase_upper_label_mapping'
              : 'purchase_upper_label_mapping'
          "
          class="purchase_upper_label_mapping"
          :style="
            props.name === 'favourite' ? { transform: `translateX(${scroll}px)` } : ''
          "
        >
          <span v-if="i !== props.positions.length - 1">{{ item.name }}</span
          ><span v-else-if="i === props.positions.length - 1" id="observebale">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./upperLabel.scss";
.purchase_upper_label_mapping_active {
  box-shadow: inset 0px 0px 6px 1px #fefbff8f, 0px 0px 6px 1px #fcfcfc;
}
</style>
