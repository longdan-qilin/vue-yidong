<template>
  <div class="user-porfile">
    <!-- 导航开始 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- 导航结束 -->

    <van-cell title="头像" is-link>
      <van-image
        round
        class="avatar"
        fit="cover"
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
    </van-cell>
    <van-cell title="昵称" is-link value="内容" />
    <van-cell title="性别" is-link value="内容" />
    <van-cell title="生日" is-link value="内容" />
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.avatar {
  width: 60px;
  height: 60px;
}
</style>
