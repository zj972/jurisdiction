<template>
    <div id=''>
      <div class="view-content">
        <el-table :data="viewAuthData">
          <el-table-column width="180" label="ID" align="center">
            <template scope="scope">
              {{scope.row.authId}}
            </template>
          </el-table-column>
          <el-table-column label="查看权限" align="left">
            <template scope="scope">
              <el-checkbox :disabled="!showFlag" v-model="scope.row.owned" @change="showPrompt(scope.row, $event)">
                {{scope.row.authName}}
              </el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <a class="show-more" @click="showMore" href="javascipt:void(0)">
          <el-button type="text"  :icon="showFlag ? 'arrow-up' : 'arrow-down'"></el-button>
        </a>
      </div>
      <!--申请理由-->
      <div class="application-reason-wrap">
        <el-input type="textarea" :rows="7" placeholder="请填写申请原因(必填)" v-model="applyReason"></el-input>
      </div>
      <!--底部按钮-->
      <div class="bottom-btn-wrap">
        <el-button type="primary" @click="cancelApply">取消</el-button>
        <el-button type="primary" @click="apply">提出申请</el-button>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
      data () {
        return {
          showFlag: false,
          applyReason: '',
          ownedViewAuth: [],
          allViewAuth: []
        }
      },
      methods: {
        getData () {
          // 获取申请人已拥有的查看权限和基本信息
          return this.$http.get('apply/view-auth').then(response => {
            this.allViewAuth = response.body.data
          }, response => {
            // error callback
          })
        },
        // 获取已经拥有的查看权限列表
        getOwned () {
          this.ownedViewAuth = this.allViewAuth.filter((item) => {
            return item.owned
          })
        },
        // 展示隐藏查看权限
        showMore () {
          this.showFlag = !this.showFlag
        },
        // 选择不属于自己角色的权限时，打开警告提示
        showPrompt (row, $event) { // 这里必须传引用类型
          if ($event.target.checked) {
            this.$confirm('如果您申请的内容与自己的工作职责不符，将不会予以通过,请慎重申请，谢谢', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'cancel-btn',
              confirmButtonClass: 'confirm-btn',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              row.owned = true
            }).catch(() => {
              row.owned = false
            })
          }
        },
        // 重置表单
        reset () {
          this.applyReason = ''
          // 这里重新请求一遍数据
//          this.getData()
          // 菜单收起
          this.showFlag = false
        },
        // 格式化申请数据
        formatApplyData () {
          let _oneApply = {}
          _oneApply.auth = []
          _oneApply.reason = this.applyReason
          // 判断查看权限是否为空,数据格式转换
          this.viewAuthData.forEach((item) => {
            if (item.owned) {
              _oneApply.auth.push(item.authId)
            }
          })
          return _oneApply
        },
        // 申请数据格式验证
        applyValidate (oneApply) {
          if (!oneApply.auth.length) {
            this.$message.warning('请至少选择一种权限')
            return false
          } else if (oneApply.reason.trim() === '') {
            this.$message.warning('申请理由不能为空')
            return false
          }
          return true
        },
        // 发送权限申请请求
        sendHttpReq (oneApply) {
          return this.$http.post('apply/view-auth-apply', oneApply).then(response => {
            if (response.body.error_code === 0) {
              this.$message.success('申请成功')
            } else {
              this.$message.error('参数错误')
            }
          }, response => {
            this.$message.error('服务器异常')
          })
        },
        apply () {
          // 整合数据 查看权限  +  申请理由
          let _oneApply = this.formatApplyData()
          if (this.applyValidate(_oneApply)) {
            // 满足申请条件，发送ajax请求
            this.sendHttpReq(_oneApply).then(() => {
              // 重置页面
              this.reset()
            })
//            console.log('这是查看权限申请数据内容')
//            console.log(_oneApply)
          }
        },
        cancelApply () {
          this.$confirm('确定取消申请吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message.success('已取消申请')
          }).catch(() => {

          })
        }
      },
      computed: {
        viewAuthData () {
          return (this.viewAuthData = this.showFlag ? this.allViewAuth : this.ownedViewAuth)
        }
      },
      mounted () {
        // 获取已有查看权限数据
        this.getData().then(() => {
          this.getOwned()
        })
      }
    }
</script>

<style>
  .show-more{
    display: block;
  }

  .show-more {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    text-align: center;
    background: lightgray;
  }

  .view-content {
    width: 400px;
    margin: 5px 0 10px 0;
    border-radius: 50px;
    line-height: 34px;
  }

  .cancel-btn {
    background: #20A0FF;
    color: #fff;
    border:none;
  }

  .cancel-btn:hover {
    background: #20A0FF;
    color: #fff;
    border:none;
  }

  .confirm-btn:focus{
    background: #e5e5e5;
    border:none;
  }
  .confirm-btn:hover{
    background: #e5e5e5;
  }
  .confirm-btn {
    background: #e5e5e5;
    border:none;
  }
</style>
