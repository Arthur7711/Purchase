<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DialogNomenclature from '../../components/dialogs/DialogNomenclature.vue';
import PanelIcon from '../../components/icons/PanelIcon.vue';
import TextLabel from '../../components/labels/TextLabel.vue';
import DropdownLabel from '../../components/labels/DropdownLabel.vue';
import DatePickerLabel from '../../components/labels/DatePickerLabel.vue';
import type { ISearchContragents, ICreateContragent, iEditConragentInfo } from './types';
import useOfficeId from '../../store/officeId';
import {
  editContragentInfo,
  getEditContragentInfo,
  deleteContragentInfo
} from '../../api/suppliersPage';
import ErrorMessage from '../../components/errorMessage/ErrorMessage.vue';
import useSuccess from '../../store/successInfo';
import i18n_config from '@/locales/i18n_config';

const props = defineProps<{
  showEditDropdown: boolean;
  modalInfo: {
    showDelete: boolean;
    openPossition: number;
  };
}>();
const emit = defineEmits<{
  (e: 'close', value: boolean): void;
  (e: 'success', value: boolean): void;
}>();
const { messages, locale } = i18n_config.global;
const route = useRoute();
const router = useRouter();

const typeOfBusiness = ref([
  { name: messages[locale]['legal entity'], id: 'ЮЛ' },
  { name: messages[locale]['Private entrepreneur'], id: 'ИП' }
]);
const closedPopup = ref(false);

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
const showNotFound = ref(false);
const errorText = ref('');
const canDelete = ref(false);
const showDeletePopup = ref(false);

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
        return (validateChecks.value.kpp = messages[locale]['inn must contain 9']);
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
const editContragent = async () => {
  await editContragentInfo(`${route.params.id}`, passData.value)
    .then(() => {
      closedPopup.value = false;
      emit('success', true);
      useSuccess.setSuccessText(messages[locale]['changes saved']);
      useSuccess.setSuccess(true);
    })
    .catch(({ response }) => {
      errorText.value = response.data.message;
    });
};
const removeContragent = async () => {
  deleteContragentInfo(`${route.params.id}`).then(() => {
    closedPopup.value = false;
    emit('success', true);
    router.push('/suppliers');
    useSuccess.setSuccessText(
      `${messages[locale].supplier} ${passData.value.name} ${messages[locale].deleted}`
    );
    useSuccess.setSuccess(true);
  });
};
watch(
  () => props.showEditDropdown,
  () => {
    closedPopup.value = props.showEditDropdown;
  }
);
watch(closedPopup, () => {
  if (!closedPopup.value) {
    emit('close', closedPopup.value);
  }
});
watch(
  () => props.showEditDropdown,
  async () => {
    if (!props.showEditDropdown) {
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
      searchNewSupplier.value = '';
      searchSuplliersResults.value = [];
      showNotFound.value = false;
      selectedSearchVersion.value = undefined;
    } else {
      await getEditContragentInfo(`${route.params.id}`).then(
        ({ data }: { data: iEditConragentInfo }) => {
          passData.value.address = data.address || '';
          passData.value.name = data.name || '';
          passData.value.business_type = data.business_type || '';
          passData.value.inn = data.inn || '';
          passData.value.kpp = data.kpp || '';
          passData.value.ogrn = data.ogrn || '';
          passData.value.head_name = data.head_name || '';
          passData.value.head_position = data.head_position || '';
          passData.value.eliminated_at = data.eliminated_at || '';
          passData.value.invalidated_at = data.invalidated_at || '';
          passData.value.website = data.website || '';
          passData.value.login = data.auth_datum?.login || '';
          passData.value.password = data.auth_datum?.password || '';
          passData.value.bank = data.bank_data?.bank || '';
          passData.value.account_holder = data.bank_data?.account_holder || '';
          passData.value.bank_account = data.bank_data?.bank_account || '';
          passData.value.bik = data.bank_data?.bik || '';
          passData.value.corr_account = data.bank_data?.corr_account || '';
          passData.value.document_number = data.bank_data?.document_number || '';
          passData.value.contact_person = data.contact?.person || '';
          passData.value.contact_position = data.contact?.position || '';
          passData.value.contact_email = data.contact?.email || '';
          passData.value.contact_phone = data.contact?.phone || '';
          canDelete.value = !!data.purchases_count;
        }
      );
    }
  }
);
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
    :title="$t('supplier data editing')"
    :visible="closedPopup"
    @close="closedPopup = $event"
    :top-possition="'1vh'"
    :width-size="'860px'"
    :left-possition="'30vw'"
  >
    <template #headoption>
      <Button
        link
        style="font-weight: 600; color: var(--vt-c-text-black)"
        :disabled="canDelete"
        @click="showDeletePopup = true"
        v-if="props.modalInfo.showDelete"
        >{{ $t('drop the supplier') }}</Button
      >
    </template>
    <template #bodyoption>
      <div class="edit_popup">
        <Panel
          :header="$t('basic data')"
          toggleable
          :collapsed="props.modalInfo.openPossition !== 1"
        >
          <template #togglericon="{ collapsed }">
            <div :style="{ rotate: collapsed ? '0deg' : '180deg' }">
              <PanelIcon />
            </div>
          </template>
          <div class="panel_body">
            <div class="left_side side">
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
                :key="Number(showEditDropdown)"
                :error-text="validateChecks.business_type"
                :show-error="!!validateChecks.business_type"
              />
              <TextLabel
                :title="$t('company director')"
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
            </div>
          </div>
        </Panel>
        <Panel :header="$t('website')" toggleable :collapsed="props.modalInfo.openPossition !== 2">
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
        <Panel
          :header="$t('manager contacts')"
          toggleable
          :collapsed="props.modalInfo.openPossition !== 3"
        >
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
          :collapsed="props.modalInfo.openPossition !== 4"
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
          <Button class="save_supplier" @click="editContragent" :disabled="disableSave">
            {{ $t('save a supplier') }}
          </Button>
        </div>
        <ErrorMessage v-if="errorText" :title="errorText" />
      </div>
      <div class="supplier_delete_dropdown" v-if="showDeletePopup">
        <div class="main">
          <p class="info">{{ $t('after deletion supplier') }}</p>
          <div class="btn_box">
            <Button @click="showDeletePopup = false">{{ $t('cancel') }}</Button>
            <Button @click="removeContragent">{{ $t('delete') }}</Button>
          </div>
        </div>
      </div>
    </template>
  </DialogNomenclature>
</template>
<style lang="scss">
@import './styles.scss';
</style>
