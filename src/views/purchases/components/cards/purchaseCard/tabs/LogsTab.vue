<template>
  <div class="logs-tab">
    <DataTable class="tabs-table" scrollable scrollHeight="55vh" :value="data">
      <template #empty>
        <p class="tabs-table_no-data">{{ $t("no logs") }}</p>
      </template>
      <Column
        field="created_at"
        :style="{
          width: '15%',
        }"
      >
        <template #header>
          <p class="tabs-table__header">{{ $t("date") }}</p>
        </template>
        <template #body="{ data }">
          <p class="tabs-table__cell">
            {{ data.created_at && formatDateTZ(data.created_at) }}
          </p>
        </template>
      </Column>
      <Column
        field="creator.description"
        :style="{
          width: '25%',
        }"
      >
        <template #header>
          <purchtableDropdown
            :options="creators"
            :placeholder="$t('user')"
            :table-name="''"
            :fieldName="'creator'"
            @select="filterLogs($event)"
          />
        </template>
        <template #body="{ data }">
          <p class="tabs-table__cell">
            {{
              i18n_config.global.locale === "ru"
                ? data.creator.description
                : data.creator.displayname
            }}
          </p>
        </template>
      </Column>
      <Column
        field="data"
        :style="{
          width: '60%',
        }"
      >
        <template #header>
          <div class="tabs-table__header--wrapper">
            <p class="tabs-table__header">{{ $t("action") }}</p>
            <button
              :class="['tabs-table__header-btn', { active: isSort }]"
              @click="sortLogs"
            >
              {{ $t("sorting") }} <img alt="sort" :src="sortArrow" />
            </button>
          </div>
        </template>
        <template #body="{ data }">
          <div class="tabs-table__cell text">
            <p v-for="str in data.data.split('\n')" :key="str">
              {{ str }}
            </p>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import i18n_config from "@/locales/i18n_config";

import sortArrow from "@/components/icons/sort-arrows.svg";

import type { ILog } from "../../../dialogs/types";
import purchtableDropdown from "@/components/custom/purch_table_filters/purchtableDropdown.vue";

const props = defineProps<{
  logs?: ILog[];
}>();

const data = ref<ILog[]>(props.logs ? [...props.logs] : []);
const logs = ref(props.logs ? [...props.logs] : []);

const creators = computed<{ id: number; description: string }[]>((): {
  id: number;
  description: string;
}[] => {
  const valueLocale =
    props.logs &&
    props.logs.map((item: ILog) => {
      return {
        ...item,
        creator: {
          ...item.creator,
          description:
            i18n_config.global.locale === "ru"
              ? item.creator.description
              : item.creator.displayname,
        },
      };
    });

  const logs = JSON.parse(JSON.stringify(valueLocale)) as ILog[];

  return Array.isArray(logs)
    ? logs.reduce(
        (res: { id: number; description: string }[], cur: ILog) =>
          res.find((find) => JSON.stringify(find) === JSON.stringify(cur.creator))
            ? res
            : [...res, cur.creator],
        []
      )
    : [];
});

const isSort = ref(false);

watch(
  () => props.logs,
  (value) => {
    logs.value = value ? [...value] : [];
    data.value = [...logs.value];
  },
  { deep: true }
);

const formatDateTZ = (date: string) => {
  const newDateTZ = new Date(date).toLocaleString().split(", ");
  const newDate = newDateTZ[0].split(".");

  return (
    `${newDate[0]}.${newDate[1]}.${newDate[2].slice(2)}` + " " + newDateTZ[1].slice(0, 5)
  );
};

const sortLogs = (): void => {
  isSort.value = !isSort.value;

  if (data.value.length === logs.value.length) {
    logs.value.sort((log1: ILog, log2: ILog) => {
      const date1: any = new Date(log1.created_at);
      const date2: any = new Date(log2.created_at);

      return isSort.value ? date2 - date1 : date1 - date2;
    });

    data.value = JSON.parse(JSON.stringify(logs.value));
  } else {
    data.value.sort((log1: ILog, log2: ILog) => {
      const date1: any = new Date(log1.created_at);
      const date2: any = new Date(log2.created_at);

      return isSort.value ? date2 - date1 : date1 - date2;
    });

    logs.value.sort((log1: ILog, log2: ILog) => {
      const date1: any = new Date(log1.created_at);
      const date2: any = new Date(log2.created_at);

      return isSort.value ? date2 - date1 : date1 - date2;
    });
  }
};

const filterLogs = (
  selected: { id: string | number; name?: string; description?: string }[]
) => {
  data.value = [];

  if (selected.length === 0) {
    data.value = JSON.parse(JSON.stringify(logs.value));
  } else {
    logs.value.forEach((item: ILog) => {
      selected.forEach((el) => {
        if (item.creator.id === el.id) {
          data.value.push(item);
        }
      });
    });
  }
};
</script>

<style lang="scss">
@import "./style.scss";

.logs-tab {
  width: 100%;
  height: 90%;
  background-color: #fff;
  padding: 14px 24px 12px 24px;
  border-radius: 10px;
}
</style>
