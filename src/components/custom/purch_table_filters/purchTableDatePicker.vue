<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  lastMonth,
  lastWeek,
  lastYear,
  sixMonthsEarlier,
} from "../../../helpers/getDatesRange";
import { format } from "date-fns";
import type { CalendarPassThroughMethodOptions } from "primevue/calendar";
import { usePrimeVue } from "primevue/config";
import i18n_config from "@/locales/i18n_config";
import ScreenParams from "@/store/screen";

const props = defineProps<{
  activeRange: number;
  selectDate: Date[];
}>();

const emit = defineEmits<{
  (e: "selectDate", value: { dateTo: string; dateFrom: string }): void;
  (e: "selectArrange", value: number): void;
  (e: "selectCustDate", value: Date[]): void;
}>();
const { messages, locale } = i18n_config.global;
const date = ref(props.selectDate);
const buttonValue = [
  messages[locale]["last year"],
  messages[locale]["last six months"],
  messages[locale]["last month"],
  messages[locale]["last week"],
];
const active = ref(props.activeRange);

const handleClickDateSetter = (index: number) => {
  active.value = index;
  date.value = [new Date(), new Date()];
  emit("selectCustDate", date.value);
  emit("selectArrange", index);
  switch (index) {
    case 0:
      emit("selectDate", {
        dateTo: format(new Date(), "yyyy-MM-dd"),
        dateFrom: lastYear,
      });
      break;
    case 1:
      emit("selectDate", {
        dateTo: format(new Date(), "yyyy-MM-dd"),
        dateFrom: sixMonthsEarlier,
      });
      break;
    case 2:
      emit("selectDate", {
        dateTo: format(new Date(), "yyyy-MM-dd"),
        dateFrom: lastMonth,
      });
      break;
    case 3:
      emit("selectDate", {
        dateTo: format(new Date(), "yyyy-MM-dd"),
        dateFrom: lastWeek,
      });
      break;
    default:
      break;
  }
};

const handleCustomDate = () => {
  if (date.value[0] && date.value[1]) {
    active.value = 5;
    emit("selectArrange", 5);
    emit("selectDate", {
      dateFrom: format(date.value[0], "yyyy-MM-dd"),
      dateTo: format(date.value[1], "yyyy-MM-dd"),
    });
    emit("selectCustDate", date.value);
  }
};
</script>

<template>
  <div class="purch_table_datepicker_all">
    <div class="purch_table_datepicker_buttongroup">
      <button
        :class="active === i ? 'purch_table_datepicker_button_active' : ''"
        v-for="(item, i) in buttonValue"
        :key="i"
        @click="handleClickDateSetter(i)"
        class="purch_table_datepicker_button"
      >
        {{ item }}
      </button>
    </div>
    <div class="purch_table_datepicker_calendar">
      <Calendar
        v-model="date"
        selectionMode="range"
        inline
        firstDayOfWeek="1"
        showButtonBar
        :numberOfMonths="ScreenParams.screenParams.width > 650 ? 2 : 1"
        @date-select="handleCustomDate"
        @clear-click="$emit('selectCustDate', [])"
      />
    </div>
  </div>
</template>

<style lang="scss">
.purch_table_datepicker_buttongroup {
  display: flex;
  justify-content: space-between;
  padding: 5px 36px 24px 36px;
}
.purch_table_datepicker_button {
  background: none;
  border: none;
  height: 29px;
  width: 157px;
  border-radius: 10px;
  box-shadow: 0px 0px 22px 7px #81838821;
  -webkit-box-shadow: 0px 0px 22px 7px #81838821;
  -moz-box-shadow: 0px 0px 22px 7px #81838821;
}

.purch_table_datepicker_button_active {
  background: linear-gradient(0deg, rgba(21, 101, 192, 0.7), rgba(21, 101, 192, 0.7)),
    var(--vt-c-white);
  color: white;
  box-shadow: 0px 0px 22px 7px #81838821;
  -webkit-box-shadow: 0px 0px 22px 7px #81838821;
  -moz-box-shadow: 0px 0px 22px 7px #81838821;
}

.purch_table_datepicker_calendar {
  .p-datepicker {
    border: none !important;
  }
  .p-datepicker.p-datepicker-multiple-month .p-datepicker-group {
    border: none !important;
  }
}

.p-datepicker .p-datepicker-header {
  border: none !important;
}

@media only screen and (max-width: 650px) {
  .purch_table_datepicker_all {
    max-width: 290px;
    padding: 0;
  }
  .purch_table_datepicker_buttongroup {
    display: flex;
    justify-content: flex-start;
    gap: 3vw;
    padding: 0px 0px 0px 0px;
  }
  .purch_table_datepicker_button {
    height: 60px;
    width: 60px;
    box-shadow: none;
    border: 0.2px rgba(21, 101, 192, 0.7) solid;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }

  .purch_table_datepicker_button_active {
    padding: 1%;
  }
}
</style>
