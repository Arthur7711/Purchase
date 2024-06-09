<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  options?: any[]
  label: string
  editable?: boolean
  modelValue: { id: number | string; name: string } | string | number
}>()

const selectedValue = ref<{ id: string | number; name: string } | string | number>(props.modelValue)
const el = ref<HTMLElement | null>(null)

const handleHide = (e: Event) => {
  const elem = document.querySelector(
    'div.dropdown_label_div_all .p-dropdown-trigger'
  ) as HTMLElement
  const dropdown_items_wrapper = document.querySelector('.p-dropdown-items-wrapper')
  if (dropdown_items_wrapper) {
    elem.click()
  }
}

watch(
  () => props.modelValue,
  () => {
    if (selectedValue.value !== props.modelValue) {
      if (Number(props.modelValue) && props.options) {
        selectedValue.value = props.options.filter((el) => el.id === Number(props.modelValue))[0]
          ? props.options.filter((el) => el.id === Number(props.modelValue))[0]
          : props.modelValue
      } else {
        selectedValue.value = props.modelValue
      }
    }
  }
)

onMounted(() => {
  el.value = document.getElementById('test')
})
</script>

<template>
  <div class="dropdown_label_div_all" id="test">
    <div
      style="
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        margin-top: -27px !important;
        padding: 0%;
        width: 100%;        
        padding-right: 4%;
      "
    >
      <Dropdown
        v-model="selectedValue"
        style="width: 100%"
        :options="options ? options : []"
        :placeholder="label"
        :editable="!!editable"
        :panel-class="'dropdown_label_dropdown_panel'"
        id="drop_dynamic"
        input-class="dropdown_label_dropdown_input"
        option-label="name"
        @change="$emit('change', selectedValue)"
        @blur="(e: Event) => handleHide(e)"
      >
      </Dropdown>
      <label
        class="dropdown_label_label"
        :class="selectedValue ? 'dropdown_label_label_show' : ''"
        for="drop_dynamic"
        >{{ label }}</label
      >
    </div>
    {{}}
  </div>
</template>

<style lang="scss">
.dropdown_label_div_all {
  height: 50px;
  border-radius: 10px;
  border: 1px solid var(--mono-divider, #e3e3e3);
  background: transparent;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .p-dropdown {
    border: none !important;
    background: none !important;
  }
}

.dropdown_label_dropdown_input {
  height: 45px;
  border: none !important;
  min-width: 100% !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.dropdown_label_dropdown_input::placeholder {
  color: var(--mono-grey, #999);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}

.dropdown_label_label_show {
  transform: translateY(1rem) !important;
  margin-left: 7px;
  color: var(--mono-grey, #999) !important;
  font-size: 12px !important;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  z-index: 0 !important;
}

.dropdown_label_label {
  padding: 1px;
  user-select: none;
  transform: translateY(2rem);
  padding-left: 2%;
  transition: all 0.3s ease-in-out;
  color: #99999900;
  z-index: -2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
</style>
