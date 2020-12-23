<template>
  <div class="user-porfile">
    <!-- 导航开始 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- 导航结束 -->

    <!-- 文件上传 -->
    <input type="file" hidden ref="fileRef" @change="fileChange" />
    <!-- /文件上传 -->
    <!-- 用户资料 -->
    <van-cell title="头像" is-link @click="$refs.fileRef.click()">
      <van-image round class="avatar" fit="cover" :src="profile.photo" />
    </van-cell>
    <van-cell title="昵称" is-link :value="profile.name" @click="onChannelName" />
    <van-cell title="性别" @click="onGender" is-link :value="profile.gender === 0 ? '男' : '女'" />
    <van-cell title="生日" @click="onBirthday" is-link :value="profile.birthday" />
    <!-- / 用户资料 -->

    <!-- 修改昵称 -->
    <van-popup v-model="isUpdateshow" position="top" :style="{ height: '100%' }">
      <update-name v-if="isUpdateshow" v-model="profile.name" @close="isUpdateshow = false" />
    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-popup v-model="isGendershow" position="bottom">
      <update-gender v-if="isGendershow" v-model="profile.gender" @close="isGendershow = false" />
    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改生日 -->
    <van-popup v-model="isbirthdayshow" position="bottom">
      <update-birthday
        v-if="isbirthdayshow"
        v-model="profile.birthday"
        @close="isbirthdayshow = false"
      />
    </van-popup>
    <!-- / 修改生日 -->

    <!-- 修复头像 -->
      <van-popup v-model="isphotoshow" position="bottom" :style="{ height: '100%' }">
      <update-photo
        v-if="isphotoshow"
        :img='img'
        @update-Photo = 'profile.photo = $event'
        @close='isphotoshow = false'
      />
    </van-popup>
    <!-- 修复头像 -->

  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import updateName from './components/update-name.vue'
import updateGender from './components/update-gender.vue'
import updateBirthday from './components/update-birthday.vue'
import updatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    updateName,
    updateGender,
    updateBirthday,
    updatePhoto
  },
  props: {},
  data () {
    return {
      // 用户资料
      profile: [],
      // 控制昵称弹出层显示与隐藏
      isUpdateshow: false,
      isGendershow: false,
      isbirthdayshow: false,
      isphotoshow: false,
      img: ''
    }
  },
  computed: {},
  watch: {},
  created () {
    // 调用这个函数 dom渲染之前调用获得数据的这个方法
    this.loadGetUserProfile()
  },
  mounted () {},
  methods: {
    // 获取用户个人资料
    async loadGetUserProfile () {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.profile = data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 点击昵称  修改昵称功能
    onChannelName () {
      // 显示修改昵称的 弹出层
      this.isUpdateshow = true
    },
    // 点击性别
    onGender () {
      // 显示修改昵称的 弹出层
      this.isGendershow = true
    },
    // 点击生日
    onBirthday () {
      this.isbirthdayshow = true
    },
    // 点击头像
    fileChange () {
      // 1. 获取当前上传的文件his
      const file = this.$refs.fileRef.files[0]
      console.log(file)
      // 获取这个 blob文件数据对象
      // Blob 对象表示一个不可变、原始数据的类文件对象。
      this.img = window.URL.createObjectURL(file)
      // 头像预览显示
      this.isphotoshow = true
      // file-input 如果选了同一个文件不会触发 change事件
      // 解决办法就是每次使用完毕 把它的 value 清空
      this.$refs.fileRef.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 60px;
  height: 60px;
}

/deep/ .van-popup {
  background-color: #f5f7f9;
}
</style>
