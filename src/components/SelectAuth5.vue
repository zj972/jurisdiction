-<!-- 权限申请/权限管理 -> 选择器 -> 子组件 -->
<template>
  <div class="select-application">
    <el-button @click="toggleSelector" class="please-select" type="success" :plain="true" size="small">
      请选择
    </el-button>
    <el-dialog v-model="showSelectAuthBox" top="25%" :show-close="true" size="tiny" >
      <div class="select-box-wrap" id="select-box-wrap" v-loading.body="loading">
        <div class="box-header clearfix">
          <h5 class="box-title">应用选择器</h5>
          <div class="btn-wrap">
            <el-button type="primary" @click="addSelect">确定</el-button>
            <el-button type="warning" @click="clearAll">置空</el-button>
          </div>
        </div>
        <div class="box-body">
          <ul class="left-part">
            <li @click="switchMenu($event, item, index)" :class="{active: changeFlag === index}"
                v-for="(item, index) in fatherMenu">
              <a href="javascript:void(0)">
              {{item.labelName}} &nbsp;({{item.labelName === "APPID" ? "必选" : "可选"}})
              </a>
            </li>
          </ul>
          <div class="right-part">
            <div v-show="changeFlag === index" v-for="(item, index) in authSelect">
              <div class="right-part-top">
                  <el-checkbox :indeterminate="item.isIndeterminate"
                               v-model="item.isAll"
                               @change="handleCheckAllChange($event, subOptHub, item)">全选/全不选
                  </el-checkbox>
                  <div class="select-auth-input">
                    <el-input placeholder="请输入关键词" icon="search" v-model="input" @change="refreshHub(input, item)"></el-input>
                  </div>
                </div>
              <div class="right-part-data">
                  <div v-for="(val, index) in subOptHub" v-show="searchResult(val)" class="cell">
                    <!--原声写法-->
                    <!--<input type="checkbox" v-model="item.checked"  :value="val" @click="handleCheckedItemsChange(subOpt, item, $event)">-->
                    <!--<span>{{val | showOpt}}</span>-->

                    <label class="el-checkbox" @click="handleCheckedItemsChange(subOptHub, item, $event)">
                      <input type="checkbox" class="really-checkbox" :value="val" v-model="item.checked">
                      <span class="checkbox-icon"></span>
                      <span>{{val | showOpt}}</span>
                    </label>
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
        authSelect: [],  // 用户选择情况
        loading: true,  // 是否显示加载loading样式
        currentMenu: 'game'
      }
    },
    components: {
      Checkbox
    },
    methods: {
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
            //  后台返回数据(注意这里返回的是对象要手动转换为数组)
//            console.log(response.body.data.subOpt)
            let _subOptObj = response.body.data
            _this.subOpt = _subOptObj
            _this.subOptHub = _this.subOpt
          } else {
            _this.$message({
              message: '子菜单获取错误',
              type: 'warning'
            })
          }
        }, response => {
          // error callback
        })
      },
      // 获取父菜单
      getFatherMenu () {
        let _this = this
        return this.$http.get('apply/father-menu').then(response => {
          // 拿到父级菜单数据
          _this.fatherMenu = response.body.data
//          console.log('父级菜单信息')
//          console.log(this.fatherMenu)
        })
      },
      // 初始化选择项
      initAuthSelect (fatherMenu) {
        fatherMenu.forEach((value) => {
          // 每一个v-model绑定对象初始化,这里要循环创建，不然是按引用传递，会相互影响
          let _checkedItem = {}
          _checkedItem.checked = []  // v-model  CheckBox选择情况
          _checkedItem.isAll = false  // 记住每个选项是否是全选状态
          _checkedItem.isIndeterminate = false  // 是否是半选状态
          _checkedItem.menuName = value.menuName  // 菜单名
          this.authSelect.push(_checkedItem)
        })
      },
      // 格式化筛选信息
      formatFilterMsg (fatherMenu) {
        // 传给后台的信息
        let _filterData = {}
        let _data = this.authSelect
        let _menu = _filterData.currentMenu = fatherMenu.menuName
        // 筛选信息格式转换,Object -> Array
        _data.forEach((item) => {
          _filterData[item.menuName] = item.checked
        })

        // 这里要进行判断，当前菜单所对应查询选项设置为空, 不然查找的就只有勾选的选项
        _filterData[_menu] = []
        return _filterData
      },
      // 切换父级菜单
      switchMenu ($event, item, num) {
        let _filterData = {}
        // 设置currentMenu
        this.currentMenu = item.menuName

        // 清空子菜单，后面使用的是push不清空会有叠加。
        this.subOpt = []
        $event.target.style.background = 'lightgreeen'
        this.changeFlag = num
        this.input = ''

        // 得到格式化的筛选信息
        _filterData = this.formatFilterMsg(item)
//        console.log('打印选择器需要传到后台的数据1')
//        console.dir(_filterData)

        // 显示loading
        this.loading = true
        // 得到子菜单信息
        this.getSubOpt(_filterData).then(() => {
          // 关闭loading
          this.loading = false
        })
      },
      // 全选/全不选
      handleCheckAllChange ($event, subOptHub, authItem) {
        // 全不选，从选中的元素中剔除subOptHub所有元素
        if (!$event.target.checked) {
          subOptHub.forEach((item) => {
            // 这里索引必须每次重新获取，因为原来的数组改变了
            let _index = authItem['checked'].indexOf(item)
            authItem['checked'].splice(_index, 1)
          })
        } else {
          // 全选 将subOptHub中的元素添加到选中列表中
          subOptHub.forEach((item, index) => {
            if (authItem['checked'].indexOf(item) < 0) {
              authItem['checked'].push(item)
            }
          })
        }
        // 关闭半选状态
        authItem.isIndeterminate = false
      },
      // 半选状态控制
      handleCheckedItemsChange (subOptHub, authItem, event) {
        // 全选按钮状态控制
        // 全选状态 是所有subOptHub中的元素都包含在checked中
        let _isAll = subOptHub.every(item => {
          return authItem.checked.indexOf(item) > -1
        })
        // subOptHub.length的判断是为了当subOptHub为空时，全选按钮为全不选状态
        if (_isAll && subOptHub.length) {
          authItem['isAll'] = true
          authItem.isIndeterminate = false
          return
        }
        // 是所有subOptHub中的元素全都不包含在checked中
        let _isNone = subOptHub.every(item => {
          return authItem.checked.indexOf(item) < 0
        })

        if (_isNone || subOptHub.length === 0) {
          authItem.isAll = false
          authItem.isIndeterminate = false
          return
        }
        // 是所有subOptHub中的部分元素包含在checked中 (排除上面两种情况)
        authItem.isIndeterminate = true
      },
      // 展示搜索结果
      searchResult (item) {
        return !this.input.trim() || item.toUpperCase().indexOf(this.input.trim().toUpperCase()) > -1
      },
      refreshHub (input, authItem) {
        let _input = input.trim()
        let _cacheArr = []
        let _regexp = new RegExp(_input, 'gi')
        _input = _input.trim()
        if (_input === '') {
          this.subOptHub = this.subOpt
        } else {
          this.subOpt.forEach((item) => {
            if (_regexp.test(item)) {
              _cacheArr.push(item)
            }
            this.subOptHub = _cacheArr
          })
        }
        // 全选、半选、全不选状态判断
        this.handleCheckedItemsChange(this.subOptHub, authItem)
      },
      // 重置所有选择情况
      reset (authSelect) {
        authSelect.forEach((item) => {
          item['checked'] = []
          item['isAll'] = false
          item['isIndeterminate'] = false
        })
      },
      // 清空按钮绑定事件
      clearAll () {
        this.$confirm('确定要清空所有吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reset(this.authSelect)
        }).then(() => {
          // 发送一次请求
          let _filterData = {}
          _filterData.currentMenu = this.currentMenu
          this.loading = true
          this.getSubOpt(_filterData).then(() => {
            // 关闭loading
            this.loading = false
          })
        }).catch(() => {
            // 这里点击取消会发出一个异常，所以要在这里捕获一下
        })
      },
      // 数据验证：判断是否选择了至少一种APPID
      dataValidate (authSelect) {
        // 获取appid的选择信息
        let _appidData = authSelect.slice(-1)
        if (_appidData[0]['checked']['length'] === 0) {
          this.$message({
            message: '请至少选择一种APPID',
            type: 'warning'
          })
          return false
        }
        return _appidData[0]['checked']
      },
      // 点击确定按钮绑定事件
      addSelect () {
        // 数据验证，通过返回appidList，不通过返回false
        let _appidList = this.dataValidate(this.authSelect)
        // 是否选择appid
        if (!_appidList) {
          return
        }

        console.log('在这了')
        console.log(_appidList)
        // 触发父组件事件，把appidList传递给父组件
        this.$emit('addSelData', _appidList)
        // 所有复选框复位
        this.reset(this.authSelect)

        // 关闭权限选择框
        this.toggleSelector()
      }
    },
    created () {
      let _filterData = {}
      // 发送ajax请求，获取父级菜单选项
      this.getFatherMenu().then(() => {
        // 初始化用户选择
        this.initAuthSelect(this.fatherMenu)
      }).then(() => {
        _filterData.currentMenu = 'game'
        // 发送ajax请求，获取打开选择器时的数据
        this.getSubOpt(_filterData).then(() => {
          // 获取到数据，关闭loading
          this.loading = false
        })
      })
    },
    filters: {
      showOpt (opt) {
        if (typeof opt === 'object') {
          return `${opt.terminal}-${opt.apk}${opt.appid}`
        } else {
          return opt
        }
      }
    }
  }
