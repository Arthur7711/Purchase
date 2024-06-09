<script setup lang="ts">
import SuppliersTable from "../../components/simpleTable/SuppliersTable.vue";
import { onMounted, ref, watch } from "vue";
import AddSuplier from "./AddSuplier.vue";
import SuccessMessage from "../../components/successMessage/SuccessMessage.vue";
import useSuccess from "../../store/successInfo";
import { getLegalEntities } from "@/api/suppliersPage";
import i18n_config from "@/locales/i18n_config";

const { locale, messages } = i18n_config.global;

const showAddDropdown = ref(false);
const tableRef = ref(1);
const legal = ref<{ id: number | null; name: string }[] | null>(null);
onMounted(async () => {
  await getLegalEntities().then((res) => {
    legal.value = res.data.map((el) => {
      return { id: el.id, name: el.name };
    });
    legal.value.unshift({ id: null, name: messages[locale].all });
  });
  if (useSuccess.success.value) {
    setTimeout(() => {
      useSuccess.setSuccess(false);
    }, 3000);
  }
});
watch(useSuccess.success, () => {
  if (useSuccess.success.value) {
    tableRef.value += 1;
    setTimeout(() => {
      useSuccess.setSuccess(false);
    }, 1500);
  }
});
</script>
<template>
  <main class="suppliers_page_main">
    <div class="heading_box">
      <h2>{{ $t("supplier base") }}</h2>
      <Button link class="add_supplier" @click="showAddDropdown = true"
        >+ {{ $t("supplier") }}</Button
      >
    </div>
    <div class="suppliers_page_main_div_table">
      <SuppliersTable v-if="legal" ref="but" :key="tableRef" :legal_entities="legal" />
    </div>
    <AddSuplier
      v-if="legal"
      :show-add-dropdown="showAddDropdown"
      @close="showAddDropdown = $event"
      @success="useSuccess.setSuccess($event)"
      :legal="legal"
    />
    <SuccessMessage
      v-if="useSuccess.success.value"
      :title="useSuccess.successText.value"
    />
  </main>
</template>
<style lang="scss">
@import "./styles.scss";
</style>
