<script setup lang="ts">
import { ref } from 'vue'
import CustomDropdownContainer from '../../../components/customDropdownContainer/CustomDropdownContainer.vue'
import i18n_config from '@/locales/i18n_config';


const props = defineProps<{
  data: { [key: string]: string }
}>()

const {locale, messages} = i18n_config.global
const showChart = ref(false)
const emit = defineEmits<{
  (e: 'show_edit', value: boolean): void
  (
    e: 'popup_options',
    value: {
      showDelete: boolean
      openPossition: number
    }
  ): void
}>()
const openEdit = () => {
  emit('show_edit', true)
  emit('popup_options', {
    showDelete: false,
    openPossition: 4
  })
}
const titlesDetails = [
  { name: messages[locale]['account number'], key: 'bank_account' },
  { name: messages[locale]['contract number'], key: 'document_number' },
  { name: messages[locale].beneficiary, key: 'account_holder' },
  { name: messages[locale]['beneficiary bank'], key: 'bank' },
  { name: messages[locale].BIC, key: 'bik' },
  { name: messages[locale]['correspondent account'], key: 'corr_account' },
  { name: messages[locale].TIN, key: 'inn' },
  { name: messages[locale].CPT, key: 'kpp' }
]
</script>
<template>
  <CustomDropdownContainer
    :is-open="showChart"
    @dropdown_control="showChart = $event"
    bg="var(--vt-c-white)"
  >
    <template #head>
      <h2 style="font-size: 20px; font-weight: 600; line-height: 20px">{{ $t('bank details') }}</h2>
    </template>
    <template #body>
      <div class="comments_supplier">
        <Button class="add_btn" @click="openEdit" v-if="props.data.account_holder === 'N/A'"
          >{{ $t('add details') }}</Button
        >
        <div class="info_box" v-if="props.data.account_holder !== 'N/A'">
          <div class="info_item" v-for="info in titlesDetails">
            <p class="title">{{ info.name }}</p>
            <p class="desc">{{ props.data[info.key] }}</p>
          </div>
          <Button link class="edit_btn" @click="openEdit">{{ $t('edit') }}</Button>
        </div>
      </div>
    </template>
  </CustomDropdownContainer>
</template>
<style lang="scss">
.comments_supplier {
  .add_btn {
    background: #8ab2df33;
    border: none;
    width: 100%;
    justify-content: center;
    color: var(--vt-c-electric-blue);
    margin-top: 16px;
  }
  .info_box {
    display: flex;
    flex-direction: column;
    .info_item {
      .title {
        font-size: 13px;
        font-weight: 400;
        line-height: 20px;
        color: var(--vt-c-bold-gray);
      }
      .desc {
        color: var(--vt-c-text-black);
        font-size: 16px;
        font-weight: 400;
        line-height: 20px;
      }
    }
    .edit_btn {
      color: var(--vt-c-electric-blue);
      padding: 0px;
      font-weight: 600;
    }
  }
}
</style>
