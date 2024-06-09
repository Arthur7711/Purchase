<script setup lang="ts">
import DialogNomenclature from '../../components/dialogs/DialogNomenclature.vue';
import PanelIcon from '../../components/icons/PanelIcon.vue';
import BlueSearch from '../../components/icons/BlueSearch.vue';
import GreenSearch from '../../components/icons/GreenSearch.vue';
import TextLabel from '../../components/labels/TextLabel.vue';
import DropdownLabel from '../../components/labels/DropdownLabel.vue';
import DatePickerLabel from '../../components/labels/DatePickerLabel.vue';
import FileAccept from '../../components/icons/FileAccept.vue';
import AddDoc from './AddDoc.vue';
import { onMounted, ref, watch } from 'vue';
import type { ISearchContragents, ICreateContragent, IDocumentCreate } from './types';
import useOfficeId from '../../store/officeId';
import {
  postContragentFile,
  searchContragents,
  getDocumentTypes,
  postContragent
} from '../../api/suppliersPage';
import ErrorMessage from '../../components/errorMessage/ErrorMessage.vue';
import useSuccess from '../../store/successInfo';
import i18n_config from '@/locales/i18n_config';

const props = defineProps<{
  showAddDropdown: boolean;
  legal?: { id: null | number; name: string }[];
}>();
const emit = defineEmits<{
  (e: 'close', value: boolean): void;
  (e: 'success', value: boolean): void;
}>();

const { locale, messages } = i18n_config.global;
const typeOfBusiness = ref([
  { name: messages[locale]['legal entity'], id: 'ЮЛ' },
  { name: messages[locale]['Private entrepreneur'], id: 'ИП' }
]);
const showFileAdd = ref(false);
const closedPopup = ref(false);
const documentTypes = ref<{ id: number; name: string; entity_types: string[] }[]>([]);

const passData = ref<ICreateContragent>({
  name: '',
  business_type: '',
  head_name: '',
  head_position: '',
  address: '',
  inn: '',
  kpp: '',
  ogrn: '',
  eliminated_at: '',
  invalidated_at: '',
  website: '',
  login: '',
  password: '',
  contact_person: '',
  contact_position: '',
  contact_phone: '',
  contact_email: '',
  account_holder: '',
  bank: '',
  bank_account: '',
  corr_account: '',
  bik: '',
  document_number: '',
  registered_at: '',
  token: ''
});
const validateChecks = ref({
  business_type: '',
  inn: '',
  name: '',
  head_name: '',
  head_position: '',
  address: '',
  kpp: '',
  ogrn: '',
  eliminated_at: '',
  invalidated_at: '',
  website: '',
  login: '',
  password: '',
  contact_person: '',
  contact_position: '',
  contact_phone: '',
  contact_email: '',
  account_holder: '',
  bank: '',
  bank_account: '',
  corr_account: '',
  bik: '',
  document_number: ''
});
const searchNewSupplier = ref('');
const searchSuplliersResults = ref<ISearchContragents[]>([]);
const selectedSearchVersion = ref<ISearchContragents>();
const disableSave = ref(true);
const files = ref<IDocumentCreate[]>([]);
const showNotFound = ref(false);
const errorText = ref('');

