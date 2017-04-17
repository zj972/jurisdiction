<!-- 权限申请 -> 一级路由 -->
<template>
  <div id="auth-apply">
    <div class="applicant-msg">
      <span class="border-bottom">申请人</span>
      <el-row>
        <el-col :xs="24" :sm="8" :md="6" :lg="5">
          姓名：
          <span v-text="userMsg.name"></span>
          (
          <span>{{userMsg.enname}}</span>
          )
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="7">
          所属部门：
          <span v-text="userMsg.department"></span>
        </el-col>
      </el-row>
    </div>
    <el-row class="authority">
      <el-col class="border-bottom">申请内容：</el-col>
      <el-col :xs="24" :sm="3" :md="2" :lg="2">应用权限：</el-col>
      <el-col :xs="24" :sm="21" :md="22" :lg="22">
        支付后台APPID权限，会根据数据后台的BPID权限自动开通，如果没有某个应用的appid权限，请自行去data后台开通对应的bpid权限，如果在数据后台开通权限后，在支付后台还是提示无权限，请退出账号，清空浏览器缓存，重新登录一下即可查看；如果有疑问，请及时联系AnneDu，谢谢。
      </el-col>
    </el-row>
    <el-tabs value="first" style="min-height:400px">
      <el-tab-pane label="查询权限" name="first">
        <ViewAuthApply></ViewAuthApply>
      </el-tab-pane>
      <el-tab-pane label="操作权限" name="second">
        <OperateAuthApply></OperateAuthApply>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ViewAuthApply from 'components/ViewAuthApply'
  import OperateAuthApply from 'components/OperateAuthApply'
  export default {
    name: 'apply',
    props: ['userMsg'],
    components: {
      ViewAuthApply,
      OperateAuthApply
    }
  }
</script>

<style scope>
  #auth-apply {
    margin: 10px;
  }

  .applicant-msg {
    line-height: 28px
  }

  .applicant-msg > span:first-child {
    display: block;
    font-weight: bold;
  }

  .authority > .el-col:first-child,
  .authority > .el-col:nth-child(2) {
    font-weight: bold;
  }


  .my-table td {
    text-align: center;
  }

  .view-content .more-content {
    display: inline-block
  }

  .select-auth-wrap,
  .add-auth-wrap,
  .own-auth-wrap,
  .application-reason-wrap,
  .bottom-btn-wrap {
    margin-bottom: 50px;
  }

  .bottom-btn-wrap {
    text-align: center;
  }
</style>
