<template>
  <div class="like-article">
    <van-button
      :icon="value === 1 ? 'good-job' : 'good-job-o'"
      :class="{
        liked: value === 1
      }"
      class="btn"
      :loading="loading"
      @click="onCollect"
      native-type="button"
    />
  </div>
</template>

<script>
import { addLike, deleteLike } from '@/api/user'

export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [String, Object, Number],
      required: true
    }
  },
  data () {
    return {
      // 点赞加载状态
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCollect () {
      // 点击后 如果网络不好的话 加载状态
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已经点赞 取消点赞
          await deleteLike(this.articleId)
        } else {
          // 没有点赞 添加点赞
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        console.log('操作失败', err)
        this.$toast.fail('操作失败')
      }
      // 事件完成 如果网络不好的话 加载状态
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  border: none;
}
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
