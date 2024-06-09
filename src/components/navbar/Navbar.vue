<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Wallet from '../icons/Wallet.vue';
import Cost from '../icons/Cost.vue';
import Shop from '../icons/Shop.vue';
import UserCheck from '../icons/UserCheck.vue';
import DatePicker from '../datePicker/DatePicker.vue';
import useDateTo from '../../store/dateTo';
import useDateFrom from '../../store/dateFrom';
import { format } from 'date-fns';
import dateConverter from '../../helpers/dateConverter';
import expensesNavbar from './ExpensesNavbar.vue';
import Building from '../icons/Building.vue';
import OfficesNav from './OfficesNav.vue';
import i18n_config from '@/locales/i18n_config';
import OverlayPicker from '@/components/datePicker/OverlayPicker.vue';
import ScreenParams from '@/store/screen';
import usePurposesExp from '@/store/expenses_store/purposes_exp';
const { messages, locale } = i18n_config.global;
const { fullPath } = toRefs(useRoute());
const dateValidation = ref<string>();
const type_id = ref();
const { query } = useRoute();
const route = useRoute();
const router = useRouter();
const customDate = ref<boolean>(false);
const defaultDate = ref({
  dateFrom: !query?.date_from
    ? format(new Date().setMonth(new Date().getMonth() - 6), 'yyyy-MM-dd')
    : (query?.date_from as string),
  dateTo: !query?.date_to ? format(new Date(), 'yyyy-MM-dd') : (query?.date_to as string)
});
const op = ref();

onMounted(() => {
  useDateFrom.setDateFrom(defaultDate.value.dateFrom);
  useDateTo.setDateTo(defaultDate.value.dateTo);
  if (localStorage.getItem('date_arrange')) {
    selectedDateArrange.value = +(localStorage.getItem('date_arrange') as string);
  }
});

const handleDateChange = (arrange: { id: number }, event: any) => {
  selectedDateArrange.value = arrange.id;
  if (arrange.id === 2) {
    handleSetDateArrange(arrange.id);
  } else {
    op.value.toggle(event);
    // type_id.value = arrange.id
  }
  customDate.value = false;
};

const setDateFrom = (date: string): void => {
  dateValidation.value = '';
  let convDate = dateConverter(date);
  defaultDate.value.dateFrom = convDate;
  date ? useDateFrom.setDateFrom(convDate.toString()) : null;
};

const setDateTo = (date: string): void => {
  let convDate = dateConverter(date);
  defaultDate.value.dateTo = convDate;
  date ? useDateTo.setDateTo(convDate.toString()) : null;
};

const setOverlayData = (val: { date_from: string; date_to: string }, id: number) => {
  selectedDateArrange.value = id;
  customDate.value = false;
  setDateFrom(val.date_from);
  setDateTo(val.date_to);
};

const tabs = [
  {
    link: '/analytics/expenses',
    title: messages[locale]['expenses']
  },
  {
    link: '/analytics/offices',
    title: messages[locale]['office comparison']
  },
  {
    link: '/analytics/leaders',
    title: messages[locale]['managers']
  },
  {
    link: '/analytics/suppliers',
    title: messages[locale]['suppliers']
  },
  {
    link: '/analytics/prices',
    title: messages[locale]['prices']
  }
];

const dateArrange = [
  { title: messages[locale]['month'], id: 1 },
  { title: messages[locale]['six months'], id: 2 },
  { title: messages[locale]['year'], id: 3 }
];

