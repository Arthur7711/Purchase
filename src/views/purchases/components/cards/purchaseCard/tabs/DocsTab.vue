<template>
  <div class="docs-tab">
    <div class="docs-tab_wrapper">
      <DataTable
        selectionMode="single"
        class="tabs-table"
        scrollable
        scrollHeight="53vh"
        :value="data"
        @row-click="selectedDocument($event.data)"
      >
        <template #empty>
          <p class="tabs-table_no-data">{{ $t("no documents") }}</p>
        </template>
        <Column
          field="is_related"
          :style="{
            width: '5%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("liaison") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              <i
                v-if="data.is_related"
                class="mdi mdi-link"
                :style="{
                  color: '#689f38',
                }"
                @click="
                  (e) => {
                    e.stopPropagation();
                    selectedDocID = selectedDocID ? 0 : data.id;
                    toggleRelated(e);
                  }
                "
              ></i>
            </p>
            <OverlayPanel ref="deleteRelatedDocPopup" class="comment_delete-popup">
              <DeletePopup
                class="comment_delete-popup__content"
                :text="$t('document will be removed')"
                :remove="(id) => deleteRelatedDoc(id)"
                :id="selectedDocID"
                :show-delete-popup="true"
                @cancel="
                  () => {
                    toggleRelated(false);
                    selectedDocID = 0;
                  }
                "
                :x="0"
                :y="0"
              />
            </OverlayPanel>
          </template>
        </Column>
        <Column
          field="type_id"
          :style="{
            width: '15%',
          }"
        >
          <template #header>
            <purchtableDropdown
              :options="useCommonsInfo.commons.value.document_types_purchase"
              :placeholder="$t('type')"
              :fieldName="'docType'"
              :table-name="''"
              :selected-filters="selectedFiltersType"
              @select="
                (e) => {
                  selectedFiltersType = e;

                  data = setFilteredDocs();
                }
              "
            />
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{ data.document_type && commons?.docsTypes[data.document_type] }}
            </p>
          </template>
        </Column>
        <Column
          field="document_date"
          :style="{
            width: '10%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("document") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{
                data.document_date &&
                new Date(data.document_date).toLocaleString().split(",")[0]
              }}
            </p>
          </template>
        </Column>
        <Column
          field="delivery_date"
          :style="{
            width: '10%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("supply") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{
                data.delivery_date &&
                new Date(data.delivery_date).toLocaleString().split(",")[0]
              }}
            </p>
          </template>
        </Column>
        <Column
          field="real_name"
          :style="{
            width: '35%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("title") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell real-name">
              {{ data.real_name }}
            </p>
          </template>
        </Column>
        <Column
          field="document_number"
          :style="{
            width: '15%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("number") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{ data.document_number || "—" }}
            </p>
          </template>
        </Column>
        <Column
          field="item_ids"
          :style="{
            width: '15%',
          }"
        >
          <template #header>
            <PositionMultiselect
              :field-name="'items_ids'"
              :placeholder="$t('items ID')"
              :table-name="''"
              :list="docsItemsID"
              :style="''"
              @change="
                (val) => {
                  selectedFiltersItemsID = val;
                  data = setFilteredDocs();
                }
              "
            />
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{ data.item_ids.reduce((acc: string, prev: string) => acc+= prev + '\n', '') || "—" }}
            </p>
          </template>
        </Column>
        <Column
          field=""
          :style="{
            width: '10%',
          }"
        >
          <template #header>
            <div class="tabs-table__header--wrapper">
              <p class="tabs-table__header"></p>
              <button
                :class="['tabs-table__header-btn', { active: isSort }]"
                @click="sortDocs"
              >
                {{ $t("sorting") }} <img alt="sort" :src="sortArrow" />
              </button>
            </div>
          </template>
          <template #body="{ data }">
            <div
              @click="
                (e) => {
                  e.stopPropagation();
                }
              "
              class="tabs-table__cell btn-actions"
            >
              <button class="btn-actions_item">
                <EyeIcon
                  :color="'rgb(21, 101, 192)'"
                  @click="
                    (e) => {
                      e.stopPropagation();
                      watchDoc(data.file_name);
                    }
                  "
                />
              </button>
              <button class="btn-actions_item">
                <DocumentDownload
                  :color="'rgb(21, 101, 192)'"
                  @click="
                    (e) => {
                      e.stopPropagation();
                      downloadDoc(data.file_name);
                    }
                  "
                />
              </button>
              <button
                class="btn-actions_item"
                @click="
                  (e) => {
                    e.stopPropagation();
                    selectedDocID = selectedDocID ? 0 : data.id;
                    toggle(e);
                  }
                "
              >
                <DeleteIcon />
              </button>

              <OverlayPanel ref="deletePopup" class="comment_delete-popup">
                <DeletePopup
                  class="comment_delete-popup__content"
                  :text="$t('document cannot be restored')"
                  :remove="(id) => deleteDoc(id)"
                  :id="selectedDocID"
                  :show-delete-popup="true"
                  @cancel="
                    () => {
                      toggle(false);
                      selectedDocID = 0;
                    }
                  "
                  :x="0"
                  :y="0"
                />
              </OverlayPanel>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="docs-tab_add-action">
      <button class="docs-tab_add-action__btn" @click="toggleDialogAddDoc = true">
        {{ $t("add") }} {{ $t("document") }} <SquarePlus />
      </button>
      <button class="docs-tab_add-action__btn" @click="toggleRelatedDoc = true">
        {{ $t("add related document") }} <SquarePlus />
      </button>
    </div>
  </div>
  <AddDocumentDialog
    :is-first-closed-doc="!docsPurchaseTypes[3]"
    :groups="groups"
    :title="$t('document addition')"
    :show-hint="!isAmountCovered"
    :is-open="toggleDialogAddDoc"
    :purchase-id="purchaseId"
    :currency="currency"
    :remainder="remainderPayments"
    :debited-currency="debitedCurrency"
    @send="isSendReq = $event"
    @close="toggleDialogAddDoc = $event"
  />
  <EditDocumentDialog
    :title="$t('document editing')"
    :groups="groups"
    :is-open="!!selectedDoc"
    :document="selectedDoc"
    :show-hint="!isAmountCovered"
    :remainder="remainderPayments"
    :purchase-id="purchaseId"
    :currency="currency"
    :debited-currency="debitedCurrency"
    @send="isSendReq = $event"
    @close="selectedDoc = $event"
  />
  <AddRelatedDocumentDialog
    :title="$t('adding related document')"
    :is-open="toggleRelatedDoc"
    :commons="commons"
    :purchase-id="purchaseId"
    @send="isSendReq = $event"
    @close="toggleRelatedDoc = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

import AddDocumentDialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/documents/AddDocumentDialog.vue";
import EditDocumentDialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/documents/EditDocumentDialog.vue";
import AddRelatedDocumentDialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/documents/AddRelatedDocumentDialog.vue";
import purchtableDropdown from "@/components/custom/purch_table_filters/purchtableDropdown.vue";
import PositionMultiselect from "@/components/custom/position_table_filters/PositionMultiselect.vue";
import DeletePopup from "@/components/deletePopup/DeletePopup.vue";

import type { IDocumentPurchase } from "@/api/attachments";
import type { IGroup } from "../../../dialogs/types";
import {
  getDocsPurchase,
  deleteAttachment,
  deleteRelatedAttachment,
} from "@/api/attachments";
import DeleteIcon from "@/components/icons/Delete.vue";
import DocumentDownload from "@/components/icons/DocumentDownload.vue";
import EyeIcon from "@/components/icons/Eye.vue";
import SquarePlus from "@/components/icons/SquarePlus.vue";
import sortArrow from "@/components/icons/sort-arrows.svg";
import useCommonsInfo from "@/store/purchases_store/commons";
import usePurchasesInfo from "@/store/purchases_store/purchases";

const props = defineProps<{
  purchaseId?: number;
  createClosedDoc: boolean;
  docsPurchaseTypes: { [key: number | string]: number };
  commons: { [key: string]: { [key: number]: string } };
  groups: IGroup[];
  debitedCurrency: string;
  remainderPayments: number;
  currency: string;
  isAmountCovered: boolean;
}>();

