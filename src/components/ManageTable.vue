<!-- 权限管理 -> 二级路由 -->
<template>
  <div class="Manage">
    <el-tabs value="role">
      <!-- 角色管理 -->
      <el-tab-pane label="角色管理" name="role">
        <el-row type="flex" justify="space-between" class="button-row">
          <el-col :xs="24" :sm="16" :md="14" :lg="12">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="inputRole">
                  <template slot="prepend">角色</template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="inputMember">
                  <template slot="prepend">成员</template>
                </el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="4" :md="3" :lg="2">
            <el-row><el-col>
              <el-button icon="plus" @click="dialogVisibleAdd = true" style="width: 100%">添加角色</el-button>
              <el-dialog title="添加角色" v-model="dialogVisibleAdd" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <add-roles></add-roles>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelRoles">取 消</el-button>
                  <el-button type="primary" @click="addRoles">确 定</el-button>
                </span>
              </el-dialog>
            </el-col></el-row>
          </el-col>
        </el-row>
        <el-table :data="tableRole" border style="width: 100%">
          <el-table-column prop="id" label="角色ID" align="center" width="80">
          </el-table-column>
          <el-table-column prop="role" label="角色" align="center" width="150">
          </el-table-column>
          <el-table-column label="菜单管理" align="center" width="120">
            <template scope="scope">
              <el-button @click.native.prevent="menuRole(scope.$index, tableRoleData)" size="small">
                菜单管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="成员管理" align="center" width="120">
            <template scope="scope">
              <el-button @click.native.prevent="memberRole(scope.$index, tableRoleData)" size="small">
                成员管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="checked" label="已选菜单" align="center" :show-overflow-tooltip="true" min-width="200">
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true" min-width="200">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="140">
            <template scope="scope">
              <el-button @click.native.prevent="alertRow(scope.$index, tableRole)" size="small">
                修改
              </el-button>
              <el-dialog title="修改角色" v-model="dialogVisibleModify" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <modify></modify>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelRoles">取 消</el-button>
                  <el-button type="primary" @click="modify">确 定</el-button>
                </span>
              </el-dialog>
              <el-button @click.native.prevent="delRow(scope.$index, tableRole)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 成员管理 -->
      <el-tab-pane label="成员管理" name="member">
        <el-row>
          <el-col :span="6" :offset="18">
            <el-input
              placeholder="请输入关键字搜索"
              icon="search"
              v-model="inputSearch">
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="tableMember" border style="width: 100%">
          <el-table-column prop="id" label="用户ID" align="center" width="80">
          </el-table-column>
          <el-table-column label="用户姓名" align="center">
            <template scope="scope">
            {{tableMember[scope.$index].name}}（{{tableMember[scope.$index].englishName}}）
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户角色" align="center">
          </el-table-column>
          <el-table-column prop="department" label="所属部门" align="center">
          </el-table-column>
          <el-table-column prop="time" label="最后登录时间" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template scope="scope">
              <el-button @click.native.prevent="menuMember(scope, tableMember)" size="small">
                菜单管理
              </el-button>
              <el-button @click.native.prevent="operate(scope.$index, tableMember)" size="small">
                操作权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AddRoles from './AddRoles'
import Modify from './Modify'

