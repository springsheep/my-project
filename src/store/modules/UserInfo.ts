import { defineStore } from 'pinia'
export const useUserInfo = defineStore({
      id: 'UserInfo',
      state: () => {
            return {
                  // 用于初始化空列表
                  userList: [] as UserInfo[],
                  // 用于尚未加载的数据
                  user: null as UserInfo | null,
                  Authorization: '' as UserInfo | '',
                  userInfoData: {} as UserInfo | {},
                  redirectUrl: '' as UserInfo | '',
                  code: '',
            }
      },
      getters: {},
      actions: {},
})

interface UserInfo {
      name: string
      age: number
      userInfoData: Object
      Authorization: string
      redirectUrl: string
}
