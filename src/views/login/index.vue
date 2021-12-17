<template>
    <div class="login">
      <el-form
        class="login-form"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="top">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            @click="onSubmit"
            :loading="isLoginLoading"
            >
            login
          </el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
      // 表单验证
        await (this.$refs.form as Form).validate()

        // 验证通过 -- 提交表单

        // 登录按钮展示loading
        this.isLoginLoading = true

        const { data } = await login(this.form)
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //   data: qs.stringify(this.form) // axios 请求， 默认发送application/json
        // })

        // 处理请求结果
        // 成功-- 跳转首页
        // 失败-- tips
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // vuex存储登录状态
          this.$store.commit('setUser', data.content)
          // 访问需要登录状态的页面时 判断登录状态-- 路由拦截器

          // this.$router.push({
          //   name: 'home'
          // })
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('login success')
        }
      } catch (err) {
        this.$message.error('login fail')
      }

      this.isLoginLoading = false
    }
  }
})
</script>
<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-form {
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      width: 300px;;
    }

    .login-btn {
      width: 100%;
    }

  }
</style>
