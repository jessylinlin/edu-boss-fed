<template>
    <div class="alloc-menu">
        <el-card>
            <div slot="header">
                <span>分配权限</span>
            </div>
            <el-tree
                ref="menu-tree"
                node-key="id"
                show-checkbox
                default-expand-all
                :data="data"
                :default-checked-keys="defaultCheckedKeys"
                :props="defaultProps"></el-tree>
            <div style="margin-top: 20px">
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button @click="onClear">清空</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getTreeMenus, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      defaultCheckedKeys: []
    }
  },
  created () {
    this.loadTreeMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadTreeMenus () {
      const { data } = await getTreeMenus()
      this.data = data.data
    },
    async onSave () {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })

      this.$message.success('操作成功')
      this.$router.back()
    },
    onClear () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)

      this.getCheckedMenus(data.data)
    },
    getCheckedMenus (menus: any) {
      menus.forEach((menu:any) => {
        if (menu.selected && !menu.subMenuList) {
          this.defaultCheckedKeys = [...this.defaultCheckedKeys, menu.id] as any
        }

        if (menu.subMenuList) {
          this.getCheckedMenus(menu.subMenuList)
        }
      })
    }
  }
})
</script>

<style lang="scss">

</style>
