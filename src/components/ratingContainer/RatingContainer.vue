<script setup lang="ts">
import LikeIcon from '../../components/icons/LikeIcon.vue'
import MidLike from '../../components/icons/MidLike.vue'
import Dislike from '../../components/icons/Dislike.vue'

const props = defineProps<{ rating: number }>()
</script>
<template>
  <div
    class="rating_container"
    :style="{
      background:
        rating > 7
          ? 'rgba(104, 159, 56, 0.15)'
          : rating > 3 && rating <= 7
          ? 'rgba(245, 176, 0, 0.15)'
          : 'rgba(245, 124, 0, 0.15)',
      borderColor:
        rating > 7
          ? 'rgba(104, 159, 56, 0.35)'
          : rating > 3 && rating <= 7
          ? 'rgba(245, 176, 0, 0.35)'
          : 'rgba(245, 124, 0, 0.35)'
    }"
  >
    <p
      class="title"
      :style="{
        color:
          rating > 7
            ? 'rgb(104, 159, 56)'
            : rating > 3 && rating <= 7
            ? 'rgb(245, 176, 0)'
            : 'rgb(245, 124, 0)'
      }"
    >
      рейтинг надёжности
    </p>
    <div class="rate">
      <LikeIcon v-if="rating > 7" />
      <MidLike v-else-if="rating > 3 && rating <= 7" />
      <Dislike v-else />
      <span> {{ props.rating }}/10 </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.rating_container {
  display: flex;
  flex-direction: column;
  height: 106px;
  padding: 20px 24px 20px 24px;
  border-radius: 15px;
  border: 1px solid;
  gap: 14px;
  box-shadow: 0px 0px 22px 7px #d8dae066;
  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
  }
  .rate {
    display: flex;
    align-items: center;
    font-size: 36px;
    font-weight: 600;
    line-height: 32px;
    flex-wrap: nowrap;
    gap: 18px;
  }
}
</style>
