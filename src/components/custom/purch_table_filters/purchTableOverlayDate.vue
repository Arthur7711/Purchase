<script lang="ts" setup>
import OverlayPanel from "primevue/overlaypanel";
import { onMounted, watch, ref } from "vue";
import PurchTableDatePicker from "./purchTableDatePicker.vue";
import downPicker from "../../icons/downPicker.vue";
import { format } from "date-fns";

const props = defineProps<{
  name: string;
  selectedValue?: any[];
}>();
const selectDateArrange = ref(1);
const selectedCustomDate = ref<Date[]>([new Date(), new Date()]);
const show = ref();
const toggle = (event: any) => {
  show.value.toggle(event);
};

watch(
  () => props.selectedValue,
  () => {
    selectedCustomDate.value = checkRangeDate(props.selectedValue);
  },
  { deep: true }
);

const checkRangeDate = (arrayDates?: any[]) => {
  if (Array.isArray(arrayDates)) {
    if (arrayDates[0] && new Date(arrayDates[0])) {
      arrayDates[0] = new Date(arrayDates[0]);
      if (arrayDates[1] && new Date(arrayDates[1])) {
        arrayDates[1] = new Date(arrayDates[1]);
      } else {
        arrayDates[1] = new Date(arrayDates[0]);
      }

      return [...arrayDates];
    }
  }

  return [];
};

onMounted(() => {
  selectedCustomDate.value = checkRangeDate(props.selectedValue);
});
</script>

<template>
  <button class="purch_filter_price_button_overlay" @click="toggle">
    {{ name }} <downPicker />
  </button>
  <OverlayPanel ref="show">
    <div class="purchtable_datepicker_div_all">
      <PurchTableDatePicker
        :active-range="selectDateArrange"
        :select-date="selectedCustomDate"
        @select-arrange="
          (val) => {
            selectDateArrange = val;
          }
        "
        @select-date="(val) => $emit('select-date', val)"
        @select-cust-date="
          (val) => {
            if (!val.length) {
              $emit('change-cust-date', {
                dateFrom: null,
                dateTo: null,
              });
            } else {
              selectedCustomDate = val;
              const validator = val[0].toString() !== val[1].toString();
              if (val[0].toString() && val[1].toString() && validator) {
                $emit('change-cust-date', {
                  dateFrom: format(val[0], 'yyyy-MM-dd'),
                  dateTo: format(val[1], 'yyyy-MM-dd'),
                });
              }
            }
          }
        "
      />
    </div>
  </OverlayPanel>
</template>

<style lang="scss">
.purch_filter_price_button_overlay {
  background: none;
  border: none;
  color: #696969;
  font-size: 14px;
}
.purch_filter_price_button_overlay > svg {
  margin-bottom: -5px;
  margin-right: -10px;
  margin-left: 3px;
  width: 11px;
}
</style>
