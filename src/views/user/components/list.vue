<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-form
                :inline="true"
                :model="form"
                class="demo-form-inline"
                style="margin-top: 20px">
                    <el-form-item label="手机号">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="注册时间">
                        <el-date-picker
                            v-model="form.createTimes"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onFilter">查询</el-button>
                        <el-button type="" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
            :data="users"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="用户id"
                    width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="头像"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                        <el-avatar :size="30" :src="scope.portrait ? scope.portrait : require('@/assets/default-avator.png')"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户名"
                    width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                label="注册时间"
                width="180"
                align="center">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                        <div class="status"
                            :class="{
                                'active': scope.row.status === 'ENABLE'
                            }"></div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="text">禁用</el-button>
                    <el-button
                    size="mini"
                    type="text"
                    @click="handleSelectRoles(scope.row)">分配角色</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top: 20px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="分配角色"
            :visible.sync="dialogVisible"
            width="50%">
            <el-select
                v-model="ids"
                multiple
                placeholder="请选择"
            >
                <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAllocRoles">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getRoles, allocUserRoles, getUserRoles } from '@/services/role'
export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      form: {
        phone: '',
        createTimes: [], // 默认时间范围
        endCreateTime: '',
        startCreateTime: ''
      },
      users: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      roles: [],
      ids: [],
      currentUser: null
    }
  },
  created () {
    this.loadUserPages()
  },
  methods: {
    async loadUserPages () {
      const { data } = await getUserPages({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        phone: this.form.phone,
        userId: null,
        startCreateTime: this.form.createTimes[0],
        endCreateTime: this.form.createTimes[1]
      })

      //   console.log(data)
      this.users = data.data.records || []
      this.total = data.data.total
    },
    onFilter () {
      this.currentPage = 1
      this.loadUserPages()
    },
    onReset () {
      this.currentPage = 1
      this.form.phone = ''
      this.form.createTimes = []
      this.loadUserPages()
    },
    handleSizeChange (val:number) {
      this.pageSize = val
      this.currentPage = 1
      this.loadUserPages()
    },
    handleCurrentChange (val:number) {
      this.currentPage = val
      this.loadUserPages()
    },
    async handleSelectRoles (role: any) {
      const { data } = await getRoles()
      this.roles = data.data
      this.currentUser = role

      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)

      this.ids = userRoles.map((item:any) => item.id)

      this.dialogVisible = true
    },
    async handleAllocRoles () {
      const { data } = await allocUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.ids
      })

      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    },
    async loadUserRoles () {
      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)

      this.ids = userRoles.map((item:any) => item.id)
    }

  }
})
</script>

<style lang="scss" scoped>
.status {
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background: #f56c6c;

    &.active {
        background: #67c23a;
    }
}
.el-select {
    width: 70%;
}
</style>
