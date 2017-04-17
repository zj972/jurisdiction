<template>
  <div class="CheckboxCascader">
    <el-popover
      ref="popover2"
      placement="bottom-start"
      width="360"
      trigger="click"
      v-model="show">
      <el-row class="button">
        <el-col align="right">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确认</el-button>
        </el-col>
      </el-row>
      <el-table :data="options" border @selection-change="handleSelectionChange" max-height="200">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column v-for="item in list" :prop="item.prop" :label="item.label" align="center" :key="item.prop"></el-table-column>
      </el-table>
    </el-popover>
    <el-button v-popover:popover2 @click="open" :disabled="disabled">{{title}}</el-button>
  </div>
</template>

<script>
  export default {
    name: 'CheckboxCascader',
    data () {
      return {
        show: false,
        list: [],
        // 表格显示
        options: [],
        multipleSelection: []
      }
    },
    props: ['data', 'title', 'disabled'],
    methods: {
      open () {
        this.list = []
        this.options = []
        this.multipleSelection = []
        let num = this.data[0].data.length
        for (let i = 0; i < num; i++) {
          this.options.push({})
        }
        for (let item of this.data) {
          this.list.push({prop: item.prop, label: item.label})
          for (let i = 0; i < num; i++) {
            this.options[i][item.prop] = item.data[i]
          }
        }
      },
      cancel () {
        this.show = false
      },
      submit () {
        if (this.multipleSelection.length === 0) {
          this.$message('请至少选择一项！')
        } else {
          this.$emit('checked', this.multipleSelection)
          this.show = false
        }
      },
      // 表格选择器
      handleSelectionChange (val) {
        let id = []
        for (let i = 0; i < val.length; i++) {
          id.push(val[i])
        }
        this.multipleSelection = [...id]
      }
    }
  }
</script>

<style scoped>
  .CheckboxCascader {
    display: inline-block;
  }
  .button {
    margin-bottom: 8px;
  }
</style>
