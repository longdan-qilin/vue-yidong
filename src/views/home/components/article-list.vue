<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <!-- list列表区域 -->
    <!-- 错误提示 refresh 下拉刷新时触发-->
    <van-pull-refresh v-model="isreFreshLoading" :success-text="reFreshSuccessText" success-duration="1500" @refresh="onRefresh">
      <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <article-item v-for="(article,index) in list" :key="index" :article='article'></article-item>
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 是否加载失败
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      reFreshSuccessText: ''
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      try {
        // 1. 异步更新数据 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // console.log(data)

        // if (Math.random() > 0.5) {
        //   JSON.parse('sefsferfeferfe')
        // }

        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        // 把列表数据解构出 ...数组的展开操作符 表示数组里的数据一个个的传入
        this.list.push(...results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        // loading 关闭以后才能触发下一次的加载更多
        this.loading = false
        // 4. 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = results.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        // console.log('获取文章列表失败！', err)
        // this.$toast('获取文章列表失败！')
        // 加载失败提示语
        this.error = true
        // 关闭加载loading
        this.loading = false
      }
    },
    // 下拉刷新时触发的函数
    async onRefresh () {
      // 1. 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 下拉刷新时每次请求的最新的数据 所以是当前的最新的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        console.log(data)
        // 测试 刷新失败
        if (Math.random() > 0.2) {
          JSON.parse('sefsferfeferfe')
        }

        // 2. 将数据追加到列表顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3. 关闭下拉刷新的 loading状态
        this.isreFreshLoading = false
        // 4. 更新提示成功的文本
        this.reFreshSuccessText = `刷新文章成功，刷新${results.length}条`
      } catch (err) {
        console.log('刷新文章失败', err)
        // 关闭下拉刷新的 loading状态
        this.reFreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
