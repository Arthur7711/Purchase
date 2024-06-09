<template>
  <DialogPurchase
    :visible="isOpenDialog"
    @close="isOpenDialog = $event"
    :width-size="
      ScreenParams.screenParams.width > 1300
        ? '1520px'
        : ScreenParams.screenParams.width + 'px'
    "
    :style-wrapper="{
      background: purchase?.info?.product_status
        ? setColorBackground(purchase.info.product_status.id)
        : setColorBackground(0),
      position: 'relative',
    }"
  >
    <template #title>
      <div :class="$style['card-purchase_header__title']">
        <p>
          {{ `id ${purchase ? purchase.id : ""}` }}
          <span
            :style="{
              color: purchase?.info?.product_status
                ? colorizeProductStatus(purchase.info.product_status.id).color
                : colorizeProductStatus(1).color,
            }"
          >
            {{ purchase?.info?.product_status?.name.toLocaleLowerCase() }}
          </span>
        </p>

        <img
          v-if="!purchase?.is_favourite"
          :src="favoriteStar"
          alt="favoriteStar"
          :class="$style['card-purchase_header__star']"
          @click="addFavorite"
        />
        <img
          v-else
          :src="favoriteStarYellow"
          alt="favoriteStar"
          :class="$style['card-purchase_header__star']"
          @click="deleteFavorite"
        />
      </div>
    </template>
    <template #actions>
      <div :class="$style['card-purchase_header__btns']">
        <Button
          unstyled
          v-if="ScreenParams.screenParams.width < 650"
          :class="$style['card-purchase_header__create-btn']"
          @click="showPurchase = !showPurchase"
          :disabled="!isCompleted"
          >show purchase</Button
        >
        <button
          v-if="ScreenParams.screenParams.width > 650"
          :class="$style['card-purchase_header__hide-btn']"
          @click="
            () => {
              if (
                purchase &&
                !usePurchasesInfo.curtailedPurchases.value.find(
                  (item) => item?.id && purchase?.id && item.id === purchase.id
                )
              ) {
                addPurch(purchase);
              }
              isOpenDialog = false;
              isCollapsed = true;
            }
          "
        >
          <p>{{ $t("collapse") }}</p>
          <HideIcon :class="$style['card-purchase_header__hide-btn--icon']" />
        </button>
      </div>
    </template>
    <template #content>
      <PurchaseCardLayout
        :is-loading="isLoading"
        :purchase="purchase"
        :type="'edit'"
        :validation="validatePurchase"
        :show-purch="showPurchase"
        :is-completed-groups="isCompletedGroups"
        :is-completed-purchase="isCompleted"
        @completed-groups="isCompletedGroups = $event"
        @hide="showPurchase = false"
        @save="save"
      />
    </template>
  </DialogPurchase>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { IPurchase, IPurchaseNew, IPosition, IGroup, IItemGroup } from "./types";

import DialogPurchase from "@/components/dialogs/DialogPurchase.vue";
import PurchaseCardLayout from "@/views/purchases/components/cards/purchaseCard/PurchaseCardLayout.vue";
import HideIcon from "@/components/icons/HideIcon.vue";

import usePurchasesInfo from "@/store/purchases_store/purchases";
import { changePurchase } from "@/api/purchases";
import { colorizeProductStatus } from "@/helpers/colorize_paying_status";
import { postFavorite, deleteFavourite } from "@/api/favoriteTablePurchases";

import favoriteStar from "@/components/icons/star-sharp.svg";
import favoriteStarYellow from "@/components/icons/star-sharp-yellow.svg";
import ScreenParams from "@/store/screen";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close", value: boolean): void;
}>();

const router = useRouter();
const route = useRoute();
const showPurchase = ref(false);
const isOpenDialog = ref(props.isOpen);
const purchase = ref<IPurchase | null>(null);
const isChanged = ref(false);
const isLoading = ref(true);
const isCollapsed = ref(false);
const isCompletedGroups = ref(true);

const validatePurchase = ref({
  purchase_data: {
    specialist_id: "",
    legal_id: "",
    account_id: "",
  },
});

const isCompleted = computed(() => {
  let isRight = !!purchase.value;

  if (purchase.value) {
    isRight =
      !Object.values(validatePurchase.value.purchase_data).some(
        (item: string) => item.length !== 0
      ) && isCompletedGroups.value;
  }

  return isRight ? isRight && isChanged.value : isRight;
});

const save = (): void => {
  isLoading.value = true;

  if (purchase.value) {
    purchase.value.groups.forEach((item: IGroup) => {
      item.items.forEach((el: IItemGroup) => {
        if (el.is_new) el.id = undefined;
      });
    });

    changePurchase(purchase.value)
      .then((res) => {
        usePurchasesInfo.setSelectedPurchase(null);
        usePurchasesInfo.setUpdateTable(true);

        setTimeout(() => {
          usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
          isLoading.value = false;
        });
      })
      .finally(() => {
        usePurchasesInfo.setUpdateTable(false);
      });
  }
};

