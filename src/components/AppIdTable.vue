<template>
    <div id='appid-table'>
      <el-dialog title="所有APPID" v-model="dialogVisible" size="tiny" @close="closeDialog">
        <div style="max-height: 450px;overflow: auto;" v-loading.body="appidListLoading">
          <el-table border :data="appidList" >
            <el-table-column prop="name" label="应用名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="id" label="appid" align="center" header-align="center"> </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">

          </span>
        </div>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
      data () {
        return {
          dialogVisible: false, // 是否显示appidList对话框
          appidListLoading: false,
          appidList: [] // appid列表
        }
      },
      methods: {
        closeDialog () {
          this.dialogVisible = false
          this.appidListLoading = false
        },
        getAppid (params) {
          // 打开对话框
          this.appidListLoading = true
          this.dialogVisible = true
          let _params = {}
          _params.game = params.game.id
          _params.platform = params.platform.id
          _params.hall = params.hall.id
          _params.terminal = params.terminal.id
          _params.apk = params.apk.id

          console.log(_params)
          // 整合请求参数
          this.$http.post('api/get-appid', _params).then(response => {
            this.appidListLoading = false
            if (response.body.error_code === 0) {
              this.appidList = response.body.data
            } else {
              this.$message({
                message: '后台开发中',
                type: 'error'
              })
            }
          }, response => {
            // error callback
          })
        }
      }
    }
</script>

<style>
</style>
