<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- /子路由出口 -->

    <!-- 标签导航栏 -->
    <!-- route 路由模式 通过to 来跳转其他页面 -->
    <van-tabbar v-model="active" class="layout-tabbar" route>
      <van-tabbar-item to='/'>
        <i slot="icon" class="toutiao toutiao-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item icon="search" to='/qa'>
        <i slot="icon" class="toutiao toutiao-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item icon="search" to='/video'>
        <i slot="icon" class="toutiao toutiao-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item icon="search" to='/my'>
        <i slot="icon" class="toutiao toutiao-wode"></i>
        <span class="text">{{$store.state.user ? '我的' :'未登录' }}</span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- /标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  props: {},
  data () {
    return {
      // v-model 默认绑定选中标签的索引值，
      // 通过修改 v-model 即可切换选中的标签。默认选中索引0
      active: 0
    }
  },
  methods: {},
  computed: {},
  created () {}
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
  }
  span.text {
    font-size: 20px;
  }
}
</style>
