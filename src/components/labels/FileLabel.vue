<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import File from '../icons/File.vue';
const props = defineProps<{
  value?: File | null;
  realName?: string | null;
  title: string;
  showError?: boolean;
  errorText?: string;
  makePaste?: boolean;
}>();

const file = ref<File | null>(null);
const nameFile = ref<string | null>(null);
const isFile = ref(false);

const emit = defineEmits<{
  (e: 'dataChange', value: File | null): void;
  (e: 'file-name', value: string | null): void;
}>();
function onFileChanged($event: Event) {
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    file.value = target.files[0];
    // @ts-ignore
    nameFile.value = $event.target?.value?.split('\\').slice(-1)[0];
  }
}
window.addEventListener('paste', function name(e: any) {
  if (e.clipboardData.files.length > 0 && props.makePaste) {
    file.value = e.clipboardData.files[0];
    nameFile.value = e.clipboardData.files[0].name;
  }
});

watch(
  () => file.value,
  (value) => {
    emit('dataChange', value);

    setTimeout(() => {
      isFile.value = !!value;
    }, 100);
  }
);

watch(
  () => nameFile.value,
  (value) => {
    emit('file-name', value);

    setTimeout(() => {
      isFile.value = !!value;
    }, 100);
  }
);
watch(
  () => props.value,
  (value) => {
    if (value !== undefined) file.value = value;
  }
);

onMounted(() => {
  if (props.value !== undefined) file.value = props.value;
  else if (props.realName !== undefined) {
    nameFile.value = props.realName;
  }
});
</script>
<template>
  <div class="case">
    <label :for="props.title" class="fileLabel">
      <div
        class="file_box"
        :style="{
          borderColor: showError ? 'red' : 'var(--vt-c-light-white)',
          border: `1px ${file ? 'solid' : 'dashed'} var(--vt-c-light-white)`
        }"
      >
        <div class="file_box__icon">
          <File />
        </div>

        <span v-if="!nameFile">{{ props.title }}</span>
        <div v-else class="file_box__content">
          <div class="file_box__content--text">
            <p>
              {{ nameFile.split('.')[0] }}
            </p>
            <p>{{ '.' + nameFile.split('.')[1] }}</p>
          </div>

          <i
            class="mdi mdi-close"
            @click="
              () => {
                file = null;
                nameFile = null;
              }
            "
          ></i>
        </div>
      </div>
      <input
        v-if="!isFile"
        placeholder="загрузить файл"
        type="file"
        :id="props.title"
        @change="onFileChanged($event)"
      />
    </label>
    <p v-if="props.showError" class="error_message">{{ props?.errorText }}</p>
  </div>
</template>
<style lang="scss" scoped>
.case {
  .error_message {
    font-size: 16px;
    font-weight: 600;
    color: red;
    padding-left: 5px;
  }
  .fileLabel {
    input {
      display: none;
    }
    .file_box {
      cursor: pointer;
      max-height: 50px;
      border-radius: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 15px;
      span {
        color: var(--vt-c-bold-gray);
      }
      &__icon {
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        & > svg {
          width: 20px;
        }
      }
      &__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 85%;
        &--text {
          display: flex;
          align-items: center;
          width: 90%;
          & > p {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        & > i {
          cursor: pointer;
          opacity: 0.8;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
