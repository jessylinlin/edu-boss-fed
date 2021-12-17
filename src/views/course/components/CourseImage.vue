<template>
    <div class="course-image">
        <el-upload
            v-if="!isUploading"
            class="avatar-uploader"
            action="upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
        >
            <img v-if="value" :src="value" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-progress
            v-else
            type="circle"
            :percentage="percent"
            :status="percent === 100 ? 'success' : undefined"
            :width="178"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fileUpload } from '@/services/course'
export default Vue.extend({
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      isUploading: false,
      percent: 0
    }
  },
  methods: {
    async handleUpload (options:any) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', options.file)

      const { data: { data } } = await fileUpload(fd, e => {
        this.percent = Math.floor(e.loaded / e.total * 100)
      })
      this.percent = 0
      this.isUploading = false
      this.$emit('input', data.name)
    },
    beforeAvatarUpload (file:any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt = file.size / 1024 / 1024 < this.limit

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
      }
      return isJPG && isLt
    }
  }
})
</script>

<style lang="scss" scoped>
  ::v-deep.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
