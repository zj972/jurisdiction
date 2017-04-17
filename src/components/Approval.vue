<!-- 我的审批 -> 一级路由 -->
<template>
  <div class='my-appoval-wrap' v-loading="loading">
    <h4>审批列表</h4>
    <hr>
    <el-tabs value="viewAuth" @tab-click="tabSwitch">
      <!--查看权限-->
      <el-tab-pane name="viewAuth">
        <span slot="label">
          <el-badge :value="newMsg.arvView" class="item" size="small">
            <div style="margin: -10px 0;">查看权限</div>
          </el-badge>
        </span>

        <ViewApproval :approval-data="approvalData.viewAuth" ref="viewApproval" v-on:refresh="refresh"></ViewApproval>

      </el-tab-pane>

      <!--操作权限-->
      <el-tab-pane name="operateAuth">
        <span slot="label">
          <el-badge :value="newMsg.arvOpt" class="item" size="small">
            <div style="margin: -10px 0;">操作权限</div>
          </el-badge>
        </span>

        <OperateApproval :approval-data="approvalData.operateAuth" ref="operateApproval" v-on:refresh="refresh"></OperateApproval>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import ViewApproval from 'components/ViewApproval'
  import OperateApproval from 'components/OperateApproval'
  export default {
    data () {
      return {
        approvalData: {},
        currentTab: 'viewAuth',
        loading: false
      }
    },
    props: ['newMsg'],
    components: {
      ViewApproval,
      OperateApproval
    },
    methods: {
      tabSwitch (tab) {
        // tab.name === 'viewAuth' ? this.newMsg.arvView = 0 : this.newMsg.arvOpt = 0
        this.currentTab = tab.name
      },
      getData () {
        return this.$http.get('approval/load-data').then(response => {
          this.approvalData = response.body.data
        }, response => {
            // error callback
        })
      },
      refresh () {
        this.loading = true
        this.getData().then(() => {
          // 设置消息数目
          this.newMsg.arvView = this.approvalData.viewAuth.length
          this.newMsg.arvOpt = this.approvalData.operateAuth.length
          this.loading = false
        })
      }
    },
    mounted () {
      this.currentTab = 'viewAuth'
      // 打开loading
      this.loading = true
      // 加载所有审批数据
      this.getData().then((response) => {
        // 关闭loading
        this.loading = false
      })
    },
    computed: {
      multipleSelection () {
        return this.currentTab === 'viewAuth' ? this.viewAuthSelectList : this.operateAuthSelectList
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../common/css/common.styl'
  .my-appoval-wrap
    margin: 0 10px
    .batch-operate
      display: inline-block
    .search-input
      width: 300px
      float: right
      margin-bottom: 10px
</style>
