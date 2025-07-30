<template>
  <van-tabbar v-model="active" :placeholder="true" :route="true" fixed>
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :icon="item.icon"
      :to="item.to"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const active = ref(0);
const tabbarData = reactive([
  {
    icon: "wap-home-o",
    title: "夜宵领取",
    to: {
      name: "Payment"
    }
  },
  {
    icon: "gem-o",
    title: "领取记录",
    to: {
      name: "Tools"
    }
  },
  {
    icon: "user-o",
    title: "领取成功",
    to: {
      name: "scan"
    }
  },
  {
    icon: "user-o",
    title: "领取失败",
    to: {
      name: "About"
    }
  }
]);
</script>
