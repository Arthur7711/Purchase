<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getAttachements, deleteAttachements, getLegalEntities } from '../../api/suppliersPage';
import { useRoute } from 'vue-router';
import type { ILastDocument, ILastDocumentTable } from './types';
import DropdownIcon from '../icons/DropdownIcon.vue';
import Pen from '../icons/Pen.vue';
import TableTrash from '../icons/TableTrash.vue';
import DocumenDownload from '../icons/DocumentDownload.vue';
import Eye from '../icons/Eye.vue';
import { debounce } from '../../helpers/debounse';
import EditDoc from '../../views/suppliers/EditDoc.vue';
import type { IDocumentEdit } from '@/views/suppliers/types';
import DeletePopup from '../deletePopup/DeletePopup.vue';
import RemoveFilter from '../icons/RemoveFilter.vue';
import purchTableOverlayDateVue from '../custom/purch_table_filters/purchTableOverlayDate.vue';
import { useInfiniteScroll } from '@vueuse/core';
import AddSupplier from '@/views/suppliers/supplierComponents/AddSupplier.vue';
import { format } from 'date-fns';
import i18n_config from '@/locales/i18n_config';

const route = useRoute();
const url = import.meta.env.VITE_VUE_APP_API_URL;
const oldUrl = import.meta.env.VITE_VUE_OLD_ADDRESS;
const scrollMake = ref<HTMLElement | null>(null);
const called = ref<boolean>(false);
const addedDoc = ref(0);
const downloadTestFile = (file_url: string) => {
  const aTag = document.createElement('a');
  aTag.setAttribute(
    'href',
    `${import.meta.env.VITE_VUE_APP_API_URL}/storage/files/${file_url}/preview`
  );
  aTag.setAttribute('download', file_url);
  aTag.setAttribute('target', '_blank');
  document.body.append(aTag);
  aTag.click();
  setTimeout(() => {
    aTag.remove();
  }, 100);
};
const documents = ref<ILastDocumentTable[]>([]);
const { messages, locale } = i18n_config.global;
const showDelete = ref(false);
const legal = ref<{ id: number; name: string }[] | null>(null);
const editableFile = ref<IDocumentEdit>({
  doc_number: '',
  doc_type: '',
  start_date: '',
  end_date: '',
  id: 0,
  fileName: '',
  document_type_number: '',
  legal_entity: ''
});
const filters = ref({
  name: '',
  type: { title: '', id: '' },
  number: '',
  date_from: '',
  date_to: '',
  sortBy: { title: '', id: '' }
});
const selectedId = ref(0);
const pageCounts = ref({
  current_page: 1,
  last_page: 1
});
const positions = ref({
  x: 0,
  y: 0
});
const typeFilters = [
  { name: messages[locale].invoice, id: '1' },
  { name: messages[locale].contract, id: '2' },
  { name: messages[locale]['closing document'], id: '3' },
  { name: messages[locale]['articles of association'], id: '4' },
  { name: messages[locale]['memorandum of association'], id: '5' },
  { name: messages[locale].Other, id: '6' },
  { name: messages[locale]['Extract from the USRLE'], id: '7' },
  { name: messages[locale]['Framework agreement'], id: '8' }
];
const suppliersTypes = [
  { name: messages[locale]['articles of association'], id: '4' },
  { name: messages[locale]['memorandum of association'], id: '5' },
  { name: messages[locale].Other, id: '6' },
  { name: messages[locale]['Framework agreement'], id: '8' }
];
const sortingBy = [
  { id: 'desc', title: messages[locale]['new ones at the top'] },
  { id: 'asc', title: messages[locale]['old at the top'] }
];
async function getDocuments(params: { [key: string]: number | string }) {
  await getAttachements(`${route.params.id}`, params).then(({ data }: { data: ILastDocument }) => {
    pageCounts.value = {
      current_page: 1,
      last_page: data.last_page
    };
    documents.value = [];
    documents.value = data.data.map((el) => {
      return {
        id: el.id,
        is_active: el.is_active,
        name: el.real_name,
        document_number: el.document_number || '',
        type: el.entity_type || '',
        url: el.file_name,
        date_from: el.document_date || '',
        date_to: el.delivery_date || '',
        document_type_number: `${el.document_type}`,
        entity_id: el.entity_id,
        legal_id: el?.legal_id
      };
    });
  });
}
async function moreDocuments(params: { [key: string]: number | string }) {
  await getAttachements(`${route.params.id}`, params).then(({ data }: { data: ILastDocument }) => {
    const docs = data.data.map((el) => {
      return {
        id: el.id,
        is_active: el.is_active,
        name: el.real_name,
        document_number: el.document_number || '',
        type: el.entity_type || '',
        url: el.file_name,
        date_from: el.document_date || '',
        date_to: el.delivery_date || '',
        document_type_number: `${el.document_type}`,
        entity_id: el.entity_id,
        legal_id: el.legal_id
      };
    });
    documents.value = [...documents.value, ...docs];
  });
}
const deleteDoc = async (id: number) => {
  await deleteAttachements(id).then(() => {
    getDocuments({ order_by: 'entity' });
    selectedId.value = 0;
    showDelete.value = false;
  });
};
const showDeletePopup = (x: number, y: number, id: number) => {
  showDelete.value = true;
  positions.value.x = x;
  positions.value.y = y;
  selectedId.value = id;
};
const filtersWork = debounce(async function () {
  if (filters.value.sortBy.id) {
    getDocuments({
      order_by: filters.value.sortBy.id ? 'date' : 'entity',
      name: filters.value.name,
      number: filters.value.number,
      type_document_id: filters.value.type?.id,
      order_dir: filters.value.sortBy.id,
      date_from: filters.value.date_from,
      date_to: filters.value.date_to
    });
  } else if (
    filters.value.date_from ||
    filters.value.date_to ||
    filters.value.name ||
    filters.value.number ||
    filters.value.type.id
  ) {
    getDocuments({
      order_by: filters.value.sortBy.id ? 'date' : 'entity',
      name: filters.value.name,
      number: filters.value.number,
      type_document_id: filters.value.type?.id,
      date_from: filters.value.date_from,
      date_to: filters.value.date_to
    });
  }
}, 500);
const clearFilter = () => {
  filters.value = {
    name: '',
    type: { title: '', id: '' },
    number: '',
    date_from: '',
    date_to: '',
    sortBy: { title: '', id: '' }
  };
  getDocuments({
    order_by: 'entity'
  });
};
const rowClass = (data: ILastDocumentTable) => {
  return [
    {
      checkedRow: data.document_type_number === '8' && data.is_active,
      errorRow: data.document_type_number === '8' && !data.is_active
    }
  ];
};
onMounted(async () => {
  await getDocuments({ order_by: 'entity' });
  await getLegalEntities().then(
    (res) =>
      (legal.value = res.data.map((el) => {
        return { id: el.id, name: el.name };
      }))
  );
});
watch(
  () => [
    filters.value.date_from,
    filters.value.date_to,
    filters.value.name,
    filters.value.number,
    filters.value.type,
    filters.value.sortBy
  ],
  () => {
    filtersWork();
  }
);
const addNewItems = async () => {
  if (pageCounts.value.current_page < pageCounts.value.last_page) {
    pageCounts.value.current_page = pageCounts.value.current_page + 1;

    if (filters.value.sortBy.id) {
      moreDocuments({
        order_by: filters.value.sortBy.id ? 'date' : 'entity',
        name: filters.value.name,
        number: filters.value.number,
        type_document_id: filters.value.type?.id,
        order_dir: filters.value.sortBy.id,
        date_from: filters.value.date_from,
        date_to: filters.value.date_to,
        page: pageCounts.value.current_page
      });
    } else if (
      filters.value.date_from ||
      filters.value.date_to ||
      filters.value.name ||
      filters.value.number ||
      filters.value.type.id
    ) {
      moreDocuments({
        order_by: filters.value.sortBy.id ? 'date' : 'entity',
        name: filters.value.name,
        number: filters.value.number,
        type_document_id: filters.value.type?.id,
        date_from: filters.value.date_from,
        date_to: filters.value.date_to,
        page: pageCounts.value.current_page
      });
    } else {
      moreDocuments({
        order_by: filters.value.sortBy.id ? 'date' : 'entity',
        page: pageCounts.value.current_page
      });
    }
  }
};
useInfiniteScroll(
  scrollMake,
  () => {
    if (!called.value) {
      addNewItems();
      called.value = true;
      setTimeout(() => {
        called.value = false;
      }, 500);
    }
  },
  { distance: 1000 }
);
watch(addedDoc, async () => {
  await getDocuments({ order_by: 'entity' });
});
</script>
<template>
  <div class="card">
    <div class="head_sorting">
      <Button
        link
        v-if="
          filters.sortBy.id ||
          filters.date_from ||
          filters.date_to ||
          filters.name ||
          filters.number ||
          filters.type.id
        "
        @click="clearFilter"
        ><RemoveFilter
      /></Button>
      <Dropdown
        class="documents_dropdown"
        :options="sortingBy"
        optionLabel="title"
        v-model="filters.sortBy"
        panel-class="dropdown_table_class"
        style="border: none"
      >
        <template #dropdownicon>
          <DropdownIcon />
        </template>
        <template #value="{ value }">
          <div class="dropdown_icon_container">
            <p>{{ $t('sorting') }} : {{ value.title }}</p>
          </div>
        </template>
      </Dropdown>
    </div>
    <div ref="scrollMake" style="max-height: 250px; overflow-y: auto">
      <DataTable
        :value="documents"
        tableStyle="width: 100%"
        class="supplier-page-tb last_document"
        tableClass="last_doc_table"
        :row-class="rowClass"
      >
        <Column field="name" header="" headerStyle="width:350px">
          <template #header>
            <input class="filter" placeholder="название" v-model="filters.name" />
          </template>
        </Column>
        <Column field="type" header="" headerStyle="width:250px">
          <template #header>
            <Dropdown
              class="documents_dropdown"
              :options="typeFilters"
              optionLabel="name"
              v-model="filters.type"
              panel-class="dropdown_table_class"
            >
              <template #dropdownicon>
                <DropdownIcon class="tableDropdownIcon" />
              </template>
              <template #value>
                <div class="dropdown_icon_container" v-if="!filters.type.id">
                  <p style="font-size: 14px">{{ $t('type') }}</p>
                </div>
              </template>
            </Dropdown>
          </template>
          <template #body="{ data }">
            {{ typeFilters.find((el) => el.id == data.document_type_number)?.name }}
          </template>
        </Column>
        <Column field="document_number" header="" headerStyle="width:200px">
          <template #header>
            <input class="filter" placeholder="номер" v-model="filters.number" />
          </template>
        </Column>
        <Column field="date" header="" headerStyle="width:200px">
          <template #header>
            <div style="padding-left: 20px">
              <purchTableOverlayDateVue
                :name="$t('date')"
                @select-date="
                  (val) => {
                    filters.date_from = val.dateFrom;
                    filters.date_to = val.dateTo;
                  }
                "
              />
            </div>
          </template>
          <template #body="{ data }">
            <p
              v-if="data.date_from || data.date_to"
              :style="{
                color:
                  data.document_type_number === '8' && data.is_active
                    ? 'var(--vt-c-progress-green)'
                    : data.document_type_number === '8' && !data.is_active
                    ? 'var(--vt-c-error-text)'
                    : '#1A1A1A',
                whiteSpace: 'nowrap'
              }"
            >
              {{
                data.date_from && data.date_to
                  ? `${format(new Date(data.date_from), 'y.MM.dd')}—${format(
                      new Date(data.date_to),
                      'y.MM.dd'
                    )} `
                  : data.date_from && !data.date_to
                  ? format(new Date(data.date_from), 'y.MM.dd')
                  : data.date_to && !data.date_from
                  ? format(new Date(data.date_to), 'y.MM.dd')
                  : ''
              }}
            </p>
          </template>
        </Column>
        <Column field="url" header="" headerStyle="width:200px">
          <template #body="{ data }">
            <a
              :href="`${oldUrl}/#/?id=${data.entity_id}`"
              target="_blank"
              style="color: var(--vt-c-electric-blue)"
              v-if="data.type === 'purchase'"
            >
              {{ $t('purchase') }}
            </a>
          </template>
        </Column>
        <Column field="id" header="">
          <template #body="{ data }">
            <div class="icons_container">
              <Button
                v-if="data.type !== 'purchase'"
                link
                @click="
                  (e) => {
                    selectedId = data.id;
                    positions = { x: e.pageX, y: e.pageY };
                    editableFile = {
                      doc_number: data.document_number,
                      doc_type: data.type,
                      fileName: data.name,
                      id: data.id,
                      start_date: data.date_from,
                      end_date: data.date_to,
                      document_type_number: data.document_type_number,
                      legal_entity: data.legal_id
                    };
                    showDelete = false;
                  }
                "
                style="padding: 5px 0"
              >
                <Pen />
              </Button>
              <Button
                link
                @click="
                  (e) => {
                    showDeletePopup(e.pageX, e.pageY, data.id);
                  }
                "
                v-if="data.type !== 'purchase'"
              >
                <TableTrash />
              </Button>
              <Button link @click="() => downloadTestFile(data.url)">
                <Eye />
              </Button>
              <a style="padding-top: 5px" download :href="`${url}/storage/files/${data.url}`">
                <DocumenDownload />
              </a>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <EditDoc
      v-if="legal"
      :document-types="suppliersTypes"
      :edit-data="editableFile"
      :show-popup="!!selectedId && !showDelete"
      @to-show="selectedId = $event"
      :positions="positions"
      @update="getDocuments({ order_by: 'entity' })"
      :legal_entities="legal"
    />
    <DeletePopup
      :text="$t('document cannot be restored')"
      :remove="deleteDoc"
      :id="selectedId"
      :show-delete-popup="!!selectedId && showDelete"
      @cancel="
        () => {
          selectedId = 0;
          showDelete = false;
        }
      "
      :x="positions.x"
      :y="positions.y"
    />
    <div class="footer_doclist">
      <AddSupplier
        v-if="legal"
        :legal_entities="legal"
        :add-count="addedDoc"
        @call_render="addedDoc = $event"
      />
    </div>
  </div>
