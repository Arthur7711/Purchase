<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import Search from "../../components/icons/Search.vue";
import {
  getNomenclatureTypes,
  getNomenclatureItemNames,
  unionNomenclatures,
  editNomenclature,
  deleteNomenclatures,
  searchNomenclature,
} from "../../api/nomenclature";
import useUserInfo from "../../store/user";
import type {
  INomenclatureType,
  ITreeNomenclature,
  INomenclatureItemNames,
} from "./types";
import ArrowList from "../../components/icons/ArrowList.vue";
import DropdownIcon from "../../components/icons/DropdownIcon.vue";
import type { INomenclatureTable } from "../../components/simpleTable/types";
import NomenclatureTable from "../../components/simpleTable/NomenclatureTable.vue";
import SelectedNomenclatureTable from "../../components/simpleTable/SelectedNomenclatureTable.vue";
import Unite from "../../components/icons/Unite.vue";
import Marker from "../../components/icons/Marker.vue";
import Delete from "../../components/icons/Delete.vue";
import DialogNomenclature from "../../components/dialogs/DialogNomenclature.vue";
import Info from "../../components/icons/Info.vue";
import SearchTable from "./SearchTable.vue";
import WarrningX from "../../components/icons/WarrningX.vue";
import SuccessMessage from "../../components/successMessage/SuccessMessage.vue";
import { debounce } from "../../helpers/debounse";
import useOfficeId from "@/store/officeId";
import i18n_config from "@/locales/i18n_config";
import ScreenParams from "@/store/screen";

