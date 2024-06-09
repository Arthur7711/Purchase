<script setup lang="ts">
import { ref, watch } from 'vue';
import TextLabel from '../../components/labels/TextLabel.vue';
import DropdownLabel from '../../components/labels/DropdownLabel.vue';
import DatePickerLabel from '../../components/labels/DatePickerLabel.vue';
import FileLabel from '../../components/labels/FileLabel.vue';
import type { IDocumentCreate } from './types';

const props = defineProps<{
  showPopup: boolean;
  documentTypes: { id: number; name: string }[];
  testShow: boolean;
  legal_entities?: { id: number | null; name: string }[];
}>();
const emit = defineEmits<{
  (e: 'to-show', value: boolean): void;
  (e: 'file', value: IDocumentCreate): void;
}>();
const selectToShow = () => {
  emit('to-show', !props.showPopup);
  documentCreation.value = {
    doc_number: '',
    doc_type: '',
    start_date: '',
    end_date: '',
    file: null,
    fileName: ''
  };
};
const documentCreation = ref<IDocumentCreate>({
  doc_number: '',
  doc_type: '',
  start_date: '',
  end_date: '',
  file: null,
  fileName: ''
});
const sendDocumentUp = () => {
  emit('file', documentCreation.value);
  selectToShow();
  documentCreation.value = {
    doc_number: '',
    doc_type: '',
    start_date: '',
    end_date: '',
    file: null,
    fileName: ''
  };
};
watch(
  () => props.testShow,
  () => {
    if (props.showPopup) {
      documentCreation.value = {
        doc_number: '',
        doc_type: '',
        start_date: '',
        end_date: '',
        file: null,
        fileName: ''
      };
    }
  }
);
</script>
<template>
  <div class="addDock">
    <Button link @click="selectToShow">
      <slot name="open_button_vuew"></slot>
    </Button>
    <div class="display_block" v-if="props.showPopup">
      <TextLabel
        :title="$t('document number')"
        :value="documentCreation.doc_number"
        @data-change="documentCreation.doc_number = $event"
        v-if="Number(documentCreation.doc_type) === 8"
      />
      <DropdownLabel
        :values="props.documentTypes"
        :title="$t('document type')"
        :selected-value="documentCreation.doc_type"
        @data-change="documentCreation.doc_type = $event"
      />
      <DatePickerLabel
        :title="$t('start date')"
        :value="documentCreation.start_date"
        @data-change="documentCreation.start_date = $event"
        v-if="Number(documentCreation.doc_type) === 8"
      />
      <DatePickerLabel
        :title="$t('end date')"
        :value="documentCreation.end_date"
        @data-change="documentCreation.end_date = $event"
        v-if="Number(documentCreation.doc_type) === 8"
      />
      <!-- {{ documentCreation }}
      {{ legal_entities }} -->
      <DropdownLabel
        :values="legal_entities"
        v-if="documentCreation.doc_type == '8' && legal_entities"
        :title="$t('legal entity')"
        :selected-value="documentCreation.legal_entity ? documentCreation.legal_entity : ''"
        @data-change="documentCreation.legal_entity = $event"
      />
      <FileLabel
        :title="$t('upload file')"
        :value="documentCreation.file"
        @data-change="documentCreation.file = $event"
        @file-name="documentCreation.fileName = $event as ''"
      />
      <Button
        link
        class="save_btn"
        @click="sendDocumentUp"
        :disabled="
          Number(documentCreation.doc_type) === 8
            ? !documentCreation.file ||
              !documentCreation.doc_type ||
              !documentCreation.start_date ||
              !documentCreation.end_date ||
              !documentCreation.legal_entity
            : !documentCreation.file || !documentCreation.doc_type
        "
        >{{ $t('save') }}</Button
      >
      <button class="close_btn" @click="$emit('to-show', false)">{{ $t('close') }}</button>
    </div>
  </div>
</template>
<style lang="scss">
.addDock {
  button {
    color: var(--vt-c-electric-blue) !important;
    font-size: 16px;
    font-weight: 600;
    &:focus {
      box-shadow: none !important;
    }
  }
  .close_btn,
  .save_btn {
    display: flex;
    justify-content: center;
    height: 50px;
  }
  .close_btn {
    background: none;
    border: none;
    color: #b74242 !important;
  }
  .display_block {
    position: absolute;
    top: 20vh;
    box-shadow: 0px 0px 22px 7px #bbbec366;
    width: 354px;
    padding: 20px 20px 6px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 20;
    background: #fff;
    border-radius: 15px;
  }
}

@media only screen and (max-width: 650px) {
  .display_block {
    top: 60vh !important;
  }
}
</style>
