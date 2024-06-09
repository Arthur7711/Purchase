<script setup lang="ts">
import GreenRounded from '../../../components/icons/GreenRounded.vue';
import Bag from '../../../components/icons/Bag.vue';
import PinkRounded from '../../../components/icons/PinkRounded.vue';
import MaskRounded from '../../../components/icons/MaskRounded.vue';
import ProgressCustom from '../../../components/progressCustom/ProgressCustom.vue';

defineProps<{
  data: {
    received_purchases_count: number;
    cancelled_purchases_count: number;
    pending_purchases_count: number;
  };
}>();
</script>
<template>
  <div class="procurement">
    <div class="sum">
      <Bag />
      <p>
        {{ $t('procurement') }}:
        {{
          data.received_purchases_count +
          data.cancelled_purchases_count +
          data.pending_purchases_count
        }}
      </p>
    </div>
    <div class="counts">
      <p>
        <GreenRounded />
        <span
          >{{ $t('successful') }}:
          <a href="">{{ data.received_purchases_count || 0 }}</a>
        </span>
      </p>
      <p>
        <PinkRounded />
        <span
          >{{ $t('canceled') }}: <a href="">{{ data.cancelled_purchases_count || 0 }}</a>
        </span>
      </p>
      <p>
        <MaskRounded />
        <span style=""
          >{{ $t('in process') }}:
          <a href=""> {{ data.pending_purchases_count || 0 }}</a>
        </span>
      </p>
    </div>
    <ProgressCustom
      :progress="{
        success: data.received_purchases_count,
        error: data.cancelled_purchases_count,
        pending: data.pending_purchases_count
      }"
      custom-width="100%"
      custom-height="20px"
    />
  </div>
</template>
<style scoped lang="scss">
.procurement {
  padding: 18px 24px 18px 24px;
  border-radius: 15px;
  border: 1px solid var(--vt-c-bold-gray);
  gap: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 22px 7px #d8dae066;
  .sum {
    display: flex;
    align-items: center;
    gap: 14px;
    p {
      font-size: 28px;
      font-weight: 600;
      line-height: 30px;
    }
  }
  .counts {
    p {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      span {
        color: var(--vt-c-tabs-gray);
      }
      a {
        color: var(--vt-c-electric-blue);
      }
    }
  }
}

@media only screen and (max-width: 650px) {
  .procurement {
    width: 98vw;
  }
}
</style>
