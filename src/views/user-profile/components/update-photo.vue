<template>
  <div class="update-photo">
    <img :src="img" class="image" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhotos } from '@/api/user'
export default {
  name: 'updatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
  },
  methods: {
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法 获取裁切参数
      // console.log(this.cropper.getdata())
      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // 错误的用法
        // 如果接口要求Content-Type 是 application/json
        /*
          则传递普通 Javascript 对象
          updateUserPhoto（{
            photo：blob
          }）
          如果接口  要求 Content-Type 是 multipart/form-data
          则你必选传递 formData 对象
        */
        this.UserPhoto(blob)
      })
    },
    async UserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...', // 提示消息
        forbidClick: true, // 禁止点击背景
        duration: 0 // 知道下一个提示触发才关闭
      })
      try {
        // 创建formData对象
        const formData = new FormData()
        // 将文件对象 添加到 photo上
        formData.append('photo', blob)
        const { data } = await updateUserPhotos(formData)
        console.log(data)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-Photo', data.data.photo)
        // 成功提示
        this.$toast.success('更新成功')
      } catch (err) {
        // 失败提示
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
  .image {
    max-width: 100%;
  }
}
</style>
