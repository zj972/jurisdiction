<!-- 权限管理 -> 角色管理 -> 添加角色 -> 子组件 -->
<template>
  <div class="RoleAdd">
    <el-button icon="plus" @click="roleAdd">添加角色</el-button>
    <el-dialog title="添加角色" v-model="dialogVisibleAdd" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align="center">
      <el-row>
        <el-col :span="6">角色</el-col>
        <el-col :span="18">
        <el-input v-model="role" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">菜单选择</el-col>
        <el-col :span="18" align="left">
          <checkbox-cascader title="一级菜单" :data="firstOptions" v-on:checked="checkedOne"></checkbox-cascader>
          <checkbox-cascader title="二级菜单" :data="secondOptions" v-on:checked="checkedTwo" :disabled="openSecond"></checkbox-cascader>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">已选菜单</el-col>
        <el-col :span="18">
          <el-table :data="menuData" max-height="300">
            <el-table-column
              prop="firstMenu"
              label="一级菜单"
              align="center">
            </el-table-column>
            <el-table-column
              prop="secondMenu"
              label="二级菜单"
              align="center">
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              align="center">
              <template scope="scope">
                <el-button @click.native.prevent="delRow(scope.$index, menuData)" size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">备注</el-col>
        <el-col :span="18">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="remark">
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleAddCancel">取 消</el-button>
        <el-button type="primary" @click="roleAddSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CheckboxCascader from './CheckboxCascader'

export default {
  components: {
    CheckboxCascader
  },
  name: 'RoleAdd',
  data () {
    return {
      role: '',
      firstMenu: '',
      secondMenu: '',
      remark: '',
      // 菜单列表
      options: [],
      // 一级菜单
      firstOptions: [],
      // 二级菜单
      secondOptions: [],
      openSecond: true,
      dialogVisibleAdd: false,
      menuData: []
    }
  },
  methods: {
    // 添加菜单
    checkedOne (val) {
      this.secondOptions = [{label: '二级菜单', prop: 'menu', data: []}]
      let checked = new Map()
      for (let item of val) {
        checked.set(item.menu)
      }
      for (let item of this.options) {
        if (checked.has(item.value)) {
          for (let i = 0; i < item.children.length; i++) {
            this.secondOptions[0].data.push(item.value + '-' + item.children[i])
          }
        }
      }
      this.openSecond = false
    },
    checkedTwo (val) {
      let list = [...val]
      for (let item of val) {
        item.menu = item.menu.split('-')
        item.firstMenu = item.menu[0]
        item.secondMenu = item.menu[1]
        delete item.menu
      }
      for (let i = 0; i < list.length; i++) {
        let key = true
        for (let j = 0, length = this.menuData.length; j < length; j++) {
          if (list[i].firstMenu === this.menuData[j].firstMenu && list[i].secondMenu === this.menuData[j].secondMenu) {
            key = false
          }
        }
        if (key) {
          this.menuData.push(list[i])
        }
      }
    },
    // 删除菜单
    delRow (index, rows) {
      rows.splice(index, 1)
    },
    // 添加角色
    roleAdd () {
      this.$http.get('manage/role-add').then((res) => {
        this.options = [...res.body.data.menu]
        this.firstOptions = [{label: '一级菜单', prop: 'menu', data: []}]
        for (let item of this.options) {
          this.firstOptions[0].data.push(item.value)
        }
        this.dialogVisibleAdd = true
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
    },
    // 提交
    roleAddSubmit () {
      if (this.role === '') {
        this.$message.error('角色不能为空！')
        return
      }
      if (this.menuData.length === 0) {
        this.$message.error('菜单不能为空！')
        return
      }
      this.$http.post('manage/role-add-submit', {
        'role': this.role,
        'menuData': this.menuData,
        'remark': this.remark
      }).then((res) => {
        if (res.body.data) {
          this.role = ''
          this.remark = ''
          this.menuData = []
          this.options = []
          this.firstOptions = []
          this.secondOptions = []
          this.openSecond = true
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          // 更新表格
          this.$emit('loading')
          this.dialogVisibleAdd = false
        } else {
          this.$message.error('服务器异常！')
        }
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
    },
    // 取消
    roleAddCancel () {
      this.role = ''
      this.remark = ''
      this.menuData = []
      this.options = []
      this.firstOptions = []
      this.secondOptions = []
      this.openSecond = true
      this.dialogVisibleAdd = false
      this.$message('已取消添加！')
    }
  }
}
</script>

<style scoped>
.el-row{
  line-height: 36px;
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
}
.el-row .el-col{
  padding: 5px;
}
.el-row>.el-col{
  border-top: 1px solid #dfe6ec;
}
.el-row>.el-col:first-child{
  text-align: center;
}
.el-row>.el-col:nth-child(2){
  border-left: 1px solid #dfe6ec;
}
.RoleAdd>.el-button{
  width: 100%;
}
</style>
