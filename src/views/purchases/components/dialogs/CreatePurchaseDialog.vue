<template>
  <DialogPurchase
    :visible="isOpenDialog"
    @close="isOpenDialog = $event"
    :width-size="
      ScreenParams.screenParams.width > 1300 ? '1520px' : ScreenParams.screenParams.width + 'px'
    "
  >
    <template #title> {{ $t('new purchase') }} </template>
    <template #actions>
      <div :class="$style['card-purchase_header__btns']">
        <PurchaseFavoriteFilling
          :selected-purchase-id="selectedFavPurchaseID"
          @data-change="selectedFavPurchaseID = $event"
        />

        <button
          v-if="ScreenParams.screenParams.width > 650"
          :class="$style['card-purchase_header__hide-btn']"
          @click="
            () => {
              if (purchase) {
                purchase.id_new = `new ${usePurchasesInfo.countNewCurtailedPurchase.value + 1}`;

                purchase.fav_clone = selectedFavPurchaseID;

                addPurch(purchase);

                isOpenDialog = false;
              }
            }
          "
        >
          <p>{{ $t('collapse') }}</p>
          <HideIcon :class="$style['card-purchase_header__hide-btn--icon']" />
        </button>
        <button
          :class="$style['card-purchase_header__create-btn']"
          v-if="ScreenParams.screenParams.width < 650"
          @click="showPurchase = !showPurchase"
        >
          Show purchase
        </button>
      </div>
    </template>
    <template #content>
      <PurchaseCardLayout
        v-if="purchase"
        :purchase="purchase"
        :is-loading="isLoading"
        :type="selectedFavPurchaseID ? 'create-fav' : 'create'"
        :task-id="taskId"
        :validation="validatePurchase"
        :showPurch="showPurchase"
        :is-completed-purchase="isCompleted"
        @completed-groups="isCompletedGroups = $event"
        @hide="showPurchase = false"
        @create="create"
      />
    </template>
  </DialogPurchase>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import type { IGroup, IItemGroup, IPurchase, IPurchaseNew } from './types';
import type { ILegalExp } from '@/store/purchases_store/commons';

import DialogPurchase from '@/components/dialogs/DialogPurchase.vue';
import PurchaseCardLayout from '@/views/purchases/components/cards/purchaseCard/PurchaseCardLayout.vue';
import HideIcon from '@/components/icons/HideIcon.vue';
import PurchaseFavoriteFilling from '../cards/purchaseCard/PurchaseFavoriteFilling.vue';

import { createPurchase, getPurchase } from '@/api/purchases';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import useCommonsInfo from '@/store/purchases_store/commons';
import ScreenParams from '@/store/screen';
import useUserInfo from '@/store/user';

const props = defineProps<{
  isOpen: boolean | false;
  taskId: string | null;
}>();
const emit = defineEmits<{
  (e: 'close', value: boolean): void;
}>();
const showPurchase = ref(false);
const isOpenDialog = ref(props.isOpen);
const isLoading = ref(true);
const isCompletedGroups = ref(true);
const purchase = ref<IPurchaseNew | null>({
  id_new: 'new',
  office_id: null,
  department_id: null,
  specialist_id: null,
  description: null,
  purchase_date: null,
  comming_date: null,
  contragent_id: null,
  legal_id: null,
  payment_status_id: null,
  payment_type_id: null,
  card_holder_id: null,
  debited_currency: null,
  note: null,
  account_id: null,
  groups: [
    {
      name_id: null,
      type_id: null,
      sub_type_id: null,
      quantity: 1,
      unit_id: 1,
      debited_price: 0,
      items: [
        {
          id: 1,
          status_id: 1,
          purpose_id: null,
          approval: null,
          budget_id: null,
          task_id: props.taskId !== null ? +props.taskId : null,
          warehouse_id: null,
          activated_at: null,
          note: null
        }
      ]
    }
  ]
});
const selectedFavPurchaseID = ref<number | null>(null);
const isFirstOpen = ref(false);
const validatePurchase = ref({
  purchase_data: {
    department: '',
    specialist_id: '',
    legal_id: '',
    account_id: ''
  }
});

