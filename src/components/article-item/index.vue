<template>
  <div>
    <!--
      cell单元格的to  属性和 vueRouter 中的RouterLink导航组件
      to属性用法是一样的 https://router.vuejs.org/zh/api/#router-link
      :to="'/article/' + article.art_id"
      :to="`/article/${article.art_id}`"
     -->
    <van-cell class="article-item" :to="{
      // 根据路由名称进行跳转
      name: 'article',
      // 传递路由动态参数
      params: {
      // 属性名：路由路径中设计的动态参数名称
      articleId: article.art_id
      }
    }">
      <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
      <div slot="label" class="label-info-wrap">
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
            <van-image class="cover-item-img" :src="img" />
          </div>
        </div>
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
      <!-- fit="cover" 已短边拉伸 -->
      <van-image v-if="article.cover.type === 1" class="right-cover" fit="cover" slot="default" :src="article.cover.images[0]" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  create () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.article-item {
  // 文章文字样式
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  // 单个图片容器样式
  .van-cell__value {
    // flex: unset;去除 flex布局
    flex: unset;
    width: 322px;
    height: 146px;
    padding-left: 25px;
  }
  // 单个图片样式
  .right-cover {
    width: 322px;
    height: 146px;
  }
  // 评论 时间 作者 样式
  .label-info-wrap span {
    font-size: 22px;
    margin-right: 25px;
    color: #b4b4b4;
  }

  // 三个图片容器样式
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
