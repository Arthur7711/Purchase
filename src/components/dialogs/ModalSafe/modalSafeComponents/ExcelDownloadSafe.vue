<script lang="ts" setup>
import { ref } from 'vue'
import DialogNomenclature from '../../DialogNomenclature.vue'
import { getDownloadExcelSafe } from '@/api/gettersSafe'
import useSafeFilters from '@/store/safeStore/safeFilterStore'
import { format } from 'date-fns'
import { lastMonth } from '@/helpers/getDatesRange'

const props = defineProps<{
  columns: { id: number; field: string; name: string; active: boolean }[]
  currency: string
}>()
const selectedExelColumns = ref(props.columns)
const visiblePopup = ref(false)

const handleDownload = () => {
  getDownloadExcelSafe({
    ...useSafeFilters.filters.value,
    date_to: useSafeFilters.filters.value.date_to || format(new Date(), 'yyyy-MM-dd'),
    date_from: useSafeFilters.filters.value.date_from || lastMonth,
    columns: selectedExelColumns.value.map((el) => el.field)
  }).then((res) => {
    const link = document.createElement('a')
    link.setAttribute('href', `${res.data.url}`)
    link.setAttribute('download', '')
    link.setAttribute('target', '_blank')
    link.click()
  })
}
</script>

<template>
  <div>
    <button class="excel_download_safe_button_excel" @click="visiblePopup = !visiblePopup">
      excel <img src="../../../icons/excel-icon-gray.svg" alt="" style="height: 14px" />
    </button>
  </div>
  <div class="excel_download_div_dialog">
    <DialogNomenclature
      :color-title="'#1565C0'"
      :visible="visiblePopup"
      :title="$t('customizing excel')"
      @close="visiblePopup = !visiblePopup"
    >
      <template #bodyoption>
        <div style="margin-top: -20px">{{ $t('select the columns') }}</div>
        <div class="excel_download_safe_currency_excel">{{ currency }}</div>
        <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(1, 1fr)">
          <div style="margin: 0 20px 20px 0" v-for="col in columns" :key="col.id">
            <Checkbox
              v-model="selectedExelColumns"
              :inputId="String(col.id)"
              :value="{
                id: col.id,
                name: col.name,
                field: col.field,
                active: col.active
              }"
            />
            <span style="margin-left: 12.5px; font-weight: 400">{{ col.name }}</span>
          </div>
        </div>
        <span
          @click="
            selectedExelColumns.length
              ? (selectedExelColumns = [])
              : (selectedExelColumns = columns)
          "
          style="
            color: #1565c0;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
          "
          >{{ selectedExelColumns.length ? $t('take off all') : $t('select all') }}</span
        >
        <div style="width: 100%; display: flex; justify-content: flex-end; align-items: center">
          <button class="excel_download_safe_cancel" @click="visiblePopup = !visiblePopup">
            {{ $t('cancel') }}
          </button>
          <button class="excel_download_safe_download" @click="handleDownload">
            {{ $t('generate') }}
          </button>
        </div>
      </template>
    </DialogNomenclature>
  </div>
</template>

<style lang="scss">
.excel_download_safe_download {
  color: var(--mono-white, #fff);
  text-align: center;
  padding: 7px 20px 7px 20px;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  border-radius: 10px;
  background: var(--blue, #1565c0) !important;
}

.excel_download_safe_cancel {
  border-radius: 10px;
  border: 1px solid var(--blue, #1565c0) !important;
  background: var(--mono-white, #fff);
  display: flex;
  font-size: 16px;
  font-style: normal;
  color: #1565c0;
  font-weight: 600;
  padding: 7px 20px 7px 20px;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 8px;
}

.excel_download_safe_currency_excel {
  color: var(--mono-black, #1a1a1a);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  margin-top: 24px;
  margin-bottom: 20px;
}

.excel_download_safe_button_excel {
  color: var(--mono-grey, #999);
  text-align: center;
  font-size: 18px;
  margin-top: 25px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
}

.excel_download_div_dialog {
  .p-checkbox,
  .p-checkbox-box {
    border-color: #999999 !important;
    border-radius: 2px !important;
  }
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight {
    background-color: #1565c0 !important;
    border: none !important;
  }
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
    box-shadow: none !important;
  }
}
</style>
