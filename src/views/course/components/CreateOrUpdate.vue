<template>
    <el-card>
    <div slot="header">
        <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
        <el-step
            v-for="(item, index) in steps"
            :key="index"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep =index"
        ></el-step>
        </el-steps>
    </div>
    <el-form>
        <div v-show="activeStep === 0">
        <el-form-item
            label="课程名称"
            label-width="80px"
        >
            <el-input v-model="course.courseName"></el-input>
        </el-form-item>
        <el-form-item
            label="课程简介"
            label-width="80px"
        >
            <el-input
            type="textarea"
            v-model="course.brief"></el-input>
        </el-form-item>
        <el-form-item
            label="课程概述"
            label-width="80px"
        >
            <el-input
            style="margin-bottom: 10px"
            v-model="course.previewFirstField"
            type="textarea"></el-input>
            <el-input
            v-model="course.previewSecondFieldd"
            type="textarea"></el-input>
        </el-form-item>
        <el-form-item
            label="讲师姓名"
            label-width="80px"
        >
            <el-input v-model="course.teacherDTO.name"></el-input>
        </el-form-item>
        <el-form-item
            label="讲师简介"
            label-width="80px"
        >
            <el-input
            type="textarea"
            v-model="course.teacherDTO.description"></el-input>
        </el-form-item>
        <el-form-item
            label="课程排序"
            label-width="80px"
        >
            <el-input-number
            v-model="course.sortNum"
            >
            </el-input-number>
        </el-form-item>
        </div>
        <div v-show="activeStep === 1">
        <el-form-item
            label="课程封面"
            label-width="80px"
        >
            <!--
            1 组件需要根据绑定的数据进行图片预览
            2 组件需要把上传成功的图片地址同步到绑定的数据中
            -->
            <course-image
            v-model="course.courseListImg"
            :limit="5"></course-image>
        </el-form-item>
        <el-form-item
            label="解锁封面"
            label-width="80px"
        >
            <course-image v-model="course.courseImgUrl"></course-image>
        </el-form-item>
        </div>
        <div v-show="activeStep === 2">
        <el-form-item
            label="售卖价格"
            label-width="80px"
        >
            <el-input v-model="course.discounts">
            <template slot="append">元</template>
            </el-input>
        </el-form-item>
        <el-form-item
            label="商品原价"
            label-width="80px"
        >
            <el-input v-model="course.price">
            <template slot="append">元</template>
            </el-input>
        </el-form-item>
        <el-form-item
            label="销量"
            label-width="80px"
        >
            <el-input v-model="course.sales">
            <template slot="append">单</template>
            </el-input>
        </el-form-item>
        <el-form-item
            label="活动标签"
            label-width="80px"
        >
            <el-input v-model="course.discountsTag"></el-input>
        </el-form-item>
        </div>
        <div v-show="activeStep === 3">
        <el-form-item
            label="限时秒杀开关"
            label-width="120px">
            <el-switch
            v-model="course.activityCourse"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
        </el-form-item>
        <template v-if="course.activityCourse">
            <el-form-item
            label="开始时间"
            label-width="120px">
            <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="course.activityCourseDTO.beginTime">
            </el-date-picker>
            </el-form-item>
            <el-form-item
            label="结束时间"
            label-width="120px">
            <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="course.activityCourseDTO.endTime">
            </el-date-picker>
            </el-form-item>
            <el-form-item
            label="秒杀价"
            label-width="120px">
            <el-input v-model="course.activityCourseDTO.amount">
                <template slot="append">元</template>
            </el-input>
            </el-form-item>
            <el-form-item
            label="秒杀库存"
            label-width="120px">
            <el-input v-model="course.activityCourseDTO.stock">
                <template slot="append">个</template>
            </el-input>
            </el-form-item>
        </template>
        </div>
        <div v-show="activeStep === 4">
        <el-form-item label="课程详情" label-width="80px">
            <text-editor v-model="course.courseDescriptionMarkDown"/>
        </el-form-item>
        <el-form-item label="是否发布">
            <el-switch
            v-model="course.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
        </el-form-item>
        <el-form-item>
            <el-button
            type="primary"
            @click="handleSave">保存</el-button >
        </el-form-item>
        </div>
        <el-form-item v-if="activeStep >= 0 && activeStep < 4">
        <el-button @click="activeStep++">
            下一步
        </el-button>
        </el-form-item>
    </el-form>
    </el-card>
</template>
<script lang="ts">
import Vue from 'vue'
import CourseImage from './CourseImage.vue'
import { saveOrUpdateCourse, getCourse } from '@/services/course'
import TextEditor from '@/components/TextEditor/index.vue'
import moment from 'moment'
export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      },
      isSeckill: false// 是否秒杀
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourse(this.courseId)
      const { activityCourseDTO } = data.data

      if (activityCourseDTO) {
        activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
        activityCourseDTO.endTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
      }

      this.course = data.data
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)

      if (data.code === '000000') {
        this.$message.success('课程创建成功')
        this.$router.back()
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.el-step.is-simple {
  cursor: pointer;
}
</style>
