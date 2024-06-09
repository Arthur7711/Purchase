<template>
  <div class="group-table_header">
    <div class="group-table_header__title">
      <p>{{ $t('fact') }}</p>
      <div class="menu-action">
        <img @click="toggle" alt="triangle" :src="btnTriangle" class="menu-action_btn" />
        <div v-show="menu" class="menu-action_content">
          <div class="fact-modal">
            <div class="fact-modal_date p-float-label">
              <Calendar
                v-model="factDate"
                @update:modelValue="factDate = $event as Date"
                dateFormat="dd.mm.y"
                showIcon
                inputId="labelCalendar"
              >
                <template #dropdownicon>
                  <CalendarIcon />
                </template>
              </Calendar>
              <label for="labelCalendar">{{ $t('date of sale') }}</label>
            </div>
            <button class="fact-modal_btn" @click="setFactDate">{{ $t('apply') }}</button>
            <button class="fact-modal_btn" @click="clearFactDate">{{ $t('reset') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import btnTriangle from '@/components/icons/triangleDownGrey.svg';
import CalendarIcon from '@/components/icons/CalendarIcon.vue';

import dateConverter from '@/helpers/dateConverter';

const props = defineProps<{
  value: string | null;
}>();

const emit = defineEmits<{
  (e: 'dataChange', value: string | null): void;
}>();

const menu = ref<boolean>(false);
const factDate = ref<Date | null>(null);
const selectedValue = ref<string | null>(props.value);

const setFactDate = (): void => {
  selectedValue.value = factDate.value && dateConverter(factDate.value.toString());
  toggle();
};

const clearFactDate = (): void => {
  factDate.value = null;
  selectedValue.value = null;
  toggle();
};

const toggle = (): void => {
  menu.value = !menu.value;
};

watch(
  () => selectedValue.value,
  (value) => {
    emit('dataChange', value);
  }
);
</script>

<style lang="scss">
.fact-modal {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  &_date {
    border-radius: 10px;
    border: 1px solid #e3e3e3;
    background: white;
    height: 50px;
    display: flex;
    align-items: center;
    & > .p-calendar {
      margin: 0 !important;
      width: 100%;
      height: 100%;

      & > input {
        border: none;
        padding: 8px 15px;
        border-radius: 10px;
      }
      & > button {
        background: white;
        outline: none;
        border: none;
        border-radius: 10px;
        & > .p-button-label {
          display: none;
        }
        &:hover {
          background: white;
        }
      }
    }
    & > label {
      left: 15px;
      color: #999;
      font-weight: 400;
    }
  }
  &_btn {
    border: none;
    outline: none;
    width: 100%;
    display: flex;
    padding: 5px 14px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    border-radius: 10px;
    background: #b6b6b6;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }
}

.menu-action {
  position: relative;
  &_content {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    background-color: white;
    border: 1px solid #e3e3e3;
    min-width: 220px;
    box-shadow: 0px 0px 22px 7px rgba(129, 131, 136, 0.2), 0px 0px 22px 7px rgba(129, 131, 136, 0.2) !important;
    // backdrop-filter: blur(2.5px);
    border-radius: 10px;
    z-index: 1;
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
