<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { IProgressTable } from "./types";
import DropdownIcon from "../icons/DropdownIcon.vue";
import Info from "../icons/Info.vue";
import ProgressCustom from "../progressCustom/ProgressCustom.vue";
import type { IContragent } from "../../views/suppliers/types";
import GreenRounded from "../icons/GreenRounded.vue";
import PinkRounded from "../icons/PinkRounded.vue";
import MaskRounded from "../icons/MaskRounded.vue";
import { useRouter } from "vue-router";
import { format } from "date-fns";
import { getContragents, getLegalEntities } from "@/api/suppliersPage";
import { debounce } from "../../helpers/debounse";
import { useInfiniteScroll } from "@vueuse/core";
import i18n_config from "@/locales/i18n_config";
import ArrowUp from "../icons/ArrowUp.vue";

const props = defineProps<{
  legal_entities?: { id: number | null; name: string }[];
}>();

const legal = ref<{ id: number | null; name: string }[] | null>(
  props.legal_entities ? props.legal_entities : null
);
const { locale, messages } = i18n_config.global;
const router = useRouter();
const scrollMake = ref<HTMLElement | null>(null);
const contragents = ref<IContragent[]>([]);
const errorInfo = ref();
const searchNameData = ref("");
const searchInnData = ref("");
const tableData = ref<IContragent[]>(contragents.value);
const showPopup = ref(false);
const selectedOption = ref<{ name: string; id: boolean | undefined }>();
const selectedLegal = ref<{ name: string; id: boolean | undefined }>();
const optionsDropdown = [
  { name: messages[locale].all, id: undefined },
  { name: messages[locale].active, id: true },
  { name: messages[locale].completed, id: false },
];
const pageCount = ref(1);
const lastPage = ref(0);
const called = ref<boolean>(false);
const but = ref<Element[]>();
const showAnchor = ref(false);
const addNewItems = debounce(async function () {
  if (pageCount.value <= lastPage.value)
    await getContragents({
      inn: searchInnData.value,
      name: searchNameData.value,
      is_active_contract: selectedOption.value?.id,
      page: pageCount.value,
    })
      .then(({ data }) => {
        contragents.value = [...contragents.value, ...data.data];
        pageCount.value = data.current_page + 1;
      })
      .catch((err) => (errorInfo.value = err.message));
}, 500);
const search = debounce(async function () {
  await getContragents({
    inn: searchInnData.value,
    name: searchNameData.value,
    is_active_contract: selectedOption.value?.id,
    legal_id:
      selectedLegal.value && selectedLegal.value.id
        ? ((selectedLegal.value.id as unknown) as number)
        : undefined,
  })
    .then(({ data }) => {
      contragents.value = data.data;
      pageCount.value = 1;
    })
    .catch((err) => (errorInfo.value = err.message));
}, 500);

onMounted(async () => {
  but.value = [
    document.querySelector(".suppliers_page_table_div_all") as Element,
    document.querySelector(".p-datatable-wrapper") as Element,
  ];
  but.value[0].addEventListener("scroll", function (e: any) {
    if (e?.target?.scrollTop > 20) {
      !showAnchor.value ? (showAnchor.value = true) : null;
    } else {
      showAnchor.value ? (showAnchor.value = false) : null;
    }
  });
  await getContragents()
    .then(({ data }) => {
      contragents.value = data.data;
      pageCount.value = data.current_page + 1;
      lastPage.value = data.last_page;
    })
    .catch((err) => (errorInfo.value = err.message));
});
watch(
  () => contragents.value.length,
  () => {
    tableData.value = contragents.value;
  }
);
watch([searchNameData, searchInnData, selectedOption, selectedLegal], () => {
  search();
});
const clickRow = (e: { index: number; data: IProgressTable }) => {
  router.push(`/suppliers/${e.data.id}`);
};
useInfiniteScroll(
  scrollMake,
  () => {
    if (!called.value) {
      addNewItems();
      called.value = true;
      setTimeout(() => {
        called.value = false;
      }, 500);
    }
  },
  { distance: 1000 }
);

