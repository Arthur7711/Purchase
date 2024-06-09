<script setup lang="ts">
import i18n_config from "@/locales/i18n_config";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useSafes from "@/store/safes";
import type { DropdownChangeEvent } from "primevue/dropdown";
import ButtonBurger from "@/components/custom/ButtonBurger.vue";
import ScreenParams from "@/store/screen";
import { toRefs } from "@vueuse/core";
import Wallet from "@/components/icons/Wallet.vue";
import Building from "@/components/icons/Building.vue";
import Cost from "@/components/icons/Cost.vue";
import Shop from "@/components/icons/Shop.vue";
import UserCheck from "@/components/icons/UserCheck.vue";
import ArrowList from "@/components/icons/ArrowList.vue";
import downPicker from "@/components/icons/downPicker.vue";
const { messages, locale } = i18n_config.global;
const router = useRouter();
const route = useRoute();
const showBurger = ref(false);
const selectedLang = ref();
const openAnalyt = ref(false);
const imgUrl = import.meta.env.VITE_VUE_APP_API_URL_AVATAR;
const props = defineProps<{
  navigationList: { text: string; title: string }[];
  showSafe: boolean;
  active: (i: number) => boolean;
  languageList: {
    id: string;
    title: string;
  }[];
  userData: {
    imgUrl: string;
    fullName: string;
  };
}>();
const { fullPath } = toRefs(useRoute());
const tabs = [
  {
    link: "/analytics/expenses",
    title: messages[locale]["expenses"],
  },
  {
    link: "/analytics/offices",
    title: messages[locale]["office comparison"],
  },
  {
    link: "/analytics/leaders",
    title: messages[locale]["managers"],
  },
  {
    link: "/analytics/suppliers",
    title: messages[locale]["suppliers"],
  },
  {
    link: "/analytics/prices",
    title: messages[locale]["prices"],
  },
];
watch(
  () => showBurger.value,
  () => {
    showBurger.value
      ? (document.body.style.position = "fixed")
      : (document.body.style.position = "");
  }
);
</script>

