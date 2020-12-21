<template>
<!-- 只有 list  在可视范围内才会检查滚动位置触发 onload
  是否在初始化时立即执行滚动位置检查 immediate-check
-->
  <van-list
    v-model="loading"
    :finished="finished"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    finished-text="没有更多了"
    :immediate-check = 'false'
    @load="onLoad"
  >
    <comment-item
    @reply-click="$emit('reply-click', $event)"
    v-for="(item, index) in list" :key="index" :comment="item" />
  </van-list>
</template>

<script>
import { getCommonts } from '@/api/common'
import CommentItem from '../comment-item'

export default {
  name: 'CommonList',
  components: {
    CommentItem
  },
  props: {
    // 获取文章或则评论id
    source: {
      type: [String, Object, Number],
      required: true
    },
    // 获取评论列表
    list: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => []
    },
    // 评论类型
    type: {
      type: String,
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10, // 每次获取评论的个数
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 当你手动初始 onload的话 他不会自动开始初始的 loading
    this.loading = true
    // 立即调用 刚进入页面就可以看到条数
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 获取的文章的评论和获取评论的回复是同一个接口
        // 唯一的区别的是接口参数不同
        // type a 文章的评论 c 评论的回复
        // source
        // 1. 请求获取数据
        const { data } = await getCommonts({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data)
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 通过$emit传参给父组件
        this.$emit('update-count', data.data)
        // 3. 关闭加载loading
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 有数据 就更新下一页的数据
          this.offset = data.data.last_id
        } else {
          // 没有数据 就finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 关闭加载loading
        this.loading = false
        console.log('加载失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
