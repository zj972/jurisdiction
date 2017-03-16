<!-- 权限管理 -> 成员管理 -> 操作权限 -> 二级路由 -->
<template>
  <div class="MemberOperation">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row>
      <el-row class="border-bottom select-btn">
        <el-col>
          <span>操作权限赋予：</span>
          <!-- 选择器 -->
          <selector></selector>
        </el-col>
      </el-row>
      <!-- 添加列表 -->
      <el-row>
        <el-table :data="tableAddData" border style="width: 100%" max-height="250">
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
                <el-button @click.native.prevent="addRow(scope.$index, tableAddData)" size="small">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
      <!-- 已有列表 -->
      <el-row>
        <el-col class="list-title">已有操作权限列表：</el-col>
        <el-col class="border-bottom"></el-col>
        <el-col class="button"><el-row>
          <el-col :xs="24" :sm="14" :md="16" :lg="18">
            <el-button type="primary" @click="alertRowDialog(multipleSelection)">批量修改</el-button>
            <el-button type="primary" @click="deleteRow(multipleSelection)">批量删除</el-button>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="6">
            <el-input placeholder="请输入关键字搜索" v-model="inputSearch"></el-input>
          </el-col>
        </el-row></el-col>
        <el-table :data="tableDel" border style="width: 100%" max-height="250" @selection-change="handleSelectionChange">
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
          <el-table-column fixed="right" label="操作" align="center" width="140">
            <template scope="scope">
              <el-button @click.native.prevent="alertRowDialog([tableDel[scope.$index].id])" size="small">
                修改
              </el-button>
              <el-button @click.native.prevent="deleteRow([tableDel[scope.$index].id])" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="批量修改" v-model="dialogVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align="center">
          <el-checkbox v-model="refund">发货退款</el-checkbox>
          <el-checkbox v-model="alarm">报警设置</el-checkbox>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAlertRow">取 消</el-button>
            <el-button type="primary" @click="alertRow()">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Selector from './Selector'

export default {
  name: 'MemberOperation',
  components: {
    Selector
  },
  data () {
    return {
      role: '',
      inputSearch: '',
      dialogVisible: false,
      refund: false,
      alarm: false,
      multipleSelection: [],
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
        }
      ],
      tableAddData: [],
      tableDelData: [],
      alertRowData: []
    }
  },
  methods: {
    // 添加到已申请列表
    addRow (index, rows) {
      this.$confirm('此操作将添加该APPID操作权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('http://localhost:3000/memberOperationAdd?id=', rows[index].id).then((res) => {
          if (res.data.msg) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.tableDelData.push(rows[index])
            rows.splice(index, 1)
            this.load()
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消添加'
        })
      })
    },
    // 从已申请列表删除
    deleteRow (index) {
      let id = index
      if (id.length !== 0) {
        this.$confirm('此操作将删除已有操作权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/memberOperationDel', id).then((res) => {
            if (res.data.msg) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              for (let i = 0; i < id.length; i++) {
                for (let j = 0; j < this.tableDelData.length; j++) {
                  if (id[i] === this.tableDelData[j].id) {
                    this.tableDelData.splice(j, 1)
                  }
                }
              }
            } else {
              this.$message.error('服务器异常！')
            }
          }, (res) => {
            // error callback
            this.$message.error('服务器异常！')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.error('请选择要删除的操作权限！')
      }
    },
    alertRowDialog (index) {
      if (index.length !== 0) {
        this.dialogVisible = true
        this.alertRowData = index
      } else {
        this.$message.error('请选择要修改的操作权限！')
      }
    },
    cancelAlertRow () {
      this.dialogVisible = false
    },
    // 修改已申请列表
    alertRow () {
      if (this.alertRowData.length !== 0) {
        let data = {
          id: this.alertRowData,
          status: {
            refund: this.refund,
            alarm: this.alarm
          }
        }
        this.$http.post('http://localhost:3000/memberOperationAlert', data).then((res) => {
          if (res.data.msg) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.load()
            this.dialogVisible = false
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择要修改的操作权限！')
      }
    },
    // 加载数据
    load () {
      this.role = this.getUrl('role')
      let id = this.getUrl('id')
      this.$http.get('http://localhost:3000/memberOperation?id=' + id).then((res) => {
        this.tableDelData = res.data.list.slice()
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
    },
    // 获取url参数
    getUrl (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = window.location.search.substr(1).match(reg)
      if (r !== null) {
        return decodeURIComponent(decodeURI(r[2]))
      }
      return null
    },
    handleSelectionChange (val) {
      let id = []
      for (let i = 0; i < val.length; i++) {
        id.push(val[i].id)
      }
      this.multipleSelection = id
      console.log(this.multipleSelection)
    },
    addSelData (data) {
      // 加入等待队列
      //  这里要对数据格式做些处理，然后push到waitingAdd数组中
      let _dataCache = {}
      _dataCache.game = data[0]['isAll'] ? ['全部游戏'] : data[0]['checked']
      _dataCache.platform = data[1]['isAll'] ? ['全部平台'] : data[1]['checked']
      _dataCache.hall = data[2]['isAll'] ? ['全部'] : data[2]['checked']
      _dataCache.terminal = data[3]['isAll'] ? ['全部'] : data[3]['checked']
      _dataCache.appPackage = data[4]['isAll'] ? ['全部'] : data[4]['checked']
      _dataCache.appid = data[5]['isAll'] ? ['全部'] : data[5]['checked']
      _dataCache.deliverRefund = false
      _dataCache.warningSetting = false
      console.dir(_dataCache)
      this.waitingAdd.push(_dataCache)
    }
  },
  computed: {
    tableDel () {
      if (this.inputSearch === '') {
        return this.tableDelData
      }
      let search = this.inputSearch
      let data = this.tableDelData.slice()
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
    }
  },
  // 初始化
  mounted () {
    this.load()
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
  margin-top: 16px;
}
.button-submit{
  text-align: center;
  margin: 10px 0;
}
table td{
  background: red;
}
.button{
  margin: 10px 0;
}
.select-btn{
  padding: 5px 0;
  margin-bottom: 10px;
}
</style>
