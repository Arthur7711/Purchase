<template>
  <Dialog class="edit-position" :is-open="isOpen" :title="title" @close="closePopup">
    <template #headerActions>
      <div class="edit-position_actions">
        <button
          v-if="ScreenParams.screenParams.width > 650"
          class="edit-position_actions__hide-btn"
          @click="
            () => {
              if (data) {
                const posInd = usePurchasesInfo.curtailedPositions.value.findIndex(
                  (item) => item?.id && data?.id && item.id === data.id
                );
                if (posInd === -1) {
                  addPosition(data);
                } else {
                  usePurchasesInfo.setSelectedIndexPos(posInd);
                  usePurchasesInfo.deleteCurtailedPosition(posInd);

                  usePurchasesInfo.addCurtailedPosition(data);
                }
              }

              emit('close', false);
            }
          "
        >
          <p>{{ $t("collapse") }}</p>
          <HideIcon class="edit-position_actions__hide-btn--icon" />
        </button>
        <button class="edit-position_actions__close" @click="closePopup">
          <img :src="CrossMark" alt="X" />
        </button>
      </div>
    </template>
    <template #content>
      <PositionCardLayout :data="data" :is-changed="isChanged" @save="savePosition" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import type { IPosition, IPurchase } from "./types";
import { useRouter, useRoute } from "vue-router";
import { changePosition } from "@/api/positions";
import { getPurchase } from "@/api/purchases";
import ScreenParams from "@/store/screen";

import Dialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue";
import CrossMark from "@/components/icons/xmark.svg";
import HideIcon from "@/components/icons/HideIcon.vue";
import PositionCardLayout from "../cards/positionCard/PositionCardLayout.vue";
import usePurchasesInfo from "@/store/purchases_store/purchases";

const props = defineProps<{
  isOpen: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: "close", value: boolean): void;
}>();

const router = useRouter();
const route = useRoute();

const data = ref<IPosition | null>(null);
const isChanged = ref(true);

const closePopup = () => {
  emit("close", false);
  if (usePurchasesInfo.selectedPosition.value) {
    router.replace({
      query: {
        ...route.query,
        purchase_item_id: undefined,
      },
    });
  }
  usePurchasesInfo.setSelectedIndexPos(null);
  usePurchasesInfo.setSelectedPosition(null);
};

watch(
  () => isChanged.value,
  (value) => {
    if (data.value) {
      data.value.is_changed = value;
    }
  }
);

watch(
  () => data.value,
  (value) => {
    console.log(
      "data.value",
      value?.is_changed,
      usePurchasesInfo.selectedPosition.value?.is_changed
    );

    isChanged.value =
      JSON.stringify(value) !== JSON.stringify(usePurchasesInfo.selectedPosition.value);
  },
  { deep: true }
);

const addPosition = (position: IPosition): void => {
  usePurchasesInfo.addCurtailedPosition(position);
};

const savePosition = async () => {
  if (data.value) {
    await changePosition(data.value).then(async (res: IPosition) => {
      usePurchasesInfo.setSelectedPosition({ ...res, is_changed: false });

      await getPurchase(res.purchase_id)
        .then(async (ans: IPurchase) => {
          usePurchasesInfo.setSelectedPurchase({ ...ans, isChanged: false });
        })
        .finally(() => {
          if (data.value) {
            data.value.is_changed = false;
            if (usePurchasesInfo.selectedPosition.value) {
              data.value.logs = [...usePurchasesInfo.selectedPosition.value.logs];
            }
          }
        });
    });

    usePurchasesInfo.setUpdatePositionTable(true);

    setTimeout(() => {
      usePurchasesInfo.setUpdatePositionTable(false);
    });
  }
};

onMounted(() => {
  const queryParams = router.currentRoute.value.query;

  if (!queryParams["purchase_item_id"] && usePurchasesInfo.selectedPosition.value) {
    router.replace({
      query: {
        ...route.query,
        id: usePurchasesInfo.selectedPosition.value.purchase_id,
        purchase_item_id: usePurchasesInfo.selectedPosition.value.id,
      },
    });
  }
  data.value =
    usePurchasesInfo.selectedPosition.value &&
    JSON.parse(JSON.stringify(usePurchasesInfo.selectedPosition.value));

  if (
    data.value &&
    usePurchasesInfo.selectedPosition.value &&
    usePurchasesInfo.selectedPosition.value.is_changed
  ) {
    data.value.is_changed = !usePurchasesInfo.selectedPosition.value.is_changed;
  }
});
</script>

<style lang="scss">
.p-datepicker {
  z-index: 1002 !important;
}

.p-dropdown-panel {
  z-index: 1003 !important;
}
.edit-position {
  &_actions {
    display: flex;
    align-items: center;
    gap: 24px;
    &__hide-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      outline: none;
      border: none;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.05);
      box-shadow: 1px 0px 5px 0px rgba(171, 171, 171, 0.16);
      color: black;
      font-size: 16px;
      font-weight: 400;
      &--icon {
        transform: rotateY(180deg);
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
</style>
