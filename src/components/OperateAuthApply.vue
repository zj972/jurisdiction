<template>
    <div id=''>
      <!--权限选择器-->
      <div class="select-auth-wrap">
        <span>应用版本：</span>
        <select-auth v-on:addSelData="addSelData"></select-auth>
      </div>
      <!--待添加权限表格-->
      <div class="add-auth-wrap">
        <h4 style="margin-bottom:20px">待添加列表</h4>
        <el-table :data="waitingAdd" border style="width: 100%" :fit="true">
          <el-table-column prop="game.name" label="游戏" align="center" width="150"></el-table-column>
          <el-table-column prop="platform.name" label="平台" align="center"  width="150">
          </el-table-column>
          <el-table-column prop="hall.name" label="大厅" align="center"  width="100"></el-table-column>
          <el-table-column prop="terminal.name" label="终端" align="center"  width="150"></el-table-column>
          <el-table-column prop="apk.name"label="应用包" align="center"></el-table-column>
          <el-table-column label="APPID应用" align="center"  prop="appid" width="150">
            <template scope="scope">
              <el-button size="small" type="default" @click="getAppid(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="权限内容" align="left"  header-align="center" >
            <template scope="scope">
              <el-checkbox  :key="index" v-for="(item, index) in scope.row.auth" v-model="item.owned">{{item.name}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="业务审核人" prop="handler.name" align="center" width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="150" fixed="right">
            <template scope="scope">
              <el-button size="small" type="default" @click="addAuth(scope.row, scope.$index)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--已添加权限表格-->
      <div class="own-auth-wrap" >
        <h4 style="margin-bottom:20px">申请列表</h4>
        <el-table :data="addedData" border  :fit="true" :highlight-current-row="true" row-key="appid" :current-row-key="currentAppid">
          <el-table-column prop="game.name" label="游戏" align="center" width="150"></el-table-column>
          <el-table-column prop="platform.name" label="平台" align="center" width="150"></el-table-column>
          <el-table-column prop="hall.name" label="大厅" align="center"  width="100"></el-table-column>
          <el-table-column prop="terminal.name" label="终端" align="center"  width="150"></el-table-column>
          <el-table-column prop="apk.name" label="应用包" align="center" ></el-table-column>
          <el-table-column label="APPID应用" align="center"  width="150">
            <template scope="scope">
              <el-button size="small" @click="getAppid(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="权限内容" align="left"  header-align="center">
            <template scope="scope">
              <el-checkbox  :key="index" v-for="(item, index) in scope.row.auth" v-model="item.owned" disabled>{{item.name}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="业务审核人" prop="handler.name" align="center" width="150"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="150">
            <template scope="scope">
              <el-button size="small" type="danger" @click="deleteAuth(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--申请理由表单-->
      <div class="application-reason-wrap">
        <el-input type="textarea" :rows="7" placeholder="请填写申请原因(必填)" v-model="applyReason"></el-input>
      </div>
      <!--底部按钮-->
      <div class="bottom-btn-wrap">
        <el-button type="primary" @click="cancelApply">取消</el-button>
        <el-button type="primary" @click="apply">提出申请</el-button>
      </div>

      <AppIdTable ref="appidTable"></AppIdTable>
    </div>
</template>

<script type="text/ecmascript-6">
  import SelectAuth from 'components/SelectAuth'
  import AppIdTable from 'components/AppIdTable'
  export default {
    data () {
      return {
        applyReason: '',  // 申请理由
        currentAppid: '',
        waitingAdd: [],   // 待添加APPID权限申请列表
        addedData: []    // 已添加APPID权限申请列表
      }
    },
    methods: {
      // 用来判断选择的appid是否已经在待添加列表或者addedList中
      isExist (appid, selectArr) {
        // 判断是否已经选择该appid
        for (let index = 0; index < selectArr.length; index++) {
          if (selectArr[index].appid === appid) {
            this.$message.error('已存在申请列表中，如要重新申请，请先删除，谢谢')
            return index
          }
        }
        return -1
      },
      // 选择器子组件触发事件
      addSelData (selectList) {
        // 1 处理选择器传来的数据
        let _selectList = selectList
        // 1 获取操作权限列表,处理人等等信息
        this.getResult(_selectList).then(res => {
          // 2 将返回信息赋给waitingAdd数组
          console.log('待添加列表数据')
          console.log(this.waitingAdd)
        })
      },
      // 获取操作权限列表
      getResult (selectList) {
        let _selectList = selectList
        // 根据APPID获取权限列表和该用户已有的权限 （这里可能要和那边协商一下）
        return this.$http.post('apply/appid-action', _selectList).then(response => {
          if (response.body.error_code === 0) {
            this.waitingAdd = this.waitingAdd.concat(response.body.data)
            console.log('数据数组合并')
            console.log(this.waitingAdd)
          } else {
            this.$message.error('参数错误')
          }
        }, response => {
          this.$message.error('服务器异常')
        })
      },
      // 将待添加权限中的条目添加到已申请添加列表中
      addAuth (item, index) {
        // 1判断选择的appid是否已经在待添加列表或者addedList中
//        let _flag = this.isExist(item.appid, this.addedData)
//        if (_flag > -1) {
//          // 把有重复的那个重新渲染一下
//          this.currentAppid = item.appid
//          return
//        }

        // 判断是否选择权限
        let _hadSct = item.auth.some(item => {
          return item.owned
        })

        if (!_hadSct) {
          this.$message.warning('请添加至少一种权限')
          return
        }

        // 添加权限
        this.addedData.push(item)
        // 将预添加队列中的删除
        this.waitingAdd.splice(index, 1)
      },
      // 从已申请添加列表中移除
      deleteAuth (item, index) {
        this.addedData.splice(index, 1)
        this.$message({
          message: '已删除该条申请',
          type: 'success'
        })
      },
      // 取消申请
      cancelApply () {
        this.$confirm('确定取消申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('已取消申请')
        }).catch(() => {

        })
      },
      // 重置页面
      reset () {
        this.applyReason = ''
        this.addedData = []
        this.waitingAdd = []
      },
      // 申请数据格式化
      formatApplyData () {
        // 整合数据 addedData(操作权限)  +  申请理由
        let _oneApply = {}
        let _authList = []
        this.addedData.forEach((item) => {
          let _oneData = {}
          _oneData.auth = []
          item.auth.forEach((item) => {
            if (item.owned) {
              _oneData.auth.push(item.id)
            }
          })
          _oneData.handler = item.handler.enname
          let _bpid = _oneData.bpid = {}
          _bpid.game = item.game
          _bpid.platform = item.platform
          _bpid.hall = item.hall
          _bpid.terminal = item.terminal
          _bpid.apk = item.apk
          _authList.push(_oneData)
        })

        _oneApply.applyList = _authList
        _oneApply.reason = this.applyReason
        return _oneApply
      },
      // 发送申请请求
      sendHttpReq (oneApply) {
        // 满足申请条件，发送ajax请求
        return this.$http.post('apply/operate-auth-apply', oneApply).then(response => {
          if (response.body.error_code === 0) {
            this.$message.success('申请成功')
          } else {
            this.$message.error('参数错误')
            return
          }
        }, response => {
          this.$message.error('服务器异常')
        })
      },
      // 申请数据验证
      applyValidate (oneApply) {
        if (oneApply.applyList.length === 0) {
          this.$message.warning('请选择应用和权限')
          return false
        } else if (oneApply.reason.trim() === '') {
          this.$message.warning('申请理由不能为空')
          return false
        }
        return true
      },
      apply () {
        // 拿到格式化后的数据
        let _apply = this.formatApplyData()
        // 数据有效性验证
        if (this.applyValidate(_apply)) {
          // 发送请求
          this.sendHttpReq(_apply).then(() => {
            // 请求成功后，完成页面数据重置
            this.reset()
            // 触发获取新条目数据
            // this.$emit('getNewMsg')
          })
          console.log('这就是一条操作权限申请数据')
          console.log(_apply)
        }
      },
      getAppid (params) {
        // 打开appid列表
        this.$refs.appidTable.getAppid(params)
      }
    },
    components: {
      SelectAuth,
      AppIdTable
    }
  }
</script>

<style>
  .current-row>td {
    background: lightcoral;
  }
</style>
