<script lang="ts" setup>
import type { ISources } from '@/api/gettersSafe'
import TreeSelect from 'primevue/treeselect'
import { ref, watch } from 'vue'
import type { TreeNode } from './types'
import SortButton from '@/components/custom/SortButton.vue'
import { debounce } from '@/helpers/debounse'

const props = defineProps<{
  entities: TreeNode[]
  column: string
}>()

const defValue = ref()
const selectedValue = ref()
const selectedSort = ref<{ field: string; dir: string }>({
  field: '',
  dir: ''
})
const inputValue = ref<string>('')
const emit = defineEmits<{
  (e: 'change', val: string): void
  (e: 'input', val: string): void
  (e: 'sort', val: { field: string; dir: string }): void
}>()

const removeSelected = () => {
  selectedValue.value = ''
  defValue.value = null
  emit('change', '')
}

const emitSelected = (value: { [key: string]: string }) => {
  defValue.value = selectedValue.value
  emit('change', Object.keys(value)[0])
}

const debInputEmit = debounce(function (val: string) {
  emit('input', val)
}, 350)

const handleHide = (e: Event) => {
  // const elem = document.querySelector(
  //   'div.filter_option_div_all .p-treeselect-trigger'
  // ) as HTMLElement
  // let wrapper = document.querySelector('.p-treeselect-items-wrapper')
  // if (elem && wrapper) {
  //   setTimeout(() => {
  //     wrapper = document.querySelector('.p-treeselect-items-wrapper')
  //     if (elem && wrapper) {
  //       elem.click()
  //     }
  //   }, 200)
  // }
}

const handleScrollUp = () => {
  let table = document.querySelector('.p-datatable-wrapper')
  let wrapper = document.querySelector('.p-treeselect-items-wrapper')
  if (table?.scrollTop !== 0) {
    wrapper = document.querySelector('.p-treeselect-items-wrapper')
    if (!wrapper) {
      table?.scrollTo(-10, 0)
    }
  }
}

const handleInputChange = () => {
  inputValue.value = inputValue.value
    .split('')
    .filter((el, i) => Number(el) || (i === 0 && el === '-') || (i !== 0 && Number(el) === 0))
    .join('')
  debInputEmit(inputValue.value)
}

const handleTreeSelect = (value: { [key: string]: string }) => {
  if (defValue.value) {
    Object.keys(defValue.value)[0] === Object.keys(value)[0]
      ? removeSelected()
      : emitSelected(value)
  } else {
    defValue.value = selectedValue.value
    emit('change', Object.keys(selectedValue.value)[0])
  }
}
</script>

<template>
  <div class="filter_option_div_all">
    <TreeSelect
      v-if="column === 'entity'"
      :class="'filter_option_tree_select'"
      :input-class="'filter_option_tree_select_input'"
      v-model="selectedValue"
      :options="entities"
      :panel-class="'filter_option_tree_select_panel'"
      @change="(e: string[]) => handleTreeSelect(e as any)"
      :placeholder="$t('source')"
      @click="handleScrollUp"
      @blur="(e: Event) => handleHide(e)"
    />
    <div v-else-if="column === 'date'" style="margin-left: 5px !important; rotate: 0deg">
      <SortButton
        :start-sort="'desc'"
        :field_name="column"
        :active="selectedSort.field === column"
        @select-dir="
          (val) => {
            selectedSort = val
            emit('sort', selectedSort)
          }
        "
      />
    </div>
    <div v-else-if="column === 'amount'">
      <input
        type="text"
        class="filter_option_safe_input_amount"
        :placeholder="$t('amount')"
        v-model="inputValue"
        @input="() => handleInputChange()"
      />
    </div>
  </div>
</template>

<style lang="scss">
.filter_option_div_all {
  max-width: 120px;
  .p-treeselect {
    margin-left: -10px;
    border: none;
    font-size: 14px !important;
    text-align: left;
  }
  .p-focus {
    box-shadow: none !important;
  }
  .p-treeselect .p-treeselect-label.p-placeholder {
    color: var(--mono-grey, #999);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
}

.filter_option_tree_select_panel {
  .p-treenode-content {
    font-size: 14px !important;
  }
  .p-treenode-content.p-highlight {
    background: #1565c0 !important;
    color: white !important;
    font-size: 14px !important;
  }
}

.filter_option_safe_input_amount {
  max-width: 55px;
  border: none;
  border-bottom: 0.2px rgba(128, 128, 128, 0.486) solid;
  color: var(--mono-grey, #999);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  padding-left: 5%;
  outline: none;
  &::placeholder {
    color: var(--mono-grey, #999);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
}
</style>