const selectedDateArrange = ref(2);
const handleSetDateArrange = (id: number) => {
  if (id === 1) {
    defaultDate.value.dateTo = '';
    defaultDate.value = {
      dateFrom: format(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd'),
      dateTo: format(new Date(), 'yyyy-MM-dd')
    };
    useDateFrom.setDateFrom(defaultDate.value.dateFrom);
    useDateTo.setDateTo(defaultDate.value.dateTo);
  } else if (id === 2) {
    defaultDate.value.dateTo = '';
    defaultDate.value = {
      dateFrom: format(new Date().setMonth(new Date().getMonth() - 6), 'yyyy-MM-dd'),
      dateTo: format(new Date(), 'yyyy-MM-dd')
    };
    useDateFrom.setDateFrom(defaultDate.value.dateFrom);
    useDateTo.setDateTo(defaultDate.value.dateTo);
  } else if (id === 3) {
    defaultDate.value.dateTo = '';
    defaultDate.value = {
      dateFrom: format(new Date().setFullYear(new Date().getFullYear() - 1), 'yyyy-MM-dd'),
      dateTo: format(new Date(), 'yyyy-MM-dd')
    };
    useDateFrom.setDateFrom(defaultDate.value.dateFrom);
    useDateTo.setDateTo(defaultDate.value.dateTo);
  }
};

watch(
  () => selectedDateArrange.value,
  () => {
    localStorage.setItem('date_arrange', String(selectedDateArrange.value));
  }
);

watch(
  () => useDateFrom.dateFrom.value,
  () => {
    if (
      new Date(useDateFrom.dateFrom.value).valueOf() > new Date(useDateTo.dateTo.value).valueOf()
    ) {
      dateValidation.value = 'the start date cannot be greater than the end date';
      useDateFrom.setDateFrom('2021-11-01');
      defaultDate.value.dateFrom = useDateFrom.dateFrom.value;
    }
  }
);
</script>
<template>
  <nav class="navbar">
    <h2 class="titles">{{ $t('analytics') }}</h2>
    <div v-if="ScreenParams.screenParams.width > 650">
      <div v-for="tab in tabs" :key="tab.link" class="tabs">
        <router-link :to="tab.link" class="links" active-class="selectedItem">
          <div v-if="tab.link === '/analytics/expenses'">
            <Wallet :selected="fullPath.includes(tab.link)" />
          </div>
          <div v-if="tab.link === '/analytics/offices'">
            <Building :selected="fullPath.includes(tab.link)" />
          </div>
          <div v-if="tab.link === '/analytics/prices'">
            <Cost :selected="fullPath.includes(tab.link)" />
          </div>
          <div v-if="tab.link === '/analytics/suppliers'">
            <Shop :selected="fullPath.includes(tab.link)" />
          </div>
          <div v-if="tab.link === '/analytics/leaders'">
            <UserCheck :selected="fullPath.includes(tab.link)" />
          </div>
          <p>{{ tab.title }}</p>
        </router-link>
      </div>
    </div>
    <div class="line" v-if="ScreenParams.screenParams.width > 650"></div>
    <div>
      <p class="dateDescription">{{ $t('data for period') }}</p>
      <div class="buttonBox">
        <OverlayPicker
          v-for="arrange in dateArrange"
          class="button"
          :active="
            !!(!customDate ? (selectedDateArrange === arrange.id ? 'activeButton' : '') : '')
          "
          :class="!customDate ? (selectedDateArrange === arrange.id ? 'activeButton' : '') : ''"
          :key="arrange.id"
          @date_select="(val) => setOverlayData(val, arrange.id)"
          :type_id="arrange.id"
        />
      </div>
      <div class="dateContainer">
        <DatePicker
          @setDate="setDateFrom"
          :touchUI="true"
          :default-date="defaultDate.dateFrom"
          @custom-date="(val: boolean) => (customDate = val)"
          class-name="datePickerCalendar"
          input-class-name="calendarInputClassName"
          :type="'from'"
        />
        <DatePicker
          @setDate="setDateTo"
          @custom-date="(val: boolean) => (customDate = val)"
          :default-date="defaultDate.dateTo"
          class-name="datePickerCalendar"
          input-class-name="calendarInputClassName"
        />
      </div>
      <div style="color: red" v-if="dateValidation">
        {{ dateValidation }}
      </div>
    </div>
    <div v-if="route.name === 'expenses' && usePurposesExp.allPurposesExp.value?.data?.length">
      <expensesNavbar />
    </div>
    <div v-if="route.name === 'offices'">
      <OfficesNav />
    </div>
  </nav>
</template>
<style lang="scss">
@import './navbar.scss';
</style>
