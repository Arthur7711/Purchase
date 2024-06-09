<script lang="ts" setup>
import DropdownNoneBorder from "@/components/dropdown_exp/DropNonBorderLarge.vue";
import { onMounted, ref, watch } from "vue";
import CalendarIcon from "../icons/CalendarIcon.vue";
import {
  setDateFormat,
  monthChange,
  yearChange,
  customDateFrom,
  customDateTo,
} from "../../helpers/dateHelper";
import { format } from "date-fns";
import usePurchDateFrom from "../../store/purchases_store/purchDateFrom";
import type { LocationQuery } from "vue-router";
import i18n_config from "@/locales/i18n_config";
import ScreenParams from "@/store/screen";
import { useRouter } from "vue-router";

const props = defineProps<{
  table_type: string;
  query?: LocationQuery;
}>();

const emit = defineEmits<{
  (e: "format_change", val: number | string): void;
}>();
const { messages, locale } = i18n_config.global;
const router = useRouter();
const minDate = ref();
const mounted = ref(false);
const date_Format = ref<string | number>(0);
const selectedDate = ref<string | Date>(new Date());
const customDate = ref([""]);
const dropTypes = ref([
  { id: 0, title: messages[locale]["month"] },
  { id: 1, title: messages[locale]["year"] },
  { id: 2, title: messages[locale]["arbitrary"] },
  { id: 3, title: messages[locale]["all time"] },
]);
const queryDateFormat = ref<number | undefined>(undefined);
onMounted(() => {
  if (
    props.query &&
    (props.query?.date || (props.query.date_to && props.query.date_from))
  ) {
    if (props.query?.date && +props.query.date === 3) {
      queryDateFormat.value = 3;
      setterDateFormat(3);
    } else {
      setterDateFormat(props.query?.date ? +props.query.date : 0);
      queryDateFormat.value = props.query?.date ? +props.query.date : 0;

      const dateTo = (props.query.date_to as string)?.split("-").join(".");
      const dateFrom = (props.query.date_from as string)?.split("-").join(".");

      customDateFrom(dateFrom);
      customDateTo(dateTo);
      customDate.value[0] = dateFrom;
      customDate.value[1] = dateTo;

      setterDates(props.query?.date ? +props.query.date : 0);
    }
  } else {
    monthChange(format(new Date(), "yyyy-MM-01"));
  }
  setTimeout(() => {
    mounted.value = true;
  }, 350);
});

watch(
  () => date_Format.value,
  (value) => {
    usePurchDateFrom.setDateFormat(+value);
  }
);

watch(date_Format, () => {
  if (date_Format.value !== undefined && mounted.value) {
    setterDates(+date_Format.value);

    emit("format_change", date_Format.value);
  }
});

const setterDateFormat = (val: string | number) => {
  date_Format.value = val;
  setDateFormat(val);
};

