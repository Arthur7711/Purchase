<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts" verbatimModuleSyntax="enabled">
import { getAuthUser, getReferences, updateReferences } from "../../api/auth";
import { ref, onMounted, watch } from "vue";
import User from "../icons/User.vue";
import EditPurchaseDialog from "@/views/purchases/components/dialogs/EditPurchaseDialog.vue";
import EditPositionDialog from "@/views/purchases/components/dialogs/EditPositionDialog.vue";
import VectorRight from "../icons/VectorRight.vue";
import SearchIcon from "../icons/Search.vue";
import Logo from "../icons/Logo.vue";
import DropdownIcon from "../icons/DropdownIcon.vue";
import type { IReference, iReferenceItem, ILocation } from "./types";
import type { IPurchase } from "@/views/purchases/components/dialogs/types";
import { useRouter, useRoute } from "vue-router";
import useOfficeId from "../../store/officeId";
import { removeCookieToken } from "../../helpers/getCookies";
import useUserInfo from "../../store/user";
import { titleCase } from "../../helpers/titleCase";
import Cookies from "js-cookie";
import useOffices from "../../store/officesData";
import TableTopSearcher from "@/components/custom/searcher_components/TableTopSearcher.vue";
import useActiveTable from "@/store/purchases_store/activeTable";
import ModalSafe from "@/components/dialogs/ModalSafe/ModalSafe.vue";
import DropdownDynamicLabel from "../custom/DynamicLabelComponents/DropdownDynamicLabel.vue";
import { getSafes } from "@/api/safes";
import useSafes from "@/store/safes";
import type { DropdownChangeEvent } from "primevue/dropdown";
import i18n_config from "@/locales/i18n_config";
import usePurchasesInfo from "@/store/purchases_store/purchases";
import { getPurchase } from "@/api/purchases";
import { getPosition } from "@/api/positions";
import type { IPosition } from "../../views/purchases/components/dialogs/types";
import ScreenParams from "@/store/screen";
import HeaderMobile from "./adaptive/HeaderMobile.vue";
import useCommonsInfo from "@/store/purchases_store/commons";
import { redirect } from "@/helpers/redirect";
const { messages, locale } = i18n_config.global;
const router = useRouter();
const route = useRoute();
const showSafe = ref(false);
const userData = ref({ imgUrl: "", fullName: "" });
const showDialog = ref(false);
const showLanguages = ref(false);
const show_search = ref(false);

const navigationList = ref([
  { text: messages[locale]["purchases"], title: "/purchases?table_type=purchase" },
  { text: messages[locale]["payments"], title: "/payments" },
  { text: messages[locale]["safe"], title: "/safe" },
  { text: messages[locale]["suppliers"], title: "/suppliers" },
  { text: messages[locale]["analytics"], title: "/analytics" },
  { text: messages[locale]["nomenclature"], title: "/nomenclature" },
]);
const selectedDropdownItem = ref<ILocation | undefined>();
const dropdownList = ref<iReferenceItem[]>([]);
const toggleEditDialogPurchase = ref(false);
const toggleEditDialogPosition = ref(false);
const isApiCalled = ref(false);
const imgUrl = import.meta.env.VITE_VUE_APP_API_URL_AVATAR;
const languageList = [
  { id: "ru", title: "Русский" },
  { id: "en", title: "English" },
];
const selectedLang = ref(
  localStorage.getItem("lang") ? localStorage.getItem("lang") : "ru"
);

const active = (i: number) => {
  let res = false;
  if (route.fullPath.length > 1) {
    route.matched[0].path.includes(
      navigationList.value[i].title.split("/")[1].split("?")[0]
    ) && navigationList.value[i].title.split("/")[1] !== ""
      ? (res = true)
      : (res = false);
    return res;
  } else {
    route.matched[0].path.includes(
      navigationList.value[i].title.split("/")[1].split("?")[0]
    )
      ? (res = true)
      : (res = false);
    return res;
  }
};

onMounted(async () => {
  getAuthUser().then(async (data) => {
    userData.value = {
      imgUrl: data.data.samaccountname,
      fullName: data.data.displayname,
    };
    selectedDropdownItem.value = data.data.location;
    const references: IReference = await getReferences();
    dropdownList.value = references.data;
    useOffices.setOffices(references.data);
    useUserInfo.setUserCurrency(data.data.location.currency);
    useUserInfo.setUserData(data.data);
    useOffices.setSelectedOffice(data.data.location);
    useUserInfo.setControlNomenclature(data.data.permissions.control_nomenclature);
    useOfficeId.setCountryId(data.data.location.country_id);
    useOfficeId.setDepartament(data.data.location.department);
    useUserInfo.setId(data.data.id);
    useUserInfo.setUrl(data.data.samaccountname);
    await getSafes().then((res) => useSafes.setSafes(res));

    const queryParams = router.currentRoute.value.query;

    if (queryParams["id"]) {
      selectedPurchase(+queryParams["id"]);

      if (queryParams["purchase_item_id"]) {
        selectedPosition(+queryParams["purchase_item_id"]);
      }
      router.replace({
        query: {
          ...route.query,
          id: undefined,
          purchase_item_id: undefined,
        },
      });
    }
  });
});