const emit = defineEmits<{
  (e: "updateDocsPurchaseTypes", value: { [key: number | string]: number }): void;
  (e: "updateCreateClosedDoc", value: boolean): void;
}>();

const docs = ref<IDocumentPurchase[]>([]);
const deletePopup = ref();
const deleteRelatedDocPopup = ref();
const data = ref<IDocumentPurchase[]>(docs.value ? [...docs.value] : []);
const selectedDoc = ref<IDocumentPurchase | null>(null);
const selectedDocID = ref<number>(0);
const isSendReq = ref(false);
const isSort = ref(false);
const toggleDialogAddDoc = ref(false);
const toggleRelatedDoc = ref(false);
const API_URL = import.meta.env.VITE_VUE_APP_API_URL;
const selectedFiltersType = ref<
  {
    id: string | number;
    name?: string;
    bank_id?: string;
    description?: string;
  }[]
>([]);
const selectedFiltersItemsID = ref<{ id: string | number; name: string }[]>([]);

const docsItemsID = computed<{ id: string | number; name: string }[]>(() => {
  const items: {
    id: string | number;
    name: string;
  }[] = [];

  docs.value.forEach((item: IDocumentPurchase) => {
    item.item_ids.forEach((itemID) => {
      if (!items.find((el) => el.id === itemID)) {
        items.push({
          id: itemID,
          name: `№${itemID}`,
        });
      }
    });
  });

  return items;
});

watch(
  () => isSendReq.value,
  async () => {
    if (props.purchaseId && isSendReq.value) {
      const types = Object.fromEntries(
        useCommonsInfo.commons.value.document_types_purchase.map((item) => [item.id, 0])
      );

      docs.value = await getDocsPurchase(props.purchaseId);

      docs.value.forEach((item) => {
        types[item.document_type] = types[item.document_type] + 1;
      });

      if (props.docsPurchaseTypes[3] !== types[3]) emit("updateCreateClosedDoc", true);

      emit("updateDocsPurchaseTypes", types);

      data.value = JSON.parse(JSON.stringify(docs.value));

      isSort.value = false;
      selectedFiltersType.value = [];

      isSendReq.value = false;

      usePurchasesInfo.setUpdateTable(true);

      setTimeout(() => {
        emit("updateCreateClosedDoc", false);
        usePurchasesInfo.setUpdateTable(false);
      });
    }
  }
);

watch(
  () => docs.value,
  (value) => {
    usePurchasesInfo.setDocsPurchase(value);
  }
);

const toggle = (event: Event | boolean): void => {
  deletePopup.value.toggle(event);
};

const toggleRelated = (event: Event | boolean): void => {
  deleteRelatedDocPopup.value.toggle(event);
};

const sortDocs = (): void => {
  isSort.value = !isSort.value;

  if (docs.value.length === data.value.length) {
    docs.value.sort((doc1: IDocumentPurchase, doc2: IDocumentPurchase) => {
      const date1: any = doc1.document_date && new Date(doc1.document_date);
      const date2: any = doc2.document_date && new Date(doc2.document_date);

      return isSort.value ? date2 - date1 : date1 - date2;
    });

    data.value = JSON.parse(JSON.stringify(docs.value));
  } else {
    data.value.sort((doc1: IDocumentPurchase, doc2: IDocumentPurchase) => {
      const date1: any = doc1.document_date && new Date(doc1.document_date);
      const date2: any = doc2.document_date && new Date(doc2.document_date);

      return isSort.value ? date2 - date1 : date1 - date2;
    });

    docs.value.sort((doc1: IDocumentPurchase, doc2: IDocumentPurchase) => {
      const date1: any = doc1.document_date && new Date(doc1.document_date);
      const date2: any = doc2.document_date && new Date(doc2.document_date);

      return isSort.value ? date2 - date1 : date1 - date2;
    });
  }
};

