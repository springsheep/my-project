<template>
      <div class="flex flex-col items-center justify-center min-h-screen bg-[#f7f8fa]">
            <van-empty image="error" :image-size="160" description="抱歉，您没有访问权限">
                  <template #description>
                        <div class="text-gray-500 mt-2">请联系管理员获取相应权限</div>
                  </template>
            </van-empty>
      </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
</script>

<style scoped>
.min-h-screen {
      min-height: 100vh;
}
</style>
