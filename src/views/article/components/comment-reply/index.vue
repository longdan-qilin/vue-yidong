<template>
  <div class="comment-reply">
    <!-- 导航 -->
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon slot="left" @click="$emit('close')" name="cross" />
    </van-nav-bar>
    <!-- / 导航 -->

    <div class="scroll-wrap">
      <!-- 评论项 -->
      <comment-item :comment="comment" />
      <!-- /评论项 -->

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <common-list type="c" :list="commentList" :source="comment.com_id" />
      <!-- /评论的回复列表 -->
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button @click="onPostWrap" round size="small" class="post-btn">写评论</van-button>
    </div>
    <!-- /发布评论 -->

    <!-- 发布评论弹出层 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post  @post-success="onPostSuccess" :target="comment.com_id" />
    </van-popup>
    <!-- 发布评论弹出层 -->
  </div>
</template>

<script>
import CommentItem from '../comment-item'
import CommonList from '../common-list'
import CommentPost from '../comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommonList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 弹出层显示与隐藏
      isPostShow: false,
      // 回复评论列表项
      commentList: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击展示回复评论
    onPostWrap () {
      this.isPostShow = true
    },
    onPostSuccess (data) {
      console.log(data)
      // 回复数量加1
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostShow = false
      // 把评论添加评论列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  right: 0;
  left: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  height: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