<template>
  <div class="mobile_header_div_all">
    <ButtonBurger :isVisible="showBurger" @change="(e) => (showBurger = e)" />
    <div
      :class="
        showBurger
          ? 'mobile_header_burger_div mobile_header_burger_div_disable'
          : 'mobile_header_burger_div_disable'
      "
      @click="showBurger = !showBurger"
    >
      <div
        v-if="showBurger"
        @click="(e) => e.stopPropagation()"
        class="mobile_header_wrapper_div"
      >
        <div class="mobile_header_wrapper_div__header">
          <img
            :src="`${imgUrl}${userData.imgUrl}`"
            style="width: 40px; border-radius: 50%"
          />
          <ButtonBurger :isVisible="showBurger" @change="(e) => (showBurger = e)" />
        </div>
        <div class="mobile_header_wrapper_div__content">
          <nav v-if="route.matched[0]?.path">
            <div
              @click="showBurger = false"
              :key="tab.title"
              :style="
                tab.title.includes('/safe') && !useSafes.safes.value.length
                  ? { marginRight: '-6%' }
                  : ''
              "
              class="tab_mobile_div"
              v-for="(tab, i) in navigationList"
              v-show="
                ScreenParams.width.value < 650
                  ? tab.title !== '/analytics'
                    ? true
                    : false
                  : true
              "
            >
              <router-link
                :to="tab.title"
                :key="tab.title"
                v-if="!tab.title.includes('/safe')"
                class="tab tab_mobile"
                :class="active(i) && !showSafe ? 'active_tab' : ''"
                >{{ tab.text }}</router-link
              >
              <span
                @click="$emit('show_safe', true)"
                v-else-if="tab.title.includes('/safe') && useSafes.safes.value.length"
                :class="showSafe ? 'active_tab' : ''"
                class="tab tab_mobile"
                >{{ tab.text }}</span
              >
            </div>
            <div>
              <span class="tab tab_mobile" @click="openAnalyt = !openAnalyt">
                {{ $t("analytics") }} <downPicker style="transform: scale(0.7)"
              /></span>
              <div @click="showBurger = false" v-if="openAnalyt">
                <div v-for="tab in tabs" :key="tab.link" class="tabs">
                  <router-link :to="tab.link" class="links" active-class="selectedItem">
                    <div v-if="tab.link === '/analytics/expenses'">
                      <Wallet :selected="fullPath.includes(tab.link)" />
                    </div>
                    <div v-if="tab.link === '/analytics/offices'">
                      <Building :selected="fullPath.includes(tab.link)" />
                    </div>
                    <div v-if="tab.link === '/analytics/prices'">
                      <Cost :selected="fullPath.includes(tab.link)" />
                    </div>
                    <div v-if="tab.link === '/analytics/suppliers'">
                      <Shop :selected="fullPath.includes(tab.link)" />
                    </div>
                    <div v-if="tab.link === '/analytics/leaders'">
                      <UserCheck :selected="fullPath.includes(tab.link)" />
                    </div>
                    <p>{{ tab.title }}</p>
                  </router-link>
                </div>
              </div>
            </div>
            <ModalSafe v-if="showSafe" @close="$emit('show_safe', false)" />
            <SearchIcon
              v-if="route.fullPath === '/purchases' || route.fullPath === '/payments'"
              @click="
                route.fullPath === '/purchases' || route.fullPath === '/payments'
                  ? $emit('show_search')
                  : null
              "
            />
          </nav>
        </div>
        <div class="mobile_header_wrapper_div__footer">
          <Dropdown
            class="mobile_header_wrapper_div__footer__dropdown"
            :options="languageList"
            v-model="selectedLang"
            :placeholder="$t('language')"
            optionLabel="title"
            optionValue="id"
            @change="(e:DropdownChangeEvent) => $emit('language_change', e)"
          >
            <template #value>{{ $t("language") }}</template>
          </Dropdown>
          <span
            class="mobile_header_wrapper_div__footer__span"
            @click="$emit('redirect')"
            >{{ $t("exit") }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mobile_header_div_all {
  height: 1px;
  width: 1px;
  display: flex;
  align-items: center;
  padding-right: 10vw;
  button {
    padding: 0px;
  }
  .links {
    font-style: normal;
    font-size: 16px;
    line-height: 18px;
    color: var(--vt-c-text-black);
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 12px;
  }
  .selectedItem {
    color: var(--vt-c-electric-blue);
    font-weight: 700 !important;
  }
}

.mobile_header_burger_div {
  min-width: 200vw !important;
  min-height: 100vh !important;
  max-height: 100vh !important;
  max-width: 200vh !important;
  position: fixed;
  z-index: 10;
  background-color: rgba(45, 45, 45, 0.419);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translate(0vw, 0vh) !important;
  transition: transform 0.5s ease-in-out;
  &_disable {
    transform: translate(-100vw, 0vh);
    transition: transform 0.5s ease-in-out;
    .mobile_header_wrapper_div {
      &__header,
      &__content,
      &__footer {
        opacity: 0 !important;
      }
      &__content {
        nav {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
      }
    }
  }
  .mobile_header_wrapper_div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 50px;
    background-color: white;
    border: none;
    box-sizing: border-box;
    padding: 5%;
    width: 70vw;
    height: 100vh;
    border-radius: 0px 10px 10px 0px;
    &__header,
    &__content,
    &__footer {
      opacity: 1 !important;
    }
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    &__footer {
      display: flex;
      flex-direction: column;
      .p-dropdown,
      .p-component,
      .p-inputwrapper,
      &__dropdown {
        padding: 0 !important;
        margin-left: -12px;
        background: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: none !important;
        .p-dropdown-label-empty {
          display: none !important;
        }
      }
      &__span {
        color: rgb(190, 93, 2);
        font-size: 16px;
        margin-top: 10%;
      }
    }
  }
}
</style>
