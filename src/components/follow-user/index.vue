<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    @click="onAllow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    @click="onAllow"
    icon="plus"
    :loading="loading"
    >关注</van-button
  >
</template>

<script>
// 导入关注功能接口 onAllow
import { addFllow, deleteFllow } from '@/api/user'
export default {
  name: 'followUser',
  components: {},
  model: {
    prop: 'isFollowed',
    event: 'update-is_followed'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [String, Object, Number],
      required: true
    }
  },
  data () {
    return {
      // 按钮的加载状态
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 关注功能
    async onAllow () {
      this.loading = true // 展开按钮 的加载状态
      try {
        if (this.isFollowed) {
          // 已经关注 取消关注
          await deleteFllow(this.userId)
        } else {
          // 未关注 添加关注
          await addFllow(this.userId)
        }
        // 通过取反 来实现 关注和不关注的切换 更新视图状态
        // this.isFollowed = !this.article.isFollowed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请稍后再试'
        // 用户不能关注自已
        if (err.response && err.response.status === 400) {
          message = '你不能关注自已'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭按钮 的加载状态
    }
  }
}
</script>

<style lang="less" scoped></style>