const setterDates = (formatDate: number): void => {
  switch (formatDate) {
    case 1:
      yearChange(
        format(
          new Date(),
          `${
            Number(usePurchDateFrom.dateFrom.value.split("-")[0]) < 2000
              ? "2000"
              : usePurchDateFrom.dateFrom.value.split("-")[0]
          }-01-01`
        )
      );
      selectedDate.value = format(
        new Date(),
        `${usePurchDateFrom.dateFrom.value.split("-")[0]}`
      );
      break;
    case 0:
      monthChange(
        format(
          new Date(),
          `${
            Number(usePurchDateFrom.dateFrom.value.split("-")[0]) < 2000
              ? new Date().getFullYear()
              : usePurchDateFrom.dateFrom.value.split("-")[0]
          }-${usePurchDateFrom.dateFrom.value.split("-")[1] || 1}-MM`
        )
      );
      selectedDate.value = format(
        new Date(),
        `${usePurchDateFrom.dateFrom.value.split("-")[1]}.${
          usePurchDateFrom.dateFrom.value.split("-")[0]
        }`
      );
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="purch_datepicker_div_all">
    <div class="purch_datepicker_div_dropdown">
      <Transition>
        <label
          v-if="date_Format?.toString()"
          for="dropdown_purch_date"
          class="purch_label_date"
          >{{ $t("period") }}</label
        >
      </Transition>
      <DropdownNoneBorder
        v-if="dropTypes"
        :disable="table_type === 'favourite' ? true : false"
        :def-value="queryDateFormat"
        @change-event="setterDateFormat"
        id="dropdown_purch_date"
        class="dropdown_right_header_purchtable"
        :drop-types="dropTypes"
      />
    </div>
    <hr
      style="
        rotate: 0deg;
        height: 34px;
        z-index: 2;
        border-color: rgba(227, 227, 227, 0.282);
      "
    />
    <div
      class="purch_datepicker_div_calendars"
      :style="{
        paddingRight: date_Format === 3 ? '12px' : '',
        marginLeft: date_Format === 3 ? '' : '-12px',
      }"
    >
      <label
        v-if="date_Format === 0"
        for="purch_label_calendar"
        class="purch_label_calendar"
        >{{ $t("select month") }}</label
      >
      <label
        v-else-if="date_Format === 1"
        for="purch_label_calendar"
        class="purch_label_calendar"
        >{{ $t("select year") }}</label
      >
      <label
        v-else-if="date_Format === 2"
        for="purch_label_calendar"
        class="purch_label_calendar"
        >{{ $t("select period") }}</label
      >
      <label
        v-else-if="date_Format === 3"
        for="purch_label_calendar"
        class="purch_label_calendar purch_label_calendar_label"
        style="margin-left: 0"
        >{{ $t("all time") }}</label
      >
      <Calendar
        v-if="date_Format === 0"
        class="calendar_header_purch"
        v-model="selectedDate"
        @date-select="(val: Date) => monthChange(val.toDateString())"
        show-icon
        id="purch_label_calendar"
        view="month"
        :placeholder="$t('select month')"
        dateFormat="mm.yy"
      >
        <template #dropdownicon>
          <img src="../icons/calendar.svg" alt="" />
        </template>
      </Calendar>
      <Calendar
        v-else-if="date_Format === 1"
        class="calendar_header_purch"
        show-icon
        id="purch_label_calendar"
        view="year"
        @date-select="(val: Date) => yearChange(val.toDateString())"
        v-model="selectedDate"
        :placeholder="$t('select year')"
        dateFormat="yy"
      >
        <template #dropdownicon>
          <CalendarIcon />
        </template>
      </Calendar>
      <div v-else-if="date_Format === 2" class="calendar_header_purch_double_container">
        <Calendar
          class="calendar_header_purch_double"
          show-icon
          v-model="customDate[0]"
          id="purch_label_calendar"
          dateFormat="dd.mm.yy"
          :placeholder="$t('date from')"
          @date-select="
            (val: Date) => {
              customDateFrom(val.toDateString());
              customDateTo(new Date().toDateString());
              minDate = val;
            }
          "
        >
          <template #dropdownicon>
            <img class="purch_picker_calendar_img" src="../icons/calendar.svg" alt="" />
          </template>
        </Calendar>
        <img
          v-if="ScreenParams.screenParams.width > 650"
          src="../icons/arrow-light-long.svg"
          style="width: 14px; height: 14px; margin-bottom: -3px; margin-left: -30px"
          alt=""
        />
        <Calendar
          class="calendar_header_purch_double"
          v-model="customDate[1]"
          show-icon
          id="purch_label_calendar"
          dateFormat="dd.mm.yy"
          :min-date="minDate"
          :placeholder="$t('date to')"
          @date-select="(val: Date) => customDateTo(val.toDateString())"
        >
          <template #dropdownicon>
            <img class="purch_picker_calendar_img" src="../icons/calendar.svg" alt="" />
          </template>
        </Calendar>
      </div>
      <span
        class="purch_label_calendar_all_time"
        id="purch_label_calendar"
        v-else-if="date_Format === 3"
        >{{ $t("all time") }}</span
      >
      <span
        style="margin-top: 2px; margin-left: 11px"
        id="purch_label_calendar"
        v-else-if="!date_Format && date_Format != 0"
        >{{ $t("select") }}{{ $t("period") }}</span
      >
    </div>
  </div>
</template>

<style lang="scss">
@import "./purchDatepicker.scss";

.purch_datepicker_div_all {
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
    transform: scale(1.1) translateY(5px);
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
