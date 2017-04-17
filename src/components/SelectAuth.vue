-<!-- 权限申请/权限管理 -> 选择器 -> 子组件 -->
<template>
  <div class="select-application">
    <el-button @click="toggleSelector" class="please-select" type="success" :plain="true" size="small">
      请选择
    </el-button>
    <el-dialog v-model="showSelectAuthBox" top="25%" :show-close="true" size="tiny" @close="closeDialog">
      <div class="select-box-wrap" id="select-box-wrap" v-loading.body="loading">
        <div class="box-header clearfix">
          <h5 class="box-title">应用选择器 <span style="font-size: 12px;color: #e5e5e5;">至少选择一个维度</span></h5>
          <div class="btn-wrap">
            <el-button type="primary" @click="addSelect">确定</el-button>
            <el-button type="warning" @click="reset(true)">置空</el-button>
          </div>
        </div>
        <div class="box-body">
          <ul class="left-part">
            <li v-for="(item, index) in fatherMenu"
              @click="switchMenu($event, item)"
                :class="{active: currentMenu === item.menuName}"
                >
              <a href="javascript:void(0)">
                {{item.labelName}}  &nbsp; {{item.menuName === 'game' ? '(必选)' : '(可选)'}}
              </a>
            </li>
          </ul>
          <div class="right-part">
            <div>
              <div class="right-part-top">
                <div class="select-auth-input">
                  <el-input placeholder="请输入关键词" icon="circle-cross" v-model="input"
                            @change="refreshHub(input)" :on-icon-click="handleIconClick"></el-input>
                </div>
              </div>
              <div class="right-part-data">
                <div v-show="currentMenu === index" v-for="(item, index) in authSelect">
                  <el-radio-group v-model="item.id" @change="addName">
                    <div v-for="(val, index) in subOptHub">
                      <el-radio :label="val.id">{{val.name}}</el-radio>
                    </div>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Checkbox from './Checkbox'
  export default {
    data () {
      return {
        input: '', // 搜索框输入
        changeFlag: 0,
        showSelectAuthBox: false,  // 是否显示选择器
        fatherMenu: [], // 父菜单信息
        subOpt: [],  // 子选项信息
        subOptHub: [],
        authSelect: {
          game: {
            id: '0',
            name: '全部'
          },
          platform: {
            id: '0',
            name: '全部'
          },
          hall: {
            id: '0',
            name: '全部'
          },
          terminal: {
            id: '0',
            name: '全部'
          },
          apk: {
            id: '0',
            name: '全部'
          }
        },  // 用户选择情况
        loading: true,  // 是否显示加载loading样式
        currentMenu: 'game'
      }
    },
    components: {
      Checkbox
    },
    methods: {
      addName (val) {
        this.subOptHub.forEach(item => {
          if (val === item.id) {
            this.authSelect[this.currentMenu].name = item.name
          }
        })
      },
      closeDialog () {
        this.loading = false
      },
      // 关闭/打开选择器
      toggleSelector () {
        this.showSelectAuthBox = !this.showSelectAuthBox
      },
      // 获得子选项
      getSubOpt (filterData) {
        let _this = this
        // 后台获取数据,目前无数据，要后台给
        return this.$http.post('apply/sub-opt', filterData).then(response => {
          if (response.body.error_code === 0) {
            _this.subOpt = response.body.data
            _this.subOptHub = _this.subOpt
          } else {
            this.$message.error('参数错误')
          }
        }, response => {
          this.$message.error('服务器异常')
        })
      },
      // 获取父菜单
      getFatherMenu () {
        let _this = this
        return this.$http.get('apply/father-menu').then(response => {
          // 拿到父级菜单数据
          _this.fatherMenu = response.body.data
        })
      },
      // 格式化筛选信息
      formatFilterMsg (currentMenu) {
        // 传给后台的信息
        let _data = this.authSelect
        let _filterData = {}
        _filterData.currentMenu = currentMenu
        _filterData.game = _data.game.id
        _filterData.platform = _data.platform.id
        _filterData.hall = _data.hall.id
        _filterData.terminal = _data.terminal.id
        _filterData.apk = _data.apk.id
        // 这里要进行判断，当前菜单所对应查询选项设置为空, 不然查找的就只有勾选的选项
        _filterData[currentMenu] = '0'
        return _filterData
      },
      // 切换父级菜单
      switchMenu ($event, item) {
        let _filterData = {}

        // 设置currentMenu
        this.currentMenu = item.menuName

        $event.target.style.background = 'lightgreeen'
        this.input = ''

        // 将当前菜单后面的菜单选择情况清除
        let _menuArr = ['game', 'platform', 'hall', 'terminal', 'apk']
        _menuArr.forEach((item, index) => {
          if (_menuArr.indexOf(this.currentMenu) < index) {
            this.authSelect[item].id = '0'
            this.authSelect[item].name = '全部'
          }
        })

        // 得到格式化的筛选信息，主要是在参数中加入currentMenu字段
        _filterData = this.formatFilterMsg(this.currentMenu)

        // 显示loading
        this.loading = true
        // 得到子菜单信息
        this.getSubOpt(_filterData).then(() => {
          this.subOptHub = this.sort()
          // 关闭loading
          this.loading = false
        })
      },
      handleIconClick () {
        this.input = ''
        this.refreshHub(this.input)
      },
      refreshHub (input) {
        let _input = input.trim()
        let _cacheArr = []
        let _regexp = new RegExp(_input, 'i')
        if (_input === '') {
          this.subOptHub = this.subOpt
        } else {
          this.subOpt.forEach((item) => {
            if (_regexp.test(item.name)) {
              _cacheArr.push(item)
            }
          })
          this.subOptHub = _cacheArr
        }
        this.subOptHub = this.sort()
      },
      // 将选中的排在第一个
      sort () {
        let _cacheArr = []
        let _subOptHub = this.subOptHub
        let _checkedId = this.authSelect[this.currentMenu].id
        _subOptHub.forEach(item => {
          if (_checkedId === item.id) {
            _cacheArr.unshift(item)
          } else {
            _cacheArr.push(item)
          }
        })
        return _cacheArr
      },
      // 重置所有选择情况
      reset (flag) {
        // 清空输入框
        this.input = ''
        // 清空用户选择情况 (产品说先不要清空)
//        for (let index in this.authSelect) {
//          this.authSelect[index].id = '0'
//          this.authSelect[index].name = '全部'
//        }
        // 重置缓存
        this.subOptHub = this.subOpt
      },
      // 数据验证：判断是否选择了至少一种APPID
      dataValidate (authSelect) {
        let _appidData = authSelect
        let _flag = authSelect['game'].id
        if (_flag === '0') {
          this.$message.warning('请选择一款游戏')
          return false
        }
        return _appidData
      },
      // 点击确定按钮绑定事件
      addSelect () {
        let _appidList = []
        // 数据验证，通过返回一条选择数据，不通过返回false
        let _oneData = this.dataValidate(this.authSelect)

        // 是否选择appid
        if (!_oneData) {
          return
        }
        _appidList.push(_oneData)
        // 触发父组件事件，把appidList传递给父组件
        this.$emit('addSelData', _appidList)
        // 所有复选框复位
        this.reset()
        // 关闭权限选择框
        this.toggleSelector()
      }
    },
    created () {
      let _filterData = {}
      // 发送ajax请求，获取父级菜单选项
      this.getFatherMenu().then(() => {
        // 初始化用户选择
        // this.initAuthSelect(this.fatherMenu)
      }).then(() => {
        // 发送ajax请求，获取打开选择器时的数据
        this.getSubOpt(_filterData).then(() => {
          // 获取到数据，关闭loading
          this.loading = false
        })
      })
    },
    filters: {
    }
  }
</script>

<style scope>

  .select-application {
    display: inline-block;
  }

  .el-dialog {
    min-width: 500px;
  }

  .please-select {
    display: inline-block;
    width: 200px;
    text-align: center;
    color: black;
    border-right: 1px solid #e5e5e5;
  }

  .please-select:hover {
    text-decoration: none;
  }

  .select-box-wrap {
    background: #ffffff;
    border: 5px solid #e5e5e5;
    border-radius: 5px;
  }

  .box-header {
    padding: 10px;
    border-bottom: 5px solid #e5e5e5;
  }

  .box-title {
    float: left;
    margin: 0;
    font-weight: 600;
    font-size: 18px;
  }

  .btn-wrap {
    float: right;
  }

  .box-body {
    display: flex;
    height: 350px;;
  }

  .left-part {
    flex: 0 0 130px;
    height: 100%;
    border-right: 5px solid #e5e5e5;
    text-align: center;
  }

  .right-part {
    flex: 1;
    padding: 10px 30px 0 30px;
  }


  .left-part li {
    padding: 10px;
    color: #000;
  }

  .select-auth-input {
    margin: 10px 0;
  }

  .right-part-data {
    height: 260px;
    overflow: auto;
  }

  .active {
    background: lightsalmon;
  }

</style>
