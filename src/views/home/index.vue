/* eslint-disable no-irregular-whitespace */
<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round icon="search" to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表
    通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签
    通过animated属性可以开启切换标签内容时的转场动画
    通过swipeable属性可以开启滑动切换标签页
    swipe-threshold='3' 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动
    -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable swipe-threshold="3">
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 文章列表 -->
        <!-- channel 文章列表要知道是哪个频道列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="ischannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- / 频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup v-model="ischannelEditShow" closeable position="bottom" close-icon-position="top-left" :style="{ height: '100%' }">
      <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive" @update-delete="updateDelete"></channel-edit>
    </van-popup>
    <!-- /频道编辑弹出层  -->

    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- /子路由出口 -->
  </div>
</template>

<script>
// 1. 导入 获取频道列表的方法
import { getUserChannels } from '@/api/user.js'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
export default {
  name: 'HomeIndex',
  props: {},
  data () {
    return {
      active: 0,
      // 4. 定义数据接收频道列表
      channels: [],
      // 是否显示弹出层
      ischannelEditShow: false
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    // 3. 调用加载频道列表数据的方法
    this.loadChannels()
  },
  methods: {
    // 2. 定义加载频道列表数据的方法
    async loadChannels () {
      try {
        let channels = []
        if (this.user) {
          // 登录状态
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录状态
          const loadChannels = getItem('TOUTIAO-CHANNELS')
          if (loadChannels) {
            // 本地存储有数据  直接获取
            channels = loadChannels
          } else {
            // 本地存储没有数据 请求数据
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    // 通过自定义事件 接受子组件传参index 改变父组件active
    onUpdateActive (index, ischannelEditShow) {
      this.active = index
      // 编辑状态 弹出层还在 不是编辑状态 弹出层隐藏
      this.ischannelEditShow = ischannelEditShow
    },
    // 删除我的频道 通过子组件传递的id
    updateDelete (id) {
      const index = this.channels.findIndex(item => item.id === id)
      this.channels.splice(index, 1)
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-bottom: 100px;
  padding-top: 180px;
  // 导航栏样式
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  // 频道列表样式
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 2;
      width: 100%;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
