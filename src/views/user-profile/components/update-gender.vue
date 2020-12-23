<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      :default-index= value
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'updateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localgender: this.value
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
        // 请求修改昵称
        await updateUserProfile({
          gender: this.localgender
        })
        // 通过父组件修改数据
        this.$emit('input', this.localgender)
        // 关闭弹出层
        this.$emit('close')
        // 更新成功
        this.$toast.success('更新成功')
      } catch (err) {
        /* 更新失败 */
        this.$toast.fail('更新失败')
        // 关闭弹出层
        this.$emit('close')
      }
    },
    onChange (picker, value, index) {
      console.log(picker)
      console.log(value)
      this.localgender = index
    }
  }
}
</script>

<style lang="less" scoped></style>
