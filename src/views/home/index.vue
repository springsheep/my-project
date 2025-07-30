<template>
      <div class="h-full flex flex-col bg-[#f7f8fa]">
            <!-- 顶部筛选栏 -->
            <div class="sticky top-0 z-10 bg-white p-1 flex flex-col items-stretch shadow-[0_2px_8px_0_rgba(0,0,0,0.03)] border-b border-[#f0f0f0]">
                  <div class="flex items-center gap-2.5 mb-2">
                        <van-field
                              v-model="searchParams.projectOrderNo"
                              label="项目号"
                              placeholder="请输入项目号"
                              clearable
                              @keyup.enter="onSearch"
                              class="flex-1 mb-0 [&_.van-field__label]:min-w-[60px] [&_.van-field__label]:text-[#666] [&_.van-field__label]:text-[13px] [&_.van-field__control]:text-[13px]"
                        />
                        <!-- <van-button type="primary" size="small" @click="goToQrcode" class="flex-shrink-0 min-w-[70px] text-[13px]" icon="qr"> 二维码 </van-button> -->
                  </div>
                  <transition name="fade">
                        <div v-if="showMoreFilter" class="w-full flex flex-col">
                              <van-field
                                    v-model="searchParams.projectName"
                                    label="项目名称"
                                    placeholder="请输入项目名称"
                                    clearable
                                    @keyup.enter="onSearch"
                                    class="w-full mb-2 [&_.van-field__label]:min-w-[60px] [&_.van-field__label]:text-[#666] [&_.van-field__label]:text-[13px] [&_.van-field__control]:text-[13px]"
                              />
                              <van-field
                                    v-model="searchParams.consigneeAddress"
                                    label="收货地址"
                                    placeholder="请输入收货地址"
                                    clearable
                                    @keyup.enter="onSearch"
                                    class="w-full mb-2 [&_.van-field__label]:min-w-[60px] [&_.van-field__label]:text-[#666] [&_.van-field__label]:text-[13px] [&_.van-field__control]:text-[13px]"
                              />
                        </div>
                  </transition>
                  <div class="flex items-center mt-0.5 justify-end">
                        <van-button type="primary" size="small" @click="onSearch" class="mr-2 min-w-[56px] text-[13px] px-2 mb-0"> 查询 </van-button>
                        <van-button size="small" @click="onReset" class="mr-2 min-w-[56px] text-[13px] px-2 mb-0"> 重置 </van-button>
                        <van-button size="small" class="min-w-[48px] text-[13px] text-[#1989fa] border-none bg-transparent shadow-none px-1 filter-btn" @click="showMoreFilter = !showMoreFilter" plain>
                              {{ showMoreFilter ? '收起' : '展开' }}
                        </van-button>
                  </div>
            </div>
            <div class="flex-1 overflow-y-auto p-2 min-h-0" ref="scrollContentRef">
                  <van-list v-model:loading="loading" :finished="finished" @load="handleLoad" :immediate-check="false" :offset="100" ref="vanListRef">
                        <template v-if="cardList.length > 0">
                              <van-card v-for="(item, idx) in cardList" :key="item.projectOrderNo || idx" class="mb-2 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-lg bg-white">
                                    <template #title>
                                          <div class="flex items-center justify-between">
                                                <span class="text-[16px] font-semibold mr-2 leading-5 text-[#222] flex-1 whitespace-normal break-all"> 项目号: {{ item.projectOrderNo || '-' }} </span>
                                                <van-tag color="#1989fa" text-color="#fff" class="align-middle ml-0.5 text-[12px] px-[8px] h-2 rounded-lg flex-shrink-0 !bg-[#1989fa] !text-white">
                                                      状态:{{ item.status || '-' }}
                                                </van-tag>
                                          </div>
                                    </template>
                                    <template #desc>
                                          <div class="text-[#666] mb-2 text-[13px]">
                                                <div class="block break-all mb-1">
                                                      <span class="inline-block min-w-[72px] text-[#888]">项目名称：</span>
                                                      <span class="inline-block text-[#333] break-all">{{ item.projectName || '-' }}</span>
                                                </div>
                                                <div class="flex mb-1">
                                                      <span class="min-w-[72px] text-[#888]">物料：</span>
                                                      <span class="text-[#333] flex-1">{{ item.goodsName || '-' }}</span>
                                                </div>
                                                <div class="flex mb-1">
                                                      <span class="min-w-[72px] text-[#888]">发货日期：</span>
                                                      <span class="text-[#333] flex-1">
                                                            {{ item.actualDepartureTime ? formatDate(item.actualDepartureTime) : '-' }}
                                                      </span>
                                                </div>
                                                <div class="flex mb-1">
                                                      <span class="min-w-[72px] text-[#888]">到货日期：</span>
                                                      <span class="text-[#333] flex-1">
                                                            {{ item.actualArrivalTime ? formatDate(item.actualArrivalTime) : '-' }}
                                                      </span>
                                                </div>
                                                <div class="flex mb-1">
                                                      <span class="min-w-[72px] text-[#888]">地址：</span>
                                                      <span class="text-[#333] flex-1">{{ item.consigneeAddress || '-' }}</span>
                                                </div>
                                                <div class="flex mb-1">
                                                      <span class="min-w-[72px] text-[#888]">数量：</span>
                                                      <span class="text-[#333] flex-1">{{ item.allQuantity ?? '-' }}</span>
                                                </div>
                                          </div>
                                    </template>
                              </van-card>
                        </template>
                        <template v-else>
                              <van-empty description="暂无数据" />
                        </template>
                  </van-list>
            </div>
      </div>
