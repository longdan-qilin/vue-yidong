<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button @click="onPost" class="post-btn" :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
import { addComments } from '@/api/common'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    // 接收父组件传的 文章id
    target: {
      type: [String, Object, Number],
      required: true
    }
  },
  // 可以使用 inject 选项来接收指定的我们想要添加在这个实例上的 property：
  inject: ['articleId'],
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 发布添加评论
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '发布中...'
      })
      try {
        const { data } = await addComments({
          target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          /* 文章id，对评论内容发表回复时，需要传递此参数，
          表明所属文章id。对文章进行评论，不要传此参数。 */
          art_id: this.articleId ? this.articleId.toString() : this.articleId
        })
        console.log(data)
        // 关闭弹出层
        // 将发布内容显示到列表数据顶部
        // 清空数据
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast.success('发布评论成功')
      } catch (err) {
        // console.log(err)
        this.$toast.fail('发布评论失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
