<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'updateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击完成按钮 请求接口修改用户信息
    async onConfirm () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁止背景点击
        message: '保存中...'
      })
      try {
        // 因为格式不是字符串 而是日期对象 用dayjs 去转换
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        // 请求修改昵称
        const { data } = await updateUserProfile({
          birthday: currentDate
        })
        console.log(data)
        // 通过父组件修改数据
        this.$emit('input', currentDate)
        // 关闭弹出层
        this.$emit('close')
        // 更新成功
        this.$toast.success('更新成功')
      } catch (err) {
        /* 更新失败 */
        this.$toast.fail('更新失败')
        console.log(err)
        // 关闭弹出层
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
