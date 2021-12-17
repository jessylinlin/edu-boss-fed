<template>
  <div class="course-section">
      <el-card>
          <div slot="header">

          </div>
          <el-tree
            :data="sections"
            :props="defaultProps"
            node-key="id"
            draggable
            :allow-drop="handleAllowDrop"
            @node-drop="handleDrop">
            <div class="inner" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="data.sectionName">
                    <el-button
                        size="mini"
                        @click="() => append(data)">
                       编辑
                    </el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="() => append(data)">
                        添加课时
                    </el-button>
                    <el-button
                        size="mini"
                        @click="() => remove(node, data)">
                        已隐藏
                    </el-button>
                </span>
                <span v-else>
                    <el-button
                        size="mini"
                        @click="() => append(data)">
                       编辑
                    </el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="$router.push({
                            name: 'course-video',
                            params: {
                                courseId: data.id
                            },
                            query: {
                                sectionId: node.parent.id,
                                lessonId: data.id
                            }
                        })">
                        上传视频
                    </el-button>
                    <el-button
                        size="mini"
                        @click="() => remove(node, data)">
                        状态
                    </el-button>
                </span>
            </div>
        </el-tree>

      </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/section'
import { saveOrUpdateCourse } from '@/services/course'
import { saveOrUpdateLesson } from '@/services/lesson'
export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data:any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
      console.log(data)
    },
    handleAllowDrop (DraggingNode:any, dropNode:any, type:any) {
      console.log(DraggingNode)
      return type !== 'inner' &&
        DraggingNode.data.sectionId === dropNode.data.sectionId
    },
    async handleDrop (dragNode:any, dropNode:any, type: any, event:any) {
      dropNode.parent.childNodes.map((item: any, index: number) => {
        if (dragNode.data.lessonDTOS) {
          // 阶段
          saveOrUpdateSection({
            id: item.data.id,
            orderNum: index + 1
          })
        } else {
          // 课时
          return saveOrUpdateLesson({
            id: item.data.id,
            orderNum: index + 1
          })
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    border-bottom: 1px solid #ebebeb;

}
::v-deep .el-tree-node__content{
    height: auto;
}
</style>>
