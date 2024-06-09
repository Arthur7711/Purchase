<template>
  <div
    :class="['custom-dropdown ', className, { 'readonly-dropdown': readonly }]"
    :style="{
      borderColor: customColor ? `rgba(${customColor}, 0.25)` : 'var(--vt-c-light-white)',
    }"
  >
    <div class="custom-dropdown_value">
      <div v-if="!noImage" class="custom-dropdown_value__avatar">
        <template v-if="!imageName">
          <Avatar
            v-if="!selectedValue"
            class="custom-dropdown_value__avatar-user"
            label="N/A"
            shape="circle"
          />
          <Avatar
            v-else-if="typeof selectedValue === 'object'"
            class="custom-dropdown_value__avatar-user"
            :image="'https://avatars.saber3d.net/?user=' + selectedValue.samaccountname"
            shape="circle"
          />
        </template>
        <div
          v-else-if="imageName === 'bank_id'"
          class="custom-dropdown_value__avatar-img"
        >
          <bankImage
            :bankName="
              selectedValue && typeof selectedValue === 'object'
                ? selectedValue[imageName]
                : 'any'
            "
          />
        </div>
      </div>
      <div
        class="custom-dropdown_value__selection"
        :style="{
          background: customColor ? `rgba(${customColor}, 0.02)` : 'none',
        }"
      >
        <label
          class="custom-dropdown_value__selection-label"
          :for="label"
          :style="{
            top:
              isFocused || selectedValue
                ? topFocused
                  ? topFocused[1]
                  : '1px'
                : topFocused
                ? topFocused[0]
                : '10px',
            fontSize: isFocused || selectedValue ? '12px' : '16px',
          }"
        >
          {{ label }}
        </label>
        <Dropdown
          v-model="selectedValue"
          :options="list"
          :optionLabel="
            optionLabel
              ? optionLabel === 'description' && i18n_config.global.locale === 'en'
                ? 'displayname'
                : optionLabel
              : 'name'
          "
          :disabled="readonly"
          :filter="isFilter"
          :filterPlaceholder="filterText"
          @filter="searchValue = $event.value"
          :virtualScrollerOptions="
            list.length > 600
              ? {
                  lazy: true,
                  onLazyLoad: onLazyLoad,
                  itemSize: 38,
                  showLoader: true,
                  loading: loading,
                  delay: 250,
                }
              : undefined
          "
          :editable="!isFilter"
          class="custom-dropdown_value__selection-dropdown"
          :style="{
            color: customColor ? `rgb(${customColor})` : '#495057',
          }"
        >
          <template #filtericon>
            <img class="search-icon" :src="searchIcon" alt="search" />
          </template>
          <template #empty>
            <p>список пуст</p>
          </template>
          <template #emptyfilter>
            <p>ничего не найдено</p>
          </template>
          <template #header>
            <slot name="prepend"></slot>
          </template>
          <template #option="slotProps">
            <div v-if="slotProps.option.icon || imageName" class="custom-option">
              <i v-if="!imageName" :class="['mdi', `mdi-${slotProps.option.icon}`]"></i>
              <div
                v-else-if="slotProps.option[imageName]"
                class="custom-dropdown_value__avatar-img"
              >
                <bankImage :bankName="slotProps.option[imageName]" />
              </div>

              {{ prop ? slotProps.option[prop] : slotProps.option.name }}
            </div>
            <div v-else>
              <p>
                {{
                  prop
                    ? prop === "description" && i18n_config.global.locale === "en"
                      ? slotProps.option["displayname"]
                      : slotProps.option[prop]
                    : slotProps.option.name
                }}
              </p>
            </div>
          </template></Dropdown
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import i18n_config from "@/locales/i18n_config";

import bankImage from "@/components/custom/variableCommons/bankImage.vue";
import searchIcon from "@/components/icons/search.svg";

