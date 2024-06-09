<script lang="ts" setup>
import DropdownNoneBorder from '@/components/dropdown_exp/DropNonBorderLarge.vue';
import { onMounted, ref, watch } from 'vue';
import CalendarIcon from '@/components/icons/CalendarIcon.vue';
import { format } from 'date-fns';
import {
  setSafeDateFormat,
  monthSafeChange,
  halfYearSafeChange,
  yearSafeChange,
  customSafeDateFrom,
  customSafeDateTo
} from '@/helpers/dateSafehelpers';
import useSafeFilters from '@/store/safeStore/safeFilterStore';
import type { DropdownChangeEvent } from 'primevue/dropdown';

const emit = defineEmits<{
  (e: 'format_change', val: number | string): void;
}>();

const mounted = ref(false);
const date_Format = ref<string | number>(0);
const selectedDate = ref<string | Date>(new Date());
const customDate = ref(['']);
const minDate = ref();

const handleHide = (e: Event) => {
  const elem = document.querySelector(
    'div.date_picker_safe_div_all .p-dropdown-trigger'
  ) as HTMLElement;
  const dropdown_items_wrapper = document.querySelector('.p-dropdown-items-wrapper');
  if (dropdown_items_wrapper) {
    elem.click();
  }
};

onMounted(() => {
  monthSafeChange(format(new Date(), 'yyyy-MM-01'));
  setTimeout(() => {
    mounted.value = true;
  }, 350);
});

watch(date_Format, () => {
  if (date_Format.value !== undefined && mounted.value) {
    switch (date_Format.value) {
      case 1:
        yearSafeChange(
          format(
            new Date(),
            `${
              !useSafeFilters.filters.value.date_from ||
              Number(useSafeFilters.filters.value.date_from.split('-')[0]) < 2000
                ? new Date().getFullYear()
                : useSafeFilters.filters.value.date_from.split('-')[0]
            }-01-01`
          )
        );
        selectedDate.value = format(
          new Date(),
          `${useSafeFilters.filters.value.date_from!.split('-')[0]}`
        );
        break;
      case 0:
        monthSafeChange(
          format(
            new Date(),
            `${
              Number(useSafeFilters.filters.value.date_from!.split('-')[0]) < 2000
                ? new Date().getFullYear()
                : useSafeFilters.filters.value.date_from!.split('-')[0]
            }-${
              Number(useSafeFilters.filters.value.date_from!.split('-')[0]) < 2000
                ? new Date().getMonth() + 1 < 10
                  ? '0' + (new Date().getMonth() + 1)
                  : new Date().getMonth() + 1
                : useSafeFilters.filters.value.date_from!.split('-')[1]
            }-01`
          )
        );
        selectedDate.value = format(
          new Date(),
          `${useSafeFilters.filters.value.date_from!.split('-')[0]}.${
            new Date().getMonth() + 1 < 10
              ? '0' + (new Date().getMonth() + 1).toString()
              : new Date().getMonth() + 1
          }`
        );
        break;
      default:
        break;
    }

    emit('format_change', date_Format.value);
  }
});

const setterDateFormat = (val: string | number) => {
  date_Format.value = val;
  setSafeDateFormat(val);
};
</script>