const handleAnchorScroll = () => {
  if (but.value) {
    but.value[0].scrollTo({
      top: 0,
      behavior: "smooth",
    });
    but.value[1].scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }
};
</script>
<template>
  <div class="suppliers_page_table_div_all" ref="scrollMake">
    <DataTable
      :value="tableData"
      dataKey="id"
      class="suppliers_page_table"
      scrollable
      :column-resize-mode="'fit'"
      :scroll-height="'82vh'"
      v-on:row-click="(e) => clickRow(e)"
    >
      <Column field="name" body-class="">
        <template #header>
          <div class="filterBox">
            <InputText :placeholder="$t('title')" v-model="searchNameData" />
          </div>
        </template>
        <template #body="{ data }">
          <p class="name_column">{{ data.name }}</p>
        </template>
        ></Column
      >
      <Column field="inn" body-class="">
        <template #header>
          <div class="filterBox">
            <InputText :placeholder="$t('TIN')" v-model="searchInnData" />
          </div>
        </template>
        <template #body="{ data }">
          <p v-if="data.inn">{{ data.inn }}</p>
        </template>
        ></Column
      >
      <Column field="drower">
        <template #header>
          <Dropdown
            optionLabel="name"
            :placeholder="$t('Contract validity')"
            class="dropdown_table"
            :options="optionsDropdown"
            v-model="selectedOption"
            panel-class="dropdown_table_class"
          >
            <template #dropdownicon>
              <DropdownIcon class="tableDropdownIcon" />
            </template>
          </Dropdown>
        </template>
        <template #body="{ data }">
          <p
            v-if="data.latest_frame_contract"
            :style="{
              color: data.latest_frame_contract?.is_active
                ? 'var(--vt-c-progress-green)'
                : 'var(--vt-c-error-text)',
            }"
          >
            {{
              data.latest_frame_contract?.document_date &&
              data.latest_frame_contract?.delivery_date
                ? `${format(
                    new Date(data.latest_frame_contract?.document_date),
                    "y.MM.dd"
                  )}—${format(
                    new Date(data.latest_frame_contract?.delivery_date),
                    "y.MM.dd"
                  )} `
                : data.latest_frame_contract?.document_date &&
                  !data.latest_frame_contract?.delivery_date
                ? format(new Date(data.latest_frame_contract?.document_date), "y.MM.dd")
                : data.latest_frame_contract?.delivery_date &&
                  !data.latest_frame_contract?.document_date
                ? format(new Date(data.latest_frame_contract?.delivery_date), "y.MM.dd")
                : ""
            }}
          </p>
        </template>
      </Column>
      <Column field="latest_frame_contract">
        <template #header>
          <Dropdown
            v-if="legal"
            optionLabel="name"
            :placeholder="$t('legal entity')"
            class="dropdown_table"
            :options="legal"
            v-model="selectedLegal"
            panel-class="dropdown_table_class"
          >
            <template #dropdownicon>
              <DropdownIcon class="tableDropdownIcon" />
            </template> </Dropdown
        ></template>
        {{ selectedLegal }}
        <template #body="{ data }">{{
          data?.latest_frame_contract
            ? data.latest_frame_contract?.legal_entity
              ? data.latest_frame_contract.legal_entity.name
              : "-"
            : "-"
        }}</template>
      </Column>
      <Column field="statistic" header-class="headTitle">
        <template #header
          ><p style="white-space: nowrap">
            {{ $t("procurement statistics") }}
            <Info
              class="statistic_info"
              @mousemove="
                (e) => {
                  showPopup = true;
                }
              "
              @mouseleave="
                () => {
                  showPopup = false;
                }
              "
            />
          </p>
        </template>
        <template #body="{ data }">
          <ProgressCustom
            :progress="{
              success: data.received_purchases_count,
              error: data.cancelled_purchases_count,
              pending: data.pending_purchases_count,
            }"
          />
        </template>
      </Column>
      <Column field="website" :header="$t('site')" header-class="headTitle"> </Column>
    </DataTable>
    <div v-if="showPopup" class="hovered_suppliers_table_info">
      <div>
        <GreenRounded />
        <span>{{ $t("successful") }}</span>
      </div>
      <div>
        <PinkRounded />
        <span>{{ $t("canceled") }}</span>
      </div>
      <div>
        <MaskRounded />
        <span>{{ $t("in process") }}</span>
      </div>
    </div>
    <button
      @click="handleAnchorScroll"
      :class="
        showAnchor
          ? 'suppliers_page_main_button_anchor suppliers_page_main_button_anchor_active'
          : 'suppliers_page_main_button_anchor'
      "
    >
      <ArrowUp :active="false" />
    </button>
  </div>
</template>
<style lang="scss">
.suppliers_page_table {
  &_div_all {
    position: relative;
    overflow-y: auto;
  }
  th {
    border: none !important;
    background: none !important;
    color: var(--vt-c-bold-gray) !important;
    font-weight: 400 !important;
    font-size: 14px !important;
  }
  th:nth-child(1) {
    width: 400px;
  }
  tr {
    background-color: var(--vt-c-white) !important;
    height: 36px;
    box-shadow: none;
    cursor: pointer;
  }
  tbody {
    tr:hover {
      background: var(--vt-c-backgroud-gray) !important;
    }
    tr:focus {
      outline: none !important;
    }
    .name_column {
      max-width: 500px;
      white-space: pre-wrap;
      overflow-x: hidden;
    }
  }
  td {
    border: none !important;
    color: var(--vt-c-text-black);
    padding: 0px 20px !important;
  }
  .filterBox {
    width: 100%;
    input {
      border: none;
      color: var(--vt-c-bold-gray);
      font-weight: 400;
      font-size: 14px;
      width: 100%;
      border-bottom: 1px solid var(--vt-c-backgroud-gray);
      &::placeholder {
        font-size: 14px !important;
      }
    }
    input:focus {
      box-shadow: none;
      border-color: var(--vt-c-backgroud-gray);
    }
    input:hover {
      border-color: var(--vt-c-backgroud-gray);
    }
  }
  .dropdown_table {
    border: none;
    span {
      color: var(--vt-c-bold-gray) !important;
      font-size: 14px;
    }
  }

  .tableDropdownIcon {
    path {
      fill: var(--vt-c-bold-gray);
    }
  }
  .statistic_info {
    height: 10px;
    width: 10px;
    margin-left: 6px;
    path {
      fill: var(--vt-c-text-black);
    }
  }
}
.hovered_suppliers_table_info {
  width: 375px;
  height: 32px;
  border-radius: 10px;
  padding: 6px 14px;
  gap: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 15px 6px rgba(120, 122, 125, 0.4);
  position: absolute;
  background: #fff;
  right: 40px;
  top: 0px;
  z-index: 10;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: nowrap;
    span {
      font-size: 16px;
      font-weight: 400;
      color: var(--vt-c-tabs-gray);
    }
  }
}
.dropdown_table_class {
  ul {
    padding: 10px !important;
    .p-dropdown-item {
      padding: 5px 8px !important;
      border-radius: 7px !important;
    }
    .p-highlight {
      background: rgba(102, 102, 102, 0.2) !important;
      color: var(--vt-c-text-black) !important;
    }
  }
}
</style>
