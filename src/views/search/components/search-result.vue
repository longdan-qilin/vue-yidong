<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished"
    :error.sync="error" error-text="请求失败，点击重新加载"
    finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
// 加载搜索结果接口
import { geSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页数，不传默认为1
      per_page: 20, // 页数量，不传每页数量由后端决定
      error: false // 默认 错误提示false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await geSearchResult({
          page: this.page, // 本页
          per_page: this.per_page, // 页面总数
          q: this.searchText // 关键词
        })
        // 检测失败的后果 展示
        if (Math.random() > 0.5) {
          JSON.parse('sefsferfeferfe')
        }
        // console.log(data)
        // 2. 将数据添加到数组中
        const { results } = data.data
        this.list.push(...results)
        // 停止加载loading 关闭
        this.loading = false
        // 4. 判断是否还有数据
        // 如果有 更新获取下一个数据的页码
        // 如果没有 则将加载状态finished  设置为结束
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        // 提示错误消息
        this.error = true
        // 关闭loading 加载
        this.loading = false
        // this.$toast('加载失败，请稍后再试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
