<script lang="ts" setup>
import { ref, watch } from 'vue';
import { curFormatter } from '../../helpers/currencyFormatter';
import useOffices from '../../store/offices_store/offices_purposes';
const props = defineProps<{
  name: string;
  cust_aux: string | number;
  aux_expenses: string | number;
  percent_down: string | number;
  background_color: string;
  id: number;
}>();
const emit = defineEmits<{
  (e: 'select-office', value: string): void;
}>();
const selected = ref([props.name]);

watch(props, () => {
  selected.value = useOffices.selectedOffices.value?.includes(props.id) ? [props.name] : [];
});
</script>

<template>
  <div :style="{ backgroundColor: background_color }" class="offices_offices_container_div_all">
    <div
      style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px"
    >
      <div>
        <Checkbox
          v-model="selected"
          :value="name"
          @change="emit('select-office', selected[0])"
          :class="'offices_offices_checkbox'"
        />
        <span class="offices_offices_container_span_name">
          {{ name === 'Minsk' ? $t('Minsk') : name }}
        </span>
      </div>
      <div
        v-tooltip.top="{
          value: `<span class='purchtable_tooltip_favourite'>${$t('average staff')}</span>`,
          escape: true,
          class: 'custom-tooltip-offices'
        }"
      >
        <img style="margin-left: 10px" src="../icons/user-large.svg" alt="not found" />
        <span class="offices_offices_container_span_cust" style="margin-left: 4px">{{
          Number(cust_aux).toFixed(0)
        }}</span>
      </div>
    </div>
    <div>
      <span
        v-tooltip="{
          value: `<span class='purchtable_tooltip_favourite'>${$t('tooltip offices page')}</span>`,
          escape: true,
          class: 'custom-tooltip-offices'
        }"
        class="offices_offices_container_span_expenses"
        >{{ curFormatter(Number(aux_expenses)) }} $</span
      >
    </div>
    <hr />
    <div style="display: flex">
      <img
        style="margin-right: 5px"
        v-if="Number(percent_down) > 0"
        src="../icons/stonksRedDown.svg"
        alt="^"
      />
      <img style="margin-right: 5px" v-else src="../icons/stonksGreenDown.svg" alt="v" />
      <span
        v-tooltip="{
          value: `<span class='purchtable_tooltip_favourite'>${$t(
            'tooltip offices page_2'
          )}</span>`,
          escape: true,
          class: 'custom-tooltip-offices'
        }"
        >{{ Number(percent_down).toFixed(0) }} % {{ $t('per period') }}</span
      >
    </div>
  </div>
</template>

<style lang="scss">
.offices_offices_container_div_all {
  margin-top: 36px;
  width: 215px;
  height: 110px;
  padding: 14px 20px;
  gap: 10px;
  border-radius: 10px;
}

.offices_offices_container_span_name {
  margin-left: 6px;
  color: var(--mono-dark-grey, #666);
  font-family: Source Sans Pro;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 138.462% */
}

.offices_offices_container_span_cust {
  color: var(--mono-dark-grey, #666);
  font-family: Source Sans Pro;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 138.462% */
}

.offices_offices_container_span_expenses {
  color: #000;
  text-align: center;
  font-size: 30px;
  margin: 0px 8px 8px 0px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px;
}

.offices_offices_checkbox {
  .p-checkbox-box {
    background: none !important;
    border-radius: 2px !important;
    border: 1px solid var(--mono-divider, #b6b5b5);
    background: var(--mono-white, #fff);
  }
  .p-checkbox-box.p-highlight {
    background: #1565c0 !important;
    border-radius: 2px !important;
    border-color: #1565c0 !important;
  }
  .p-checkbox-box.p-focus {
    box-shadow: none !important;
  }
}

@media only screen and (max-width: 650px) {
  .offices_offices_container_div_all {
    width: 100%;
  }
}
</style>
