<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import i18n_config from '@/locales/i18n_config';

const { locale, messages } = i18n_config.global;
const props = defineProps<{
  data: { [key: string]: string };
}>();
const supplierDataCases = [
  { name: messages[locale].TIN, key: 'inn' },
  { name: messages[locale].CPT, key: 'kpp' },
  { name: messages[locale]['OGRN or OGRNIP'], key: 'ogrn' },
  { name: messages[locale]['type of business'], key: 'business_type' },
  { name: messages[locale]['company manager'], key: 'head_name' },
  { name: messages[locale].address, key: 'address' }
];
const suplierWebsites = [
  { name: messages[locale].website, key: 'website' },
  { name: messages[locale].login, key: 'login' },
  { name: messages[locale]['login password'], key: 'password' }
];
const contacts = [
  { name: messages[locale]['company representative'], key: 'contact_person' },
  { name: messages[locale].telephone, key: 'contact_phone' },
  { name: messages[locale].mail, key: 'contact_email' }
];
</script>
<template>
  <div class="info_bar">
    <div class="data">
      <h3>{{ $t('supplier data') }}</h3>
      <div class="data_item" v-for="info in supplierDataCases" :key="info.key">
        <p class="title">{{ info.name }}</p>
        <p class="value">
          {{
            props.data[info.key] === 'ЮЛ'
              ? $t('legal entity')
              : props.data[info.key] === 'ИП'
                ? $t('Private entrepreneur')
                : props.data[info.key]
          }}
        </p>
        <p
          class="value"
          v-if="info.name === $t('OGRN or OGRNIP')"
          style="font-size: 14px !important"
        >
          {{ $t('assigned') }}: {{ props.data.eliminated_at }}
        </p>
        <p
          class="value"
          v-if="info.name === $t('OGRN or OGRNIP')"
          style="font-size: 14px !important"
        >
          {{ $t('terminated') }}:
          {{ props.data.invalidated_at }}
        </p>
        <p class="value" v-if="info.name === $t('company manager')">
          {{ props.data.head_position }}
        </p>
      </div>
    </div>
    <div class="data">
      <h3>{{ $t('supplier site') }}</h3>
      <div class="data_item" v-for="info in suplierWebsites" :key="info.key">
        <p class="title">{{ info.name }}</p>
        <p v-if="info.name !== $t('website')" class="value" style="color: var(--vt-c-bold-gray)">
          {{ props.data[info.key] }}
        </p>
        <a
          v-if="info.name === $t('website')"
          style="color: var(--vt-c-electric-blue)"
          :href="props.data[info.key]"
          target="_blank"
          >{{ props.data[info.key] }}</a
        >
      </div>
    </div>
    <div class="data">
      <h3>{{ $t('manager contacts') }}</h3>
      <div class="data_item" v-for="info in contacts" :key="info.key">
        <p class="title">{{ info.name }}</p>
        <p class="value">{{ props.data[info.key] }}</p>
        <p class="value" v-if="info.name === $t('company representative')">
          {{ props.data.contact_position }}
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.info_bar {
  border-radius: 15px;
  padding: 24px 24px 32px 24px;
  background: var(--vt-c-white);
  box-shadow: 0px 0px 22px 7px #d8dae066;
  display: flex;
  gap: 30px;
  flex-direction: column;
  h3 {
    font-size: 20px;
    font-weight: 600;
  }
  .data {
    display: flex;
    flex-direction: column;
    gap: 2px;
    .title {
      color: var(--vt-c-bold-gray);
      font-size: 13px;
      line-height: 20px;
      white-space: nowrap;
      margin-top: 14px;
    }
    .value {
      color: var(--vt-c-text-black);
      font-size: 16px;
      line-height: 20px;
    }
  }
}

@media only screen and (max-width: 650px) {
  .info_bar {
    width: 98vw;
    flex-wrap: wrap;
    padding-left: 5px;
  }
  .data {
    gap: 1px;
  }
  .title {
    font-size: 12px !important;
  }
}
</style>
