<template>
  <div class="transfers-tab">
    <DataTable class="tabs-table" scrollable scrollHeight="58vh" :value="transfers">
      <template #empty>
        <p class="tabs-table_no-data">{{ $t("no transfers") }}</p>
      </template>
      <Column
        field="created_at"
        :style="{
          width: '20%',
        }"
        sortable
      >
        <template #header>
          <p class="tabs-table__header">{{ $t("date") }}</p>
        </template>
        <template #body="{ data }">
          <p class="tabs-table__cell">
            {{
              data.created_at && new Date(data.created_at).toLocaleString().split(",")[0]
            }}
          </p>
        </template>
      </Column>
      <Column
        field="task_id"
        :style="{
          width: '20%',
        }"
        sortable
      >
        <template #header>
          <p class="tabs-table__header">{{ $t("task ID") }}</p>
        </template>
        <template #body="{ data }">
          <p class="tabs-table__cell">
            <a :href="`${API_URL_HD}#/?id=${data.task_id}`" target="_blank">{{
              data.task_id
            }}</a>
          </p>
        </template>
      </Column>
      <Column
        field="active_id"
        :style="{
          width: '20%',
        }"
        sortable
      >
        <template #header>
          <p class="tabs-table__header">{{ $t("actives ID") }}</p>
        </template>
        <template #body="{ data }">
          <p class="tabs-table__cell">
            <a :href="`${API_URL_ACTIVES}#/all?id=${data.active_id}`" target="_blank">{{
              data.active_id
            }}</a>
          </p>
        </template>
      </Column>
      <Column
        field="warehouse_id"
        :style="{
          width: '40%',
        }"
      >
        <template #header>
          <p class="tabs-table__header">{{ $t("warehouse") }}</p>
        </template>
        <template #body="{ data }">
          <p class="tabs-table__cell">
            {{ data.warehouse && data.warehouse.name }}
          </p>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import type { ITransferPosition } from "../../../dialogs/types";

const props = defineProps<{
  transfers?: ITransferPosition[];
}>();

const API_URL_ACTIVES = import.meta.env.VITE_VUE_ACTIVES;
const API_URL_HD = import.meta.env.VITE_VUE_HD;
</script>

<style lang="scss">
@import "../../purchaseCard/style.scss";

.transfers-tab {
  width: 100%;
  height: 90%;
  background-color: #fff;
  border-radius: 10px;
  padding-top: 10px;
}
</style>
