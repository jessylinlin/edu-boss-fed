<template>
    <div class="header">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">{{menusMap[$route.name]}}</a></el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown>
            <span class="el-dropdown-link">
                <el-avatar :size="40" :src="userInfo.portrait || require('@/assets/default-avator.png')"></el-avatar>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
                <el-dropdown-item divided @click.native="handleLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getUserInfo } from '@/services/user'

export default Vue.extend({
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}, // 当前登录信息
      menusMap: {
        role: '角色管理',
        menu: '菜单管理',
        resource: '资源管理',
        user: '用户管理',
        course: '课程管理',
        advert: '广告管理',
        'advert-space': '广告位管理'
      }
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLogout () {
      // 清除登录状态 跳转到登录页面
      this.$confirm('确认退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setUser', null)
        this.$router.push({
          name: 'login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
})
</script>
<style lang="scss" scoped>
    .header {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
</style>
