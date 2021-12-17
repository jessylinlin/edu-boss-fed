<template>
    <div class="course-video">
        <el-card>
            <div slot="header">
                <div>课程</div>
                <div>阶段</div>
                <div>课时</div>
            </div>
           <el-form label-width="70px">
               <el-form-item label="视频上传">
                   <input type="file" ref="video-file">
               </el-form-item>
               <el-form-item label="封面上传">
                   <input type="file" ref="image-file">
               </el-form-item>
               <el-form-item>
                   <el-button
                   type="primary"
                   @click="handleUpload">开始上传</el-button>
                   <el-button @click="$router.back()">返回</el-button>
               </el-form-item>
               <el-form-item>
                    <p>视频上传中 {{uploadPercent}}%</p>
                    <p v-if="isUploadSuccess">视频转码中 {{isTranscodeSuccess ? '完成' : '正在处理， 请稍后'}}</p>
               </el-form-item>
           </el-form>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-upload'
export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      uploader: null,
      imageURL: null,
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranscodeSuccess: false
    }
  },
  //   computed: {
  //     video () {
  //       return (this.$refs as any)['video-file']
  //     },
  //     image () {
  //       return (this.$refs as any)['image-file']
  //     }
  //   },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '161813996448548', // 后台提供的
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB，此参数单位默认为 B
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo:any) => {
          let uploadAddressAndAuth

          // 1、通过后端获取文件上传凭证
          // 2、 调用uploader. setUploadAuthAndAddress设置上传凭证
          // 3、 设置好上传凭证 确认没有问题后 上传进度开始
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            this.imageURL = data.data.imageURL
            uploadAddressAndAuth = data.data
            // uploadAuth
          } else {
            // 获取视频上传凭证
            const fileName = uploadInfo.file.name
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName,
              imageURL: this.imageURL
            })

            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }

          (this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo:any) {
          console.log(uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo:any, code:number | string, message:string) {
          console.log(uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo:any, totalSize:number| string, loadedPercent: number) => {
          console.log(uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo:any) {
          console.log(uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: (uploadInfo:any) => {
        // 视频转码
          this.isUploadSuccess = true
          this.handleAliyunTransCode()
          console.log(`end:${uploadInfo}`)
        }
      })
    },
    handleUpload () {
      // 初始化上传状态
      this.isTranscodeSuccess = false
      this.isUploadSuccess = false
      this.uploadPercent = 0
      const uploader = this.uploader as any
      // 获取上传的文件
      const video = (this.$refs['video-file'] as any).files[0]
      const image = (this.$refs['image-file'] as any).files[0]

      // 将文件添加到上传列表中
      // 开始上传后 会按照列表中添加的顺序
      uploader.addFile(image, null, null, null, '{ "Vod": {} }')
      uploader.addFile(video, null, null, null, '{ "Vod": {} }')

      // 开始上传 触发 onUploadstarted事件
      uploader.startUpload()
    },
    async handleAliyunTransCode () {
      const data = await aliyunTransCode({
        lessonId: this.$route.query.lessonId,
        coverImageId: this.imageURL,
        fileName: (this.$refs['video-file'] as any).files[0].name,
        fileId: this.videoId
      })

      console.log(data)
      this.loadAliyunTransCodePercent()
    },
    loadAliyunTransCodePercent () {
      const timer = setInterval(async () => {
        const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
        console.log(data.data)
        if (data.data === 100) {
          this.isTranscodeSuccess = true
          console.log('转码成功')
          window.clearInterval(timer)
        }
      }, 3000)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
