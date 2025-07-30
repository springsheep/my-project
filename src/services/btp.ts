import { GYOrderPage } from './api'
import { request, METHOD } from '@/utils/request'
/*
 * @Description: 手工添加行程
 */
export function GYOrderPageGet(data: Object) {
      return request(GYOrderPage, METHOD.GET, data)
}
