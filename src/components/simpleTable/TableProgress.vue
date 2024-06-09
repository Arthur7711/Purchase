<script setup lang="ts">
import { ref, watch } from "vue";
import type { IProgressTable, IHoveredData } from "./types";
import Search from "../icons/Search.vue";
import GreenRounded from "../icons/GreenRounded.vue";
import PinkRounded from "../icons/PinkRounded.vue";
import MaskRounded from "../icons/MaskRounded.vue";
import useCheckedName from "../../store/checkedName";
import {
  readabilityNumber,
  readabilityDotNumbers,
} from "../../helpers/readabilityNumber";
import useTableSelection from "../../store/selectedTableItem";
import useDateFrom from "../../store/dateFrom";
import useDateTo from "../../store/dateTo";
import ProgressCustom from "../progressCustom/ProgressCustom.vue";

const props = defineProps<{
  products: Array<IProgressTable>;
  selectedProduct: Array<IProgressTable>;
  titleswitch: boolean;
  currency: string;
}>();

const emit = defineEmits<{
  (e: "select-product", value: IProgressTable[]): void;
}>();

const selectedProduct = ref(props.selectedProduct);
const searchData = ref("");
const tableData = ref<IProgressTable[]>(props.products);
const hoveredItem = ref<IHoveredData>({
  id: undefined,
  approved: undefined,
  pending: undefined,
  reject: undefined,
});
const url_start = import.meta.env.VITE_VUE_PROJECT;
const showPopup = ref(Infinity);
const changeShowPopup = (num: number) => (showPopup.value = num);
const possitions = ref({ x: Infinity, y: Infinity });
const setPossitions = (coordinates: { x: number; y: number }) => {
  if (coordinates.y + 400 > window.innerHeight) {
    possitions.value = { x: coordinates.x, y: coordinates.y - 100 };
  } else {
    possitions.value = coordinates;
  }
};

const rowClass = (data: any) => {
  return [{ checkedRow: data.name == useCheckedName.checkedName.value }];
};

watch(selectedProduct, () => {
  emit("select-product", selectedProduct.value);
});
watch(searchData, () => {
  tableData.value = props.products.filter((searchedItem) =>
    searchedItem.name.toLowerCase().includes(searchData.value.toLowerCase())
  );
});
watch(showPopup, () => {
  const hoveredData = tableData.value.find((el) => el.id === showPopup.value);
  hoveredItem.value = {
    approved: hoveredData?.approved,
    id: hoveredData?.id,
    pending: hoveredData?.pending,
    reject: hoveredData?.reject,
  };
});
const makeHighlighting = (index: number) => {
  document.getElementById("tableRef")?.scrollTo(0, index * 50);
};
watch(useCheckedName.checkedName, () => {
  makeHighlighting(
    props.products.findIndex((el) => el.name === useCheckedName.checkedName.value)
  );
});
const clickRow = (e: { index: number; data: IProgressTable }) => {
  useTableSelection.setCheckedIndex(e.data.color);
};
</script>
<template>
  <div class="card_progress_table" id="tableRef">
    <DataTable
      v-model:selection="selectedProduct"
      :value="tableData"
      dataKey="id"
      class="leader_table"
      :row-hover="true"
      :show-gridlines="false"
      :row-class="rowClass"
      :header-class="'leaders_header_class'"
      v-on:row-click="(e) => clickRow(e)"
      table-class="leaders_table"
      :table-style="{ 'border-spacing': '0rem 1rem' }"
    >
      <Column
        selectionMode="multiple"
        headerStyle="border-radius: 10px 0px 0px 10px"
        :body-style="{
          'border-radius': '10px 0px 0px 10px',
          display: 'flex',
          justifyContent: 'center',
          'margin-top': '15px',
        }"
        body-class="checkboxItem"
        header-class="checkboxItem"
      ></Column>
      <Column
        field="name"
        body-style="
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          color: var(--vt-c-electric-blue);
        "
      >
        <template #header>
          <div class="filterBox">
            <InputText :placeholder="$t('title')" v-model="searchData" /><Search
              class="searchIcon"
            />
          </div>
        </template>

        <template #body="{ data }">
          <div class="title_box">
            <div class="img_box">
              <img alt="avatar" :src="data.imgUrl" />
            </div>
            <p>{{ data.name }}</p>
          </div>
        </template>
        ></Column
      >
      <Column
        field="reserveSum"
        :header-style="{ marginLeft: '-40px' }"
        :header="
          props.currency.includes('N') ? $t('br sum') : $t('amount') + props.currency
        "
        #body="{ data }"
        ><p>{{ readabilityNumber(Math.floor(data.reserveSum)) }}</p></Column
      >
      <Column field="procentItem" :header="$t('% approvals')">
        <template #body="{ data }">
          <div
            class="progress_box"
            @mousemove="
              (e) => {
                changeShowPopup(data.id);
                if (data.id) setPossitions({ x: e.clientX + 10, y: e.pageY });
              }
            "
            @mouseleave="
              () => {
                changeShowPopup(Infinity);
              }
            "
          >
            <p style="">
              {{ data.approvedProcent }}
            </p>
            <span>
              <ProgressCustom
                :progress="{
                  success: data.approved,
                  error: data.reject,
                  pending: 0,
                }"
                custom-width="60px"
                custom-height="10px"
              />
            </span>
          </div>
        </template>
      </Column>
      <Column
        field="count"
        :header="props.titleswitch ? $t('item items') : $t('approved')"
      >
        <template #body="{ data }">
          <a
            target="_blank"
            :href="`${url_start}#/purchases?table_type=position&approver_ids=${data.id}&date_from=${useDateFrom.dateFrom.value}&date_to=${useDateTo.dateTo.value}`"
            style="color: var(--vt-c-electric-blue)"
            >{{ readabilityNumber(data.count) }}</a
          >
        </template>
      </Column>
      <Column
        field="procent"
        header=""
        headerStyle="border-radius: 0px 10px 10px 0px;"
        :body-style="{
          'border-radius': '0px 10px 10px 0px',
          padding: '0px',
          margin: '0px',
        }"
      >
        <template #body="{ data }">
          <div
            :style="{
              background: data.color,
              height: '55px',
              'border-radius': '0px 10px 10px 0px',
              margin: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              whiteSpace: 'nowrap',
            }"
          >
            {{ readabilityDotNumbers(data.procent) }}
          </div>
        </template>
      </Column>
    </DataTable>
    <div
      v-if="showPopup === hoveredItem.id"
      :style="{
        width: '147px',
        minHeight: '140px',
        background: '#F4F4F4',
        'box-shadow': '0px 0px 14px 7px rgba(120, 122, 125, 0.4)',
        'border-radius': '10px',
        padding: '12px 14px',
        position: 'fixed',
        top: possitions.y + 'px',
        left: possitions.x + 'px',
      }"
      :key="showPopup"
    >
      <p style="color: #999999; font-size: 13px; margin-bottom: 8px">
        {{ $t("approval statistics") }}
      </p>
      <p style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px">
        <GreenRounded />
        <span style="color: var(--vt-c-tabs-gray)"
          >{{ $t("approved") }}:
          {{ hoveredItem.approved || 0 }}
        </span>
      </p>
      <p style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px">
        <PinkRounded />
        <span style="color: var(--vt-c-tabs-gray)"
          >{{ $t("denied") }}:
          {{ hoveredItem.reject || 0 }}
        </span>
      </p>
      <p style="display: flex; align-items: center; gap: 8px">
        <MaskRounded />
        <span style="color: var(--vt-c-tabs-gray)"
          >{{ $t("pending") }}:
          {{ hoveredItem.pending || 0 }}
        </span>
      </p>
    </div>
  </div>