const contragentsSearch = async () => {
  if (searchNewSupplier.value.length) {
    const { data } = await searchContragents(searchNewSupplier.value);
    searchSuplliersResults.value = data;
    if (data.length) {
      showNotFound.value = false;
    } else {
      showNotFound.value = true;
    }
  }
};
const checkContragent = async () => {
  if (!passData.value.name) {
    disableSave.value = true;
    return (validateChecks.value.name = messages[locale]['name required']);
  } else {
    validateChecks.value.name = '';
  }
  if (!passData.value.business_type) {
    disableSave.value = true;
    return (validateChecks.value.business_type = messages[locale]['select type of business']);
  } else {
    validateChecks.value.business_type = '';
  }
  switch (useOfficeId.countryId.value) {
    case 1:
      if (
        passData.value.inn &&
        passData.value.inn.length !== 10 &&
        passData.value.inn &&
        passData.value.inn.length !== 12
      ) {
        disableSave.value = true;
        return (validateChecks.value.inn = messages[locale]['inn must contain']);
      } else {
        validateChecks.value.inn = '';
      }
      if (
        passData.value.ogrn &&
        passData.value.ogrn.length !== 13 &&
        passData.value.ogrn &&
        passData.value.ogrn.length !== 15
      ) {
        disableSave.value = true;
        return (validateChecks.value.ogrn = messages[locale]['ogrn must contain']);
      } else {
        validateChecks.value.ogrn = '';
      }
      if (passData.value.kpp && passData.value.kpp.length !== 9) {
        disableSave.value = true;
        return (validateChecks.value.kpp = messages[locale]['kpp must contain']);
      } else {
        validateChecks.value.kpp = '';
      }
      if (passData.value.bik && passData.value.bik.length !== 9) {
        disableSave.value = true;
        return (validateChecks.value.bik = messages[locale]['bik must contain']);
      } else {
        validateChecks.value.bik = '';
      }
      if (passData.value.bank_account && passData.value.bank_account.length !== 20) {
        disableSave.value = true;
        return (validateChecks.value.bank_account = messages[locale]['bank account must contain']);
      } else {
        validateChecks.value.bank_account = '';
      }
      if (passData.value.corr_account && passData.value.corr_account.length !== 20) {
        disableSave.value = true;
        return (validateChecks.value.corr_account = messages[locale]['corr account must contain']);
      } else {
        validateChecks.value.corr_account = '';
      }
      break;
    case 2:
      if (passData.value.inn && passData.value.inn.length !== 8) {
        disableSave.value = true;
        return (validateChecks.value.inn = messages[locale]['inn must contain 8']);
      } else {
        validateChecks.value.inn = '';
      }
      break;
    case 4:
      if (passData.value.inn && passData.value.inn.length !== 9) {
        disableSave.value = true;
        return (validateChecks.value.inn = messages[locale]['inn must contain 9']);
      } else {
        validateChecks.value.inn = '';
      }
      break;
    default:
      break;
  }
  if (passData.value.head_name && passData.value.head_name.length > 50) {
    disableSave.value = true;
    return (validateChecks.value.head_name = messages[locale]['max. 50']);
  } else {
    validateChecks.value.head_name = '';
  }
  if (passData.value.head_position && passData.value.head_position.length > 50) {
    disableSave.value = true;
    return (validateChecks.value.head_position = messages[locale]['max. 50']);
  } else {
    validateChecks.value.head_position = '';
  }
  if (
    passData.value.contact_email &&
    !passData.value.contact_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  ) {
    disableSave.value = true;
    return (validateChecks.value.contact_email = messages[locale]['valid e-mail']);
  } else {
    validateChecks.value.contact_email = '';
  }
  if (passData.value.account_holder && !passData.value.bank_account) {
    disableSave.value = true;
    return (validateChecks.value.bank_account = messages[locale]['add a bank account']);
  } else {
    validateChecks.value.bank_account = '';
  }
  if (passData.value.account_holder && !passData.value.bank) {
    disableSave.value = true;
    return (validateChecks.value.bank = messages[locale]['please add the bank']);
  } else {
    validateChecks.value.bank = '';
  }
  if (passData.value.login && !passData.value.password) {
    disableSave.value = true;
    return (validateChecks.value.password = messages[locale]['add a password']);
  } else {
    validateChecks.value.password = '';
  }
  disableSave.value = false;
};
const removeFile = (fileName: string) => {
  files.value = files.value.filter((el) => el.fileName !== fileName);
};
const createContragent = async () => {
  await postContragent(passData.value)
    .then(({ data }) => {
      if (files.value.length) {
        files.value?.map(async (el) => {
          await postContragentFile({ requestData: el, id: data.id });
        });
      }
      closedPopup.value = false;
      emit('success', true);
      useSuccess.setSuccessText(messages[locale]['new supplier added']);
    })
    .catch((err) => {
      errorText.value = err.message;
    });
};
onMounted(async () => {
  await getDocumentTypes().then(
    ({ data }: { data: { id: number; name: string; entity_types: string[] }[] }) => {
      documentTypes.value = data.filter((el) => el.entity_types.includes('contragent'));
    }
  );
});
watch(
  () => props.showAddDropdown,
  () => {
    closedPopup.value = props.showAddDropdown;
  }
);
watch(closedPopup, () => {
  if (!closedPopup.value) {
    emit('close', closedPopup.value);
    showFileAdd.value = false;
  }
});
watch(
  () => props.showAddDropdown,
  () => {
    if (!props.showAddDropdown) {
      passData.value = {
        name: '',
        business_type: '',
        head_name: '',
        head_position: '',
        address: '',
        inn: '',
        kpp: '',
        ogrn: '',
        eliminated_at: '',
        invalidated_at: '',
        website: '',
        login: '',
        password: '',
        contact_person: '',
        contact_position: '',
        contact_phone: '',
        contact_email: '',
        account_holder: '',
        bank: '',
        bank_account: '',
        corr_account: '',
        bik: '',
        document_number: '',
        registered_at: '',
        token: ''
      };
      validateChecks.value = {
        business_type: '',
        inn: '',
        name: '',
        head_name: '',
        head_position: '',
        address: '',
        kpp: '',
        ogrn: '',
        eliminated_at: '',
        invalidated_at: '',
        website: '',
        login: '',
        password: '',
        contact_person: '',
        contact_position: '',
        contact_phone: '',
        contact_email: '',
        account_holder: '',
        bank: '',
        bank_account: '',
        corr_account: '',
        bik: '',
        document_number: ''
      };
      files.value = [];
      searchNewSupplier.value = '';
      searchSuplliersResults.value = [];
      showNotFound.value = false;
      selectedSearchVersion.value = undefined;
    }
  }
);
watch(selectedSearchVersion, () => {
  passData.value.address = selectedSearchVersion.value?.address || '';
  passData.value.name = selectedSearchVersion.value?.name || '';
  passData.value.business_type = selectedSearchVersion.value?.business_type || '';
  passData.value.inn = selectedSearchVersion.value?.inn || '';
  passData.value.kpp = selectedSearchVersion.value?.kpp || '';
  passData.value.ogrn = selectedSearchVersion.value?.ogrn || '';
  passData.value.head_position = selectedSearchVersion.value?.head_position || '';
  passData.value.eliminated_at = selectedSearchVersion.value?.eliminated_at || '';
  passData.value.invalidated_at = selectedSearchVersion.value?.eliminated_at || '';
  passData.value.head_name = selectedSearchVersion.value?.head_name || '';
  passData.value.token = selectedSearchVersion.value?.token || '';
});
watch(
  () => [
    passData.value.name,
    passData.value.business_type,
    passData.value.inn,
    passData.value.ogrn,
    passData.value.kpp,
    passData.value.bik,
    passData.value.bank_account,
    passData.value.corr_account,
    passData.value.head_name,
    passData.value.head_position,
    passData.value.contact_email,
    passData.value.account_holder,
    passData.value.bank,
    passData.value.bank_account,
    passData.value.login,
    passData.value.password
  ],
  () => {
    checkContragent();
  }
);
watch(errorText, () => {
  if (errorText.value) {
    setTimeout(() => {
      errorText.value = '';
    }, 3000);
  }
});
</script>
<template>
  <DialogNomenclature
    :title="$t('adding new supplier')"
    :visible="closedPopup"
    @close="closedPopup = $event"
    :top-possition="'0'"
    :width-size="'860px'"
    :left-possition="'0'"
  >
    <template #bodyoption>
      <div id="add_suppliers_all" class="add_suplier_div_all">
        <div
          :class="`search_container ${searchSuplliersResults.length && 'active_search_container'}`"
          v-if="useOfficeId.countryId.value === 1"
        >
          <InputText v-model="searchNewSupplier" :placeholder="$t('auto search')" />
          <Button link class="search_button" @click="contragentsSearch">
            <BlueSearch class="search_icon" v-if="!searchSuplliersResults.length" />
            <GreenSearch v-else-if="searchSuplliersResults.length" />
          </Button>
        </div>
        <div class="search_results_container" v-if="searchSuplliersResults.length">
          <p
            v-for="(result, index) in searchSuplliersResults"
            :key="index"
            class="searched_result"
            @click="
              () => {
                selectedSearchVersion = result;
                searchSuplliersResults = [];
              }
            "
          >
            {{ result.name }}
          </p>
        </div>
        <div class="search_results_container" v-if="showNotFound">
          <p>{{ $t('nothing was found') }}</p>
        </div>
        <Panel :header="$t('basic data')" toggleable>
          <template #togglericon="{ collapsed }">
            <div :style="{ rotate: collapsed ? '0deg' : '180deg' }">
              <PanelIcon />
            </div>
          </template>
          <div class="panel_body">
            <div class="left_side side" style="width: 55%">
              <TextLabel
                :title="$t('title') + '*'"
                :value="passData.name"
                @data-change="passData.name = $event"
                :error-text="validateChecks.name"
                :show-error="!!validateChecks.name"
              />
              <DropdownLabel
                :values="typeOfBusiness"
                :title="$t('type of business')"
                :selected-value="passData.business_type"
                @data-change="passData.business_type = $event"
                :key="Number(showAddDropdown)"
                :error-text="validateChecks.business_type"
                :show-error="!!validateChecks.business_type"
              />
              <TextLabel
                :title="$t('company manager')"
                :value="passData.head_name"
                @data-change="passData.head_name = $event"
                :error-text="validateChecks.head_name"
                :show-error="!!validateChecks.head_name"
              />
              <TextLabel
                :title="$t('management position')"
                :value="passData.head_position"
                @data-change="passData.head_position = $event"
                :error-text="validateChecks.head_position"
                :show-error="!!validateChecks.head_position"
              />
              <TextLabel
                :title="$t('address')"
                :value="passData.address || ''"
                @data-change="passData.address = $event"
              />
            </div>
            <div class="side" style="width: 310px">
              <div style="display: flex; gap: 18px">
                <TextLabel
                  :title="$t('TIN')"
                  :value="passData.inn"
                  @data-change="passData.inn = $event"
                  :error-text="validateChecks.inn"
                  :show-error="!!validateChecks.inn"
                />
                <TextLabel
                  :title="$t('CPT')"
                  :value="passData.kpp"
                  @data-change="passData.kpp = $event"
                  :error-text="validateChecks.kpp"
                  :show-error="!!validateChecks.kpp"
                />
              </div>
              <TextLabel
                :title="$t('OGRN or OGRNIP')"
                :value="passData.ogrn"
                @data-change="passData.ogrn = $event"
                :error-text="validateChecks.ogrn"
                :show-error="!!validateChecks.ogrn"
              />
              <DatePickerLabel
                :title="$t('date of assignment of OGRN or OGRNIP')"
                :value="passData.eliminated_at"
                @data-change="passData.eliminated_at = $event"
              />
              <DatePickerLabel
                :title="$t('date of termination')"
                :value="passData.invalidated_at"
                @data-change="passData.invalidated_at = $event"
              />
              <AddDoc
                :show-popup="showFileAdd"
                @to-show="showFileAdd = $event"
                :document-types="documentTypes"
                @file="files.push($event)"
                :testShow="showAddDropdown"
                :legal_entities="legal"
              >
                <template #open_button_vuew>+ {{ $t('document') }}</template>
              </AddDoc>
            </div>
          </div>
          <div v-for="fileInfo in files" class="addedFiles" :key="fileInfo.fileName">
            <div style="display: flex; align-items: center; gap: 10px">
              <FileAccept />
              <span style="color: var(--vt-c-electric-blue)">{{ fileInfo.fileName }}</span>
            </div>
            <Button
              link
              style="color: #999999; font-size: 12px"
              @click="() => removeFile(fileInfo.fileName)"
              >X</Button
            >
          </div>
        </Panel>
        <Panel :header="$t('site')" toggleable :collapsed="true">
          <template #togglericon="{ collapsed }">
            <div :style="{ rotate: collapsed ? '0deg' : '180deg' }">
              <PanelIcon />
            </div>
          </template>
          <div class="website_panel">
            <TextLabel
              :title="$t('website address')"
              :value="passData.website"
              @data-change="passData.website = $event"
              :error-text="validateChecks.website"
              :show-error="!!validateChecks.website"
            />
            <TextLabel
              :title="$t('login')"
              :value="passData.login"
              @data-change="passData.login = $event"
              :disable="useOfficeId.department.value === 'all'"
            />
            <TextLabel
              :title="$t('login password')"
              :value="passData.password"
              @data-change="passData.password = $event"
              :error-text="validateChecks.login"
              :show-error="!!validateChecks.login"
              :disable="useOfficeId.department.value === 'all'"
            />
          </div>
        </Panel>
        <Panel :header="$t('manager contacts')" toggleable :collapsed="true">
          <template #togglericon="{ collapsed }">
            <div :style="{ rotate: collapsed ? '0deg' : '180deg' }">
              <PanelIcon />
            </div>
          </template>
          <div class="panel_body">
            <div class="left_side side">
              <TextLabel
                :title="$t('company representative')"
                :value="passData.contact_person"
                @data-change="passData.contact_person = $event"
              />
              <TextLabel
                :title="$t('position')"
                :value="passData.contact_position"
                @data-change="passData.contact_position = $event"
              />
            </div>
            <div class="side" style="width: 310px">
              <TextLabel
                :title="$t('telephone')"
                :value="passData.contact_phone"
                @data-change="passData.contact_phone = $event"
              />
              <TextLabel
                :title="$t('mail')"
                :value="passData.contact_email"
                @data-change="passData.contact_email = $event"
                :error-text="validateChecks.contact_email"
                :show-error="!!validateChecks.contact_email"
              />
            </div>
          </div>
        </Panel>
        <Panel
          v-if="useOfficeId.department.value !== 'all'"
          :header="$t('bank details')"
          toggleable
          :collapsed="true"
        >
          <template #togglericon="{ collapsed }">
            <div :style="{ rotate: collapsed ? '0deg' : '180deg' }">
              <PanelIcon />
            </div>
          </template>
          <div class="panel_body">
            <div class="left_side side">
              <TextLabel
                :title="$t('beneficiary')"
                :value="passData.account_holder"
                @data-change="passData.account_holder = $event"
              />
              <TextLabel
                :title="$t('beneficiary bank')"
                :value="passData.bank"
                @data-change="passData.bank = $event"
                :error-text="validateChecks.bank"
                :show-error="!!validateChecks.bank"
              />
            </div>
            <div class="side" style="width: 40%">
              <TextLabel
                :title="$t('account number')"
                :value="passData.bank_account"
                @data-change="passData.bank_account = $event"
                :error-text="validateChecks.bank_account"
                :show-error="!!validateChecks.bank_account"
              />
              <TextLabel
                :title="$t('contract number')"
                :value="passData.document_number"
                @data-change="passData.document_number = $event"
              />
              <TextLabel
                :title="$t('BIC')"
                :value="passData.bik"
                @data-change="passData.bik = $event"
                :error-text="validateChecks.bik"
                :show-error="!!validateChecks.bik"
              />
              <TextLabel
                :title="$t('correspondent account')"
                :value="passData.corr_account"
                @data-change="passData.corr_account = $event"
                :error-text="validateChecks.corr_account"
                :show-error="!!validateChecks.corr_account"
              />
            </div>
          </div>
        </Panel>
        <div class="button_box">
          <Button class="save_supplier" @click="createContragent" :disabled="disableSave">
            {{ $t('save a supplier') }}
          </Button>
        </div>
        <ErrorMessage v-if="errorText" :title="errorText" />
      </div>
    </template>
  </DialogNomenclature>
</template>
<style lang="scss">
@import './styles.scss';
</style>
