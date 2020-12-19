<template>
  <div class="search-container">
    <!-- Tips: 在 van-search 外层增加 form 标签，
    且 action 不为空，即可在 iOS 输入法中显示搜索按钮
    @focus='isResultShow = false 获得焦点 搜索结果隐藏
    -->
    <!-- 搜索栏 -->
    <form class="search-form" action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @focus="isResultShow = false" background="#3296fa" @search="onSearch" @cancel="onCancel" />
    </form>
    <!-- / 搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText"></search-result>
    <!-- / 搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" @search="onSearch" :searchText="searchText"></search-suggestion>
    <!-- / 联想建议 -->

    <!-- 历史记录 -->
    <search-history v-else @search='onSearch' @clear-search-histories='searchHistorys = []' :searchHistorys='searchHistorys'></search-history>
    <!-- / 历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'searchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  props: {},
  data () {
    return {
      // 搜索输入框的文本
      searchText: '',
      // 搜索结果是否存在
      isResultShow: false,
      // 搜索历史记录  在本地存储中获得
      searchHistorys: getItem('TOUTIAO-SEARCH-HISTORYS')
    }
  },
  computed: {},
  watch: {
    // 首先要观测有关历史记录的数据变化 这个用watch
    searchHistorys (value) {
      // 打印出来 发现可以观测
      // console.log('ss')
      setItem('TOUTIAO-SEARCH-HISTORYS', value)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (value) {
      // console.log(value)
      // 更新文本框的内容
      this.searchText = value
      // 存储搜索历史记录
      // 要求：不要重复历史记录 最新的排在最前面
      // 展示搜索结果
      // const index = this.searchHistorys.indexOf(value)
      // if (index !== -1) {
      //   this.searchHistorys.splice(index, 1)
      // }
      this.searchHistorys.unshift(value)
      this.searchHistorys = [...new Set(this.searchHistorys)]
      console.log(this.searchHistorys)
      // 搜索结果是否存在
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    .van-search__action {
      color: #fff;
    }
  }
}
</style>
