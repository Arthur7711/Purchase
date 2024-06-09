<script lang="ts" setup>
defineProps<{
  active: boolean
}>()
</script>

<template>
  <div style="transition: all 1s ease-in-out">
    <TransitionGroup name="image_active">
      <svg
        v-if="!active"
        width="43"
        height="30"
        viewBox="0 0 43 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect width="43" height="30" fill="url(#pattern0)" />
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_4902_102285" transform="scale(0.0232558 0.0333333)" />
          </pattern>
          <image
            id="image0_4902_102285"
            width="43"
            height="30"
            xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAeCAYAAAC16ufeAAAB5UlEQVRYCe2WO4vCQBSF9weKCBaiiGhhLVrZ+ajs9CdYWIjNPlhdsVkRVBDslmW38K1soYLG5/rIWa6QMErUjGjExYGQSTK58+XMuXfygBtqDzfEijvspVbrruxdWeC/Jpgoop3L4Ssex3q5vNRKH4yrOsEWoxGKgQCe9Hp8xmJXAVYNS588HwxQ8PmuBswFe21gbljyazWVwrPBsFfhQbWKpMWCR51OPmg8rQo9O7VxwS4nE5TDYRmAYJQ8rAQrgb8YjahnMoAocjNzwVaTyQ3cu8uFYb2OabeLrMejCLxLIooiWtksXk0mvNlsGNZqu0OOXquG/RUEZN3uzURCqyUH5gGml0hVUvkjGpVjqO2ohhUaDaSsVpRCIawXCzk+u+SsJRbj8abUFfx+rGYzefyo00HabkcxGMRqPpfvq+mcFXbXwwT8nUhoDyvZIO1wYNRuKwox6/eR83oPelgTGxAdm2BCs6kIvM/DmiYYkSmVLqkk0Vny56BSQdJs3lJY8jCVrp9SSfFDj91U7VkpECnUyeeRcTq36u0WLLMpsEm3nE4x6/WkUNxnblieGfZZgicGO/aisDSRmqRjgQ71Lw67C0z/w2SlU5omsBJwORIBbQqnNs1gTwVk37vDsmqcs39Tyv4BsBFkCqEAChIAAAAASUVORK5CYII="
          />
        </defs>
      </svg>
    </TransitionGroup>
    <TransitionGroup name="image_disable">
      <svg
        v-if="active"
        style="margin-top: 0px"
        width="43"
        height="39"
        viewBox="0 0 43 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect width="43" height="39" fill="url(#pattern0)" />
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_4902_101483" transform="scale(0.0232558 0.025641)" />
          </pattern>
          <image
            id="image0_4902_101483"
            width="43"
            height="39"
            xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAnCAYAAACWn7G7AAABo0lEQVRYCe2YyUvDQBTG+wcq1KXiAgULPbmCKBU9Ci54EDyLIF5coLYFF7BF7EVKG9FaUTwJPRhioVhibBrz6QRSEpEyWeaQMgMhE5J5881vvvcSEkKAWihAWsHFstotTpaTBXiCsXIBJ8vJEgK8zrLyQfeSbWoqDp+PMXYaRU8ybDumcrP4aDYgiLcYTA/b7vWe9GEyO4OSKHiCTk22/lVHIr9kE2EV3Ems+Vw4NYC9yj506K5EU4vdKe+CEBo/j6MsPTiaTNM1HDwdoT8dMagT+m4alVjpU0LsIo6hzCgq749u5jHGEKqE8lphw1UMKrF30j0imRHMXS1AaSntif7zp7nl5Gxaoz3AY6f7xPphg+KbgOhZzPD9Yn4ZNaXmmDMVWRLVS4KJsoiJ7DQuX3OQWzK2SttYL2w6rgrUYp2WLqtfibfnrxNGHSYL/3tNi5haLAlISlDyJUX1UjDFVhtVo9xZE8/sr9ysQv1WabWy/5DpVDHMBdGqdUSWNqj1OS7WSsPPfqDIBirB/Nwl5gnGxfpJgFUsbgNOlv/kYOWBX7I/QWw9C7AtEqMAAAAASUVORK5CYII="
          />
        </defs>
      </svg>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
.image_active-enter-active {
  transition-delay: 0.2s;
  transition-property: all;
}
.image_active-leave-active {
  transition: all 0.2s ease;
}
.image_active-enter-from {
  opacity: 0;
  transform: scale(1.3);
}
.image_active-leave-to {
  opacity: 0;
  transform: scale(0);
}

.image_disable-enter-active {
  transition-delay: 0.2s;
  transition-property: all;
}
.image_disable-leave-active {
  transition: all 0.2s ease;
}
.image_disable-enter-from {
  opacity: 0;
  transform: scale(1.3);
  z-index: 10;
}
.image_disable-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
