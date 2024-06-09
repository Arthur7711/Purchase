<script setup lang="ts">
import CalendarIcon from '../icons/CalendarIcon.vue'
import { ref, watch } from 'vue'
import usedateTo from '../../store/dateTo'
import usedateFrom from '../../store/dateFrom'
const props = defineProps<{
  className: string
  inputClassName: string
  defaultDate: string
  type?: string
}>()
// @blur="$emit('setDate', date)"

const date = ref({
  sendDate: props.defaultDate,
  visualDate:
    props.defaultDate?.split('-')[2] +
    '.' +
    props.defaultDate?.split('-')[1] +
    '.' +
    props.defaultDate?.split('-')[0].slice(2, 4)
})

const emit = defineEmits<{
  (e: 'setDate', value: any): void
  (e: 'customDate', value: boolean): void
}>()

watch(
  () => date.value.visualDate,
  () => {
    if (date.value.visualDate[2] === '.') {
      date.value.sendDate = props.defaultDate
    } else {
      date.value.sendDate = date.value.visualDate
    }
    emit('setDate', date.value.sendDate)
  }
)

watch(
  () => props.defaultDate,
  () => {
    date.value.visualDate =
      props.defaultDate?.split('-')[2] +
      '.' +
      props.defaultDate?.split('-')[1] +
      '.' +
      props.defaultDate?.split('-')[0].slice(2, 4)
    date.value.sendDate = props.defaultDate
  }
)
</script>
<template>
  <div class="class">
    <Calendar
      dateFormat="dd.mm.y"
      v-model="date.visualDate"
      showIcon
      @date-select="emit('customDate', true)"
      :max-date="type === 'from' ? new Date(usedateTo.dateTo.value) : undefined"
      :min-date="type !== 'from' ? new Date(usedateFrom.dateFrom.value) : undefined"
      :class="props.className"
      :inputClass="inputClassName"
    >
      <template #dropdownicon>
        <CalendarIcon />
      </template>
    </Calendar>
    <!-- <Calendar
      v-else
      dateFormat="dd.mm.y"
      v-model="date.visualDate"
      showIcon
      @date-select="emit('customDate', true)"
      :min-date="new Date(usedateFrom.dateFrom.value)"
      :class="props.className"
      :currentMonth="Number(props.defaultDate?.split('-')[1])"
      :inputClass="inputClassName"
    >
      <template #dropdownicon>
        <CalendarIcon />
      </template>
    </Calendar> -->
  </div>
</template>

<style lang="scss">
.class {
  width: 118px;
}
</style>
