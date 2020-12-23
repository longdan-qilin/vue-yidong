<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      left-arrow
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="update">
      <van-field
        v-model.trim="localname"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!--/ 输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'updateName',
  components: {},
  props: {
    value: {
      tyep: String,
      required: true
    }
  },
  data () {
    return {
      localname: this.value
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
        // 修改昵称不能为空
        if (!this.localname.length) {
          this.$toast('昵称不能为空')
          return
        }
        // 请求修改昵称
        await updateUserProfile({
          name: this.localname
        })
        // 通过父组件修改数据
        this.$emit('input', this.localname)
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
    }
  }
}
</script>

<style lang="less" scoped>
.update {
  padding: 20px;
}
</style>
