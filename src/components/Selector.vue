<!-- 未完成 -->
<template>
  <div class="Selector">
    <el-dropdown trigger="click" :hide-on-click="false" menu-align="start">
      <el-button type="primary">
        --请选择--</i>
      </el-button>
      <el-dropdown-menu slot="dropdown" class="select-popover">
        <el-row>
          <el-col :span="6">
            <el-menu>
              <el-menu-item
                v-for="(list, index) in tableLists"
                :index="list.prop"
                :key="index">请选择{{list.label}}
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="18">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city">{{city}}</el-checkbox>
            </el-checkbox-group>
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
      msg: 'Welcome to Selector.vue',
      tableLists: [
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
      ]
    }
  }
}
</script>

<style scoped>
.select-popover{
  padding: 0;
  width: 700px;
}
</style>
