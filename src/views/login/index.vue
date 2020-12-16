<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- 只有传递了 redirect 这样一个参数，才显示返回按钮 -->
      <van-icon v-if="$route.query.redirect" slot="left" @click="$router.back()" name="cross" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-cell-group>
        <van-field v-model="user.mobile" name="mobile" placeholder="请输入手机号" :rules="userFormRules.mobile" type="number" maxlength="11">
          <!-- <template v-solt:left-icon>#left-icon
            <i>3中方法一种是具名插槽 填坑 儿子是填坑 父亲挖坑 一种是新版的 v-solt 还有一种是#号代替</i>
          </template> -->
          <i slot="left-icon" class="toutiao toutiao-shouji"></i>
        </van-field>
        <van-field v-model="user.code" type="number" name="code" placeholder="请输入验证码" :rules="userFormRules.code" maxlength="6">
          <template #left-icon>
            <i class="toutiao toutiao-yanzhengma"></i>
          </template>
          <template #button>
            <!-- time 倒计时的时间 ss 秒的格式 hh表示小时-->
            <van-count-down v-if="isCountDownShow" :time="1000 * 10" format="ss s" @finish="isCountDownShow = false" />
            <!-- native-type='button' 防止触发表单提交。 round圆形按钮-->
            <van-button v-else native-type="button" class="send-sms-btn" round size="small" type="default" @click="onSendSms">发送验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
        >
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 是否显示倒计时
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1. 获取表单数据
      const user = this.user
      // 2. 验证表单数据对象
      /* 表单验证：
        1.给van-field 组件配置 rules验证规则
        2. 当表单提交的时候回自动触发表单验证规则
        a. 如果验证通过 会触发 submit 事件
        b. 如果验证失败 不会触发 submit
       */
      // 引入 Toast 组件后，
      // 会自动在 Vue 的 prototype 上挂载 $toast 方法，便于在组件内调用。
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 默认持续时间是2000 如果为0代表一直持续
      })
      // 3. 利用axios请求且提交数据
      try {
        // try 测试代码块的错误
        // $toast 每次调用会覆盖上次的
        const { data } = await login(user)
        // res.data.data => { token: 'xxx',refresh_token: 'xxx' }
        this.$store.commit('setUser', data.data)
        console.log('登录成功')
        this.$toast.success('登录成功！')
        /* // 跳转回原来的页面 this.$router.back('my') 这个有bug
        // 如果重新进入login页面 返回的话回会直接进入浏览器而不是我的页面
        从哪里来的 直接从哪里去 获取不到 redirect 重定向 自定义数据
        */
        console.log(this.$route.query.redirect)
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        // catch 语句处理错误
        if (err.response.status === 400) {
          // console.log('手机号或则验证码错误')
          this.$toast.fail('手机号或则验证码错误')
        } else {
          // console.log('登录失败，请稍后尝试！', err)
          this.$toast.fail('登录失败，请稍后尝试！')
          // 停止 loading，它会把当前页面中所有的 toast 都给清除
          // loginToast.clear()
        }
      }
    },
    async onSendSms () {
      // 1. 验证手机号
      // console.log('onSendSms')
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // console.log('123')
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
}

.send-sms-btn {
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size: 22px;
  color: #666;
}
.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>