const { messages, locale } = i18n_config.global;
const el = ref<HTMLElement | null>(null);
const searchData = ref("");
const nomenclatureTypes = ref<ITreeNomenclature[]>([]);
const reserveNomenclatureTypes = ref<ITreeNomenclature[]>([]);
const errorMessage = ref("");
const tableSearch = ref("");
const currentTablePage = ref(2);
const perTablePage = ref(Infinity);
const sortVariant = [
  { name: messages[locale]["by name"], id: "asc", orderBy: "name" },
  { name: messages[locale]["recently used up"], id: "desc", orderBy: "item_id" },
];
const selectedSort = ref(sortVariant[0]);
const totalNomenclature = ref<null | number>(null);
const nomenclatureDataTable = ref<INomenclatureTable[]>([]);
const nomenclatureSelectedDataTable = ref<INomenclatureTable[]>([]);
const nomenclatureSearchData = ref<INomenclatureTable[]>([]);
const changeTitle = ref("");
const showDialog = ref(false);
const selectedVerion = ref("");
const called = ref<boolean>(false);
const selectedSearchedData = ref<{ id: number; items_count: number; name: string }>();
const fuzzyTableData = ref<INomenclatureTable[]>([]);
const fuzzyCount = ref(0);
const op = ref();
const errorClass = ref(false);
const successInfo = ref("");
const selectedNavigationBar = ref({ key: "", parentId: "", label: "" });
const oldNavigationBar = ref("");
const showSearch = ref(false);
const showEdit = ref(false);
const getNomenclature = async (click?: boolean) => {
  // selectedNavigationBar.value = { key: '', parentId: '', label: '' }
  // nomenclatureSelectedDataTable.value = []
  // oldNavigationBar.value = ''
  // nomenclatureTypes.value = []
  // if (currentTablePage.value <= perTablePage.value) {
  await getNomenclatureItemNames({ page: "1" })
    .then(({ data }: { data: INomenclatureItemNames }) => {
      totalNomenclature.value = data.total;
      nomenclatureDataTable.value = data.data;
      currentTablePage.value = data.current_page + 1;
      perTablePage.value = data.last_page;
      if (!click) {
        nomenclatureSelectedDataTable.value = [];
      }
      oldNavigationBar.value = selectedNavigationBar.value.label;
      selectedNavigationBar.value = { key: "", parentId: "", label: "" };
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
  // }
};
const getMoreNomenclatureItems = async () => {
  if (currentTablePage.value <= perTablePage.value) {
    await getNomenclatureItemNames({ page: String(currentTablePage.value) })
      .then(({ data }: { data: INomenclatureItemNames }) => {
        totalNomenclature.value = data.total;
        nomenclatureDataTable.value.push(...data.data);
        currentTablePage.value = data.current_page + 1;
        perTablePage.value = data.last_page;
      })
      .catch((err) => {
        errorMessage.value = err.message;
      });
  }
};
const searchNomenclatureResults = async () => {
  await getNomenclatureItemNames({ search_mode: "exact", q: tableSearch.value })
    .then(({ data }: { data: INomenclatureItemNames }) => {
      totalNomenclature.value = data.total;
      nomenclatureDataTable.value = data.data;
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
  await getNomenclatureItemNames({ search_mode: "fuzzy", q: tableSearch.value })
    .then(({ data }: { data: INomenclatureItemNames }) => {
      fuzzyCount.value = data.total;
      fuzzyTableData.value = data.data;
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
};
const showMessage = (message: string) => {
  successInfo.value = message;
  setTimeout(() => {
    successInfo.value = "";
  }, 3000);
};
const debouncedSearchData = debounce(async function () {
  const selectedTypeID = selectedNavigationBar.value?.parentId
    ? +selectedNavigationBar.value.parentId
    : selectedNavigationBar.value.key
    ? +selectedNavigationBar.value.key
    : null;

  const selectedSubtypeID = selectedNavigationBar.value?.parentId
    ? +selectedNavigationBar.value.key
    : null;

  searchNomenclature({
    q: tableSearch.value,
    type_id: selectedTypeID,
    sub_type_id: selectedSubtypeID,
  })
    .then(({ data }) => {
      nomenclatureSearchData.value = data.data;
    })
    .catch((err) => (errorMessage.value = err.message));
}, 500);
const modifyNominclatureItems = async () => {
  switch (selectedVerion.value) {
    case "union":
      await unionNomenclatures({
        ids: nomenclatureSelectedDataTable.value.map((el) => el.id),
        name: changeTitle.value,
      });
      await getNomenclature();
      showMessage(messages[locale]["titles combined"]);
      showDialog.value = false;
      break;
    case "edit":
      await editNomenclature({
        id: nomenclatureSelectedDataTable.value[0].id,
        name: changeTitle.value,
      });
      await getNomenclature();
      showMessage(messages[locale]["name changed"]);
      showDialog.value = false;
      break;
    case "delete":
      await deleteNomenclatures({
        ids: nomenclatureSelectedDataTable.value.map((el) => el.id),
      });
      await getNomenclature();
      showMessage(messages[locale]["names removed"]);
      showDialog.value = false;
      break;
    default:
      break;
  }
  if (!changeTitle.value) {
    errorClass.value = true;
  } else {
    errorClass.value = false;
    showDialog.value = false;
  }
  tableSearch.value = "";
  changeTitle.value = "";
};
const showDropdown = (event: any) => {
  op.value.show(event);
};
const filterGlobalTable = async (dataValue: {
  key: string;
  label: string;
  parentId: string;
  children: { key: string; label: string; parentId: string }[];
}) => {
  tableSearch.value = "";
  await getNomenclatureItemNames({
    type_id: dataValue?.children ? dataValue.key : dataValue.parentId,
    sub_type_id: dataValue?.children ? "" : dataValue.key,
  })
    .then(({ data }: { data: INomenclatureItemNames }) => {
      totalNomenclature.value = data.total;
      nomenclatureDataTable.value = data.data;
      currentTablePage.value = data.current_page + 1;
      perTablePage.value = data.last_page;
      oldNavigationBar.value = selectedNavigationBar.value.label;

      selectedNavigationBar.value = {
        key: dataValue.key,
        parentId: dataValue.parentId || "",
        label: dataValue.label,
      };
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
};
const selectedVariant = (variant: string) => {
  selectedVerion.value = variant;
  showDialog.value = true;
};
const clickToSearch = async () => {
  await searchNomenclatureResults();
  op.value.hide();
};
onMounted(async () => {
  await getNomenclatureTypes()
    .then(({ data }: { data: INomenclatureType[] }) => {
      nomenclatureTypes.value = data.map((nomenclatureType) => {
        return {
          key: String(nomenclatureType.id),
          label: `${nomenclatureType.name} (${nomenclatureType.names_count})`,
          children: nomenclatureType.sub_types.map((el) => {
            return {
              key: String(el.id),
              label: el.name,
              parentId: String(nomenclatureType.id),
            };
          }),
        };
      });
      reserveNomenclatureTypes.value = JSON.parse(
        JSON.stringify(nomenclatureTypes.value)
      );
    })
    .catch((err) => (errorMessage.value = err.message));
  await getNomenclatureItemNames({})
    .then(({ data }: { data: INomenclatureItemNames }) => {
      totalNomenclature.value = data.total;
      nomenclatureDataTable.value = data.data;
      currentTablePage.value = data.current_page + 1;
      perTablePage.value = data.last_page;
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
});

watch(
  () => [useOfficeId.department.value, useOfficeId.officeId.value],
  async () => {
    await getNomenclatureTypes()
      .then(({ data }: { data: INomenclatureType[] }) => {
        nomenclatureTypes.value = data.map((nomenclatureType) => {
          return {
            key: String(nomenclatureType.id),
            label: `${nomenclatureType.name} (${nomenclatureType.names_count})`,
            children: nomenclatureType.sub_types.map((el) => {
              return {
                key: String(el.id),
                label: el.name,
                parentId: String(nomenclatureType.id),
              };
            }),
          };
        });
        reserveNomenclatureTypes.value = JSON.parse(
          JSON.stringify(nomenclatureTypes.value)
        );
      })
      .catch((err) => (errorMessage.value = err.message));
    await getNomenclatureItemNames({})
      .then(({ data }: { data: INomenclatureItemNames }) => {
        totalNomenclature.value = data.total;
        nomenclatureDataTable.value = data.data;
        currentTablePage.value = data.current_page + 1;
        perTablePage.value = data.last_page;
      })
      .catch((err) => {
        errorMessage.value = err.message;
      });
  }
);

watch(searchData, () => {
  nomenclatureTypes.value = reserveNomenclatureTypes.value.filter(
    (el) =>
      el.label.toLowerCase().includes(searchData.value) ||
      el.children.find((item) => item.label.toLowerCase().includes(searchData.value))
  );
});
watch([showDialog, changeTitle], () => {
  if (!showDialog.value || changeTitle.value) {
    errorClass.value = false;
  }
});
watch(tableSearch, async () => {
  if (tableSearch.value.length >= 2) {
    debouncedSearchData();
  } else if (tableSearch.value.length === 0) {
    getNomenclature();
  }
});
watch(selectedSort, async () => {
  await getNomenclatureItemNames({
    order_dir: selectedSort.value.id,
    order_by: selectedSort.value.orderBy,
  })
    .then(({ data }: { data: INomenclatureItemNames }) => {
      totalNomenclature.value = data.total;
      nomenclatureDataTable.value = data.data;
      tableSearch.value = "";
    })
    .catch((err) => {
      errorMessage.value = err.message;
    });
});
watch(selectedSearchedData, async () => {
  if (selectedSearchedData.value) {
    tableSearch.value = selectedSearchedData.value?.name;
    await searchNomenclatureResults();
    op.value.hide();
  }
});
watch(selectedNavigationBar, () => {
  // @ts-ignore
  const old = document.querySelectorAll(
    `[aria-label="${oldNavigationBar.value}"]`
  )[0] as any;
  old?.childNodes?.[0]?.classList?.remove("active_navbar_title");

  // @ts-ignore
  const sel = document.querySelectorAll(
    `[aria-label="${selectedNavigationBar.value.label}"]`
  )?.[0] as any;
  sel?.childNodes?.[0]?.classList?.add("active_navbar_title");
  // classList.add('active_navbar_title')
});
useInfiniteScroll(
  el,
  () => {
    if (!called.value) {
      getMoreNomenclatureItems();
      called.value = true;
      setTimeout(() => {
        called.value = false;
      }, 500);
    }
  },
  { distance: 10 }
);
</script>

<template>
  <main class="main_nomenclature">
    <div v-if="ScreenParams.screenParams.width > 650" class="types_box">
      <div class="title_box">
        <h1 class="nomenclature_title">{{ $t("nomenclature") }}</h1>
        <p class="count">{{ totalNomenclature }}</p>
      </div>
      <div class="container_box">
        <div class="nomenclature_search_box">
          <InputText
            class="input"
            :placeholder="$t('type or subtype')"
            v-model="searchData"
          />
          <div class="search">
            <Search />
          </div>
        </div>
        <div class="results">
          <p
            :class="`info_title ${
              !selectedNavigationBar.key ? 'active_navbar_title' : ''
            }`"
            v-if="!searchData.length"
            @click="() => getNomenclature(true)"
          >
            {{ $t("all items") }}
          </p>
          <Tree :value="nomenclatureTypes" class="nomenclature_tree">
            <template #togglericon="{ expanded }">
              <div :style="{ rotate: expanded ? '90deg' : '0deg' }">
                <ArrowList />
              </div>
            </template>
            <template #default="slotProps">
              <p
                @click="() => filterGlobalTable(slotProps.node)"
                style="cursor: pointer"
                :class="
                  selectedNavigationBar.key === slotProps.node.key
                    ? 'active_navbar_title'
                    : ''
                "
              >
                {{ slotProps.node.label }}
              </p>
            </template>
          </Tree>
        </div>
      </div>
    </div>
    <div v-else class="nomenclature_div_showsearch_all">
      <section v-if="!showEdit && !showSearch" class="nomenclature_top_buttons_section">
        <button
          class="nomenclature_div_showsearch_show_button"
          @click="showSearch = !showSearch"
          :class="showSearch ? 'nomenclature_div_showsearch_show_button_show' : ''"
        >
          {{ $t("show_2") }} {{ $t("search_3") }}
        </button>
        <button
          class="nomenclature_div_showsearch_show_button"
          @click="showEdit = !showEdit"
          :class="showEdit ? 'nomenclature_div_showsearch_show_button_show' : ''"
        >
          {{ $t("show_2") }} {{ $t("editor") }}
        </button>
      </section>
      <div
        class="nomenclature_div_showsearch"
        :class="
          showSearch
            ? 'nomenclature_div_showsearch nomenclature_div_showsearch_active'
            : 'nomenclature_div_showsearch'
        "
      >
        <div class="types_box">
          <button style="float: right" @click="showSearch = !showSearch">
            {{ $t("hide") }}
          </button>
          <div class="title_box">
            <h1 class="nomenclature_title">{{ $t("nomenclature") }}</h1>
            <p class="count">{{ totalNomenclature }}</p>
          </div>
          <div class="container_box">
            <div class="nomenclature_search_box">
              <InputText
                class="input"
                :placeholder="$t('type or subtype')"
                v-model="searchData"
              />
              <div class="search">
                <Search />
              </div>
            </div>
            <div class="results">
              <p
                :class="`info_title ${
                  !selectedNavigationBar.key ? 'active_navbar_title' : ''
                }`"
                v-if="!searchData.length"
                @click="() => getNomenclature(true)"
              >
                {{ $t("all items") }}
              </p>
              <Tree :value="nomenclatureTypes" class="nomenclature_tree">
                <template #togglericon="{ expanded }">
                  <div :style="{ rotate: expanded ? '90deg' : '0deg' }">
                    <ArrowList />
                  </div>
                </template>
                <template #default="slotProps">
                  <p
                    @click="() => filterGlobalTable(slotProps.node)"
                    style="cursor: pointer"
                    :class="
                      selectedNavigationBar.key === slotProps.node.key
                        ? 'active_navbar_title'
                        : ''
                    "
                  >
                    {{ slotProps.node.label }}
                  </p>
                </template>
              </Tree>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nomenclature_body">
      <div class="table_container">
        <div class="table_search_box">
          <div class="nomenclature_search_box">
            <InputText
              class="input"
              :placeholder="$t('name')"
              v-model="tableSearch"
              @click="showDropdown"
            />
            <div class="search">
              <Search />
            </div>
            <OverlayPanel ref="op" style="width: 500px">
              <SearchTable
                :products="nomenclatureSearchData"
                @selected-product="selectedSearchedData = $event"
              />
              <Button class="search_button_nomenclature" @click="clickToSearch">{{
                $t("search")
              }}</Button>
            </OverlayPanel>
          </div>
          <Dropdown
            v-model="selectedSort"
            :options="sortVariant"
            optionLabel="name"
            :placeholder="$t('sorting')"
            class="nomenclature_dropdown"
            panel-class="nomenclature_dropdown_box"
          >
            <template #dropdownicon>
              <DropdownIcon />
            </template>
          </Dropdown>
        </div>
        <p class="table_info_title" v-if="tableSearch && fuzzyTableData.length">
          {{ $t("items found") }}: {{ totalNomenclature }}
        </p>
        <div
          ref="el"
          style="max-height: 79vh; max-width: 1100px; overflow-y: auto; padding: 0 20px"
          class="nomenclature_table_div_table"
          v-if="nomenclatureDataTable.length"
        >
          <NomenclatureTable
            :products="nomenclatureDataTable"
            @select-product="nomenclatureSelectedDataTable = $event"
            :nomenclature-selected-data-table="nomenclatureSelectedDataTable"
          />
        </div>
        <div v-if="fuzzyTableData.length" style="margin-top: 20px">
          <p class="table_info_title">{{ $t("similar titles") }}: {{ fuzzyCount }}</p>
          <div style="max-height: 79vh; overflow-y: auto; padding: 0 20px">
            <NomenclatureTable
              :products="fuzzyTableData"
              @select-product="nomenclatureSelectedDataTable = $event"
              :marked-text="tableSearch"
              :nomenclature-selected-data-table="nomenclatureSelectedDataTable"
            />
          </div>
        </div>
      </div>
      <div style="width: 30%">
        <div v-if="ScreenParams.width.value > 650">
          <div class="editable_container">
            <Button
              class="unite"
              @click="() => selectedVariant('union')"
              :disabled="nomenclatureSelectedDataTable.length <= 1"
              v-if="
                nomenclatureSelectedDataTable.length &&
                useUserInfo.controlNomenclature.value
              "
            >
              <Unite />
              <span>{{ $t("merge") }}</span>
            </Button>
            <Button
              class="edit"
              v-if="
                nomenclatureSelectedDataTable.length &&
                useUserInfo.controlNomenclature.value
              "
              @click="() => selectedVariant('edit')"
              :disabled="nomenclatureSelectedDataTable.length !== 1"
            >
              <Marker />
              <span>{{ $t("change name") }}</span>
            </Button>
            <Button
              class="delete"
              v-if="
                nomenclatureSelectedDataTable.length &&
                useUserInfo.controlNomenclature.value
              "
              @click="() => selectedVariant('delete')"
            >
              <Delete />
            </Button>
          </div>
          <DialogNomenclature
            :visible="showDialog"
            :title="
              selectedVerion === 'union'
                ? $t('merging')
                : selectedVerion === 'edit'
                ? $t('name change')
                : $t('deletion of names')
            "
            @close="showDialog = $event"
          >
            <template #bodyoption>
              <div class="unite_dialog">
                <div class="table_dialogs">
                  <SelectedNomenclatureTable
                    :products="nomenclatureSelectedDataTable"
                    @select-product="nomenclatureSelectedDataTable = $event"
                    :highlight-mode="selectedVerion === 'delete'"
                  />
                </div>
                <div class="change_data" v-if="selectedVerion !== 'delete'">
                  <label>
                    <p>{{ $t("set a new name") }}</p>
                    <InputText
                      v-model="changeTitle"
                      type="text"
                      :class="errorClass ? 'classError' : 'change_input'"
                    />
                  </label>
                </div>
                <div
                  class="info_container"
                  v-if="
                    selectedVerion === 'union' ||
                    (selectedVerion === 'delete' &&
                      !nomenclatureSelectedDataTable.some((el) => el.items_count > 0))
                  "
                >
                  <Info />
                  <p>
                    {{
                      selectedVerion === "delete"
                        ? $t("cannot be restored")
                        : $t("replace the names") +
                          ": " +
                          nomenclatureSelectedDataTable.length
                    }}
                  </p>
                </div>
                <div
                  class="error_popup_box"
                  v-if="
                    selectedVerion === 'delete' &&
                    nomenclatureSelectedDataTable.some((el) => el.items_count > 0)
                  "
                >
                  <WarrningX />
                  <div class="warrning_info">
                    <h3>{{ $t("cannot be deleted") }}</h3>
                    <p
                      v-if="
                        nomenclatureSelectedDataTable.some((el) => el.items_count > 0) &&
                        nomenclatureSelectedDataTable.filter((el) => el.items_count > 0)
                          .length === 1
                      "
                    >
                      {{ $t("delete the highlighted items") }}
                    </p>
                  </div>
                </div>
                <Button
                  v-if="selectedVerion === 'delete'"
                  class="cancel"
                  @click="showDialog = false"
                  >{{ $t("cancel") }}</Button
                >
                <Button
                  @click="modifyNominclatureItems"
                  class="unite"
                  :disabled="
                    (selectedVerion === 'delete' &&
                      nomenclatureSelectedDataTable.some((el) => el.items_count > 0)) ||
                    !nomenclatureSelectedDataTable.length
                  "
                  >{{
                    selectedVerion === "union"
                      ? $t("merge")
                      : selectedVerion === "edit"
                      ? $t("rename")
                      : $t("delete")
                  }}</Button
                >
              </div>
            </template>
          </DialogNomenclature>
          <div class="changeContainer">
            <p class="select_info" v-if="!nomenclatureSelectedDataTable.length">
              {{ $t("to change names, select them from the list on the left") }}
            </p>
            <div v-if="nomenclatureSelectedDataTable.length">
              <p class="selected_table_title">{{ $t("selected items") }}</p>
              <SelectedNomenclatureTable
                :products="nomenclatureSelectedDataTable"
                @select-product="nomenclatureSelectedDataTable = $event"
                :link-mode="true"
              />
            </div>
          </div>
        </div>
        <div v-else class="nomenclature_div_showsearch_all">
          <div
            class="nomenclature_div_showsearch"
            :class="
              showEdit
                ? 'nomenclature_div_showsearch nomenclature_div_showsearch_active'
                : 'nomenclature_div_showsearch'
            "
          >
            <div class="changeContainer">
              <div class="editable_container">
                <Button
                  class="unite"
                  @click="() => selectedVariant('union')"
                  :disabled="nomenclatureSelectedDataTable.length <= 1"
                  v-if="
                    nomenclatureSelectedDataTable.length &&
                    useUserInfo.controlNomenclature.value
                  "
                >
                  <Unite />
                  <span>{{ $t("merge") }}</span>
                </Button>
                <Button
                  class="edit"
                  v-if="
                    nomenclatureSelectedDataTable.length &&
                    useUserInfo.controlNomenclature.value
                  "
                  @click="() => selectedVariant('edit')"
                  :disabled="nomenclatureSelectedDataTable.length !== 1"
                >
                  <Marker />
                  <span>{{ $t("change name") }}</span>
                </Button>
                <Button
                  class="delete"
                  v-if="
                    nomenclatureSelectedDataTable.length &&
                    useUserInfo.controlNomenclature.value
                  "
                  @click="() => selectedVariant('delete')"
                >
                  <Delete />
                </Button>
                <button class="edit" @click="showEdit = false">
                  <span>{{ $t("hide") }}</span>
                </button>
              </div>
              <DialogNomenclature
                :visible="showDialog"
                :title="
                  selectedVerion === 'union'
                    ? $t('merging')
                    : selectedVerion === 'edit'
                    ? $t('name change')
                    : $t('deletion of names')
                "
                @close="showDialog = $event"
              >
                <template #bodyoption>
                  <div class="unite_dialog">
                    <div class="table_dialogs">
                      <SelectedNomenclatureTable
                        :products="nomenclatureSelectedDataTable"
                        @select-product="nomenclatureSelectedDataTable = $event"
                        :highlight-mode="selectedVerion === 'delete'"
                      />
                    </div>
                    <div class="change_data" v-if="selectedVerion !== 'delete'">
                      <label>
                        <p>{{ $t("set a new name") }}</p>
                        <InputText
                          v-model="changeTitle"
                          type="text"
                          :class="errorClass ? 'classError' : 'change_input'"
                        />
                      </label>
                    </div>
                    <div
                      class="info_container"
                      v-if="
                        selectedVerion === 'union' ||
                        (selectedVerion === 'delete' &&
                          !nomenclatureSelectedDataTable.some((el) => el.items_count > 0))
                      "
                    >
                      <Info />
                      <p>
                        {{
                          selectedVerion === "delete"
                            ? $t("cannot be restored")
                            : $t("replace the names") +
                              ": " +
                              nomenclatureSelectedDataTable.length
                        }}
                      </p>
                    </div>
                    <div
                      class="error_popup_box"
                      v-if="
                        selectedVerion === 'delete' &&
                        nomenclatureSelectedDataTable.some((el) => el.items_count > 0)
                      "
                    >
                      <WarrningX />
                      <div class="warrning_info">
                        <h3>{{ $t("cannot be deleted") }}</h3>
                        <p
                          v-if="
                            nomenclatureSelectedDataTable.some(
                              (el) => el.items_count > 0
                            ) &&
                            nomenclatureSelectedDataTable.filter(
                              (el) => el.items_count > 0
                            ).length === 1
                          "
                        >
                          {{ $t("delete the highlighted items") }}
                        </p>
                      </div>
                    </div>
                    <Button
                      v-if="selectedVerion === 'delete'"
                      class="cancel"
                      @click="showDialog = false"
                      >{{ $t("cancel") }}</Button
                    >
                    <Button
                      @click="modifyNominclatureItems"
                      class="unite"
                      :disabled="
                        (selectedVerion === 'delete' &&
                          nomenclatureSelectedDataTable.some(
                            (el) => el.items_count > 0
                          )) ||
                        !nomenclatureSelectedDataTable.length
                      "
                      >{{
                        selectedVerion === "union"
                          ? $t("merge")
                          : selectedVerion === "edit"
                          ? $t("rename")
                          : $t("delete")
                      }}</Button
                    >
                  </div>
                </template>
              </DialogNomenclature>

              <p class="select_info" v-if="!nomenclatureSelectedDataTable.length">
                {{ $t("to change names, select them from the list on the left") }}
              </p>
              <div v-if="nomenclatureSelectedDataTable.length">
                <p class="selected_table_title">{{ $t("selected items") }}</p>
                <SelectedNomenclatureTable
                  :products="nomenclatureSelectedDataTable"
                  @select-product="nomenclatureSelectedDataTable = $event"
                  :link-mode="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuccessMessage v-if="successInfo" :title="successInfo" />
  </main>
</template>
<style lang="scss">
@import "./styles.scss";
</style>