const props = defineProps<{
  label: string; // имя поля
  value: number | string | null | undefined; // входной параметр (id выбранного элемента)
  list: any[]; // сделать нормальный тип (список)
  selected?: // весь выбранный элемент или введнное в инпут
  | number
    | string
    | null
    | undefined
    | {
        id: number;
        name?: string;
        description?: string;
        real_name?: string;
        bank_id?: string;
        samaccountname?: string;
      };
  search?: string; // значение инпута в поиске
  isFilter?: boolean; // поиск по списку
  filterText?: string; // placeholder  для поиска
  noImage?: boolean; // отвечает за отображение картинки/аватара слева
  imageName?: string; // если будет картинка, то тут будет название свойства из объекта с именем
  optionLabel?: string; // отображение в инпуте другого пропса в качестве name
  prop?: string; // отображение в списке другого пропса в качестве name
  topFocused?: string[]; // значение свойства top у лейбла (для float label)
  readonly?: boolean; // только для чтения
  className?: string; // входной параметр для доп стилизации из вне
  customColor?: boolean | string; // кастом инпута - boolean (стандартный цвет инпута), string (новый цвет)
}>();

const emit = defineEmits<{
  (e: "dataChange", value: number | null): void;
  (e: "search", value: string): void;
  (
    e: "selected",
    value:
      | number
      | string
      | null
      | undefined
      | {
          id: number;
          name?: string;
          description?: string;
          bank_id?: string;
          shortname?: string;
          samaccountname?: string;
        }
  ): void;
}>();

const isFocused = ref(false);

const selectedValue = ref<
  | number
  | string
  | null
  | undefined
  | {
      id: number;
      name?: string;
      description?: string;
      bank_id?: string;
      shortname?: string;
      samaccountname?: string;
    }
>(null);
const searchValue = ref<string>("");

watch(
  () => searchValue.value,
  (value) => {
    emit("search", value);
  }
);

watch(
  () => selectedValue.value,
  (value) => {
    if (typeof value === "object") {
      emit("dataChange", value && value.id);
    } else if (!value && props.list.length && props.value) {
      emit("dataChange", null);
    }

    emit("selected", value);
  }
);

watch(
  () => props.value,
  () => {
    selectedValue.value = props.list.find((el) => el.id === props.value);
  }
);

watch(
  () => props.list,
  () => {
    if (props.value) {
      selectedValue.value = props.list.find((el) => el.id === props.value);
    }
  },
  { deep: true }
);

const loading = ref(false);
const loadLazyTimeout = ref();

const onLazyLoad = () => {
  loading.value = true;

  if (loadLazyTimeout.value) {
    clearTimeout(loadLazyTimeout.value);
  }

  loadLazyTimeout.value = setTimeout(() => {
    loading.value = false;
  }, 100);
};

onMounted(() => {
  if (props.value && props.list.length) {
    selectedValue.value = props.list.find((el) => el.id === props.value);
  }
});
</script>

<style lang="scss">
.custom-dropdown {
  width: 100%;
  height: 50px;
  border: 1px solid var(--vt-c-light-white);
  box-sizing: border-box;
  border-radius: 10px;
  &.readonly-dropdown {
    border: 1px dashed var(--vt-c-light-white);
  }
  &_value {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    align-self: stretch;
    gap: 10px;
    &__avatar {
      width: 36px !important;
      height: 36px !important;
      padding: 0 10px;
      &-user {
        width: 36px !important;
        height: 36px !important;
      }
      &-img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px !important;
        height: 36px !important;
        & > div {
          margin: 0 !important;
          width: 80%;
          height: 80%;
          & > .bankimage_img {
            margin: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    &__selection {
      box-sizing: border-box;
      padding: 0 15px;
      position: relative;
      max-width: 100%;
      width: 100%;
      height: 100%;
      & label {
        position: absolute;
        transition: 0.4s;
        color: var(--vt-c-bold-gray);
      }
      &-dropdown {
        max-width: 100%;
        width: 100%;
        height: 100%;
        margin: 0;
        border: none;
        outline: none;
        background: none;

        & > input {
          padding: 0;
          max-width: 100%;
          color: inherit;
        }
        & > span {
          padding: 15px 0;
        }
        & > svg {
          right: 18px !important;
        }
      }
    }
  }
  .p-dropdown-trigger {
    width: 15px !important;
    margin-left: -6px !important;
  }
}
.custom-option {
  display: flex;
  align-items: center;
  gap: 6px;
}
.p-dropdown-panel {
  max-width: 300px !important;
}

.p-dropdown-item {
  white-space: normal !important;
}

.p-dropdown.p-dropdown-clearable .p-dropdown-label {
  padding: 5px 37px 0 0 !important;
}
.p-component-overlay {
  background-color: rgb(233, 233, 233);
  transition-duration: 0.2s;
}

.search-icon {
  position: absolute;
  top: 14px;
}
</style>
