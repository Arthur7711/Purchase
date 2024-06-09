<script setup lang="ts">
import AccessDenied from '../assets/images/access_denied.png';
</script>
<template>
  <div class="inner_page">
    <main>
      <div class="image_box">
        <img alt="no access" v-bind:src="AccessDenied" />
      </div>
      <h2>Access Denied</h2>
    </main>
  </div>
</template>
<style scoped>
.inner_page {
  height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
main .image_box {
  display: flex;
  justify-content: center;
}
main h2 {
  font-weight: 700;
  font-size: 24px;
  line-height: 18px;
  color: var(--vt-c-text-black);
  margin-top: 36px;
  text-align: center;
}
main p {
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 25px;
  margin-top: 12px;
}
</style>
