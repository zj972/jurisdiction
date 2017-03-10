<!-- 权限管理 -> 成员管理 -> 操作权限 -> 二级路由 -->
<template>
  <div class="MemberOperation">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row>
      <el-row>
        <el-col :xs="24" :sm="3" :md="2" :lg="2">操作权限赋予：</el-col>
        <el-col :xs="24" :sm="21" :md="22" :lg="22">
          <!-- 选择器 -->
        </el-col>
      </el-row>
      <!-- 添加列表 -->
      <el-row>
        <el-table :data="tableDataAdd" border style="width: 100%" max-height="250">
            <el-table-column
              v-for="(header,index) in tableHeader"
              :prop="header.prop"
              :label="header.label"
              :key="index"
              align="center">

            </el-table-column>
            <el-table-column label="权限内容" align="center" width="220">
              <template scope="scope">
                <el-checkbox v-model="scope.row.content.refund">发货退款</el-checkbox>
                <el-checkbox v-model="scope.row.content.alarm">报警设置</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="业务审核人" prop="verifier" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="100">
              <template scope="scope">
                <el-button @click.native.prevent="addRow(scope.$index, tableDataAdd)" size="small">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
      <div class="border-bottom"></div>
      <!-- 已有列表 -->
      <el-row>
        <el-col class="list-title">已有操作权限列表：</el-col>
        <el-col class="button"><el-row>
          <el-col :xs="24" :sm="14" :md="16" :lg="18">
            <el-button type="primary">批量修改</el-button>
            <el-button type="primary">批量删除</el-button>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="6">
            <el-input placeholder="请输入关键字搜索"></el-input>
          </el-col>
        </el-row></el-col>
        <el-table :data="tableDataDel" border style="width: 100%" max-height="250">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            v-for="(header,index) in tableHeader"
            :prop="header.prop"
            :label="header.label"
            :key="index"
            align="center">
          </el-table-column>
          <el-table-column label="权限内容" align="center" width="220">
            <template scope="scope">
              <el-checkbox v-model="scope.row.content.refund" disabled>发货退款</el-checkbox>
              <el-checkbox v-model="scope.row.content.alarm" disabled>报警设置</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="业务审核人" prop="verifier" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableDataDel)" size="small">
                修改
              </el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, tableDataDel)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 申请理由 -->
      <el-row>
        <el-col class="list-title">申请理由：</el-col>
        <el-input
          v-model="reason"
          type="textarea"
          :rows="4"
          placeholder="请输入内容">
        </el-input>
      </el-row>
      <!-- 提交 -->
      <el-row type="flex" justify="center" class="button-submit">
        <el-col :xs="12" :sm="6" :md="5" :lg="3"><el-button type="primary" size="large" @click="cancel">取消</el-button></el-col>
        <el-col :xs="12" :sm="6" :md="5" :lg="4"><el-button type="primary" size="large" @click="submit">提交申请</el-button></el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MemberOperation',
  data () {
    return {
      role: '产品/运营人员',
      msg: {
        name: '杨少波',
        englishName: 'SarboYang',
        department: '业务支持中心/数据支付部/前端组'
      },
      view: ['订单查询', '欺诈订单', '统计信息'],
      viewList: ['订单查询', '欺诈订单', '统计信息', '产品配置', '收入汇总', '应用警报设置', '财务对账'],
      state: true,
      number: 3,
      dialogVisible: false,
      reason: '',
      tableHeader: [
        {
          prop: 'game',
          label: '游戏'
        }, {
          prop: 'platform',
          label: '平台'
        }, {
          prop: 'hall',
          label: '大厅'
        }, {
          prop: 'terminal',
          label: '终端'
        }, {
          prop: 'package',
          label: '应用包'
        }, {
          prop: 'appid',
          label: 'APPID应用'
        // }, {
        //   prop: 'content',
        //   label: '权限内容',
        //   button: [
        //     '发货退款',
        //     '报警设置'
        //   ]
        }
      ],
      tableDataAdd: [
        {
          game: '1',
          platform: '2',
          hall: '3',
          terminal: '4',
          package: '5',
          appid: '6',
          verifier: '7',
          content: {
            refund: true,
            alarm: false
          }
        }, {
          game: '11',
          platform: '22',
          hall: '33',
          terminal: '44',
          package: '55',
          appid: '66',
          verifier: '77',
          content: {
            refund: true,
            alarm: true
          }
        }, {
          game: '111',
          platform: '222',
          hall: '333',
          terminal: '444',
          package: '555',
          appid: '666',
          verifier: '777',
          content: {
            refund: false,
            alarm: true
          }
        }, {
          game: '12',
          platform: '23',
          hall: '34',
          terminal: '45',
          package: '56',
          appid: '67',
          verifier: '78',
          content: {
            refund: true,
            alarm: false
          }
        }
      ],
      tableDataDel: [
      ]
    }
  },
  methods: {
    // 更多
    more () {
      if (this.state) {
        this.number = this.viewList.length
        this.state = false
      } else {
        this.number = 3
        this.state = true
      }
    },
    // 添加到已申请列表
    addRow (index, rows) {
      this.tableDataDel.push(rows[index])
      rows.splice(index, 1)
    },
    // 从已申请列表删除
    deleteRow (index, rows) {
      this.$confirm('此操作将删除该条申请信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rows.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 取消
    cancel () {
      this.$confirm('此操作将删除上面所选申请信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableDataAdd = []
        this.tableDataDel = []
        // view初始化
        this.view = []
        this.reason = ''
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 提交
    submit () {
      this.$confirm('此操作将提交上面所选申请信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 提交
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    }
  }
}
</script>

<style scoped>
.MemberOperation{
  margin: 10px;
}
.proposer{
  line-height: 34px;
}
.content>span:first-child,
.proposer>span:first-child{
  display: block;
  font-weight: bold;
  line-height: 24px;
}
.content .el-row{
  margin: 15px 0;
}
.content .el-row>.el-col:first-child{
  font-weight: bold;
}
.more{
  margin-left: 15px;
}
.list-title{
  line-height: 34px;
}
.button-submit{
  text-align: center;
}
table td{
  background: red;
}
.button{
  margin: 10px 0;
}
</style>
