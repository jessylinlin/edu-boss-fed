<template>
  <div class="resource-list">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model="form.name" placeholder="资源名称"></el-input>
                </el-form-item>
                <el-form-item label="资源路径" prop="url">
                    <el-input v-model="form.url" placeholder="资源路径"></el-input>
                </el-form-item>
                <el-form-item label="资源分类" prop="categoryId">
                    <el-select v-model="form.categoryId" clearable placeholder="请选择资源分类">
                    <el-option
                    :label="category.name"
                    :value="category.id"
                    v-for="category in categories"
                    :key="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                    type="primary"
                    @click="onSubmit"
                    :disabled="isLoading">查询搜索</el-button>
                    <el-button @click="onReset" :disabled="isLoading">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="add-btn">
                <el-button @click="onAddOrEdit()">添加</el-button>
            </div>
        </div>

        <el-table
            :data="resources"
            v-loading="isLoading"
            style="width: 100%; margin-bottom: 20px">
            <el-table-column
                prop="date"
                label="编号"
                width="80"
                type="index">
            </el-table-column>
            <el-table-column
                prop="name"
                label="资源名称">
            </el-table-column>
            <el-table-column
                prop="url"
                label="资源路径">
            </el-table-column>
            <el-table-column
                prop="descriptio"
                label="描述">
            </el-table-column>
            <el-table-column
                prop="createdTime"
                label="添加时间">
            </el-table-column>
            <el-table-column
            label="操作">
             <template slot-scope="scope">
              <el-button
                size="mini"
                @click="onAddOrEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.form.current"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            :disabled="isLoading">
        </el-pagination>
    </el-card>
    <add-or-edit
        v-if = "dialogFormVisible"
        :editId="editId"
        :dialogFormVisible="dialogFormVisible"
        :categories="categories"
        @showDialog="showDialog"
        @loadRescources="loadRescources">
    </add-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, getResourceCategory, deleteResource } from '@/services/resource'
import { Form } from 'element-ui'
import AddOrEdit from './addOrEditResource.vue'

export default Vue.extend({
  name: 'ResourceList',
  components: {
    AddOrEdit
  },
  data () {
    return {
      resources: [],
      categories: [],
      form: {
        name: '',
        url: '',
        categoryId: null,
        current: 1, // 当前页
        size: 10 // 每页
      },
      totalCount: 0,
      isLoading: true,
      dialogFormVisible: false,
      editId: -1 // 获取正在编辑的资源id
    }
  },
  created () {
    this.loadRescources()
    this.loadResourceCategory()
  },
  methods: {
    async loadResourceCategory () {
      const { data } = await getResourceCategory()
      this.categories = data.data
    },
    async loadRescources () {
      this.isLoading = true
      const { data } = await getResourcePages({
        current: this.form.current,
        size: this.form.size,
        name: this.form.name,
        url: this.form.url,
        categoryId: this.form.categoryId
      })

      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.current = 1
      this.loadRescources()
    },
    handleSizeChange (val:number) {
      this.form.size = val
      this.form.current = 1
      this.loadRescources()
    },
    handleCurrentChange (val:number) {
      this.form.current = val
      this.loadRescources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadRescources()
    },
    onAddOrEdit (row:any = {}) {
      this.editId = row.id || -1
      console.log(row)
      this.showDialog(true)
    },
    showDialog (flg: boolean) {
      this.dialogFormVisible = flg
    },
    async handleDelete (row:any = {}) {
      this.$confirm('确认删除吗', '删除提示', {})
        .then(async () => {
          // 确认
          const { data } = await deleteResource(row.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadRescources()
          }
        })
        .catch(() => {
          // 取消
          this.$message.info('已取消删除')
        })
    }
  }
})
</script>

<style lang='scss' scoped>
    .add-btn {
        border-top: 1px solid #EBEEF5;
        padding: 18px 0;
    }
</style>
