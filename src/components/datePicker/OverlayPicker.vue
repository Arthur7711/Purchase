<!-- eslint-disable no-case-declarations -->
<script lang="ts" setup>
import { format } from 'date-fns';
import Calendar from 'primevue/calendar';
import { ref } from 'vue';

const props = defineProps<{
  type_id: number;
  active: boolean;
}>();

const value = ref();
const el = ref();
const year = ref(new Date().getFullYear());
const emit = defineEmits<{
  (e: 'date_select', val: { date_to: string; date_from: string }): void;
}>();

const handleChange = (e: any) => {
  const yearMonth = {
    year: format(new Date(e), 'yyyy-MM-01').split('-')[0],
    month: format(new Date(e), 'yyyy-MM-01').split('-')[1]
  };

  switch (props.type_id) {
    case 1:
      const monthSelect = {
        date_from: format(new Date(e), 'yyyy-MM-01'),
        date_to: format(
          new Date(e),
          `yyyy-MM-${new Date(+yearMonth.year, +yearMonth.month, 0).getDate()}`
        )
      };
      emit('date_select', monthSelect);
      break;
    case 2:
      const halfSelected = {
        date_from: `${year.value}-${e === 1 ? '01' : '07'}-01`,
        date_to: `${year.value}-${e === 1 ? '06' : '12'}-${e === 1 ? '30' : '31'}`
      };
      emit('date_select', halfSelected);
      el.value.toggle(null);
      break;
    case 3:
      const yearSelect = {
        date_from: format(new Date(e), 'yyyy-01-01'),
        date_to: format(new Date(e), `yyyy-12-31`)
      };
      emit('date_select', yearSelect);
      break;
    default:
      break;
  }
};
</script>

<template>
  <button
    :class="active ? 'overlay_picker_button_half_active' : ''"
    class="overlay_picker_button_half"
    v-if="type_id === 2"
    type="button"
    @click="(event) => el.toggle(event)"
  >
    {{ $t('six months') }}
  </button>
  <Calendar
    v-else
    :view="type_id === 1 ? 'month' : 'year'"
    :input-class="
      active
        ? `overlay_picker_input_active overlay_picker_input_${type_id}`
        : `overlay_picker_input_${type_id}`
    "
    panel-class="overlay_picker_panel"
    :date-format="type_id === 1 ? 'mm.yy' : 'yy'"
    @date-select="(e: Date) => handleChange(e)"
    :placeholder="type_id === 1 ? $t('month') : $t('year')"
  >
  </Calendar>
  <OverlayPanel class="overlay_picker_overlay" ref="el">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 12vw !important;
      "
    >
      <button class="overlay_picker_button-counter" @click="year--">
        <img src="../icons/leftTriangle.svg" alt="" />
      </button>
      <span>{{ year }}</span>
      <button class="overlay_picker_button-counter" @click="year++">
        <img src="../icons//rightTriangle.svg" alt="" />
      </button>
    </div>
    <div
      style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px"
    >
      <span @click="() => handleChange(1)" class="overlay_picker_span_halfyear">
        {{ $t('JAN-JUN') }}
      </span>
      <span @click="() => handleChange(2)" class="overlay_picker_span_halfyear">
        {{ $t('JUL-DEC') }}
      </span>
    </div>
  </OverlayPanel>
</template>

<style lang="scss">
.overlay_picker_panel {
  width: 18% !important;
}

.overlay_picker_input_1,
.overlay_picker_input_3 {
  font-size: 14px;
  border: none;
  caret-color: transparent;
  display: flex;
  max-width: 95% !important;
  justify-content: center;
  align-items: center;
  padding-right: 0;
  transition: all 0.5s ease-in-out;
  &::placeholder {
    color: black;
  }
}
.overlay_picker_input_1 {
  padding-left: 23%;
}
.overlay_picker_input_3 {
  padding-left: 32%;
}

.overlay_picker_button-counter {
  background: none;
  border: none;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay_picker_button_half {
  background-color: #fff;
  border: none;
  color: black;
  padding: 4.5%;
  font-size: 14px;
  white-space: nowrap;
  margin-left: -1.5%;
  border-radius: 5px;
  transition: all 0.5s ease-in-out;
}

.overlay_picker_span_halfyear {
  padding: 2%;
  margin-left: 1%;
  border-radius: 12px;
  &:hover {
    background-color: #acacac61;
  }
}

.overlay_picker_button_half_active,
.overlay_picker_input_active {
  background-color: #1565c0b3;
  color: white;
  &::placeholder {
    color: #fff !important;
  }
}

.p-overlaypanel:after,
.p-overlaypanel:before {
  content: ' ' !important;
  display: none !important;
}

.overlay_picker_overlay {
  .p-overlaypanel:before {
    content: '' !important;
    display: none !important;
  }
  .p-overlaypanel:after {
    content: '' !important;
    display: none !important;
  }
}

@media only screen and (max-width: 650px) {
  .overlay_picker_panel {
    width: 300px !important;
  }
}
</style>
