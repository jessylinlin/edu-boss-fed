<template>
    <div class="alloc-menu">
        <el-card>
            <div slot="header">
                <span>分配资源</span>
            </div>
            <el-tree
                ref="resource-tree"
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
import { getRoleResources, allocateRoleResources } from '@/services/resource'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'AllocResource',
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
        children: 'resourceList',
        label: 'name'
      },
      defaultCheckedKeys: []
    }
  },
  created () {
    this.loadRoleResources()
  },
  methods: {
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)

      this.data = data.data

      this.getCheckedResource(this.data)
    },
    getCheckedResource (resources:any) {
      resources.forEach((resource: any) => {
        if (resource.selected && !resource.resourceList) {
          this.defaultCheckedKeys = [...this.defaultCheckedKeys, resource.id] as any
        }
        if (resource.resourceList) {
          this.getCheckedResource(resource.resourceList)
        }
      })
    },
    async onSave () {
      const resourceIdList = (this.$refs['resource-tree'] as Tree).getCheckedKeys()

      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList
      })

      if (data.code === '000000') {
        this.$message.success('分配资源成功！')
        this.$router.back()
      }
    },
    onClear () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss">

</style>