const isCompleted = computed(() => {
  let isRight = true;

  isRight =
    !Object.values(validatePurchase.value.purchase_data).some(
      (item: string) => item.length !== 0
    ) && isCompletedGroups.value;

  return isRight;
});
const create = (): void => {
  isLoading.value = true;
  if (purchase.value) {
    purchase.value.groups.forEach((item: IGroup) => {
      item.items.forEach((el: IItemGroup) => {
        el.id = undefined;
      });
    });
    createPurchase(purchase.value)
      .then((res) => {
        usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
        usePurchasesInfo.setUpdateTable(true);

        isLoading.value = false;
        usePurchasesInfo.setSelectedIndex(null);
        emit('close', false);
      })
      .finally(() => {
        usePurchasesInfo.setUpdateTable(false);
      });
  }
};

const addPurch = (purch: IPurchaseNew | IPurchase): void => {
  const data = purch as IPurchaseNew;

  usePurchasesInfo.addCurtailedPurchase(data);
};

watch(isOpenDialog, () => {
  if (!isOpenDialog.value) {
    usePurchasesInfo.setSelectedIndex(null);
    emit('close', isOpenDialog.value);
    usePurchasesInfo.setSelectedNewPurchase(null);
  }
});

watch(
  () => props.isOpen,
  () => {
    isOpenDialog.value = props.isOpen;
  }
);

watch(
  () => selectedFavPurchaseID.value,
  async (value) => {
    if (!isFirstOpen.value) {
      if (!value && purchase.value) {
        purchase.value = {
          id_new: 'new',
          office_id: purchase.value.office_id,
          department_id: purchase.value.department_id,
          specialist_id: purchase.value.specialist_id,
          description: null,
          purchase_date: null,
          comming_date: null,
          contragent_id: null,
          legal_id: null,
          payment_status_id: null,
          payment_type_id: null,
          card_holder_id: null,
          debited_currency: null,
          note: null,
          account_id: null,
          groups: [
            {
              name_id: null,
              type_id: null,
              sub_type_id: null,
              quantity: 1,
              unit_id: 1,
              debited_price: 0,
              items: [
                {
                  status_id: 1,
                  purpose_id: null,
                  approval: null,
                  budget_id: null,
                  task_id: props.taskId !== null ? +props.taskId : null,
                  warehouse_id: null,
                  activated_at: null,
                  note: null
                }
              ]
            }
          ]
        };
      } else if (value) {
        const favPurchase: IPurchase = await getPurchase(value);

        delete favPurchase.id;
        favPurchase.payment_status_id = null;
        favPurchase.purchase_date = null;
        favPurchase.comming_date = null;
        favPurchase.specialist_id = purchase.value && purchase.value.specialist_id;

        favPurchase.groups.forEach((item: IGroup) => {
          delete item.hash;
          item.items.forEach((el: IItemGroup) => {
            delete el.id;
            el.status_id = 1;
            el.activated_at = null;
            el.sn = null;
            el.approval = null;
          });
        });

        const newPurch = {
          ...purchase.value,
          ...favPurchase
        };

        purchase.value = null;

        setTimeout(() => {
          purchase.value = newPurch as IPurchaseNew;
        });
      }
    } else isFirstOpen.value = false;
  }
);

onMounted(() => {
  if (purchase.value) {
    purchase.value.specialist_id = useUserInfo.userData.value
      ? useUserInfo.userData.value.id
      : null;
  }

  const legal_entity = useCommonsInfo.commons.value.legalEntities as ILegalExp[];
  legal_entity.forEach((el) => {
    if (el.is_default && purchase.value && !purchase.value.legal_id) {
      purchase.value.legal_id = el.id;
    }
  });
  if (usePurchasesInfo.selectedNewPurchase.value) {
    purchase.value = null;

    setTimeout(() => {
      if (usePurchasesInfo.selectedNewPurchase.value) {
        purchase.value = JSON.parse(JSON.stringify(usePurchasesInfo.selectedNewPurchase.value));

        if (usePurchasesInfo.selectedNewPurchase.value.fav_clone) {
          selectedFavPurchaseID.value = usePurchasesInfo.selectedNewPurchase.value.fav_clone;
          isFirstOpen.value = true;
        }
      }
    });
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
    &__btns {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    &__hide-btn {
      cursor: pointer;
      border: none;
      outline: none;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 10px;
    & > button {
      height: 70px;
    }
  }
}
</style>
