<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <div slot="left" @click="onClickLeft">
        <van-icon name="arrow-left" />
      </div>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- 模板中的 $event 是事件参数
          当我们传递给子组件的数据既要使用还要修改
          传递：props
          :is-followd='article.is_followed'
          修改：自定义事件
          @update-is-followed='article.is_followed = $event'
          简写方式：在组件上使用 v-model
          value='artice.is_follwed'
          @input='article.is_follwed = $event'
          此处省略.....
          @update-is_followed="article.is_followed = $event"
          -->
          <!-- 一个组件只能使用一次v-model 如果有多个数据需要实现类似于 v-model
          的效果 咋办？ 可以使用属性的 .sync 修饰符
           -->
          <follow-user :user-id="article.aut_id" v-model="article.is_followed" class="follow-btn" />
          <!-- <van-button v-if="article.is_followed" class="follow-btn"
          round size="small" @click="onAllow" :loading="loadfllow">已关注</van-button>
          <van-button v-else class="follow-btn" type="info" color="#3296fa"
          round size="small" @click="onAllow" icon="plus" :loading="loadfllow">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          ref="article-content"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small">写评论</van-button>
          <van-icon name="comment-o" badge="123" color="#777" />
          <collect-article v-model="article.is_collected" :articleId='article.art_id' class="btn-item" />
          <like-article v-model="article.attitude" :articleId='article.art_id' class="btn-item" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="this.errstatus" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArtcileInfo">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import followUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
// 加载图片预览
import { ImagePreview } from 'vant'
// ImagePreview({
//   images: [
//     'https://img.yzcdn.cn/vant/apple-1.jpg',
//     'https://img.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 图片初始位置
//   startPosition: 0
// })

export default {
  name: 'ArticleIndex',
  components: {
    followUser,
    CollectArticle,
    LikeArticle
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      // 文章详情
      article: '',
      // 默认加载loading
      loading: true,
      // 默认err状态
      errstatus: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    // 调用加载文章详情的函数
    this.loadArtcileInfo()
  },
  mounted () {},
  methods: {
    onClickLeft () {
      this.$toast('返回')
      this.$router.back()
    },
    // 获取文章详情
    async loadArtcileInfo () {
      // 展示加载状态
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId + '')
        console.log(data)
        // if (Math.random() > 0.5) {
        //   JSON.parse('sefsferfeferfe')
        // }
        // 数据驱动视图这件事儿不是立即的
        this.article = data.data

        // 初始化图片点击预览  因为延迟问题有判定
        // 因此图片是等数据驱动完成才能渲染的有顺序 不能立即拿到的 弄个异步延时器即可
        setTimeout(() => {
          this.PreviewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errstatus = 404
        }
        console.log('获取文章失败', err)
      }
      // 不管成功还是失败 加载loading都要关闭
      this.loading = false
    },
    // 预览图片
    PreviewImage () {
      // 获取文章内容dom
      const articleCotent = this.$refs['article-content']
      // dom中获取 所有img元素
      console.log(articleCotent)
      const imgs = articleCotent.querySelectorAll('img')
      console.log(imgs)
      // 获取所有图片的地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每张图片注册点击事件
        img.onclick = () => {
          ImagePreview({
            // 预览图片的地址数组
            images,
            // 图片初始位置
            startPosition: index
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./git-markdown.css');
.article-container {
  /deep/ .van-nav-bar__left {
    position: absolute;
    top: 14px;
    flex: unset;
    .van-icon-arrow-left {
      font-size: 50px;
      color: #e22829;
    }
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
