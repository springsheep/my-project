<template>
      <div class="qrcode-page">
            <div class="qrcode-container">
                  <h2 class="qrcode-title">扫描二维码访问首页</h2>
                  <div class="qrcode-wrapper">
                        <canvas ref="qrcodeCanvas" class="qrcode-canvas"></canvas>
                  </div>
                  <p class="qrcode-desc">扫描上方二维码即可访问首页</p>
            </div>
      </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

const qrcodeCanvas = ref<HTMLCanvasElement>()

onMounted(async () => {
      if (qrcodeCanvas.value) {
            try {
                  // 生成home页面的完整URL
                  const homeUrl = `${window.location.origin}${import.meta.env.VITE_PUBLIC_PATH}/home`

                  await QRCode.toCanvas(qrcodeCanvas.value, homeUrl, {
                        width: 200,
                        margin: 2,
                        color: {
                              dark: '#000000',
                              light: '#FFFFFF',
                        },
                  })
            } catch (error) {
                  console.error('生成二维码失败:', error)
            }
      }
})
</script>

<style scoped lang="less">
.qrcode-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
}

.qrcode-container {
      background: white;
      border-radius: 16px;
      padding: 40px 30px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 100%;
}

.qrcode-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 30px;
      margin-top: 0;
}

.qrcode-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
}

.qrcode-canvas {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qrcode-desc {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.5;
}

// 暗色模式适配
.dark .qrcode-container {
      background: #1f2937;
      color: #f9fafb;
}

.dark .qrcode-title {
      color: #f9fafb;
}

.dark .qrcode-desc {
      color: #d1d5db;
}
</style>