const addPurch = (purch: IPurchaseNew | IPurchase): void => {
  const data = purch as IPurchase;
  data.isChanged = isChanged.value;

  usePurchasesInfo.addCurtailedPurchase(data);
};

const setColorBackground = (id: number): string => {
  switch (id) {
    case 4:
      return "linear-gradient(0deg, rgba(194, 24, 91, 0.02) 0%, rgba(194, 24, 91, 0.02) 100%), #FFF";
    case 2:
      return "#F3F7FC";
    case 3:
      return "linear-gradient(0deg, rgba(104, 159, 56, 0.04) 0%, rgba(104, 159, 56, 0.04) 100%), #FFF";
    case 7:
      return "linear-gradient(0deg, rgba(198, 40, 40, 0.08) 0%, rgba(198, 40, 40, 0.08) 100%), #FFF";
    case 8:
      return "linear-gradient(0deg, rgba(245, 124, 0, 0.05) 0%, rgba(245, 124, 0, 0.05) 100%), #FFF";
    default:
      return "#F4F4F4";
  }
};

watch(isOpenDialog, () => {
  if (!isOpenDialog.value) {
    if (!isCollapsed.value) {
      if (purchase.value) {
        const arrPurchs: IPosition[] = [];

        usePurchasesInfo.curtailedPositions.value.forEach((item) => {
          if (
            purchase.value &&
            purchase.value?.id &&
            item.purchase_id !== purchase.value.id
          ) {
            arrPurchs.push(item);
          }
        });

        usePurchasesInfo.setCurtailedPositions(arrPurchs);
      }
    } else {
      isCollapsed.value = false;
    }

    usePurchasesInfo.setSelectedIndex(null);
    usePurchasesInfo.setSelectedPurchase(null);
    emit("close", isOpenDialog.value);

    router.replace({
      query: {
        ...route.query,
        id: undefined,
      },
    });
  }
});
watch(
  () => props.isOpen,
  () => {
    isOpenDialog.value = props.isOpen;
  }
);

watch(
  () => purchase.value,
  (value) => {
    isChanged.value =
      JSON.stringify(value) !== JSON.stringify(usePurchasesInfo.selectedPurchase.value);
  },
  { deep: true }
);

watch(
  () => usePurchasesInfo.selectedPurchase.value,
  (value) => {
    if (value) {
      purchase.value = JSON.parse(JSON.stringify({ ...value, isChanged: false }));
    } else purchase.value = null;
  },
  { deep: true }
);

const addFavorite = async (): Promise<void> => {
  if (purchase.value) {
    await postFavorite(`${purchase.value.id}`).then(() => {
      if (purchase.value) purchase.value.is_favourite = true;
      usePurchasesInfo.setUpdateTable(true);
    });

    setTimeout(() => {
      usePurchasesInfo.setUpdateTable(false);
    });
  }
};

const deleteFavorite = async (): Promise<void> => {
  if (purchase.value) {
    await deleteFavourite(`${purchase.value.id}`).then(() => {
      if (purchase.value) purchase.value.is_favourite = false;
      usePurchasesInfo.setUpdateTable(true);
    });

    setTimeout(() => {
      usePurchasesInfo.setUpdateTable(false);
    });
  }
};
onMounted(() => {
  const queryParams = router.currentRoute.value.query;

  const newPurch = JSON.parse(JSON.stringify(usePurchasesInfo.selectedPurchase.value));

  usePurchasesInfo.setSelectedPurchase({ ...newPurch });

  if (!queryParams["id"]) {
    router.replace({ query: { ...route.query, id: newPurch.id } });
  }

  if (
    usePurchasesInfo.selectedPurchase.value &&
    usePurchasesInfo.selectedPurchase.value.isChanged
  ) {
    isChanged.value = usePurchasesInfo.selectedPurchase.value.isChanged;
  }
});
</script>

<style lang="scss" module>
.card-purchase {
  &_header {
    text-align: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;
    width: 25%;
    &__title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    &__star {
      cursor: pointer;
    }
    &__btns {
      display: flex;
      align-items: center;
      gap: 12px;
    }
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
    &__fill-btn {
      cursor: pointer;
      border: none;
      outline: none;
      padding: 5px 14px;
      border-radius: 10px;
      color: #1565c0;
      background-color: #ffffff;
      font-weight: 600;
      font-size: 16px;
      &:enabled:hover {
        color: #256ec2;
      }
      &:disabled {
        cursor: auto;
        color: #b6b6b6;
      }
    }
    &__close-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 10px;
      height: 16px;
      background: none;
      border: none;
      outline: none;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
}

@media only screen and (max-width: 650px) {
  .card-purchase_header__btns {
    margin-top: 10px;
  }
}
</style>
