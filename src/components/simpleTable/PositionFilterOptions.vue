<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import PurchtableDropdown from "../custom/purch_table_filters/purchtableDropdown.vue";
import PurchTableOverlayDate from "../custom/purch_table_filters/purchTableOverlayDate.vue";
import PurchPriceFilter from "../custom/purch_table_filters/PurchPriceFilter.vue";
import PositionMultiselect from "../custom/position_table_filters/PositionMultiselect.vue";
import PurchTextFilter from "../custom/purch_table_filters/PurchTextFilter.vue";
import usePositionFilter from "../../store/purchases_store/positionsFilter";
import i18n_config from "@/locales/i18n_config";
import SortButton from "@/components/custom/SortButton.vue";

const props = defineProps<{
  field_name: string;
  options: { id: number | string; name: string }[];
  selected_sort: {
    field: string;
    dir: string;
  };
}>();
const { messages, locale } = i18n_config.global;
const approve_statuses = [
  { id: "none", name: messages[locale]["no match"] },
  { id: "pending", name: messages[locale].pending },
  { id: "rejected", name: messages[locale].rejected },
  { id: "accepted", name: messages[locale].accepted },
];
const nameParams: { [key: string]: string[] } = {
  id: ["item_id", "ID"],
  purchase_id: ["purchase_id", messages[locale]["purchase ID"]],
  task_id: ["task_id", messages[locale]["task ID"]],
  note: ["note", messages[locale]["note"]],
  item_name: ["name", messages[locale]["name"]],
  sn: ["sn", messages[locale]["serial number"]],
  status: ["product_status_ids", messages[locale]["status"]],
  approval: ["approve_statuses", messages[locale]["agreement"]],
  contragent: ["contragent_ids", messages[locale]["supplier"]],
  "purchase.legal_entity": ["legal_ids", messages[locale]["legal entity"]],
  type: ["type_ids", messages[locale]["type"]],
  subtype: ["subtype_ids", messages[locale]["subtype"]],
  purpose: ["purpose_ids", messages[locale]["purpose"]],
  warehouse: ["warehouse_ids", messages[locale]["warehouse"]],
  budget: ["budget_ids", messages[locale]["budget"]],
};

const handleSetPrice = (value: string | number, field: string) => {
  usePositionFilter.setPositionsFilters({ val: value, name: field });
};

const handleChange = (val: { val: any; field: string }) => {
  switch (val.field) {
    case "id":
    case "purchase_id":
    case "task_id":
    case "note":
    case "item_name":
    case "sn":
      usePositionFilter.setPositionsFilters({
        val: val.val,
        name: nameParams[val.field][0],
      });
      break;
    case "document.document_date":
      usePositionFilter.setPositionsFilters({
        val: val.val.dateFrom,
        name: "document_date_from",
      });
      usePositionFilter.setPositionsFilters({
        val: val.val.dateTo,
        name: "document_date_to",
      });
      break;
    case "document.delivery_date":
      usePositionFilter.setPositionsFilters({
        val: val.val.dateFrom,
        name: "delivered_from",
      });
      usePositionFilter.setPositionsFilters({
        val: val.val.dateTo,
        name: "delivered_to",
      });
      break;
    default:
      usePositionFilter.setPositionsFilters({
        val: val.val.map((el: { id: string }) => el.id),
        name: nameParams[val.field][0],
      });
      break;
  }
};
</script>

<template>
  <div style="display: flex; justify-content: flex-start">
    <PurchTextFilter
      v-if="
        field_name === 'id' ||
        field_name === 'purchase_id' ||
        field_name === 'note' ||
        field_name === 'task_id' ||
        field_name === 'item_name' ||
        field_name === 'sn'
      "
      :class="'position_input_filter_' + field_name + ' position_input_filter'"
      :value="usePositionFilter.filters.value[nameParams[field_name][0]]"
      :field_name="field_name"
      :placeholder="nameParams[field_name][1] || ''"
      :style="field_name === 'item_name' ? { width: '150px', maxWidth: '250px' } : {}"
      @change-value="handleChange($event)"
    />

    <PurchtableDropdown
      v-else-if="field_name === 'approval' || field_name === 'status'"
      :field-name="nameParams[field_name][0]"
      :placeholder="nameParams[field_name][1] || ''"
      :style="
        field_name === 'status' && $i18n.locale === 'en'
          ? { marginLeft: '0', width: '30px' }
          : { width: '30px' }
      "
      :table-name="'positions'"
      :options="
        field_name === 'approval'
          ? approve_statuses
          : field_name === 'status'
          ? options
          : [{ id: 0, name: '' }]
      "
      @change="(val) => handleChange({ val: val, field: field_name })"
    />
    <PurchTableOverlayDate
      :name="field_name === 'document.document_date' ? $t('document') : $t('delivery')"
      v-else-if="
        field_name === 'document.document_date' || field_name === 'document.delivery_date'
      "
      :selected-value="
        field_name === 'document.document_date'
          ? [
              usePositionFilter.filters.value.document_date_from,
              usePositionFilter.filters.value.document_date_to,
            ]
          : [
              usePositionFilter.filters.value.delivered_from,
              usePositionFilter.filters.value.delivered_to,
            ]
      "
      @select-date="(val) => handleChange({ val: val, field: field_name })"
      @change-cust-date="(val) => handleChange({ val: val, field: field_name })"
    />

    <PurchPriceFilter
      v-else-if="field_name === 'price' || field_name === 'aux_price'"
      :name="field_name === 'price' ? 'local_price' : field_name"
      :filter-value="usePositionFilter.filters.value[field_name]"
      @select="(val) => handleSetPrice(val, field_name)"
    >
      <template #sort>
        <SortButton
          :startSort="selected_sort.field === field_name ? selected_sort.dir : undefined"
          :field_name="field_name"
          :active="usePositionFilter.filters.value.order_by === field_name"
          @select-dir="(val) => $emit('sel_sort', val)"
        />
      </template>
    </PurchPriceFilter>
    <PositionMultiselect
      v-else-if="
        field_name === 'contragent' ||
        field_name === 'purchase.legal_entity' ||
        field_name === 'type' ||
        field_name === 'subtype' ||
        field_name === 'purpose' ||
        field_name === 'warehouse' ||
        field_name === 'budget'
      "
      :table-name="'positions'"
      :field-name="nameParams[field_name][0]"
      :placeholder="nameParams[field_name][1] || ''"
      :list="options"
      :style="
        field_name === 'subtype'
          ? { width: '100px', textAlign: 'left' }
          : field_name === 'type'
          ? { width: '80px', textAlign: 'left' }
          : field_name === 'purpose'
          ? { width: '80px', textAlign: 'left' }
          : ''
      "
      @change="
        (val) => {
          handleChange({ val: val, field: field_name });
        }
      "
    />
    <div
      v-else
      :style="
        field_name === 'activated_at'
          ? { width: '100px', textAlign: 'left' }
          : { width: '70px', textAlign: 'left' }
      "
    >
      <span style="font-size: 14px; font-weight: 400; color: #696969">{{
        field_name === "purchase.purchase_date"
          ? $t("purchase")
          : field_name === "activated_at"
          ? $t("fact")
          : $t("quantity")
      }}</span>
    </div>
  </div>
</template>

<style lang="scss"></style>
