<script lang="ts" setup>
import type { IBalance, IOperation, ISources } from "@/api/gettersSafe";
import { FilterMatchMode } from "primevue/api";
import { onMounted, ref, watch } from "vue";
import FilterOptionSafe from "./FilterOptionSafe.vue";
import type { TreeNode } from "./types";
import useSafeFilters from "@/store/safeStore/safeFilterStore";
import { useInfiniteScroll } from "@vueuse/core";
import { debounce } from "@/helpers/debounse";
import ProgressSpinner from "primevue/progressspinner";
import type { IParamsBalance } from "@/api/gettersSafe";
import { getOperation } from "@/api/gettersSafe";
import ModalSafeAmount from "./ModalSafeAmount.vue";
import { deleteReserve } from "@/api/postsSafe";

const props = defineProps<{
  options: IOperation | null;
  currency: string;
  isUpdate: boolean;
  safe_account: IBalance;
  entities: TreeNode[];
  columns: {
    id: number;
    field: string;
    name: string;
    active: boolean;
  }[];
}>();

const filters = ref();
const okScroll = ref(false);
const el = ref();
const isUpdate = ref(false);

const emit = defineEmits<{
  (e: "scroll", val: string | number): void;
  (e: "entity_id", val: string | number): void;
  (e: "update", val: boolean): void;
}>();

const setFilters = () => {
  const res: { [key: string]: { value: null; matchMode: any } } = {};
  props.columns.map((el) => {
    res[el.field] = { value: null, matchMode: FilterMatchMode.STARTS_WITH };
  });
  filters.value = res;
};

const handleOpenPurchCard = (id: string | number) => {
  emit("entity_id", id);
};

const handleSetFiltration = (name: string, value: string) => {
  switch (name) {
    case "order_dir":
      useSafeFilters.setFilters(name, value as "desc" | "asc");
      break;
    case "treeSelect":
      if (!Number(value)) {
        useSafeFilters.setFilters("entity_id", "");
        useSafeFilters.setFilters(
          "entity_type",
          value as "" | "income" | "outcome" | "purchase"
        );
      } else {
        useSafeFilters.setFilters("entity_type", "");
        useSafeFilters.setFilters("entity_id", value);
      }
      break;
    case "amount":
      useSafeFilters.setFilters(name, value);
      break;
    default:
      break;
  }
};

onMounted(() => {
  el.value = document.querySelector(".p-datatable-wrapper");
  setFilters();
});

watch(
  () => el.value,
  () => {
    if (el.value) {
      useInfiniteScroll(
        el,
        () => {
          if (
            okScroll.value &&
            props.options &&
            useSafeFilters.filters.value.page &&
            useSafeFilters.filters.value.page < props.options.last_page.toString()
          ) {
            useSafeFilters.setFilters(
              "page",
              Number(useSafeFilters.filters.value.page) + 1
            );
            okScroll.value = false;
          } else okScroll.value = true;
        },
        { distance: 1 }
      );
    }
  }
);

watch(
  () => useSafeFilters.filters.value.page,
  async () => {
    if (!isUpdate.value && useSafeFilters.filters.value.page) {
      isUpdate.value = true;
      emit("scroll", useSafeFilters.filters.value.page);
    } else {
      useSafeFilters.setFilters("page", 1);
    }
    setTimeout(() => {
      isUpdate.value = false;
    }, 290);
  }
);

watch(
  () => props.isUpdate,
  () => {
    isUpdate.value = props.isUpdate;
  }
);
</script>

