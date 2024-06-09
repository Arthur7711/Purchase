<script setup lang="ts">
import { ref, watch } from 'vue';
import TextLabel from '../../components/labels/TextLabel.vue';
import DropdownLabel from '../../components/labels/DropdownLabel.vue';
import DatePickerLabel from '../../components/labels/DatePickerLabel.vue';
import type { IDocumentEdit } from './types';
import FileAccept from '../../components/icons/FileAccept.vue';
import { EditAttachements } from '../../api/suppliersPage';

const props = defineProps<{
  showPopup: boolean;
  documentTypes: { id: string; name: string }[];
  editData: IDocumentEdit;
  positions: {
    x: number;
    y: number;
  };
  legal_entities: { id: number; name: string }[];
}>();
const documentCreation = ref<IDocumentEdit>({
  doc_number: '',
  doc_type: '',
  start_date: '',
  end_date: '',
  fileName: '',
  id: Infinity,
  document_type_number: '',
  legal_entity: ''
});
const closePopUp = () => {
  emit('to-show', 0);
  documentCreation.value = {
    doc_number: '',
    doc_type: '',
    start_date: '',
    end_date: '',
    fileName: '',
    id: Infinity,
    document_type_number: ''
  };
};
const sendDocumentUp = async () => {
  await EditAttachements({
    file_id: documentCreation.value.id,
    document_number: documentCreation.value.doc_number,
    document_type: Number(documentCreation.value.document_type_number),
    document_date: documentCreation.value.start_date,
    delivery_date: documentCreation.value.end_date,
    legal_id: documentCreation.value.legal_entity ? documentCreation.value.legal_entity : undefined
  });
  emit('update');
  closePopUp();
};
const emit = defineEmits<{
  (e: 'to-show', value: number): void;
  (e: 'update'): void;
}>();

watch(
  () => props.showPopup,
  () => {
    documentCreation.value = props.editData;
  }
);
</script>
<template>
  <div class="editDoc">
    <div
      class="display_block"
      v-if="showPopup && positions.y && positions.x"
      :style="{ top: `${positions.y + 20}px`, left: `${positions.x - 20}px` }"
    >
      <TextLabel
        :title="'номер документа'"
        :value="documentCreation.doc_number"
        @data-change="documentCreation.doc_number = $event"
      />
      <DropdownLabel
        :values="props.documentTypes"
        :title="'тип документа'"
        :selected-value="documentCreation.document_type_number"
        @data-change="documentCreation.document_type_number = $event"
      />
      <DatePickerLabel
        :title="'дата начала'"
        :value="documentCreation.start_date"
        @data-change="documentCreation.start_date = $event"
      />
      {{ documentCreation.end_date }}
      <DatePickerLabel
        :title="''"
        :value="documentCreation.end_date"
        @data-change="documentCreation.end_date = $event"
      />
      <DropdownLabel
        :values="legal_entities"
        v-if="documentCreation.document_type_number === '8' && legal_entities"
        :title="$t('legal entity')"
        :selected-value="documentCreation.legal_entity ? documentCreation.legal_entity : ''"
        @data-change="documentCreation.legal_entity = $event"
      />
      <div class="file_info_container">
        <FileAccept />
        <p>
          {{ editData.fileName }}
        </p>
      </div>
      <!-- <FileLabel
        :title="'загрузить файл'"
        :value="documentCreation.file"
        @data-change="documentCreation.file = $event"
        @file-name="documentCreation.fileName = $event"
      /> -->
      <div class="btn_box">
        <Button link class="save_btn cancel_btn" @click="closePopUp">отменить</Button>
        <Button
          link
          class="save_btn"
          :disabled="
            documentCreation.document_type_number == '8' ? !documentCreation.legal_entity : false
          "
          @click="sendDocumentUp"
          >{{ $t('save') }}</Button
        >
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.editDoc {
  button {
    color: var(--vt-c-electric-blue) !important;
    font-size: 16px;
    font-weight: 600;
    &:focus {
      box-shadow: none !important;
    }
  }
  .save_btn {
    display: flex;
    justify-content: center;
  }
  .cancel_btn {
    color: #666666 !important;
  }
  .display_block {
    position: fixed;
    box-shadow: 0px 0px 22px 7px #bbbec366;
    width: 354px;
    padding: 20px 20px 6px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 20;
    background: #fff;
    border-radius: 15px;
    .btn_box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
    .file_info_container {
      background: var(--vt-c-backgroud-gray);
      width: 100%;
      height: 50px;
      padding: 15px;
      border-radius: 10px;
      gap: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      p {
        color: var(--vt-c-electric-blue);
      }
    }
  }
}
</style>
