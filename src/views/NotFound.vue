<script setup lang="ts">
import NotFoundImage from '../assets/images/404.png'
</script>
<template>
  <div class="inner_page">
    <main>
      <img alt="404" v-bind:src="NotFoundImage" />
      <h2>упс... страница не найдена</h2>
      <p>
        <router-link to="/">перейти на главную</router-link>
      </p>
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
main h2 {
  font-weight: 700;
  font-size: 24px;
  line-height: 18px;
  color: var(--vt-c-text-black);
  margin-top: 50px;
  text-align: center;
}
main p {
  text-align: center;
  margin-top: 24px;
}
main a {
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: var(--vt-c-electric-blue);
}
</style>
