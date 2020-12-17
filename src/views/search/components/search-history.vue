<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell :title="searchHistory"
      @click="onSearchItemClick(searchHistory, index)"
      v-for="(searchHistory, index) in searchHistorys" :key="index">
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistorys: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 控制删除显示状态
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearchItemClick (searchHistory, index) {
      if (this.isDeleteShow) {
        // 如果是删除状态 删除这一项的历史记录
        this.searchHistorys.splice(index, 1)
      } else {
        // 如果不是删除状态 直接进入搜索状态
        this.$emit('search', searchHistory)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
