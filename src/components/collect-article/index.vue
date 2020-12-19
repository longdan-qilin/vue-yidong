<template>
  <div class="collect-article">
    <van-button
      class="btn"
      :icon= "value ? 'star' : 'star-o'"
      :class = "{
        collect : value
      }"
      :loading="loading"
      @click="onCollect"
      native-type="button"
    />
  </div>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/user'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Object, Number],
      required: true
    }
  },
  data () {
    return {
      // 收藏加载状态
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onCollect () {
      this.loading = true // 改变之前 加载的状态
      try {
        if (this.value) {
          // 已经收藏 取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏 添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图 自定义事件修改数据并不是立即的
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        console.log('操作失败，请稍后再试', err)
      }
      this.loading = false //  改变完成 加载的状态
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  border: none;
}

.collect {
  .van-icon {
    color: #ffa500;
  }
}
</style>