<template>
  <div class="date_picker_safe_div_all">
    <div class="date_picker_safe_div_picker" style="">
      <Transition>
        <label v-if="date_Format?.toString()" for="dropdown_purch_date" class="purch_label_date">{{
          $t('period')
        }}</label>
      </Transition>
      <Dropdown
        :disable="false"
        v-model="date_Format"
        id="dropdown_purch_date"
        class="date_picker_safe_dropdown_header"
        option-label="title"
        @change="(e: DropdownChangeEvent) => setterDateFormat(e.value)"
        option-value="id"
        :options="[
          { id: 0, title: $t('month') },
          { id: 1, title: $t('year') },
          { id: 2, title: $t('arbitrary') },
          { id: 3, title: $t('all time') }
        ]"
        @blur="handleHide"
      />
    </div>
    <div style="max-height: 40px; width: 8px"></div>
    <div class="date_picker_safe_div_all_calendars">
      <label v-if="date_Format === 0" for="purch_label_calendar" class="safe_label_calendar">{{
        $t('select month')
      }}</label>
      <label v-else-if="date_Format === 1" for="purch_label_calendar" class="safe_label_calendar">{{
        $t('select year')
      }}</label>
      <label v-else-if="date_Format === 2" for="purch_label_calendar" class="safe_label_calendar">{{
        $t('select period')
      }}</label>
      <label v-else-if="date_Format === 3" for="purch_label_calendar" class="safe_label_calendar">{{
        $t('all time')
      }}</label>
      <div
        :class="date_Format === 3 ? 'safe_modal_div_calendars_alltime' : 'safe_modal_div_calendars'"
        class="safe_modal_div_calendars"
      >
        <Calendar
          v-if="date_Format === 0"
          view="month"
          v-model="selectedDate"
          dateFormat="yy.mm"
          @date-select="(val : Date) => monthSafeChange(val.toDateString())"
          id="purch_label_calendar"
          :placeholder="$t('select') + ' ' + $t('month')"
        >
          <template #dropdownicon>
            <img
              class="safe_modal_icon_calendar"
              style="width: 14px; height: 14px; margin-bottom: -3px"
              src="../../../icons/calendar.svg"
              alt=""
            />
          </template>
        </Calendar>
        <Calendar
          v-else-if="date_Format === 1"
          id="purch_label_calendar"
          view="year"
          v-model="selectedDate"
          :placeholder="$t('select') + ' ' + $t('year')"
          dateFormat="yy"
          @date-select="(val : Date)=> yearSafeChange(val.toDateString())"
        >
          <template #dropdownicon
            ><img
              class="safe_modal_icon_calendar"
              style="margin-bottom: -3px"
              src="../../../icons/calendar.svg"
              alt=""
          /></template>
        </Calendar>
        <div v-else-if="date_Format === 2" class="safe_modal_div_calendars_container">
          <Calendar
            class="calendar_header_purch_double"
            v-model="customDate[0]"
            id="purch_label_calendar"
            dateFormat="dd.mm.yy"
            :input-class="'modal_safe_calendar_double_one_input'"
            :placeholder="$t('date from')"
            @date-select="
              (val : Date) => {
                customSafeDateFrom(val.toDateString())
                customSafeDateTo(new Date().toDateString())
                minDate = val
              }
            "
          >
          </Calendar>
          <img src="../../../icons/arrow-light-long.svg" style="margin-bottom: -3px" alt="" />
          <Calendar
            class="calendar_header_purch_double"
            v-model="customDate[1]"
            id="purch_label_calendar"
            show-icon
            dateFormat="dd.mm.yy"
            :min-date="minDate"
            @date-select="(val : Date) => customSafeDateTo(val.toDateString())"
            :placeholder="$t('date to')"
          >
            <template #dropdownicon
              ><img
                class="safe_modal_icon_calendar"
                style="margin-left: 70%"
                src="../../../icons/calendar.svg"
                alt=""
            /></template>
          </Calendar>
        </div>
        <div
          style="margin-top: 12px; margin-left: 11px"
          id="purch_label_calendar"
          v-else-if="date_Format === 3"
        >
          {{ $t('all time') }}
        </div>
        <div
          style="margin-top: 3px !important"
          id="purch_label_calendar"
          v-else-if="!date_Format && date_Format != 0"
        >
          {{ $t('select') + ' ' + $t('period') }}
        </div>
        <img
          v-if="date_Format !== 2 && date_Format !== 3"
          class="safe_modal_icon_calendar"
          src="../../../icons/calendar.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.date_picker_safe_div_all {
  display: flex;
}

.date_picker_safe_dropdown_header {
  padding-right: 6px !important;
  padding-left: 2px;
  padding-top: 2px;
  margin-top: -5px !important;
  border-radius: 9px;
  height: 70px !important;
  border: 1px solid #e3e3e3 !important;
  .p-dropdown-trigger {
    margin-top: 5px !important;
  }
  .p-dropdown,
  .p-dropdown-label {
    margin-top: 1px;
    background: none;
    font-size: 16px !important;
    font-weight: 400 !important;
    margin-left: -2px !important;
    padding: 11px;
    padding-right: 15px;
  }
  .p-inputwrapper-focus {
    border: 1px solid #e3e3e3 !important;
  }
}

.modal_safe_calendar_double_one_input {
  width: 100% !important;
}

.date_picker_safe_div_picker {
  display: flex;
  flex-direction: column;
  max-height: 50px;
  min-width: max-content;
  margin-right: 8px;
}

.safe_modal_div_calendars_container {
  background-color: white;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  border: 1px solid #e3e3e3 !important;
}

.date_picker_safe_div_all_calendars {
  margin-top: -0.5px;
  margin-left: -5px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
}

.safe_modal_div_calendars_alltime {
  padding-right: 6px !important;
  padding-left: 0px;
  padding-top: 2px;
  margin-top: -2px !important;
  border-radius: 12px;
  background-color: #fff;
  height: 50px;
  border: 1px solid #e3e3e3 !important;
}

.safe_modal_div_calendars {
  margin-top: -3px;
  display: flex;
  height: 50px !important;
  .p-inputtext {
    border: 1px solid #e3e3e3 !important;
  }
}

.safe_label_calendar {
  background: none;
  margin-bottom: -16px;
  background: none;
  color: #999999;
  margin-left: 12px;
  font-size: 12px;
  z-index: 2;
}

.safe_modal_icon_calendar {
  margin-left: -20px;
}

.date_picker_safe_div_all {
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

@media only screen and (max-width: 650px) {
  .date_picker_safe_div_all {
    flex-direction: column;
  }
  .date_picker_safe_div_all_calendars {
    margin-left: 2px;
    margin-top: 5%;
  }
  .safe_modal_icon_calendar {
    max-width: 12px !important;
    min-height: 12px !important;
  }
}
</style>