</script>

<style scope>
  [v-cloak] {
    display: none;
  }
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
    height: 300px;;
  }

  .left-part {
    flex: 0 0 130px;
    height: 100%;
    border-right: 5px solid #e5e5e5;
    text-align: center;
  }

  .right-part {
    flex: 1;
    height: 100%;
    width: 350px;
    padding: 10px 30px;
  }

  .cell {
    margin:5px 0;
  }

  .cell .really-checkbox,.cell .label-text,.cell .checkbox-icon{
    vertical-align: middle;
  }

  .left-part li {
    padding: 10px;
    color: #000;
  }

  .select-auth-input {
    margin: 10px 0;
  }

  .right-part-data {
    height: 190px;
    overflow: auto;
  }

  .active {
    background: lightsalmon;
  }

  .checkbox-icon {
    display: inline-block;
    position: relative;
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    background-color: #fff;
    z-index: 1;
  }

  .checkbox-icon::after {
    -ms-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1);
  }

  .checkbox-icon::after{
    box-sizing: content-box;
    display: inline-block;
    content: '';
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 8px;
    width:4px;
    position: absolute;
    top: 1px;
    left: 5px;
    -ms-transform-origin: center;
    transform-origin: center;
  }


  input[type="checkbox"].really-checkbox:checked + .checkbox-icon{
    background-color: #20a0ff;
    border-color: #0190fe;
  }

  .really-checkbox {
    visibility: hidden;
    width:0;
  }

</style>
