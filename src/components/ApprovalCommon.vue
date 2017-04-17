<template>
    <div id=''>
      <!--公共部分-->
      <div class="batch-operate">
        <el-button type="primary" size="small" @click="operateBatch(selectList, true, authPassBatch)">批量通过</el-button>
        <el-button type="warning" size="small" @click="operateBatch(selectList, false, authRejectBatch)">批量驳回</el-button>
      </div>
      <div class="clearfix" size="small">
        <el-input class="search-input" placeholder="请输入关键字" icon="search" @change="sendKeyWords" v-model="keywords"></el-input>
      </div>
    </div>


</template>

<script type="text/ecmascript-6">
    export default {
      data () {
        return {
          keywords: ''
        }
      },
      props: ['selectList'],
      methods: {
        operateBatch (selectList, flag, callback) {
          let _data = {}
          if (!selectList.length) {
            this.$message({
              message: '请至少选择一项',
              type: 'warning'
            })
            return
          }
          _data.idList = selectList.map((item) => {
            return item.uuid
          })

          if (!flag) {
            this.$prompt('驳回理由', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              _data.reason = value
              // 这里是异步的不能放在
              if (callback) {
                callback(_data).then(() => {
                  this.$emit('refreshData')
                })
              }
            }).catch(() => {
              // todo
            })
          } else {
            if (callback) {
              callback(_data).then(() => {
                this.$emit('refreshData')
              })
            }
          }
          console.log(_data)
        },
        authPassBatch (passList) {
          return this.$http.post(`approval/pass-batch`, passList).then(response => {
            // {idList:['1', '2']}
            // 根据状态值判断，进行相关操作
            if (response.body.error_code === 0) {
              this.$message({
                message: '批量通过成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '参数错误',
                type: 'error'
              })
            }
          }, response => {
            this.$message({
              message: '服务器错误',
              type: 'error'
            })
          })
        },
        authRejectBatch (rejectList) {
          return this.$http.post(`approval/reject-batch`, rejectList).then(response => {
            // {idList:['1', '2']}
            // 根据状态值判断，进行相关操作
            if (response.body.error_code === 0) {
              this.$message({
                message: '批量拒绝成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '参数错误',
                type: 'error'
              })
            }
          }, response => {
            // error callback
            this.$message({
              message: '服务器错误',
              type: 'error'
            })
          })
        },
        sendKeyWords () {
          this.$emit('resolveInput', this.keywords)
        }
      }
    }
</script>

<style>
</style>