const handleChangeLocale = (e: { value: "ru" | "en" }) => {
  i18n_config.global.locale = e.value;
  localStorage.setItem("lang", e.value);

  usePurchasesInfo.setCurtailedPurchases([]);
  location.reload();
};

const dialogHandler = () => {
  if (showDialog.value) {
    showLanguages.value = false;
  }
  showDialog.value = !showDialog.value;
};
const languageHandler = () => {
  showLanguages.value = !showLanguages.value;
};

watch(
  () => useOffices.selectedOffice.value,
  async (value) => {
    if (value) {
      if (
        value &&
        (!selectedDropdownItem.value ||
          (selectedDropdownItem.value && selectedDropdownItem.value.id !== value.id))
      ) {
        selectedDropdownItem.value = value;
      }
    }
  },
  { deep: true }
);

watch(
  () => usePurchasesInfo.selectedPurchase.value,
  (value) => {
    if (value) {
      toggleEditDialogPurchase.value = true;
    }
  }
);

watch(
  () => usePurchasesInfo.selectedPosition.value,
  (value) => {
    if (value) {
      toggleEditDialogPosition.value = true;
    }
  }
);

watch(selectedDropdownItem, async () => {
  if (selectedDropdownItem.value?.id && isApiCalled.value) {
    useOffices.setSelectedOffice(selectedDropdownItem.value);

    await updateReferences(selectedDropdownItem.value?.id);
    useOfficeId.setOfficeId(selectedDropdownItem.value?.office_id);
    useOfficeId.setUpdatedRefer(selectedDropdownItem.value.id);
    useOfficeId.setCountryId(selectedDropdownItem.value.country_id);

    useCommonsInfo.setIsActualCommons(false);

    await getAuthUser().then(async (data) => {
      useUserInfo.setUserCurrency(data.data.location.currency);
      useUserInfo.setUserData(data.data);
      useUserInfo.setControlNomenclature(data.data.permissions.control_nomenclature);
      useOfficeId.setDepartament(data.data.location.department);
      await getSafes().then((res) => useSafes.setSafes(res));
    });
  }
  isApiCalled.value = true;
});

const selectedPurchase = async (id: number) => {
  await getPurchase(id).then((res: IPurchase) => {
    if (
      useOffices.offices.value &&
      res?.location_id !== useUserInfo.userData.value?.location.id
    ) {
      for (let ind = 0; ind < useOffices.offices.value.length; ind++) {
        const department: ILocation | undefined = useOffices.offices.value[
          ind
        ].locations.find((el) => el.id === res?.location_id);
        if (department) {
          useOffices.setSelectedOffice(department);
          break;
        }
      }
    }

    usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
  });
};

const selectedPosition = async (id: number) => {
  await getPosition(id).then((res: IPosition) => {
    usePurchasesInfo.setSelectedPosition({ ...res, is_changed: false });
  });
};
</script>

