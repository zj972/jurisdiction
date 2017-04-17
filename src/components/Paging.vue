<!-- 权限管理 -> 分页 -> 子组件 -->
<template>
  <div class="Paging" align="right">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="msg.currentPage"
      :page-size="msg.size"
      layout="prev, pager, next, jumper"
      :total="msg.total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Paging',
  data () {
    return {
    }
  },
  props: ['msg'],
  methods: {
    handleSizeChange (val) {
      this.msg.currentPage = val
    },
    handleCurrentChange (val) {
      this.msg.currentPage = val
    }
  }
}
</script>

<style scoped>
.Paging{
  margin: 10px 0;
}
</style>
