<template>
    <div class="role">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
         <span>筛选搜索</span>
         <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px">
            <el-form-item label="输入搜索">
              <el-input v-model="form.name" placeholder="角色名称" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button>重置</el-button>
            </el-form-item>
         </el-form>
          <div class="add-btn" style="border-top: 1px solid #EBEEF5; padding-top: 18px">
            <el-button @click="handleAdd">添加角色</el-button>
          </div>
        </div>
        <el-table
          :data="roles"
          style="width: 100%">
          <el-table-column
            type="index"
            label="编号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="添加时间">
          </el-table-column>
          <el-table-column
            label="操作">
             <template slot-scope="scope">
               <div>
                  <el-button
                  size="mini"
                  type="text"
                  @click="$router.push({
                    name: 'alloc-menu',
                    params: {
                      roleId: scope.row.id
                    }
                  })">分配菜单</el-button>
                <el-button
                  size="mini"
                   type="text"
                   @click="$router.push({
                     name: 'alloc-resource',
                     params: {
                       roleId: scope.row.id
                     }
                   })">分配资源</el-button>
               </div>
               <div>
                  <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)">删除</el-button>
               </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="30%">
       <create-or-edit
        v-if="dialogVisible"
        :role-id="roleId"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"></create-or-edit>
      </el-dialog>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getRoles, deleteRole } from '@/services/role'
import CreateOrEdit from './components/CreateOrEdit.vue'
export default Vue.extend({
  name: 'Role',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      roles: [

      ],
      dialogVisible: false,
      roleId: null, // 编辑角色的id
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      const { data } = await getRoles()

      this.roles = data.data
    },
    onSubmit () {
      console.log('12')
    },
    onAddOrEdit (row: any) {
      console.log('edit')
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    },
    handleEdit (row:any) {
      this.roleId = row.id
      this.isEdit = true
      this.dialogVisible = true
    },
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    },
    async handleDelete (role: any) {
      const { data } = await deleteRole(role.id)

      if (data.code === '000000') {
        this.loadRoles()
        this.$message.success('成功删除角色！')
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.el-button--mini {
  margin-bottom: 10px;
}
</style>