<template>
  <div v-if="options" class="modal_safe_table_div_all">
    <div
      v-if="isUpdate || props.isUpdate"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 1000;
        width: 420px;
        height: 2109px;
      "
    >
      <div>
        <ProgressSpinner />
      </div>
    </div>
    <div>
      <DataTable
        v-if="options"
        v-model:filters="filters"
        :value="options.data"
        filterDisplay="row"
        scrollable
        scrollHeight="229px"
        :tableClass="'modal_safe_table_table'"
      >
        <Column
          v-for="col in columns"
          :key="col.field"
          :headerClass="'header_class_payments'"
          :showFilterMenu="false"
          filter
        >
          <template #filter>
            <div
              style="text-align: left !important; display: flex"
              :style="
                col.field === 'description'
                  ? {
                      marginLeft: '-48px',
                      backgroundColor: '#ffff',
                      borderRadius: '0px !important',
                    }
                  : ''
              "
            >
              <div class="modal_safe_table_div_colunm_name">
                {{ col.field === "description" || col.field === "date" ? col.name : "" }}
              </div>
              <FilterOptionSafe
                v-if="
                  col.field === 'entity' || col.field === 'date' || col.field === 'amount'
                "
                :entities="entities"
                @change="(e) => handleSetFiltration('treeSelect', e)"
                @sort="(e) => handleSetFiltration('order_dir', e.dir)"
                @input="(val) => handleSetFiltration('amount', val)"
                :column="col.field"
              />
            </div>
          </template>
          <template #body="{ data }"
            ><div
              :style="
                col.field === 'amount'
                  ? { textAlign: 'right', maxWidth: '70px' }
                  : col.field === 'description'
                  ? {
                      marginLeft: '-48px',
                      width: '200px',
                      overflow: 'hidden',
                      maxHeight: '2.5rem',
                    }
                  : col.field === 'entity'
                  ? { maxWidth: '85px' }
                  : ''
              "
              class="modal_safe_table_div_data"
            >
              <div v-if="col.field === 'amount'">
                <ModalSafeAmount
                  :currency="currency"
                  :amount="data[col.field]"
                  :is_active="data.is_active"
                  :entity_id="data.entity.id"
                />
              </div>
              <div
                v-else
                style="display: flex; align-items: center"
                :style="
                  col.field === 'description'
                    ? {
                        width: '95%',
                        fontSize: '13px',
                        marginLeft: '0%',
                        overflow: 'hidden',
                        lineHeight: '20px',
                        display: '-webkit-box',
                        '-webkit-line-clamp': '2',
                        '-webkit-box-orient': 'vertical',
                      }
                    : ''
                "
                v-tooltip="{
                  value: `<span class='purchtable_tooltip_safe'>${
                    data[col.field]
                  }</span>`,
                  escape: true,
                  class: 'custom-tooltip-safe',
                  disabled:
                    col.field === 'description'
                      ? data[col.field]
                        ? data[col.field].length > 40
                          ? false
                          : true
                        : true
                      : true,
                }"
              >
                {{
                  col.field !== "entity"
                    ? col.field === "description"
                      ? data[col.field]
                        ? data[col.field].substr(0, 80)
                        : data[col.field]
                      : data[col.field]
                    : data[col.field].name.split("")[0] === "#"
                    ? data[col.field].name.slice(1)
                    : data[col.field].name
                }}
                <img
                  v-if="
                    col.field === 'entity' && data[col.field].name.split('')[0] === '#'
                  "
                  src="../../../icons/arrow-up-right.svg"
                  alt="#"
                  @click="
                    (e) => {
                      e.stopPropagation();
                      handleOpenPurchCard(data[col.field].name.slice(1));
                    }
                  "
                  style="cursor: pointer; margin-left: 5px"
                />
                <img
                  v-if="data[col.field] && data[col.field]?.id === 1"
                  @click="
                    () => {
                      deleteReserve({
                        safe_id: safe_account.safe_id,
                        id: safe_account.id,
                        entry_id: data.id,
                      });
                      $emit('update', true);
                    }
                  "
                  src="../../../icons/cross_circle_red.svg"
                  alt="(x)"
                  style="margin-top: 1px"
                />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div
      v-if="!options.data.length && !isUpdate"
      style="display: flex; justify-content: center; align-items: center; color: #999"
    >
      {{ $t("list empty") }}
    </div>
  </div>
</template>

<style lang="scss">
.modal_safe_table_div_all {
  padding-left: 2%;
  min-width: 470px;
  max-width: 470px;
  padding-bottom: 0;
  margin-right: 0px;
  .p-datatable .p-datatable-tbody > tr:focus {
    outline: none;
  }
  .p-datatable-wrapper {
    overflow-x: hidden !important;
    width: 480px !important;
    border: none !important;
  }
  .p-datatable .p-datatable-thead > tr > th {
    padding: 0px 0px 0px 0px !important;
    font-size: 14px !important;
    border: none !important;
    background-color: white !important;
  }
  .p-datatable .p-datatable-tbody > tr > td {
    padding: 0px 0px 10px 0px !important;
    font-size: 14px !important;
    border-radius: 10px !important;
  }
  .p-filter-column {
    text-align: left !important;
    border-radius: 0px !important;
  }
}

.safe_tooltip_description {
  height: 50px !important;
  background-color: #fff;
}

.modal_safe_table_div_colunm_name {
  color: var(--mono-grey, #999);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
}

.custom-tooltip-safe .p-tooltip-text {
  background-color: white;
  color: #666666;
  min-height: 25px;
  padding-bottom: 5px;
  padding-top: 1px;
  font-size: 14px;
}

.custom-tooltip-safe.p-tooltip-right .p-tooltip-arrow {
  background-color: #fff;
  padding: none;
  color: #666666;
}
@media only screen and (max-width: 650px) {
  .modal_safe_table_div_all {
    .p-datatable-wrapper {
      overflow-x: scroll !important;
      width: 82vw !important;
    }
    .p-datatable {
      max-width: 80vw !important;
      overflow-x: hidden;
    }
  }
}
</style>