const setFilteredDocs = (): IDocumentPurchase[] => {
  let dataDocs: IDocumentPurchase[] = [];

  if (!selectedFiltersType.value.length && !selectedFiltersItemsID.value.length) {
    return JSON.parse(JSON.stringify(docs.value));
  } else {
    dataDocs = filteredByType(docs.value);

    return filteredByItemsID(dataDocs);
  }
};

const filteredByType = (data: IDocumentPurchase[]): IDocumentPurchase[] => {
  const items: IDocumentPurchase[] = [];

  if (selectedFiltersType.value.length) {
    data.forEach((item: IDocumentPurchase) => {
      selectedFiltersType.value.forEach((el) => {
        if (item.document_type === el.id) {
          items.push(item);
        }
      });
    });
  } else {
    return data;
  }

  return items;
};

const filteredByItemsID = (data: IDocumentPurchase[]): IDocumentPurchase[] => {
  const items: IDocumentPurchase[] = [];

  if (selectedFiltersItemsID.value.length) {
    data.forEach((item: IDocumentPurchase) => {
      selectedFiltersItemsID.value.forEach((el) => {
        if (
          item.item_ids.find((id: number) => id === el.id) &&
          !items.find((el: IDocumentPurchase) => el.id === item.id)
        ) {
          items.push(item);
        }
      });
    });
  } else {
    return data;
  }

  return items;
};

const selectedDocument = (value: IDocumentPurchase) => {
  selectedDoc.value = value;
};

const deleteDoc = async (docID: number): Promise<void> => {
  await deleteAttachment(docID);

  selectedDocID.value = 0;
  isSendReq.value = true;
  toggle(false);
};

const deleteRelatedDoc = async (docID: number): Promise<void> => {
  if (props.purchaseId) {
    await deleteRelatedAttachment(props.purchaseId, docID);

    selectedDocID.value = 0;
    isSendReq.value = true;
    toggleRelated(false);
  }
};

const watchDoc = (fileName: string): void => {
  window.open(`${API_URL}/storage/files/${fileName}/preview`, "_blank");
};

const downloadDoc = (fileName: string): void => {
  window.location.href = `${API_URL}/storage/files/${fileName}`;
};

onMounted(async () => {
  if (props.purchaseId) {
    docs.value = await getDocsPurchase(props.purchaseId);

    const types = { ...props.docsPurchaseTypes };

    docs.value.forEach((item) => {
      types[item.document_type] = types[item.document_type] + 1;
    });

    emit("updateDocsPurchaseTypes", types);

    data.value = [...docs.value];
  }
});
</script>

<style lang="scss">
@import "./style.scss";

.docs-tab {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  &_wrapper {
    display: flex;
    gap: 12px;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    &__header {
      display: flex;
      gap: 10px;
      padding: 14px 18px 0 18px;
      & .docs-info {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 15px;
        gap: 10px;
        border-radius: 10px;
        border: 1px solid #e3e3e3;
        background: #fff;
        &_content {
          & > p {
            color: #999;
            font-size: 12px;
            font-weight: 400;
          }
          &__sums {
            display: flex;
            align-items: center;
            gap: 8px;
            & > .current-price {
              color: #1a1a1a;
              font-size: 16px;
              font-weight: 400;
            }
            & > .debited-price {
              color: #999;
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
  &_add-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
    &__btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 10px 10px 12px 10px;
      border-radius: 10px;
      gap: 8px;
      color: #1565c0;
      background: none;
      border: none;
      outline: none;
      font-size: 14px;
      font-weight: 600;
      &:disabled {
        cursor: auto;
        opacity: 0.5;
        &:hover {
          background: none;
        }
      }
      &:hover {
        background: #1565c011;
      }
    }
  }
}
</style>
