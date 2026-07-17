// 停车缴费业务逻辑：查询费用 → 密码校验 → 确认支付
import { reactive, ref } from 'vue'
import {
  haveCoupon,
  getMoney,
  findMerPassword,
  findMerPassWordUser,
  payConfirmTime,
  getMerFreemin
} from '../api/parking'

export function useParking({ plate, message, merchant }) {
  // 订单信息
  const order = reactive({
    orderid: '',
    price: '查询中',
    carNo: '',
    company: '',
    time: '',
    hoursec: '时长计算中..'
  })

  const orderVisible = ref(false) // 是否显示订单信息
  const queryDone = ref(false) // 查询完成（控制按钮组切换）
  const showPasswordModal = ref(false) // 是否显示随机码弹窗
  const loading = ref(false)

  // 查询停车费
  async function query() {
    const carNo = plate.carNo.value
    if (!plate.isValid.value) {
      message.showMessage('车牌错误！')
      return
    }
    loading.value = true
    try {
      // 1. 校验是否已领取优惠券
      const couponRes = await haveCoupon({
        merchantid: merchant.merchantId,
        carNum: carNo
      })
      if (couponRes.code == 200 && couponRes.data >= 1) {
        message.showMessage('已领取优惠券，不能代付')
        return
      }

      // 2. 查询停车费用
      const moneyRes = await getMoney({
        merchantid: merchant.merchantId,
        carNumber: carNo
      })
      if (moneyRes.wait_price === undefined) {
        message.showMessage('查询失败，请重试')
        return
      }
      const waitprice = parseInt(moneyRes.wait_price)
      if (waitprice === -1) {
        message.showMessage('商户不存在,请联系管理员')
        return
      }
      if (waitprice === -2) {
        message.showMessage('该商户没有绑定此停车场')
        return
      }
      // 0 或正数：展示订单
      order.orderid = moneyRes.id
      order.price = moneyRes.wait_price
      order.carNo = moneyRes.car_number
      order.company = moneyRes.company
      order.time = moneyRes.create_time
      order.hoursec = moneyRes.time
      orderVisible.value = true
      queryDone.value = true
      plate.closeKeyboard()

      // 3. 查询商户是否需要弹窗输入随机码
      const passRes = await findMerPassword({ merchantid: merchant.merchantId })
      if (passRes.code == 200 && passRes.data >= 1) {
        showPasswordModal.value = true
      }
    } catch (e) {
      console.error(e)
      message.showMessage('网络错误，请重试')
    } finally {
      loading.value = false
    }
  }

  // 校验随机码
  async function verifyPassword(numberStr) {
    loading.value = true
    try {
      const res = await findMerPassWordUser({
        orderid: order.orderid,
        numberpass: numberStr,
        merchantid: merchant.merchantId
      })
      if (res.code == 200) {
        showPasswordModal.value = false
        return true
      }
      if (res.code == '423') {
        message.showMessage('随机码错误,请重新输入')
        return false
      }
      message.showMessage('校验失败，请重试')
      return false
    } catch (e) {
      message.showMessage('网络错误，请重试')
      return false
    } finally {
      loading.value = false
    }
  }

  // 确认支付
  async function pay() {
    if (!order.orderid) {
      message.showMessage('订单不存在或未点击查询费用')
      return
    }
    loading.value = true
    try {
      const res = await payConfirmTime({
        timese: order.time,
        orderid: order.orderid,
        merchantid: merchant.merchantId
      })
      if (res.code == '200') {
        if (res.data == 2) {
          message.showMessage('余额不足,请充值')
        } else if (res.data == 3) {
          message.showMessage('请登录商户系统绑定对应停车场')
        } else if (res.data == 4) {
          message.showMessage('该商户不存在,请联系系统管理员')
        } else {
          // 代付成功，查询免费离场时长
          const freeRes = await getMerFreemin({
            orderid: order.orderid,
            merchantid: merchant.merchantId
          })
          if (freeRes.code == 200) {
            message.showMessage('代付成功，请在' + freeRes.data + '分钟内出场', 3000)
          } else {
            message.showMessage('代付成功，请在15分钟内出场', 3000)
          }
        }
      } else if (res.code == '300') {
        message.showMessage('先查询订单,再进行支付')
      } else if (res.code == '418') {
        message.showMessage('车辆已在黑名单，无法进行商户代扣')
      } else if (res.code == '419') {
        message.showMessage('已支付，请勿重新支付')
      } else if (res.code == '420') {
        message.showMessage('已超过商户代扣时间，请联系工作人员')
      } else if (res.code == '422') {
        message.showMessage('已超过商户代扣次数')
      } else {
        message.showMessage('网络错误，请联系系统管理员')
      }
    } catch (e) {
      console.error(e)
      message.showMessage('网络错误，请联系系统管理员')
    } finally {
      loading.value = false
    }
  }

  // 重置查询
  function resetQuery() {
    orderVisible.value = false
    queryDone.value = false
    showPasswordModal.value = false
    order.orderid = ''
    order.price = '查询中'
    order.carNo = ''
    order.time = ''
    order.hoursec = '时长计算中..'
    plate.reset()
  }

  return {
    order,
    orderVisible,
    queryDone,
    showPasswordModal,
    loading,
    query,
    verifyPassword,
    pay,
    resetQuery
  }
}
