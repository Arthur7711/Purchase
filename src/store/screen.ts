import { mobileDetector } from '@/helpers/isMobile_detector';
import { ref, type Ref } from 'vue';

class Screen {
  height: Ref<number>;
  width: Ref<number>;
  isMobile: Ref<boolean>;
  constructor(height: number, width: number, isMobile: boolean) {
    this.height = ref(height);
    this.width = ref(width);
    this.isMobile = ref(isMobile);
  }
  get screenParams() {
    return { height: this.height.value, width: this.width.value, isMobile: this.isMobile.value };
  }
  set setHeight(height: number) {
    this.height.value = height;
  }
  set setWidth(width: number) {
    this.width.value = width;
  }
  set setMobile(isMobile: boolean) {
    this.isMobile.value = isMobile;
  }
}

const ScreenParams = new Screen(
  window.screen.height,
  window.screen.width,
  mobileDetector(navigator.userAgent)
);

window.addEventListener('resize', function () {
  ScreenParams.setWidth = this.window.screen.width;
  ScreenParams.setHeight = this.window.screen.height;
});

export default ScreenParams;