</template>
<style lang="scss">
.card {
  .head_sorting {
    display: flex;
    justify-content: flex-end;
    button {
      padding: 0;
    }
  }
  .footer_doclist {
    display: flex;
    justify-content: flex-end;
  }
}
.last_document {
  .last_doc_table {
    border-spacing: 0px 1rem;
    .p-datatable-tbody {
      .checkedRow {
        background: rgba(104, 159, 56, 0.05) !important;
      }
      .errorRow {
        background: rgba(198, 40, 40, 0.05) !important;
      }
      tr {
        border-radius: 10px;
        box-shadow: 0px 0px 5px 0px #00000014;
        &:focus {
          outline: none !important;
        }
        td {
          padding: 0.25rem 1rem !important;
          &:nth-child(1) {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          &:nth-child(6) {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }
      }
    }
  }
  .filter {
    border: none;
    border-bottom: 1px solid var(--vt-c-light-white);
    width: 100%;
    &:focus-visible {
      outline: none !important;
    }
  }
  .tableDropdownIcon {
    path {
      fill: var(--vt-c-bold-gray);
    }
  }
  .documents_dropdown {
    border: none;
    span {
      color: var(--vt-c-bold-gray);
    }
  }
  .p-datatable-thead {
    tr {
      th {
        padding: 0;
      }
    }
  }
  .icons_container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 30px;
    button {
      padding: 0;
    }
  }
}
</style>
