<script lang="ts" setup>
import { getOfficePurposes, type IPurposesOffices } from '@/api/offices'
import Checkbox from 'primevue/checkbox'
import Listbox from 'primevue/listbox'
import { onMounted, ref, watch } from 'vue'
import useOfficesPurposes from '../../store/offices_store/offices_purposes'
import DropdownArrow from '../icons/DropdownArrow.vue'

const purposes = ref<IPurposesOffices[] | null>(null)
const selectedPurposes = ref()
const activeLabel = ref<string[] | null>(null)
const show = ref(true)

onMounted(async () => {
  await getOfficePurposes().then((res) => {
    purposes.value = res.data
    selectedPurposes.value = res.data
  })
  activeLabel.value = purposes.value ? purposes.value?.map((el) => el.name) : null
})

watch(selectedPurposes, () => {
  activeLabel.value = selectedPurposes.value.map((el: { name: string }) => el.name)
  useOfficesPurposes.setSelectedPurposes(selectedPurposes.value.map((el: { id: string }) => el.id))
})
</script>

<template>
  <div class="offices_div_all">
    <div class="offices_listbox_div_topbutton">
      <span>{{ $t('goals') }}</span>
      <div>
        <button @click="selectedPurposes = purposes">{{ $t('Select All') }}</button>
        <button @click="show = !show">
          <div
            class="offices_div_button"
            :class="show ? 'offices_div_button_non_rotate' : 'offices_div_button_rotate'"
          >
            <DropdownArrow />
          </div>
        </button>
      </div>
    </div>
    <Transition name="slide-fade">
      <Listbox
        v-if="purposes"
        filt
        v-show="show"
        multiple
        v-model="selectedPurposes"
        :options="purposes"
        optionLabel="name"
        class="offices_listbox_listbox"
        filter
        :filterPlaceholder="$t('looking for')"
      >
        <template #option="{ option }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${option.name}</span>`,
              escape: true,
              class: 'custom-tooltip-offices'
            }"
            style="display: flex"
          >
            <Checkbox
              v-model="selectedPurposes"
              :readonly="true"
              :name="option.name"
              :value="option"
            />
            <label
              style="margin-left: 8px"
              :style="
                activeLabel
                  ? activeLabel.includes(option.name)
                    ? { color: 'black' }
                    : { color: '#999999' }
                  : ''
              "
              :for="option.name"
            >
              <div class="office_nav_div_option_name" style="margin-top: -5px">
                {{ option.name }}
              </div>
            </label>
          </div>
        </template>
        <template #filtericon> <div style="display: none"></div></template>
      </Listbox>
    </Transition>
  </div>
</template>

<style lang="scss">
@import './OfficesNav.scss';
</style>
