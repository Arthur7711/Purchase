<script lang="ts" setup>
import { curFormatter } from "@/helpers/currencyFormatter";
import { getCurrencySignName } from "@/helpers/currencySign";
import useUserInfo from "@/store/user";
import usePositionsFilters from "../../store/purchases_store/positionsFilter";
import { useRouter, useRoute } from "vue-router";

const props = defineProps<{
  top_data: {
    summ: string | number;
    aux_summ: string | number;
    purch_count: string | number;
    activatedTotalPrice: string | number;
    activatedTotalUSD: string | number;
  };
  name?: string; 
  tableType: string;
}>();

const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="headerpurch_div_display_allprice" v-if="name !== 'payments'">
    <div class="headerpurch_div_display_left headerpurch_div_display_left_block">
      <img class="headerpurch_img_display_left" src="../icons/money_bill.svg" alt="$$$" />
      <div class="headerpurch_div_inside_left">
        <span style="color: #999999">{{ $t("total amount") }}</span>
        <div>
          <span
            >{{ curFormatter(top_data.summ) }}
            {{
              useUserInfo.userData.value?.location &&
              getCurrencySignName(useUserInfo.userData.value.location.currency)
            }}
          </span>
          <span
            v-if="useUserInfo.userData.value?.location.office_name !== 'Global'"
            style="color: #999999; margin-left: 10px"
          >
            {{ curFormatter(top_data.aux_summ) }}$</span
          >
        </div>
      </div>
    </div>
    <hr
      v-if="tableType === 'position'"
      style="
        rotate: 90deg;
        height: 34px;
        z-index: 2;
        border-color: rgba(227, 227, 227, 0.282);
      "
    />
    <div
      class="headerpurch_div_display_left fact-btn"
      v-if="tableType === 'position'"
      @click="
        () => {
          usePositionsFilters.setPositionsFilters({
            val: usePositionsFilters.filters.value.only_activated ? 0 : 1,
            name: 'only_activated',
          });
          router.replace({
            query: {
              ...route.query,
              only_activated: usePositionsFilters.filters.value.only_activated
                ? 1
                : undefined,
            },
          });
        }
      "
    >
      <img
        class="headerpurch_img_display_left"
        src="../icons/money_bill.svg"
        alt="$$$"
        :style="{
          opacity: usePositionsFilters.filters.value.only_activated ? 1 : 0.5,
        }"
      />
      <div class="headerpurch_div_inside_left">
        <span style="color: #999999">{{ $t("fact amount") }}</span>
        <div>
          <span
            >{{ curFormatter(top_data.activatedTotalPrice) }}
            {{
              useUserInfo.userData.value?.location &&
              getCurrencySignName(useUserInfo.userData.value.location.currency)
            }}
          </span>
          <span
            v-if="useUserInfo.userData.value?.location.office_name !== 'Global'"
            style="color: #999999; margin-left: 10px"
          >
            {{ curFormatter(top_data.activatedTotalUSD) }}$</span
          >
        </div>
      </div>
    </div>
    <hr
      style="
        rotate: 90deg;
        height: 34px;
        z-index: 2;
        border-color: rgba(227, 227, 227, 0.282);
      "
    />
    <div class="headerpurch_div_display_left headerpurch_div_display_right">
      <img
        class="headerpurch_img_display_left"
        src="../icons/basket-shopping.svg"
        alt="$$$"
      />
      <div class="headerpurch_div_inside_left">
        <span style="color: #999999">{{
          tableType === "position" ? $t("total items") : $t("total purchases")
        }}</span>
        <div>
          <span>{{ curFormatter(top_data.purch_count) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
