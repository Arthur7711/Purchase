<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  name: string;
  options: { id: string | number; name: string }[];
  filter_name: string;
  incoming_selected: (string | number)[] | undefined;
}>();
const emit = defineEmits<{
  (e: "change", val: (string | number)[]): void;
}>();
const selectedOption = ref<{ id: string | number; name: string }[]>([]);
const className = "selection_search_options";

const handleSelect = (val: { id: string | number; name: string }) => {
  selectedOption.value.includes(val)
    ? (selectedOption.value = selectedOption.value.filter((el) => el.name !== val.name))
    : selectedOption.value.push(val);
  emit(
    "change",
    selectedOption.value.map((el) => el.id)
  );
};

watch(
  () => props.incoming_selected,
  () => {
    if (props.options && props.incoming_selected && props.incoming_selected.length) {
      const res: { id: string | number; name: string }[] = [];
      props.options.forEach((el) => {
        if (props.incoming_selected?.includes(el.id)) {
          res.push(el);
        }
      });
      selectedOption.value = res;
    } else {
      selectedOption.value = [];
    }
  }
);
</script>

<template>
  <div>
    <span :class="className + '_span_name'">{{ name }}</span>
    <div :class="className + '_div_flex_mapping'">
      <span
        @click="() => handleSelect(option)"
        :class="className + '_span_option'"
        :style="
          selectedOption.includes(option)
            ? { borderRadius: '5px', background: '#E3E3E3' }
            : ''
        "
        v-for="option in options"
        >{{ option.name.toLowerCase() }}</span
      >
    </div>
  </div>
</template>

<style lang="scss">
.selection_search_options_div_flex_mapping {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.selection_search_options_span_name {
  color: #999999;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding-left: 5px;
}

.selection_search_options_span_option {
  color: #1a1a1a;
  font-size: 16px;
  font-style: normal;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 5px;
  font-weight: 400;
  line-height: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  transition: all 0.18s ease-in;
  &:hover {
    background: #1565c0 !important;
    color: white;
    transform: scale(1.07);
    animation-name: jumper;
    animation-duration: 0.5s;
  }
}

@keyframes jumper {
  0% {
    transform: scale(1.1);
  }
  25% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
