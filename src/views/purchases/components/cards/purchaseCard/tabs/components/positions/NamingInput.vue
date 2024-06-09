<template>
  <div class="add-relate_content">
    <TextLabelIcon
      class="add-relate_content__input"
      :value="naming"
      :readonly="readonly"
      :title="$t('name')"
      :disabled="true"
    >
      <template v-if="!readonly" #rightIcon>
        <button @click="toggle" class="add-relate_content__input-btn">
          <img alt="dropdownIcon" :src="dropdownIcon" class="menu-action_btn" />
        </button>
      </template>
    </TextLabelIcon>
    <div class="menu-action">
      <div v-show="menu" class="menu-action_content docs">
        <div class="docs-search">
          <div class="docs-search_row">
            <TextLabelIcon
              :value="searchName"
              :placeholder="$t('search by name')"
              @data-change="searchName = $event"
            >
              <template #rightIcon>
                <img :src="searchIcon" alt="search" />
              </template>
            </TextLabelIcon>
          </div>
          <div v-if="searchName" class="namings__actions">
            <button
              v-if="searchName.length > 2 && !namings.length && !isLoading"
              class="approvals-modal_wrapper__actions_btn"
              @click="addNaming"
            >
              {{ $t("add") }}
            </button>
          </div>

          <p v-if="searchName" class="approvals-modal_title">
            {{ $t("search results") }}
          </p>

          <div v-if="namings.length" class="docs-search_row">
            <p class="docs-search_list--title">{{ $t("title") }}</p>
            <ul class="docs-search_list">
              <div v-if="isLoading" class="docs-search_loader">
                <ProgressSpinner />
              </div>

              <li
                :class="[
                  'docs-search_list__item',
                  {
                    selected: selectedName && selectedName.id === itemName.id,
                  },
                ]"
                v-for="itemName in namings"
                :key="itemName.id"
                @click="
                  () => {
                    selectedName = itemName;
                    toggle();
                  }
                "
              >
                <p class="docs-search__name namings_text">
                  {{ itemName.name }}
                </p>
              </li>
              <Observer
                @intersect="
                  () => {
                    intersected();
                  }
                "
              />
            </ul>
          </div>
          <p class="docs-search_row description" v-else-if="searchName">
            {{ $t("nothing was found") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

import searchIcon from "@/components/icons/search.svg";
import dropdownIcon from "@/components/icons/dropdownIcon.svg";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import Observer from "@/components/observer/Observer.vue";
import ProgressSpinner from "primevue/progressspinner";

import useCommonsInfo from "@/store/purchases_store/commons";
import { searchNomenclature } from "@/api/nomenclature";

const props = defineProps<{
  itemNameId: number | null;
  typeId: number | null;
  subtypeId: number | null;
  readonly: boolean;
}>();

const emit = defineEmits<{
  (e: "dataChange", value: number | null): void;
  (e: "addNewName", value: string): void;
  (e: "selectName", value: { id: number; name: string } | null): void;
}>();

const selectedName = ref<{ id: number; name: string } | null>(null);
const searchName = ref<string | null>(null);
const namings = ref<{ id: number; name: string }[]>([]);
const isLoading = ref(false);
const menu = ref(false);
const resultSearch = ref<{
  current_page: number;
  data: { id: number; name: string }[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}>();

const namesCommons = computed(
  () => useCommonsInfo.commons.value.itemNames as { id: number; name: string }[]
);
const naming = computed<string | null>(
  () => selectedName.value && selectedName.value.name
);
const isAllNamings = computed(
  () => resultSearch.value && resultSearch.value.to === resultSearch.value.total
);

watch(
  () => searchName.value,
  async (value) => {
    if (value && value.length > 2) {
      isLoading.value = true;
      const res = await searchNomenclature({ q: value, is_raw: false });

      resultSearch.value = res.data;
      isLoading.value = false;

      if (resultSearch.value) {
        namings.value = [...resultSearch.value.data];
      }
    } else namings.value = [];
  }
);

watch(
  () => selectedName.value,
  async (value) => {
    emit("dataChange", value ? value.id : null);
    emit("selectName", value);
  }
);

watch(
  () => props.itemNameId,
  () => {
    selectedName.value =
      namesCommons.value.find((item) => item.id === props.itemNameId) || null;

    searchName.value = selectedName.value ? selectedName.value.name : null;
  }
);

watch(
  () => namesCommons.value,
  () => {
    searchName.value = null;
    selectedName.value =
      namesCommons.value.find((item) => item.id === props.itemNameId) || null;

    setTimeout(() => {
      searchName.value = selectedName.value ? selectedName.value.name : null;
    });
  },
  { deep: true }
);

const toggle = (): void => {
  menu.value = !menu.value;
};

const addNaming = async () => {
  if (searchName.value) {
    emit("addNewName", searchName.value);
  }
};

const intersected = async () => {
  if (!isAllNamings.value && searchName.value && resultSearch.value) {
    isLoading.value = true;
    const res = await searchNomenclature({
      q: searchName.value,
      page: resultSearch.value.current_page + 1,
      is_raw: false,
    });

    resultSearch.value = res.data;

    if (resultSearch.value) {
      namings.value = [...namings.value, ...resultSearch.value.data];
    }
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.itemNameId) {
    selectedName.value =
      namesCommons.value.find((item) => item.id === props.itemNameId) || null;

    searchName.value = selectedName.value ? selectedName.value.name : null;
  }
});
</script>

<style lang="scss" scoped>
.namings {
  &__actions {
    padding: 0 10px 10px 10px;
  }
  &_text {
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
