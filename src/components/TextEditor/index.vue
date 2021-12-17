<template>
<div class="text-editor" ref="editor">

</div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { fileUpload } from '@/services/course'
export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  // 组件已经渲染好 可以初始化操作dom
  mounted () {
    const editor = new E(this.$refs.editor as any)
    // 事件监听在create之前
    editor.config.onchange = (value:string) => {
      this.$emit('input', value)
    }

    editor.config.customUploadImg = async (resultFiles:any,
      insertImgFn:any) => {
    // resultFiles 是 input 中选中的文件列表
    // insertImgFn 是获取图片 url 后，插入到编辑器的方法

      // 上传图片，返回结果，将图片插入到编辑器中
      //   insertImgFn(imgUrl)

      const fs = new FormData()
      fs.append('file', resultFiles[0])
      const { data: { data: { name } } } = await fileUpload(fs)

      insertImgFn(name)
    }

    editor.create()
    editor.txt.html(this.value)
  },
  methods: {

  }
})
</script>

<style lang="scss" scoped>

</style>