export default {
  components: {
    AddRoles,
    Modify
  },
  name: 'Manage',
  data () {
    return {
      inputRole: '',
      inputMember: '',
      inputSearch: '',
      dialogVisibleAdd: false,
      dialogVisibleModify: false,
      tableRoleData: [
        {
          id: 1,
          role: '产品/运营人员',
          checked: '订单查询、欺诈订单、产品配置、收入汇总、统计信息、版本统计信息、应用警报设置、权限申请',
          remark: ''
        }, {
          id: 2,
          role: '技术人员',
          checked: '订单查询、产品配置',
          remark: ''
        }, {
          id: 3,
          role: '财务人员',
          checked: '订单查询、渠道对账收入、FBC对账收入、对账单',
          remark: ''
        }, {
          id: 4,
          role: '商务人员',
          checked: '订单查询、收入汇总、统计信息、渠道对账收入、FBC对账收入、对账单',
          remark: ''
        }, {
          id: 5,
          role: '客服/测试人员',
          checked: '订单查询',
          remark: ''
        }, {
          id: 6,
          role: '普通管理员',
          checked: '【支付服务中心】',
          remark: ''
        }, {
          id: 7,
          role: '超级管理员',
          checked: '【支付服务中心】、【支付系统管理】',
          remark: ''
        }
      ],
      // 接收数据是使用slice()克隆tableMemberData
      tableMemberData: [
        {
          id: 1,
          name: '杨少波',
          englishName: 'SarboYang',
          role: '超级管理员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 22:25:22'
        }, {
          id: 2,
          name: '张磊',
          englishName: 'zhanglei',
          role: '管理员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 22:23:22'
        }, {
          id: 3,
          name: '杨少波',
          englishName: 'SarboYang',
          role: '运营/产品人员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 22:12:22'
        }, {
          id: 4,
          name: '杨少波',
          englishName: 'SarboYang',
          role: '商务人员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 26:22:22'
        }, {
          id: 5,
          name: '杨波',
          englishName: 'SarboYang',
          role: '客服人员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-97 22:22:82'
        }
      ]
    }
  },
  methods: {
    // 菜单管理（角色管理页）
    menuRole (index, rows) {
      console.log(this.$router)
      console.log(rows[index])
      this.$router.push({name: 'MenuRole', query: {id: rows[index].id}})
    },
    // 成员管理
    memberRole (index, rows) {
      console.log(this.$router)
      console.log(rows[index])
      this.$router.push({name: 'MemberRole', query: {id: rows[index].id}})
    },
    // 修改
    alertRow () {
      this.dialogVisibleModify = true
    },
    modify () {
      this.dialogVisibleModify = true
    },
    cancelModify () {
      this.dialogVisibleModify = true
    },
    // 删除
    delRow (index, rows) {

    },
    // 菜单管理（成员管理页）
    menuMember (scope, rows) {
      console.log(scope, rows)
    },
    // 操作权限
    operate () {

    },
    // 添加角色
    addRoles () {
      this.dialogVisibleAdd = false
    },
    cancelRoles () {
      this.dialogVisibleAdd = false
    }
  },
  computed: {
    // 动态渲染表格
    tableMember () {
      if (this.inputSearch === '') {
        return this.tableMemberData
      }
      let search = this.inputSearch
      let data = this.tableMemberData.slice()
      for (let i = 0; i < data.length;) {
        let judge = false
        for (let value in data[i]) {
          // 正则匹配
          judge = judge || (new RegExp(search).test(data[i][value]))
        }
        if (!judge) {
          data.splice(i, 1)
        } else {
          i++
        }
      }
      return data
    },
    // 动态渲染表格
    tableRole () {
      if (this.inputRole === '' && this.inputMember === '') {
        return this.tableRoleData
      }
      let role = this.inputRole
      let member = this.inputMember
      let roleData = this.tableRoleData.slice()
      if (role) {
        for (let i = 0; i < roleData.length;) {
          let judge = false
          // 正则匹配
          judge = judge || (new RegExp(role).test(roleData[i].role))
          if (!judge) {
            roleData.splice(i, 1)
          } else {
            i++
          }
        }
      }
      let memberData = this.tableMemberData.slice()
      let memberRole = []
      if (member) {
        console.log(this.tableMemberData)
        for (let i = 0; i < memberData.length; i++) {
          let judge = false
          judge = judge || (new RegExp(member).test(memberData[i].name))
          if (judge) {
            memberRole.push(memberData[i].role)
          }
        }
        console.log(memberRole)
        for (let i = 0; i < roleData.length;) {
          let judge = false
          for (let j = 0; j < memberRole.length; j++) {
            if (roleData[i].role === memberRole[j]) {
              judge = true
            }
          }
          if (!judge) {
            roleData.splice(i, 1)
          } else {
            i++
          }
        }
      }
      return roleData
    }
  }
}
</script>

<style scoped>
.el-tab-pane {
  margin: 15px;
}
.el-row {
  margin: 15px 0;
}
.button-row>.el-col>.el-row{
  margin: 0;
}
</style>
