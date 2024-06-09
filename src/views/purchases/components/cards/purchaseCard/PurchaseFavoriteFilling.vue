<template>
  <div class="menu-action">
    <Button
      @click="toggle"
      unstyled
      :class="[
        'fav-purchs_fill-btn',
        { 'fav-purchs_fill-btn--chosen': selectedFavPurchase },
      ]"
    >
      {{ !selectedFavPurchase ? $t("fill from favorites") : $t("filled from favorites") }}
    </Button>

    <div v-show="menu" class="menu-action_content">
      <div class="approvals-modal">
        <div v-if="favPurchases.length" class="approvals-modal_wrapper">
          <ul class="approvals-modal_list">
            <li
              v-for="chosen in favPurchases"
              :key="chosen.id"
              :class="[
                'approvals-modal_list__item approval',
                {
                  selected: selectedFavPurchase && selectedFavPurchase.id === chosen.id,
                },
              ]"
              @click="selectFavPurchase(chosen)"
            >
              <p class="approval_name">
                {{ chosen.id }}
              </p>
              <p class="approval_description">{{ chosen.description }}</p>
              <p class="approval_occupation">
                {{
                  chosen.purchase_date.split("-")[1] +
                  "." +
                  chosen.purchase_date.split("-")[0].substr(2)
                }}
              </p>
            </li>
          </ul>
        </div>
        <div v-else class="fav-purchs_no-data-description">
          <p class="fav-purchs_no-data-description__headline">
            <img :src="favoriteStar" alt="favoriteStar" />
            {{ $t("favorites list is empty") }}
          </p>
          <p>{{ $t("add fav description") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import type { IFavouriteBrief } from "@/api/favoriteTablePurchases";

import { getFavouriteBrief } from "../../../../../api/favoriteTablePurchases";

import favoriteStar from "@/components/icons/star-sharp.svg";

const props = defineProps<{
  selectedPurchaseId: number | null;
}>();
const emit = defineEmits<{
  (e: "dataChange", value: number | null): void;
}>();

const menu = ref<boolean>(false);
const favPurchases = ref<IFavouriteBrief[]>([]);
const selectedFavPurchase = ref<IFavouriteBrief | null>(null);

watch(
  () => menu.value,
  async () => {
    if (menu.value && !favPurchases.value.length) {
      getData();
    }
  }
);

watch(
  () => props.selectedPurchaseId,
  () => {
    getData();
  }
);

const toggle = (): void => {
  menu.value = !menu.value;
};

const selectFavPurchase = (chosenFavPurch: IFavouriteBrief) => {
  if (selectedFavPurchase.value) {
    if (chosenFavPurch.id === selectedFavPurchase.value.id)
      selectedFavPurchase.value = null;
    else selectedFavPurchase.value = chosenFavPurch;
  } else selectedFavPurchase.value = chosenFavPurch;

  emit("dataChange", selectedFavPurchase.value ? selectedFavPurchase.value.id : null);
};

const getData = async () => {
  const res = await getFavouriteBrief();
  if (res?.data) {
    favPurchases.value = res.data;

    selectedFavPurchase.value =
      favPurchases.value.find(
        (el: IFavouriteBrief) => el.id === props.selectedPurchaseId
      ) || null;
  }
};
</script>

<style lang="scss">
.fav-purchs {
  &_fill-btn {
    cursor: pointer;
    border: none;
    outline: none;
    padding: 10px 14px;
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
    &--chosen {
      color: white;
      background-color: #256ec2;
      &:enabled:hover {
        color: white;
      }
    }
  }
  &_no-data-description {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px 24px;
    &__headline {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
.approvals-modal {
  width: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &_wrapper {
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &__actions {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      &_btn {
        cursor: pointer;
        padding: 0 4px;
        border: none;
        outline: none;
        border-radius: 5px;
        background: #1565c0;
        color: white;
        font-size: 14px;
        font-weight: 400;
        &:hover {
          background: #2f7acf;
        }
      }
    }
  }
  &_title {
    display: flex;
    width: 100%;
    height: 20px;
    background: rgba(0, 0, 0, 0.05);
    padding: 0 8px;
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 500;
  }
  &_description {
    text-align: center;
    padding: 10px;
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 500;
  }
  &_list {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    overflow: auto;
    max-height: 200px;
    &__item {
      &.approval {
        display: flex;
        justify-content: space-between;
        &.selected {
          background-color: #1565c0;
          .approval_name {
            color: white !important;
          }
          .approval_description {
            color: white;
          }
          .approval_occupation {
            color: white;
          }
        }
      }
    }
    .approval {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      border-radius: 7px;
      padding: 6px;
      &_name {
        text-align: left;
        font-size: 16px;
        font-weight: 400;
      }
      &_description {
        font-size: 16px;
        font-weight: 400;
        width: 60%;
        overflow: hidden;
        white-space: nowrap;
      }
      &_occupation {
        font-size: 16px;
        font-weight: 400;
      }
      &:hover {
        background-color: #1565c0;
        .approval_name {
          color: white !important;
        }
        .approval_description {
          color: white !important;
        }
        .approval_occupation {
          color: white;
        }
      }
    }
  }
}

.menu-action {
  position: relative;
  &_content {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -30%;
    top: 30px;
    background-color: white;
    border: 1px solid #e3e3e3;
    box-shadow: 0px 0px 22px 7px rgba(129, 131, 136, 0.2),
      0px 0px 22px 7px rgba(129, 131, 136, 0.2) !important;
    border-radius: 10px;
    z-index: 10;
  }
  &_btn {
    cursor: pointer;
  }
  .p-float-label input:focus ~ label,
  .p-float-label input.p-filled ~ label,
  .p-float-label textarea:focus ~ label,
  .p-float-label textarea.p-filled ~ label,
  .p-float-label .p-inputwrapper-focus ~ label,
  .p-float-label .p-inputwrapper-filled ~ label {
    top: 10px !important;
  }
}
</style>
