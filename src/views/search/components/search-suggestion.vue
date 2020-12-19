<template>
  <div class="search-suggestion">
    <van-cell icon="search" @click="$emit('search', text)" v-for="(text, index) in suggestions" :key="index">
      <div slot="title" v-html="hightlight(text)"></div>
    </van-cell>
    <!-- 双花括号不会解析html直接输出纯文本  而v-html指令 会解析html-->
    <!-- <div v-html="htmlStr"></div> -->
    <!-- <div>{{htmlStr}}</div> -->
  </div>
</template>

<script>
// 到入请求联想建议接口
import { geSearchSuugestions } from '@/api/search'
// 按需加载有好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 联想建议数据列表
      suggestions: []
      // htmlStr: 'Hello <span style="color:red">world</span>'
    }
  },
  computed: {},
  watch: {
    // 当 searchText 发生变化时 就会调用 handler 函数
    searchText: {
      // handler 函数名称是固定的
      // debounce 函数 参数1：一个函数 参数2：延迟时间，单位是毫秒 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 1200),
      /*    handler(value) {
        this.loadSearchSuggestions(value)
      } */
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 获取联想建议数据列表
    async loadSearchSuggestions (q) {
      try {
        const { data } = await geSearchSuugestions(q)
        console.log(data)
        const { options } = data.data
        // 得到的数据传到定义的数组
        this.suggestions = options
      } catch (err) {
        this.$toast('请求失败，请稍后重试')
      }
    },
    // 关键字高亮效果
    hightlight (text) {
      // 创建匹配对应文本的替换文本
      const HighLightStr = `<span class='active'>${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会当做匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式  则手动 new RegExp
      //  new RegExp  new 一个正则表达式 构造函数
      // 参数1：匹配模式字符串 他会根据这个字符串创建正则对象
      // 参数2：匹配模式 写到字符串中
      const str = this.searchText.replace(/([*.?+$^(){}|\\/])/g, '\\$1')
      // 创建匹配对应文本的正则表达式
      const reg = new RegExp(str, 'gi')
      return text.replace(reg, HighLightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
