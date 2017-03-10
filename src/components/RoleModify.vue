<!-- 权限管理 -> 角色管理 -> 修改角色 -> 子组件 -->
<template>
  <div class="RoleModify">
    <el-row>
      <el-col :span="6">角色</el-col>
      <el-col :span="18">
      <el-input v-model="role" placeholder="请输入内容"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">菜单选择</el-col>
      <el-col :span="18">
        <el-row type="flex" justify="space-between">
        <el-select v-model="firstMenu" placeholder="一级菜单请选择" @change="toSecond">
          <el-option
            v-for="item in firstOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value">
          </el-option>
        </el-select>
        <el-select v-model="secondMenu" :disabled="disable" placeholder="二级菜单请选择" @change="addList">
          <el-option
            v-for="item in secondOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value">
          </el-option>
        </el-select>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">已选菜单</el-col>
      <el-col :span="18">
        <el-table :data="tableData">
          <el-table-column
            prop="firstMenu"
            label="一级菜单"
            align="center">
          </el-table-column>
          <el-table-column
            prop="secondMenu"
            label="二级菜单"
            align="center">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center">
            <template scope="scope">
              <el-button @click.native.prevent="delRow(scope.$index, tableData)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">备注</el-col>
      <el-col :span="18">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'RoleModify',
  data () {
    return {
      role: '',
      firstMenu: '',
      secondMenu: '',
      textarea: '',
      disable: true,
      firstValue: '',
      secondValue: '',
      firstOptions: [
        {
          value: '选项11',
          label: '黄金糕',
          children: [
            {
              value: '选项21',
              label: '双皮奶'
            }, {
              value: '选项22',
              label: '双皮奶'
            }, {
              value: '选项23',
              label: '双皮奶'
            }, {
              value: '选项24',
              label: '双皮奶'
            }
          ]
        }, {
          value: '选项12',
          label: '双皮奶',
          children: [
            {
              value: '选项31',
              label: '双皮1奶'
            }, {
              value: '选项32',
              label: '双皮2奶'
            }, {
              value: '选项33',
              label: '双皮3奶'
            }, {
              value: '选项34',
              label: '双皮4奶'
            }
          ]
        }, {
          value: '选项13',
          label: '蚵仔煎',
          children: [
            {
              value: '选项21',
              label: '双3皮奶'
            }, {
              value: '选项22',
              label: '双45皮奶'
            }, {
              value: '选项23',
              label: '双12皮奶'
            }, {
              value: '选项24',
              label: '双23皮奶'
            }
          ]
        }, {
          value: '选项14',
          label: '龙须面',
          children: [
            {
              value: '选项21',
              label: '双3皮奶'
            }, {
              value: '选项22',
              label: '双45皮奶'
            }, {
              value: '选项23',
              label: '双12皮奶'
            }, {
              value: '选项24',
              label: '双23皮奶'
            }
          ]
        }, {
          value: '选项15',
          label: '北京烤鸭',
          children: [
            {
              value: '选项21',
              label: '双3皮奶'
            }, {
              value: '选项22',
              label: '双45皮奶'
            }, {
              value: '选项23',
              label: '双12皮奶'
            }, {
              value: '选项24',
              label: '双23皮奶'
            }
          ]
        }
      ],
      secondOptions: [],
      tableData: []
    }
  },
  methods: {
    delRow (index, rows) {
      rows.splice(index, 1)
    },
    toSecond (value) {
      this.firstValue = value
      this.disable = false
      for (let list of this.firstOptions) {
        if (list.value === value) {
          this.secondOptions = list.children.slice()
        }
      }
    },
    addList (value) {
      this.secondValue = value
      this.tableData.push({
        firstMenu: this.firstValue,
        secondMenu: this.secondValue
      })
    }
  }
}
</script>

<style scoped>
.el-row{
  line-height: 36px;
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
}
.el-row .el-col{
  padding: 5px;
}
.el-row>.el-col{
  border-top: 1px solid #dfe6ec;
}
.el-row>.el-col:first-child{
  text-align: center;
}
.el-row>.el-col:nth-child(2){
  border-left: 1px solid #dfe6ec;
}
</style>
