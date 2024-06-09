<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import DialogNomenclature from '../../../components/dialogs/DialogNomenclature.vue';
import type { IDocumentCreate } from '../types';
import TextLabel from '../../../components/labels/TextLabel.vue';
import DropdownLabel from '../../../components/labels/DropdownLabel.vue';
import DatePickerLabel from '../../../components/labels/DatePickerLabel.vue';
import FileLabel from '../../../components/labels/FileLabel.vue';
import { postContragentFile } from '../../../api/suppliersPage';
import { useRoute } from 'vue-router';
import FileAccept from '@/components/icons/FileAccept.vue';
import i18n_config from '@/locales/i18n_config';
const props = defineProps<{
  addCount: number;
  legal_entities: { id: number; name: string }[];
}>();

const emit = defineEmits<{
  (e: 'call_render', value: number): void;
}>();

const { locale, messages } = i18n_config.global;
const legal = ref<{ id: number; name: string }[] | null>(props.legal_entities);
const documnetTypes = [
  { name: messages[locale]['articles of association'], id: '6' },
  { name: messages[locale]['memorandum of association'], id: '5' },
  { name: messages[locale].Other, id: '4' },
  { name: messages[locale]['Framework agreement'], id: '8' }
];
const route = useRoute();
const showDialog = ref(false);
const documentCreation = ref<IDocumentCreate>({
  doc_number: '',
  doc_type: '',
  start_date: '',
  end_date: '',
  file: null,
  fileName: '',
  legal_entity: ''
});

const addDocument = async () => {
  await postContragentFile({
    id: Number(route.params.id),
    requestData: documentCreation.value
  }).then((data) => {
    emit('call_render', props.addCount + 1);
    showDialog.value = false;
  });
};
watch(showDialog, () => {
  if (!showDialog.value) {
    documentCreation.value = {
      doc_number: '',
      doc_type: '',
      start_date: '',
      end_date: '',
      file: null,
      fileName: '',
      legal_entity: ''
    };
  }
});
</script>
<template>
  <div class="dialog_add_suplier">
    <Button link class="add" @click="showDialog = true">+ {{ $t('document') }}</Button>
    <DialogNomenclature
      :visible="showDialog"
      :title="$t('document addition')"
      @close="showDialog = false"
    >
      <template #bodyoption>
        <div class="supplier_add_popup">
          <div class="require_labels">
            <div style="width: 50%">
              <TextLabel
                :title="$t('document number')"
                :value="documentCreation.doc_number"
                @data-change="documentCreation.doc_number = $event"
              />
            </div>
            <div style="width: 50%">
              <DropdownLabel
                :values="documnetTypes"
                :title="$t('document type')"
                :selected-value="documentCreation.doc_type"
                @data-change="documentCreation.doc_type = $event"
              />
            </div>
          </div>
          <div class="require_labels" v-if="Number(documentCreation.doc_type) === 8">
            <div style="width: 50%">
              <DatePickerLabel
                :title="$t('start date')"
                :value="documentCreation.start_date"
                @data-change="documentCreation.start_date = $event"
              />
            </div>
            <div style="width: 50%">
              <DatePickerLabel
                :title="$t('end date')"
                :value="documentCreation.end_date"
                @data-change="documentCreation.end_date = $event"
              />
            </div>
          </div>
          <DropdownLabel
            :values="legal"
            v-if="documentCreation.doc_type === '8' && legal"
            :title="$t('legal entity')"
            :selected-value="documentCreation.legal_entity ? documentCreation.legal_entity : ''"
            @data-change="documentCreation.legal_entity = $event"
          />
          <FileLabel
            :title="$t('upload file')"
            :value="documentCreation.file"
            @data-change="documentCreation.file = $event"
            @file-name="documentCreation.fileName = $event as ''"
            :make-paste="showDialog"
          />
          <div class="file_info" v-if="documentCreation.fileName">
            <FileAccept />
            <span style="color: var(--vt-c-electric-blue)">{{ documentCreation.fileName }}</span>
          </div>
          <Button
            class="save_btn"
            @click="addDocument"
            :disabled="
              Number(documentCreation.doc_type) === 8
                ? !documentCreation.file ||
                  !documentCreation.doc_type ||
                  !documentCreation.start_date ||
                  !documentCreation.end_date ||
                  !documentCreation.legal_entity
                : !documentCreation.file || !documentCreation.doc_type
            "
          >
            {{ $t('save') }}
          </Button>
        </div>
      </template>
    </DialogNomenclature>
  </div>
</template>
<style lang="scss">
.dialog_add_suplier {
  .add {
    color: var(--vt-c-electric-blue);
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    &:hover {
      color: var(--vt-c-electric-blue) !important;
    }
  }
}
.supplier_add_popup {
  display: flex;
  flex-direction: column;
  gap: 14px;
  .require_labels {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
  }
  .file_info {
    background: var(--vt-c-backgroud-gray);
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    border-radius: 10px;
    gap: 20px;
  }
  .save_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vt-c-electric-blue);
    &:hover {
      background-color: var(--vt-c-electric-blue) !important;
    }
  }
}
</style>