</template>
<style lang="scss">
.leaders_table {
  .p-datatable-tbody {
    tr {
      border-radius: 10px;
      box-shadow: 0px 0px 5px 0px #00000014;
      background-color: #fff !important;
      &:focus {
        outline: none !important;
      }
      td {
        padding: 0px !important;
        &:nth-child(1) {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        &:nth-child(6) {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
  .filterBox {
    text-align: left !important;
  }
  .p-column-title {
    margin-left: -14px !important;
    text-align: left;
  }
}
.leader_table {
  th {
    border: none !important;
    background: none !important;
    color: var(--vt-c-text-black);
  }
  td {
    border: none !important;
    color: var(--vt-c-text-black);
  }
  .checkboxItem {
    div {
      .p-highlight {
        background: var(--vt-c-electric-blue);
      }
    }
  }
  .filterBox {
    position: relative;
    .searchIcon {
      position: absolute;
      left: 100px;
      top: 12px;
    }
    input {
      border: none;
    }
    input:focus {
      box-shadow: none;
    }
  }
  .title_box {
    display: flex;
    align-items: center;
    gap: 10px;
    .img_box {
      width: 35px;
      height: 35px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }
  .progess {
    height: 6px;
    width: 60px;
  }
  .progress_box {
    display: flex;
    align-items: center;
    gap: 8px;
    p {
      color: var(--vt-c-progress-green);
      font-size: 14px;
      line-height: 18px;
      width: 25px;
    }
  }
}
.p-progressbar .p-progressbar-value {
  background: var(--vt-c-progress-green);
}
.card_progress_table {
  position: relative;
  max-height: 79vh;
  overflow-y: auto;
  padding: 0 20px;
  .progress_information {
    width: 100px;
    height: 100px;
    background: red;
    position: absolute;
  }
}
tr.p-highlight.checkedRow {
  background-color: var(--vt-c-backgroud-gray) !important;
}

.p-highlight.checkedRow {
  background-color: var(--vt-c-backgroud-gray) !important;
}

.p-datatable-wrapper > table > thead > tr > th {
  text-align: right !important;
  span {
    //margin-left: -7px !important;
    //margin-right: 20px;
    text-align: left;
    //padding-left: -15px !important;
  }
}
</style>
