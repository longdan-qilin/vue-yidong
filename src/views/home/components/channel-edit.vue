<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" round plain size="mini" class="edit-btn" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>

    <!-- 宫格区域 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item v-for="(channels, index) in myChannels" :key="index" class="grid-item" @click="onMyChannelClick(channels, index)">
        <!-- v-bind:class 语法
      一个对象，对象中的key 表示要作用的css类名 对象的中的value要计算除布尔值
      true 表示作用该类名 false 不作用类名
      <van-grid-item v-for="(channels, index) in myChannels" :class="{ active: index === active}" :key="index" icon="clear" class="grid-item">
       -->
        <!-- 通过自定义元素插槽 可以单独的控制 v-if等 -->
        <van-icon slot="icon" v-show="isEdit && !fixedChannels.includes(channels.id)" name="clear"></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{ channels.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格区域 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <!-- 宫格区域 -->
    <van-grid :gutter="10" class="recommoned-grid">
      <van-grid-item icon="plus" @click="onAddChannel(channel)" class="grid-item" v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" />
    </van-grid>
    <!-- /宫格区域 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannels } from '@/api/channel'
import { setItem } from '@/utils/storage'
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    // 通过自定义属性获取父组件的数据驼峰命名法
    myChannels: {
      type: Array,
      required: true
    },
    // 获取父组件自定义属性传参的数据
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 所有的频道列表
      AllChannels: [],
      // 控制编辑状态的显示
      isEdit: false,
      // 固定我的频道 不允许删除
      fixedChannels: [0]
    }
  },
  // 计算属性会观测内部数据依赖的变化 当能内部依赖数据发生变化时 计算属性会重新执行
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // 计算属性 频道推荐 = 所有频道 - 展示频道
      // return this.AllChannels.filter(channle => {
      //   return !this.myChannels.find(myChannel => {
      //     return myChannel.id === channle.id
      //   })
      // })
      // console.log(2)
      // 第三种方法
      return _.differenceBy(this.AllChannels, this.myChannels, 'id')
    }
    /*  recommendChannels () {
      // 计算属性 频道推荐 = 所有频道 - 展示频道
      const channels = []
      // foreach 遍历整个元素项 所有频道
      this.AllChannels.forEach(channel => {
        // 寻找符合条件的 符合的返回true
        // find 遍历 找到满足条件的元素项 满足条件是 展示频道返回这个结果,不满足返回unfined
        const ret = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        console.log(ret)
        // 如果取反此时 就是不满足条件的 就是推荐频道 元素push给定义的空数组
        if (!ret) {
          channels.push(channel)
        }
      })
      // 返回这个计算结果
      return channels
    } */
  },
  watch: {},
  created () {
    // 调用获取全部频道列表函数
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    // 获取全部频道列表
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.AllChannels = data.data.channels
        console.log(this.AllChannels)
      } catch (err) {
        console.log('获取数据失败', err)
        this.$toast('获取数据失败')
      }
    },
    // 推荐频道添加到我的频道
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求到接口放到线上
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          console.log('添加失败！', err)
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO-CHANNELS', this.myChannels)
      }
    },
    // 切换频道加上删除频道功能
    onMyChannelClick (channel, index) {
      // 点击切换频道 编辑状态 删除频道
      if (this.isEdit) {
        // 1. 如果是固定频道 则不删除
        if (this.fixedChannels.includes(channel.id)) return
        // 2. 如果删除的激活频道之前的频道 则更新激活的频道项
        // 参数1：要删除的元素开始索引 （包括）
        // 参数2：删除的个数 如果不指定 则从参数1开始一直删除
        if (index <= this.active) this.$emit('update-active', this.active - 1, true)
        //  3. 通过组件通信拜托父组件删除
        this.$emit('update-delete', channel.id)
        // 4. 调用删除函数
        this.deleteChannels(channel)
      } else {
        // 不是编辑状态 执行切换频道 通过组件通信把index传递父组件
        this.$emit('update-active', index, false)
      }
    },
    // 请求后端删除
    async deleteChannels (channel) {
      try {
        if (this.user) {
          // 登录状态 数据请求到接口 放到线上
          await deleteUserChannels(channel.id)
        } else {
          // 未登录状态 数据存储到本地
          setItem('TOUTIAO-CHANNELS', this.myChannels)
        }
      } catch (err) {
        // console.log('删除频道失败,请稍后重试', err)
        this.$toast('删除频道失败,请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  // 标题样式
  .title-text {
    font-size: 32px;
    color: #333;
  }
  // 编辑按钮样式
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  // 宫格样式
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    // 非根组件节点 找不出 只能深度监听查找
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      // unset 去掉定位方式
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  // 我的频道 宫格样式
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__content {
        .van-icon {
          position: absolute;
          top: -10px;
          right: -10px;
          color: #cacaca;
          font-size: 30px;
          z-index: 2;
        }
      }
    }
  }
  // 频道推荐宫格内容 +
  /deep/.recommoned-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
