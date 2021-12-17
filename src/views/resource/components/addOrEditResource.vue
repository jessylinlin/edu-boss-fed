<template>
    <div class="add-edit-resource">
        <el-dialog
        :title="editId === -1 ? '添加资源' : '编辑资源'"
        :visible="dialogFormVisible"
        :before-close="closeDialog">
            <el-form :model="dialogForm" label-width="80px">
                <el-form-item label="资源名称">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="资源路径">
                    <el-input v-model="dialogForm.url"></el-input>
                </el-form-item>
                 <el-form-item label="资源分类" prop="categoryId">
                    <el-select v-model="dialogForm.categoryId" clearable placeholder="请选择资源分类">
                    <el-option
                    :label="category.name"
                    :value="category.id"
                    v-for="category in categories"
                    :key="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动形式">
                    <el-input type="textarea" v-model="dialogForm.description"></el-input>
                </el-form-item>
            </el-form>
             <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateResource, getEditResource } from '@/services/resource'
export default Vue.extend({
  name: 'AddOrEditResource',
  props: {
    editId: {
      type: Number,
      default: -1
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      dialogForm: {
        name: '',
        categoryId: null,
        url: '',
        description: ''
      }
    }
  },
  mounted () {
    this.loadEditResource()
  },
  methods: {
    closeDialog () {
      this.$emit('showDialog', false)
    },
    loadResourceList () {
      this.$emit('loadRescources')
    },
    async onSubmit () {
      const { data } = await saveOrUpdateResource(this.dialogForm)

      if (data.code === '000000') {
        this.closeDialog()
        this.$message.success('提交成功')
        this.loadResourceList()
      }
    },
    async loadEditResource () {
      const { data } = await getEditResource(this.editId)

      this.dialogForm = data.data
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
