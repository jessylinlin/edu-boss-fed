<template>
  <div class="create-role">
    <el-form :model="form">
        <el-form-item label="角色名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
         <el-form-item label="角色编码">
            <el-input v-model="form.code"></el-input>
        </el-form-item>
         <el-form-item label="角色描述">
            <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">确认</el-button>
            <el-button @click="$emit('cancel')">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdateRole, getRoleById } from '@/services/role'
export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    // edit ？
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async onSubmit () {
      const { data } = await createOrUpdateRole(this.form)

      if (data.code === '000000') {
        this.$message.success('已成功添加角色')
        this.$emit('success')
      }
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.form = data.data
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
