<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/header/Header.vue";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { usePrimeVue } from "primevue/config";
import useSelectedLang from "./store/selectedLang";
import { useToast } from "primevue/usetoast";
import useError from "@/store/errorStore";
import ScreenParams from "./store/screen";
import { mobileDetector } from "./helpers/isMobile_detector";

const toast = useToast();
const route = useRoute();
const pageUrl = ref("");
const prime = usePrimeVue();
const setRuLocale = () => {
  if (prime.config.locale) {
    prime.config.locale.firstDayOfWeek = 1;
    prime.config.locale.dayNames = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    prime.config.locale.dayNamesShort = ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"];
    prime.config.locale.dayNamesMin = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    (prime.config.locale.monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ]),
      (prime.config.locale.monthNamesShort = [
        "Янв",
        "Фев",
        "Март",
        "Апр",
        "Май",
        "Июнь",
        "Июль",
        "Авг",
        "Сент",
        "Окт",
        "Нояб",
        "Дек",
      ]);
  }
};

const setEnLocale = () => {
  if (prime.config.locale) {
    prime.config.locale.firstDayOfWeek = 0;
    prime.config.locale.dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    prime.config.locale.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    prime.config.locale.dayNamesMin = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    (prime.config.locale.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]),
      (prime.config.locale.monthNamesShort = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]);
  }
};

const showError = (detail: string) => {
  toast.add({ severity: "error", summary: "Error Message", detail: detail, life: 3000 });
};

onMounted(() => {
  useSelectedLang.setLang(
    localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as "ru" | "en")
      : (localStorage.setItem("lang", "en"), "en")
  );
  switch (useSelectedLang.lang.value) {
    case "ru":
      setRuLocale();
      break;
    case "en":
      setEnLocale();
      break;
    default:
      break;
  }
});

watch(
  () => route.path,
  () => {
    pageUrl.value = route.path;
  }
);

watch(
  () => useError.error.value,
  () => {
    if (useError.error.value) {
      showError(useError.error.value);
    }
  }
);
</script>

<template>
  <div v-if="!pageUrl.includes('access_denied')">
    <Header />
  </div>
  <div
    class="mainContent"
    :style="{
      paddingTop:
        pageUrl.includes('prices') && route.path.split('/').length > 3 ? '1%' : '0',
    }"
  >
    <RouterView />
  </div>
  <div>
    <Toast position="bottom-right" />
  </div>
</template>

<style scoped>
.mainContent {
  display: flex;
  align-items: flex-start;
  min-height: 94vh;
  overflow: hidden;
}
.mainBody {
  padding: 36px 24px 18px;
  background: var(--vt-c-white);
  border-radius: 15px;
  min-height: 94vh;
  min-width: 84vw;
}

@media only screen and (max-width: 650px) {
  .mainContent {
    max-width: 100vw;
    overflow: hidden;
  }
  .mainBody {
    overflow: scroll;
  }
}
</style>