<template>
  <header
    v-if="ScreenParams.screenParams.width > 1200"
    class="header"
    :style="show_search ? { alignItems: 'flex-start' } : ''"
  >
    <div class="purchases_container">
      <Logo />
      <div
        v-if="
          dropdownList.length > 1 ||
          (dropdownList.length === 1 && dropdownList?.[0]?.locations.length > 1)
        "
      >
        <Dropdown
          v-model="selectedDropdownItem"
          :options="dropdownList"
          optionLabel="department"
          optionGroupLabel="name"
          optionGroupChildren="locations"
          class="dropdown_group"
          panelClass="dropdown_group_panel"
        >
          <template #optiongroup="slotProps">
            <div class="sub_title">{{ slotProps.option.name }}</div>
          </template>

          <template #dropdownicon>
            <DropdownIcon />
          </template>
          <template #value="slotProps">
            <p
              class="title_content"
              v-if="slotProps.value.office_shortname && slotProps?.value?.department"
            >
              {{
                slotProps.value.office_shortname && slotProps?.value?.department
                  ? `${slotProps?.value?.office_shortname.toUpperCase() || ""}-${
                      titleCase(slotProps?.value?.department) || ""
                    }`
                  : slotProps.placeholder
                  ? slotProps.placeholder
                  : " "
              }}
            </p>
          </template>
        </Dropdown>
      </div>
      <p
        class="title_content"
        v-if="
          dropdownList.length === 1 &&
          dropdownList?.[0]?.locations.length === 1 &&
          dropdownList?.[0]?.locations[0].office_shortname &&
          dropdownList?.[0]?.locations[0].department
        "
      >
        {{
          `${dropdownList?.[0]?.locations[0].office_shortname}-${dropdownList?.[0]?.locations[0].department}`
        }}
      </p>
    </div>
    <nav v-if="route.matched[0]?.path && !show_search" style="margin-right: 200px">
      <div
        :style="
          tab.title.includes('/safe') && !useSafes.safes.value.length
            ? { marginRight: '-6%' }
            : ''
        "
        :key="tab.title"
        v-for="(tab, i) in navigationList"
      >
        <router-link
          :to="tab.title"
          :key="tab.title"
          v-if="!tab.title.includes('/safe')"
          class="tab"
          :class="active(i) && !showSafe ? 'active_tab' : ''"
          >{{ tab.text }}</router-link
        >
        <span
          @click="showSafe = !showSafe"
          v-else-if="tab.title.includes('/safe') && useSafes.safes.value.length"
          :class="showSafe ? 'active_tab' : ''"
          class="tab"
          >{{ tab.text }}</span
        >
      </div>
      <ModalSafe v-if="showSafe" @close="showSafe = false" />
      <SearchIcon
        v-if="route.name === 'purchases' || route.name === 'payments'"
        @click="
          route.name === 'purchases' || route.name === 'payments'
            ? (show_search = !show_search)
            : null
        "
      />
    </nav>
    <div
      v-show="show_search && (route.name === 'purchases' || route.name === 'payments')"
      style="height: max-content; margin-bottom: 10rem; margin-top: 10px"
    >
      <TableTopSearcher
        :table_type="
          route.name === 'payments' ? 'payments' : useActiveTable.activeTable.value
        "
        @close="(value) => (show_search = value)"
      />
    </div>
    <div style="padding-right: 10px">
      <Dropdown class="dropper">
        <template #dropdownicon>
          <div @click="dialogHandler" style="cursor: pointer; padding-top: 10px">
            <img
              :src="`${imgUrl}${userData.imgUrl}`"
              style="width: 40px; border-radius: 50%"
            />
          </div>
        </template>
        <template #footer>
          <main class="user_log_container">
            <div class="user_info">
              <User />
              <p>{{ userData.fullName }}</p>
            </div>
            <div
              class="languages_box"
              @click="languageHandler"
              :class="showLanguages ? 'active_languages_box' : ''"
            >
              <Dropdown
                class="dropper"
                :options="languageList"
                v-model="selectedLang"
                :placeholder="$t('language')"
                optionLabel="title"
                optionValue="id"
                @change="(e: DropdownChangeEvent) => handleChangeLocale(e)"
                :class="showLanguages ? 'active_languages' : ''"
              >
                <template #value>{{ $t("language") }}</template>
              </Dropdown>
            </div>
            <p @click="redirect" class="log_out">{{ $t("exit") }}</p>
          </main>
        </template>
      </Dropdown>
    </div>
  </header>
  <header v-else>
    <div class="adaptive-header_div__all">
      <div v-if="dropdownList.length > 1">
        <Dropdown
          v-model="selectedDropdownItem"
          :options="dropdownList"
          optionLabel="department"
          optionGroupLabel="name"
          optionGroupChildren="locations"
          class="dropdown_group"
          panelClass="dropdown_group_panel"
        >
          <template #optiongroup="slotProps">
            <div class="sub_title">{{ slotProps.option.name }}</div>
          </template>

          <template #dropdownicon>
            <DropdownIcon />
          </template>
          <template #value="slotProps">
            <p
              class="title_content"
              v-if="slotProps.value.office_shortname && slotProps?.value?.department"
            >
              {{
                slotProps.value.office_shortname && slotProps?.value?.department
                  ? `${slotProps?.value?.office_shortname.toUpperCase() || ""}-${
                      titleCase(slotProps?.value?.department) || ""
                    }`
                  : slotProps.placeholder
                  ? slotProps.placeholder
                  : " "
              }}
            </p>
          </template>
        </Dropdown>
      </div>
      <HeaderMobile
        @show_safe="showSafe = !showSafe"
        @close="(val) => (showSafe = val)"
        @show_search="show_search = !show_search"
        @language_change="(e) => handleChangeLocale(e)"
        @redirect="redirect"
        :language-list="languageList"
        :active="active"
        :navigation-list="navigationList"
        :show-safe="showSafe"
        :user-data="userData"
      />
    </div>
    <ModalSafe v-if="showSafe" @close="showSafe = false" />
  </header>
  <EditPurchaseDialog
    v-if="toggleEditDialogPurchase"
    :is-open="toggleEditDialogPurchase"
    @close="toggleEditDialogPurchase = $event"
  ></EditPurchaseDialog>
  <EditPositionDialog
    v-if="toggleEditDialogPosition"
    :title="`${$t('item')} ${usePurchasesInfo.selectedPosition.value?.id}`"
    :is-open="toggleEditDialogPosition"
    @close="toggleEditDialogPosition = $event"
  ></EditPositionDialog>
</template>
<style lang="scss">
@import "./header.scss";

.adaptive-header_div__all {
  display: flex;
  max-width: 95vw;
  min-width: 95vw;
  justify-content: space-between;
  align-items: center;
}
</style>
