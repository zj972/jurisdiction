<template>
  <div class="Application">
    <div class="proposer">
      <span class="border-bottom">申请人：</span>
      <el-row>
        <el-col :xs="24" :sm="8" :md="6" :lg="5">
          姓名：
          <span v-text="msg.name"></span>
          (
          <span v-text="msg.englishName"></span>
          )
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="7">
          所属部门：
          <span v-text="msg.department"></span>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <span class="border-bottom">申请内容：</span>
      <el-row>
        <el-col :xs="24" :sm="3" :md="2" :lg="2">应用权限：</el-col>
        <el-col :xs="24" :sm="21" :md="22" :lg="22">支付后台APPID权限，会根据数据后台的BPID权限自动开通，如果没有某个应用的appid权限，请自行去data后台开通对应的bpid权限，如果在数据后台开通权限后，在支付后台还是提示无权限，请退出账号，清空浏览器缓存，重新登录一下即可查看；如果有疑问，请及时联系AnneDu，谢谢。</el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="3" :md="2" :lg="2">查看内容：</el-col>
        <el-col :xs="24" :sm="21" :md="22" :lg="22">
          <el-checkbox-group v-model="view">
            <el-checkbox
              v-for="(item,index) in viewList"
              :label="item"
              :key="index"
              v-show="index < number">
            </el-checkbox>
            <el-button size="mini" @click="more" v-if="state" class="more">更多<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button size="mini" @click="more" v-else class="more"><i class="el-icon-arrow-left el-icon--left"></i>收起</el-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="3" :md="2" :lg="2">操作权限：</el-col>
        <el-col :xs="24" :sm="21" :md="22" :lg="22">
          <el-cascader
            :options="options"
            v-model="selectedOptions">
          </el-cascader>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="tableData" border style="width: 100%" max-height="250">
            <el-table-column
              v-for="(header,index) in tableHeader"
              :prop="header.prop"
              :label="header.label"
              :key="index">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data () {
    return {
      msg: {
        name: '杨少波',
        englishName: 'SarboYang',
        department: '业务支持中心/数据支付部/前端组'
      },
      view: ['订单查询', '欺诈订单', '统计信息'],
      viewList: ['订单查询', '欺诈订单', '统计信息', '产品配置', '收入汇总', '应用警报设置', '财务对账'],
      state: true,
      number: 3,
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [{
                value: 'yizhi',
                label: '一致'
              }, {
                value: 'fankui',
                label: '反馈'
              }, {
                value: 'xiaolv',
                label: '效率'
              }, {
                value: 'kekong',
                label: '可控'
              }]
            }, {
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }
          ]
        }, {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                }, {
                  value: 'color',
                  label: 'Color 色彩'
                }, {
                  value: 'typography',
                  label: 'Typography 字体'
                }, {
                  value: 'icon',
                  label: 'Icon 图标'
                }, {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            }, {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                }, {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                }, {
                  value: 'input',
                  label: 'Input 输入框'
                }, {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                }, {
                  value: 'select',
                  label: 'Select 选择器'
                }, {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                }, {
                  value: 'switch',
                  label: 'Switch 开关'
                }, {
                  value: 'slider',
                  label: 'Slider 滑块'
                }, {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                }, {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                }, {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                }, {
                  value: 'upload',
                  label: 'Upload 上传'
                }, {
                  value: 'rate',
                  label: 'Rate 评分'
                }, {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            }, {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                }, {
                  value: 'tag',
                  label: 'Tag 标签'
                }, {
                  value: 'progress',
                  label: 'Progress 进度条'
                }, {
                  value: 'tree',
                  label: 'Tree 树形控件'
                }, {
                  value: 'pagination',
                  label: 'Pagination 分页'
                }, {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            }
          ]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ],
      selectedOptions: [],
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
        }, {
          prop: 'content',
          label: '权限内容'
        }, {
          prop: 'verifier',
          label: '业务审核人'
        }
      ],
      tableData: [
        {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }, {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }, {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }, {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }, {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }, {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }, {
          game: 'game',
          platform: 'platform',
          hall: 'hall',
          terminal: 'terminal',
          package: 'package',
          appid: 'appid',
          content: 'content',
          verifier: 'verifier'
        }
      ]
    }
  },
  methods: {
    more (e) {
      if (this.state) {
        this.number = this.viewList.length
        this.state = false
      } else {
        this.number = 3
        this.state = true
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.Application{
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
.content>.el-row{
  margin: 15px 0;
}
.content>.el-row>.el-col:first-child{
  font-weight: bold;
}
.more{
  margin-left: 15px;
}
</style>
