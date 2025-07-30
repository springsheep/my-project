<script setup lang="ts">
// import tabbar from "@/components/Tabbar/index.vue";
import { useCachedViewStore } from '@/store/modules/cachedView'
import { useDarkMode } from '@/hooks/useToggleDarkMode'
import { computed } from 'vue'

const cachedViews = computed(() => {
      return useCachedViewStore().cachedViewList
})
</script>

<template>
      <div class="app-wrapper">
            <!-- <van-watermark content="Vant" opacity="0.1"></van-watermark> -->
            <van-config-provider theme="light" class="flex flex-col items-center">
                  <!-- <nav-bar /> -->

                  <router-view v-slot="{ Component }">
                        <keep-alive :include="cachedViews">
                              <component :is="Component" class="flex-1 w-full" />
                        </keep-alive>
                  </router-view>
                  <!-- <tabbar /> -->
            </van-config-provider>
      </div>
</template>

<style lang="less" scoped>
@import '@/styles/mixin.less';

.app-wrapper {
      .clearfix();
      position: relative;
      height: 100%;
      width: 100%;
}
:deep(.van-config-provider) {
      @apply h-full;
}
</style>
