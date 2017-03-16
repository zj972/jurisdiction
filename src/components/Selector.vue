<!-- 权限申请/权限管理 -> 选择器 -> 子组件 -->
<template>
  <div class="Selector">
    <el-dropdown trigger="click" :hide-on-click="false" menu-align="start">
      <el-button>
        --请选择--
      </el-button>
      <el-dropdown-menu slot="dropdown" class="select-popover">
        <el-row class="head">
          <el-col :span="12">应用选择器</el-col>
          <el-col :span="12" align="right">
            <el-button>确定</el-button>
            <el-button>重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-menu>
              <el-menu-item
                v-for="(list, index) in leftList"
                :index="list.prop"
                :key="index"
                v-text="'请选择' + list.label"
                @click="focus = list.prop">
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="18" class="content">
            <el-row v-for="(list, index) in rightList"
              v-show="list.prop === focus">
              <el-input placeholder="请输入关键字" icon="search"></el-input>
              <el-table
                :data="list.data"
                border
                style="width: 100%"
                height="270"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="50">
                </el-table-column>
                <el-table-column
                  :label="'所有' + list.label"
                  prop="data">
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Selector',
  data () {
    return {
      focus: '',
      leftList: [
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
      rightList: [
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
      appid: [
        {
          id: 1,
          game: '德州扑克',
          platform: '2',
          hall: '3',
          terminal: '4',
          package: '5',
          appid: '6'
        }
      ]
    }
  }
}
</script>

<style scoped>
.Selector{
  display: inline-block;
}
.head{
  background: #8492A6;
  color: #fff;
  line-height: 50px;
  padding: 0 10px;
}
.select-popover{
  padding: 0;
  width: 700px;
}
.content{
  padding: 10px;
}
.el-table{
  margin-top: 10px;
}
</style>
