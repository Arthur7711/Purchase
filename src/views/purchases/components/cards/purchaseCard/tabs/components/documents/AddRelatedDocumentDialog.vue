<template>
  <Dialog class="add-relate" :is-open="isOpen" :title="title" @close="closePopup">
    <template #headerActions>
      <div class="add-relate_actions">
        <button class="add-relate_actions__close" @click="closePopup">
          <img :src="CrossMark" alt="X" />
        </button>
      </div>
    </template>
    <template #content>
      <div class="add-relate_content">
        <TextLabelIcon
          class="add-relate_content__input"
          :value="fileName"
          :title="$t('document')"
          :disabled="true"
        >
          <template #rightIcon>
            <button @click="toggle" class="add-relate_content__input-btn">
              <img alt="triangle" :src="btnTriangle" class="menu-action_btn" />
            </button>
          </template>
        </TextLabelIcon>
        <div class="menu-action">
          <div v-show="menu" class="menu-action_content docs">
            <div class="docs-search">
              <div class="docs-search_row">
                <TextLabelIcon
                  :value="searchFile"
                  :placeholder="$t('search by title or purchase ID')"
                  @data-change="searchFile = $event"
                >
                  <template #rightIcon>
                    <img :src="searchIcon" alt="search" />
                  </template>
                </TextLabelIcon>
              </div>

              <p v-if="searchFile" class="approvals-modal_title">
                {{ $t("search results") }}
              </p>

              <div v-if="attachments.length" class="docs-search_row">
                <p class="docs-search_list--title">
                  {{ `${$t("title")} / ${$t("type")}  / ${$t("purchase ID")} ` }}
                </p>
                <ul class="docs-search_list">
                  <div v-if="isLoading" class="docs-search_loader">
                    <ProgressSpinner />
                  </div>

                  <li
                    :class="[
                      'docs-search_list__item',
                      {
                        selected: selectedFile && selectedFile.id === attachment.id,
                      },
                    ]"
                    v-for="attachment in attachments"
                    :key="attachment.id"
                    @click="
                      () => {
                        selectedFile = attachment;
                        toggle();
                      }
                    "
                  >
                    <p class="docs-search__name">
                      {{
                        `${
                          attachment.real_name && attachment.real_name.split(".")[0]
                        } / ${commons?.docsTypes[attachment.document_type]} / id${
                          attachment.entity_id
                        }`
                      }}
                    </p>
                  </li>
                  <Observer @intersect="intersected" />
                </ul>
              </div>
              <p class="docs-search_row description" v-else-if="searchFile">
                {{ $t("nothing was found") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <button
        @click="saveRelate"
        :class="['add-relate_actions__submit', { active: !isDisabledSaved }]"
        :disabled="isDisabledSaved"
      >
        {{ $t("save") }}
      </button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import Dialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue";
import CrossMark from "@/components/icons/xmark.svg";
import searchIcon from "@/components/icons/search.svg";
import btnTriangle from "@/components/icons/triangleDownGrey.svg";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import Observer from "@/components/observer/Observer.vue";
import ProgressSpinner from "primevue/progressspinner";

import { postRelatedAttachment, searchDocs } from "@/api/attachments";
import type { IDocumentPurchase } from "@/api/attachments";

const props = defineProps<{
  isOpen: boolean;
  title: string;
  purchaseId?: number;
  commons: { [key: string]: { [key: number]: string } };
}>();

const emit = defineEmits<{
  (e: "close", value: boolean): void;
  (e: "send", value: boolean): void;
}>();

const selectedFile = ref<any>(null);
const searchFile = ref<string | null>(null);
const menu = ref(false);
const isLoading = ref(false);
const attachments = ref<IDocumentPurchase[]>([]);
const resultSearch = ref<{
  current_page: number;
  data: IDocumentPurchase[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}>();

const isAllDocs = computed(
  () => resultSearch.value && resultSearch.value.to === resultSearch.value.total
);
const isDisabledSaved = computed<boolean>(() => !selectedFile.value);
const fileName = computed<string | null>(
  () =>
    selectedFile.value &&
    `${selectedFile.value.real_name && selectedFile.value.real_name.split(".")[0]} / ${
      props.commons?.docsTypes[selectedFile.value.document_type]
    } / id${selectedFile.value.entity_id}`
);

watch(
  () => searchFile.value,
  async (value) => {
    if (value && value.length > 2) {
      isLoading.value = true;
      resultSearch.value = await searchDocs(value, "purchase", 1, props.purchaseId);

      isLoading.value = false;

      if (resultSearch.value) {
        attachments.value = [...resultSearch.value.data];
      }
    } else attachments.value = [];
  }
);

const closePopup = () => {
  emit("close", false);
  selectedFile.value = null;
  searchFile.value = null;
};

const saveRelate = async () => {
  if (props.purchaseId && selectedFile.value) {
    await postRelatedAttachment(props.purchaseId, selectedFile.value.id).then(() => {
      emit("send", true);
    });

    closePopup();
  }
};

const intersected = async () => {
  if (!isAllDocs.value && searchFile.value && resultSearch.value && props.purchaseId) {
    isLoading.value = true;
    resultSearch.value = await searchDocs(
      searchFile.value,
      "purchase",
      resultSearch.value.current_page + 1,
      props.purchaseId
    );

    if (resultSearch.value) {
      attachments.value = [...attachments.value, ...resultSearch.value.data];
    }
    isLoading.value = false;
  }
};

const toggle = (): void => {
  menu.value = !menu.value;
};
</script>

<style lang="scss">
.p-datepicker {
  z-index: 1002 !important;
}

.p-dropdown-panel {
  z-index: 1003 !important;
}
.add-relate {
  &_content {
    width: 450px;
    &__input {
      & > .p-float-label > input {
        color: black;
        opacity: 1;
      }

      &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: none;
        outline: none;
        background: none;
        width: 30px;
        height: 30px;
      }
    }
  }
  &_actions {
    display: flex;
    align-items: center;
    gap: 24px;
    &__submit {
      cursor: pointer;
      outline: none;
      border: none;
      width: 100%;
      padding: 7px 20px;
      border-radius: 10px;
      color: white;
      font-size: 18px;
      font-weight: 600;
      background: #b6b6b6;
      &.active {
        background: #1565c0;
        color: white;
        margin: 0;
      }
    }
    &__close {
      display: flex;
      align-items: center;
      background: none;
      cursor: pointer;
      border: none;
      outline: none;
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
    }
  }
}

.menu-action {
  position: relative;
  &_content.docs {
    top: 5px;
    right: 0;
    width: 100%;
    .docs-search {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-bottom: 10px;
      .description {
        text-align: center;
      }
      &_row {
        padding: 10px;
      }
      &_loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 95%;
        height: 100%;
        max-height: 200px;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.39);
      }
      &_list {
        display: flex;
        flex-direction: column;
        list-style-type: none;
        gap: 3px;
        overflow: auto;
        max-height: 200px;
        &--title {
          padding: 0 10px;
          color: #999999;
        }
        &__item {
          width: 99%;
          cursor: pointer;
          border-radius: 10px;
          padding: 5px 10px;
          &.selected {
            background-color: #1565c0;
            color: white;
          }
          &:hover {
            background-color: #1565c0;
            color: white;
          }
        }
      }
    }
  }
}
</style>
