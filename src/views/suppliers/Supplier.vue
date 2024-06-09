<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import InfoBar from './supplierComponents/Infobar.vue';
import Procurement from './supplierComponents/Procurement.vue';
import RatingContainer from '../../components/ratingContainer/RatingContainer.vue';
import SumChart from './supplierComponents/SumChart.vue';
import UniqueNames from './supplierComponents/UniqueNames.vue';
import LastDocuments from './supplierComponents/LastDocuments.vue';
import ChartContainer from './supplierComponents/ChartContainer.vue';
import EditSupplier from './EditSupplier.vue';
import BankDetails from './supplierComponents/BankDetails.vue';
import Comments from './supplierComponents/Comments.vue';
import {
  getEditContragentInfo,
  getUniqueNames,
  getSupplierTimeline,
  getSupplierSummary
} from '../../api/suppliersPage';
import type { iEditConragentInfo, IGetTimeline, ITimeline } from './types';
import { useRoute } from 'vue-router';
import SuccessMessage from '../../components/successMessage/SuccessMessage.vue';
import useSuccess from '../../store/successInfo';
import ErrorMessage from '../../components/errorMessage/ErrorMessage.vue';
import useOfficeId from '../../store/officeId';
import ScreenParams from '@/store/screen';

const route = useRoute();
const showEdit = ref(false);
const rerenderKey = ref(1);
const summary = ref(0);
const errMessage = ref('');
const openedPopupInfo = ref({
  showDelete: true,
  openPossition: 1
});
const counting = ref({
  pending_purchases_count: 0,
  received_purchases_count: 0,
  cancelled_purchases_count: 0
});
const passData = ref({
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
const graphtData = ref<ITimeline>({
  labels: [],
  datasets: [
    {
      label: '',
      data: [],
      borderColor: 'blue',
      borderWidth: 1.5
    }
  ]
});
const uniqueNamesData = ref([]);

const getSupplierInfo = async () => {
  await getEditContragentInfo(`${route.params.id}`)
    .then(({ data }: { data: iEditConragentInfo }) => {
      passData.value.address = data.address || 'N/A';
      passData.value.name = data.name || 'N/A';
      passData.value.business_type = data.business_type || 'N/A';
      passData.value.inn = data.inn || 'N/A';
      passData.value.kpp = data.kpp || 'N/A';
      passData.value.ogrn = data.ogrn || 'N/A';
      passData.value.head_name = data.head_name || 'N/A';
      passData.value.head_position = data.head_position || 'N/A';
      passData.value.eliminated_at = data.eliminated_at || 'N/A';
      passData.value.invalidated_at = data.invalidated_at || 'N/A';
      passData.value.website = data.website || 'N/A';
      passData.value.login = data.auth_datum?.login || 'N/A';
      passData.value.password = data.auth_datum?.password || 'N/A';
      passData.value.bank = data.bank_data?.bank || 'N/A';
      passData.value.account_holder = data.bank_data?.account_holder || 'N/A';
      passData.value.bank_account = data.bank_data?.bank_account || 'N/A';
      passData.value.bik = data.bank_data?.bik || 'N/A';
      passData.value.corr_account = data.bank_data?.corr_account || 'N/A';
      passData.value.document_number = data.bank_data?.document_number || 'N/A';
      passData.value.contact_person = data.contact?.person || 'N/A';
      passData.value.contact_position = data.contact?.position || 'N/A';
      passData.value.contact_email = data.contact?.email || 'N/A';
      passData.value.contact_phone = data.contact?.phone || 'N/A';
      counting.value.cancelled_purchases_count = data.cancelled_purchases_count;
      counting.value.pending_purchases_count = data.pending_purchases_count;
      counting.value.received_purchases_count = data.received_purchases_count;
    })
    .catch((err) => {
      errMessage.value = err.message;
    });
};
const getTimeline = async () => {
  await getSupplierSummary(`${route.params.id}`)
    .then(({ data }) => {
      summary.value = data.total;
    })
    .catch((err) => {
      errMessage.value = err.message;
    });
  await getSupplierTimeline(`${route.params.id}`)
    .then(({ data }: { data: IGetTimeline }) => {
      graphtData.value.labels = data.labels;
      graphtData.value.datasets[0].label = data?.datasets?.[0]?.label;
      graphtData.value.datasets[0].data = data?.datasets?.[0]?.data.map((el) => el.total_price);
    })
    .catch((err) => {
      errMessage.value = err.message;
    });
};

onMounted(async () => {
  getSupplierInfo();
  getTimeline();
  await getUniqueNames(`${route.params.id}`)
    .then(({ data }) => {
      uniqueNamesData.value = data;
    })
    .catch((err) => (errMessage.value = err.message));
});

watch(useSuccess.success, () => {
  if (useSuccess.success.value) {
    rerenderKey.value += 1;
    setTimeout(() => {
      useSuccess.setSuccess(false);
    }, 1500);
  }
});
watch(rerenderKey, () => getSupplierInfo());
watch(errMessage, () => {
  setTimeout(() => {
    errMessage.value = '';
  }, 1500);
});
const editSupplierData = () => {
  showEdit.value = true;
  openedPopupInfo.value = {
    showDelete: true,
    openPossition: 1
  };
};
</script>
<template>
  <div class="supplier_page">
    <div class="head">
      <h1>{{ passData.name }}</h1>
      <Button :class="'supplier_page_head_button'" link @click="editSupplierData">{{
        $t('edit')
      }}</Button>
    </div>
    <ErrorMessage v-if="errMessage" :title="errMessage" />
    <EditSupplier
      :show-edit-dropdown="showEdit"
      @close="showEdit = $event"
      :modal-info="openedPopupInfo"
    />
    <main class="main_supplier" :key="useOfficeId.updatedRefer.value">
      <InfoBar :data="passData" />
      <div class="supplier_container">
        <LastDocuments />
        <ChartContainer v-if="ScreenParams.screenParams.width > 650" />
        <div class="details_comments">
          <BankDetails
            @show_edit="showEdit = $event"
            :data="passData"
            @popup_options="openedPopupInfo = $event"
          />
          <Comments />
        </div>
      </div>
      <div class="supplier_container">
        <!-- <RatingContainer :rating="9" v-if="useOfficeId.countryId.value === 1" /> -->
        <Procurement :data="counting" />
        <SumChart :sum="`${summary}`" :grapht-data="graphtData" :key="graphtData.labels.length" />
        <UniqueNames :sum="uniqueNamesData.length" :data="uniqueNamesData" />
      </div>
    </main>
    <SuccessMessage v-if="useSuccess.success.value" :title="useSuccess.successText.value" />
  </div>
</template>
<style lang="scss">
@import './styles.scss';
</style>
