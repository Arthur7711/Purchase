<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "../components/navbar/Navbar.vue";
import ScreenParams from "@/store/screen";
import { ref, watch } from "vue";
const showNav = ref(false);
watch(
  () => showNav.value,
  () => {
    switch (showNav.value) {
      case false:
        document.body.style.position = "";
        break;
      case true:
        document.body.style.position = "fixed";
        break;
      default:
        break;
    }
  }
);
</script>
<template>
  <Navbar v-if="ScreenParams.screenParams.width > 650" />
  <div
    v-else
    :class="
      showNav
        ? 'layout_analyt_navbar_active layout_analyt_navbar'
        : 'layout_analyt_navbar'
    "
  >
    <button class="layout_analyt_navbar_active__button" @click="showNav = !showNav">
      {{ $t("hide filters") }}
    </button>
    <Navbar />
  </div>
  <main class="mainBody">
    <button
      class="mainBody_button_show_filters"
      v-if="ScreenParams.screenParams.width < 650"
      @click="showNav = !showNav"
    >
      {{ $t("show filters") }}
    </button>
    <RouterView />
  </main>
</template>
<style lang="scss">
@import "../assets/colors.scss";
.mainBody {
  padding: 36px;
  background: var(--vt-c-white);
  border-radius: 15px;
  width: 100%;
  // min-height: 180vh;
}

.layout_analyt_navbar {
  position: fixed;
  background-color: #fff;
  z-index: 3;
  width: 100vw;
  padding-bottom: 10vh;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: flex-start;
  opacity: 1;
  transform: translateX(-100vw);
  transition: all 0.3s;
}
.layout_analyt_navbar_active {
  z-index: 3;
  height: 100vh;
  overflow-y: scroll !important;
  opacity: 1;
  transform: translateX(0vw);
  &__button {
    margin-top: 50px;
    background: none;
    border: 1px $purch_blue solid;
    padding: 1%;
    border-radius: 10px;
    color: $purch_blue;
  }
}
@media only screen and (max-width: 650px) {
  .mainBody {
    overflow: scroll;
    .mainBody_button_show_filters {
      background: none;
      color: $purch_blue;
      border: 1px $purch_blue solid;
      padding: 1%;
      border-radius: 10px;
    }
  }
}
</style>
