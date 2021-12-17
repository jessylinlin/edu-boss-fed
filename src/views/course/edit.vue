<template>
    <div class="course-create">
       <create-or-update
        :is-edit="true"
        :course-id="courseId"></create-or-update>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'
export default Vue.extend({
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrUpdate
  }
})
</script>
<style lang="scss" scoped>
.el-step.is-simple {
  cursor: pointer;
}
</style>