</template>

<script setup lang="ts">
import { showNotify } from 'vant'
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GYOrderPageGet } from '@/services/btp.ts'

defineOptions({
      name: 'FundContent',
})

interface CardItem {
      projectOrderNo?: string | null
      projectName?: string | null
      status?: string | null
      goodsName?: string | null
      actualDepartureTime?: number | null
      actualArrivalTime?: number | null
      consigneeAddress?: string | null
      allQuantity?: number | null
}

const cardList = ref<CardItem[]>([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = 5

// 查询参数
const searchParams = ref({
      projectName: '', // 项目名称，模糊查询
      projectOrderNo: '', // 项目单号，模糊查询
      consigneeAddress: '', // 收货地址，模糊查询
})

// 控制展开/收起
const showMoreFilter = ref(false)

function formatDate(ts: number | null | undefined) {
      if (!ts) return '-'
      const date = new Date(ts)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
}

const scrollContentRef = ref<HTMLElement | null>(null)
const vanListRef = ref<any>(null)
const router = useRouter()

const goToQrcode = () => {
      router.push('/qrcode')
}

const onSearch = async () => {
      page.value = 1
      finished.value = false
      cardList.value = []
      loading.value = false
      await nextTick()
      triggerListCheck()
}

const onReset = () => {
      searchParams.value.projectName = ''
      searchParams.value.projectOrderNo = ''
      searchParams.value.consigneeAddress = ''
      onSearch()
}

const handleLoad = async () => {
      loading.value = true

      try {
            // 构造接口参数，自动添加前后模糊匹配
            const params = {
                  projectName: searchParams.value.projectName ? searchParams.value.projectName : undefined,
                  projectOrderNo: searchParams.value.projectOrderNo ? searchParams.value.projectOrderNo : undefined,
                  consigneeAddress: searchParams.value.consigneeAddress ? searchParams.value.consigneeAddress : undefined,
                  currentPage: page.value,
                  pageSize: pageSize,
            }
            const res = await GYOrderPageGet(params)
            // 新接口返回结构为 { orderList: CardItem[], countPage: number }
            // 由于GYOrderPageGet返回的是AxiosResponse，需要取data字段
            const data = res?.data ?? {}
            const records: CardItem[] = data.orderList || []
            if (page.value === 1) {
                  cardList.value = records
            } else {
                  cardList.value = cardList.value.concat(records)
            }
            if (!records.length || records.length < pageSize) {
                  finished.value = true
            } else {
                  page.value++
            }
      } catch (e) {
            console.log(e)
            finished.value = true
      } finally {
            loading.value = false
            await nextTick()
            triggerListCheck()
      }
}

// 主动触发 van-list 的滚动检查
function triggerListCheck() {
      const el = scrollContentRef.value
      if (el) {
            const evt = new Event('scroll', { bubbles: true })
            el.dispatchEvent(evt)
      }
      if (vanListRef.value && typeof vanListRef.value.check === 'function') {
            vanListRef.value.check()
      }
}

// onMounted(async () => {
//       handleLoad()
// })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
      transition: all 0.2s;
}
.fade-enter-from,
.fade-leave-to {
      opacity: 0;
      height: 0;
      transform: scaleY(0.95);
}
.fade-enter-to,
.fade-leave-from {
      opacity: 1;
      height: auto;
      transform: scaleY(1);
}
</style>
