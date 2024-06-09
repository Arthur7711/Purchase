<script lang="ts" setup>
import { debounce } from "@/helpers/debounse";
import { onMounted, ref, watch } from "vue";
import ScreenParams from "@/store/screen";
import useUser from "@/store/user";
import { getCurrencySignName } from "@/helpers/currencySign";

const props = defineProps<{
  name: string;
  filterValue: string | number | boolean | (string | number)[];
  placeholder?: string;
}>();
const valuePrice = ref("");

onMounted(() => {
  if (props.filterValue && valuePrice.value !== props.filterValue) {
    valuePrice.value = props.filterValue as string;
  }
});

const emit = defineEmits<{
  (e: "select", value: string | number): void;
}>();

const debounsedEmit = debounce(function (value: string | number) {
  emit("select", value);
}, 400);

watch(
  () => valuePrice.value,
  () => {
    if (valuePrice.value) {
      debounsedEmit(valuePrice.value);
    } else {
      debounsedEmit("");
    }
  }
);
</script>

<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: flex-end;
      box-sizing: border-box !important;
      padding-right: 0px !important;
    "
  >
    <input
      v-model="valuePrice"
      type="text"
      :placeholder="
        placeholder
          ? placeholder
          : name === 'local_price'
          ? $t('price') + ' ' + getCurrencySignName(String(useUser.userCurrency.value))
          : name === 'aux_price'
          ? $t('price') + ' $'
          : ''
      "
      style="font-weight: 600; font-size: 13px"
      class="purchtable_input_filter purchtable_input_filter_desc"
    />
    <slot name="sort"></slot>
  </div>
</template>

<style lang="scss" scoped>
.purch_filter_price_button_overlay_price {
  max-width: 50px !important;
  display: flex;
  justify-content: flex-end !important;
  align-items: flex-end !important;
}
.purch_filter_price_button_overlay {
  background: none;
  border: none;
  color: #696969;
  display: flex;
  font-size: 14px;
  max-width: 90px;

  justify-content: flex-end;
  .purch_filter_price_button_overlay_svg {
    margin-left: -20px !important;
  }
}

.purchprice_div_all {
  display: flex;
  flex-direction: row;
}
.active_label_purch {
  margin-top: 12px;
}

.purchprice_input {
  width: 90px;
  height: 50px;
}
.purchprice_input:focus {
  box-shadow: none !important;
}

.purchprice_div_all {
  .p-float-label,
  label {
    transition-duration: 0.5s;
  }
}

.iconca {
  width: 11px;
  margin-left: 7px;
  margin-bottom: -3px;
}

.p-float-label input:focus ~ label,
.p-float-label input.p-filled ~ label,
.p-float-label textarea:focus ~ label,
.p-float-label textarea.p-filled ~ label,
.p-float-label .p-inputwrapper-focus ~ label,
.p-float-label .p-inputwrapper-filled ~ label {
  top: 1em !important;
}
</style>
