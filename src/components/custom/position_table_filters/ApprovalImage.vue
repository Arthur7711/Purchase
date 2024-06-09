<script lang="ts" setup>
const props = defineProps<{
  accountname: string | null
  status: string | null
}>()
</script>

<template>
  <div>
    <img
      v-if="accountname"
      class="approval_image_image"
      :class="`${status}`"
      :src="'https://avatars.saber3d.net/?user=' + accountname"
      alt="not found"
    />
    <img
      v-else
      class="approval_image_image"
      :class="`${status}`"
      src="../../icons/empty-user.svg"
      alt=""
    />
  </div>
</template>

<style lang="scss" scoped>
.approval_image_image {
  max-width: 40px;
  border-radius: 50%;
}
.accepted {
  border: 2px #689f38 solid;
}
.pending {
  border: 2px #1565c0 solid;
}

.rejected {
  border: 2px #f57c00 solid;
}
</style>
