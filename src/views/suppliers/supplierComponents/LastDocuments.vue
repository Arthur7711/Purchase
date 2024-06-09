<script setup lang="ts">
import { ref } from 'vue'
import CustomDropdownContainer from '../../../components/customDropdownContainer/CustomDropdownContainer.vue'
import LastDocuments from '../../../components/simpleTable/LastDocuments.vue'

const showChart = ref(false)
</script>
<template>
  <CustomDropdownContainer
    :is-open="showChart"
    @dropdown_control="showChart = $event"
    bg="var(--vt-c-white)"
  >
    <template #head>
      <h2 style="font-size: 20px; font-weight: 600; line-height: 20px">{{ $t('documents') }}</h2>
    </template>
    <template #body>
      <div class="last_doc_container">
        <LastDocuments />
      </div>
    </template> 
  </CustomDropdownContainer>
</template>
<style lang="scss">
.last_doc_container {
  overflow-y: auto;
  padding: 10px;
}
</style>
