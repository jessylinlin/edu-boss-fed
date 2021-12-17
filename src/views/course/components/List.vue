<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-form
                :inline="true"
                :model="form"
                class="demo-form-inline"
                style="margin-top: 20px">
                    <el-form-item label="课程名称">
                        <el-input v-model="form.courseName" placeholder="课程名称"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="form.status">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onFilter">查询</el-button>
                        <el-button type="" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="$router.push({
                  name: 'course-create'
                })">新建课程</el-button>
            </div>
            <el-table
            :data="courses"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="ID"
                    width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="courseName"
                    label="课程名称"
                    width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="价格"
                    width="120"
                    align="center">
                    <template slot-scope="scope">
                        ¥{{scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sortNum"
                    label="排序"
                    width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="上架状态"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            :disabled="scope.row.isStatusLoading"
                            @change="handleStates(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="$router.push({
                      name: 'course-edit',
                      params: {
                        courseId: scope.row.id
                      }
                    })">编辑</el-button>
                    <el-button
                    size="mini"
                    @click="$router.push({
                      name: 'course-section',
                      params: {
                        courseId: scope.row.id
                      }
                    })">内容管理</el-button>
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCourseList, changeCourseStates } from '@/services/course'
export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      options: [{
        value: null,
        label: '全部'
      }, {
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],
      form: {
        status: 1,
        courseName: ''
      },
      courses: [],
      currentPage: 1,
      pageSize: 5,
      total: 0

    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      const { data: { data: courseData } } = await getCourseList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        courseName: this.form.courseName,
        status: this.form.status
      })
      courseData.records.forEach((item:any) => {
        item.isStatusLoading = false
      })
      this.courses = courseData.records || []
      this.total = courseData.total
    },
    onFilter () {
      this.currentPage = 1
      this.loadCourses()
    },
    onReset () {
      this.currentPage = 1
      this.form.courseName = ''
      this.form.status = 0
      this.loadCourses()
    },
    handleSizeChange (val:number) {
      this.pageSize = val
      this.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val:number) {
      this.currentPage = val
      this.loadCourses()
    },
    async handleStates (course: any) {
      course.isStatusLoading = true
      const params = {
        courseId: course.id,
        status: course.status
      }

      const { data: { code } } = await changeCourseStates(params)

      if (code === '000000') {
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      }
      course.isStatusLoading = false
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
