<script setup lang="ts">
import Listbox from 'primevue/listbox';
import { ref, onMounted, watch } from 'vue';
import Checkbox from 'primevue/checkbox';
import type { ITypesDataExp, ITypesExp } from '@/store/expenses_store/types_exp';
import { colors } from '../../views/analistic/suppliers/colorConstants';
import { debounce } from '@/helpers/debounse';

const props = defineProps<{
  options: ITypesExp;
  title: { title: String; aux_title: String };
  emittedValue?: string | string[];
  firsRender?: boolean;
}>();

onMounted(() => {
  if (!props.emittedValue && props.firsRender) {
    addAll();
  } else {
    selected.value = props.options.data.filter((el) => {
      if (props.emittedValue?.includes(String(el.id))) {
        return el;
      }
    });
  }
  props.options.data.map((el, index) => {
    colorize(index);
  });
  emit('select', selected.value);
});

const display = ref(true);
const selected = ref();
const checked = ref(['']);
const colorses = ref([]);
const addAll = () => {
  selected.value = props.options.data;
  checked.value = [];
  if (props.options.data.length) {
    checked.value = props.options.data.map((el) => el.name);
  }
};

watch(
  () => props.options,
  () => {
    if (!props.emittedValue) {
      addAll();
    } else {
      selected.value = props.options.data.filter((el) => {
        if (props.emittedValue?.includes(String(el.id))) {
          return el;
        }
      });
    }
    emit('select', selected.value);
    colorses.value = [];
    props.options.data.map((el, index) => {
      colorize(index);
    });
  }
);

watch(
  () => props.emittedValue,
  () => {
    if (props.emittedValue) {
      if (!Array.isArray(props.emittedValue)) {
        selected.value = props.options.data.filter((el) => {
          if (el.name === props.emittedValue || el.id == props.emittedValue) {
            return el;
          }
        });
        emit('select', selected.value);
      } else {
        selected.value = props.options.data.filter((el) => {
          if (props.emittedValue?.includes(String(el.id))) {
            return el;
          }
        });
        emit('select', selected.value);
      }
    } else {
      addAll();
      emit('select', selected.value);
    }
  }
);

const handleShow = () => {
  display.value = !display.value;
};

const clearAll = () => {
  selected.value = '';
  checked.value = [''];
  emit('select', selected.value);
};

const emit = defineEmits<{
  (e: 'select', value: []): void;
  (e: 'colorset', value: any): void;
}>();

const colorize = (index: number) => {
  let res = '';
  res =
    index > colors.length ? '#' + Math.floor(Math.random() * 16777215).toString(16) : colors[index];
  emit('colorset', res);
  colorses.value.push(res as never);
};

const emitter = debounce(function emitter() {
  emit('select', selected.value);
}, 500);

watch(selected, () => {
  checked.value = [];
  if (selected.value?.length) {
    checked.value = selected.value.map((el: ITypesDataExp) => el.name);
  }
});
</script>

<template>
  <div class="listboxexpens_div_all">
    <div class="listboxexpens_buttongroup_div">
      <span>{{ props.title.title }}</span>
      <button
        class="listbox_button_expenses listbox_button_expenses_blue"
        @click="
          () => {
            clearAll();
          }
        "
      >
        {{ $t('Reset') }}
      </button>
      <button
        class="listbox_button_expenses"
        @click="
          () => {
            addAll();
            emitter();
          }
        "
      >
        {{ $t('Select All') }}
      </button>
      <button
        class="listbox_button_expenses"
        :style="display ? { rotate: '0deg' } : { rotate: '180deg' }"
        @click="handleShow"
      >
        &#8743;
      </button>
    </div>
    <Transition>
      <div @click="emitter" v-show="display" v-if="colorses.length > 0">
        <div class="listbox_expenses_div_all">
          <Listbox
            multiple
            v-model="selected"
            :options="props.options.data"
            optionLabel="name"
            filter
            :filterPlaceholder="$t('looking for')"
          >
            <template #option="{ option, index }">
              <div
                class="listbox_expenses_div_checkbox"
                :class="props.title.aux_title === 'active' ? 'checkbox_active' : ''"
              >
                <Checkbox
                  v-model="checked"
                  :style="
                    props.title.aux_title === 'active'
                      ? {
                          background: colorses[index],
                          borderRadius: '10px'
                        }
                      : {
                          background: '#1565C0',
                          borderRadius: '10px'
                        }
                  "
                  :inputId="props.title + option.id"
                  name="name"
                  :value="option.name"
                />

                <div class="exp_label_listbox" :for="props.title + option.id">
                  <div class="listbox_exp_div_flex">
                    <span class="listbox_option_span">
                      {{ option.name }}
                    </span>
                    <span class="exp_span_procent">
                      {{
                        Number(
                          ((option.price_sum / Number(props.options.total)) * 100).toFixed(1)
                        ) > 0.01
                          ? ((option.price_sum / Number(props.options.total)) * 100).toFixed(1)
                          : '< ' + 0.1
                      }}%</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </Listbox>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@import './listboxExpenses.scss';

.listboxexpens_div_all {
  .v-enter-active,
  .v-leave-active {
    transition: all 0.4s ease-in;
    transform: translateY(10px) scale(1.1);
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: translateY(-60px) scale(0.6);
  }
}
</style>
