/**
 * Created by JohnLi on 2017/3/15.
 */
var express = require('express')
var bodyParser = require('body-parser');
var url = require('url');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 权限申请数据
var authApplyData = require('../mock/apply.json');

// 权限菜单选项数据
// var menuData = authApplyData.parentMenu;

// 我的权限数据
var myAuthData = require('../mock/myauth.json');

// 我的审批  数据
var approvalData = require('../mock/approval.json');

// 权限管理数据
var manageData = require('../mock/manage.json');

// app加载时获取的新消息数据
var newsData = require('../mock/app.json');

var apiRoutes = express.Router();

apiRoutes.get('/app/userId', function (req, res) {
  res.json({
    error_code: 0,
    data: '1314521'
  });
});

// 获取  我的权限  和 我的审批中的 新消息数目
apiRoutes.get('/app/newMsg', function (req, res) {
  res.json({
    error_code: 0,
    data: newsData.newMsg
  });
});

apiRoutes.get('/apply/userMsg', function (req, res) {
  res.json({
    error_code: 0,
    data: authApplyData.userMsg
  });
});

/* ------------ 权限申请--------------------- */
apiRoutes.post('/apply/view-auth-apply', function (req, res) {
  res.json({
    error_code: 0
  });
  console.dir(req.body);
});

apiRoutes.post('/apply/operate-auth-apply', function (req, res) {
  res.json({
    error_code: 0
  });
  console.dir(req.body);
});

// 查看权限信息
apiRoutes.get('/apply/view-auth', function (req, res) {
  var _viewData = {}
  _viewData = authApplyData.applyInitData
  res.json({
    error_code: 0,
    data: _viewData
  });
});

apiRoutes.get('/apply/father-menu', function (req, res) {
  res.json({
    error_code: 0,
    data: authApplyData.parentMenu
  });
});

apiRoutes.post('/apply/sub-opt', function (req, res) {
  res.json({
    error_code: 0,
    data: {
      subOpt: [
        '德州扑克',
        '斗地主',
        '地方棋牌',
        '印尼棋牌',
        'IPOKER',
        '四人地主',
        '三公',
        '麻将',
        '博定'
      ]
    }
  });
  // console.dir(req.body); // 打印筛选条件
});

apiRoutes.get('/apply/appid-action', function (req, res) {
  res.json({
    error_code: 0,
    data: [{
      id: 1,
      name: '订单操作'
    }, {
      id: 2,
      name: '其他操作'
    }]
  });
  // console.dir(req.body); // 打印筛选条件
});

apiRoutes.get('/myAuth/', function (req, res) {
  var params = url.parse(req.url, true).query;
  var authType = params.authType;
  res.json({
    error_code: 0,
    data: myAuthData[authType]
  });
});

apiRoutes.get('/myAuth/withdraw', function (req, res) {
  var params = url.parse(req.url, true).query;
  var _authType = params.authType;
  var uuid = params.uuid;
  console.log('authType:' + _authType + 'uuid:' + uuid);
  res.json({
    error_code: 0
    // 看这里要不要把更新后的数据在获取一遍，传给前端。
    // data: myAuthData[_authType]
  });
});

apiRoutes.get('/myAuth/search', function (req, res) {
  var params = url.parse(req.url, true).query;
  var _tagType = params.searchType;
  var _searchKey = params.searchKey;
  // 接下来执行数据库查询操作
  console.log('tagType:' + _tagType + 'searchKey:' + _searchKey);
  res.json({
    error_code: 0,
    // 数据
    data: {
      "viewAuth": [],
      "operateAuth": [
        {
          "uuid": 1,
          "game": "地方棋牌",
          "platform": "四川",
          "hall": "全部",
          "terminal": "全部",
          "apk": "全部",
          "APPID": "全部",
          "auth": ["订单操作"],
          "status": 1,
          "handler": "查询数据",
          "reason": "我想申请这些操作权限1"
        }]
    }
  });
});

/* ***************approvalData********************** */
apiRoutes.get('/approval/loadData', function (req, res) {
  var params = url.parse(req.url, true).query;
  var _authType = params.authType;
  res.json({
    error_code: 0,
    data: approvalData[_authType]
  });
});

// 通过一条
apiRoutes.post('/approval/passOne', function (req, res) {
  console.log('通过一条');
  console.log(req.body);
  res.json({
    error_code: 0
  });
});

// 批量通过
apiRoutes.post('/approval/passBatch', function (req, res) {
  console.log('批量通过');
  console.log(req.body);
  res.json({
    error_code: 0
  });
});

// 驳回一条
apiRoutes.post('/approval/rejectOne', function (req, res) {
  console.log('驳回一条');
  console.log(req.body);
  res.json({
    error_code: 0
  });
});

// 批量驳回
apiRoutes.post('/approval/rejectBatch', function (req, res) {
  console.log('批量驳回');
  console.log(req.body);
  res.json({
    error_code: 0
  });
});


/* --------------------权限管理------------------- */
apiRoutes.get('/manageIndex', function (req, res) {
  res.json(
    {
      "role": manageData.role,
      "member": manageData.member
    }
  )
})

apiRoutes.get('/roleAdd', function (req, res) {
  res.json(
    {
      "menu": manageData.menu
    }
  )
})

apiRoutes.post('/roleAddSubmit', function (req, res) {
  // req: {"role":"角色","menuData":[{"firstMenu":"双皮奶","secondMenu":"双皮2奶"},{"firstMenu":"蚵仔煎","secondMenu":"双12皮奶"}],"remark":"备注"}
  manageData.role.push({
    "id": 8,
    "role": "特级人员",
    "checked": "订单查询、欺诈订单、产品配置、收入汇总、统计信息、版本统计信息、应用警报设置、权限申请",
    "remark": "添加的~"
  })
  res.send({msg: true})
})

apiRoutes.get('/roleDel', function (req, res) {
  // 根据id删除角色
  console.log('id: ' + req.query.id)
  res.send({msg: true})
})

apiRoutes.get('/roleModify', function (req, res) {
  // 根据id返回相应数据，menu是选择框内容
  console.log('id: ' + req.query.id)
  res.json(
    {
      "role": "修改后的角色",
      "menu": manageData.menu,
      "menuData": [
        {
          "firstMenu": "蚵仔煎",
          "secondMenu": "双45皮奶"
        }, {
          "firstMenu": "龙须面",
          "secondMenu": "双45皮奶"
        }
      ],
      "remark": "3234"
    })
})

apiRoutes.post('/roleModifySubmit', function (req, res) {
  // req: {"role":"角色","menuData":[{"firstMenu":"双皮奶","secondMenu":"双皮2奶"},{"firstMenu":"蚵仔煎","secondMenu":"双12皮奶"}],"remark":"备注"}
  manageData.role.shift()
  res.send({msg: true})
})

apiRoutes.get('/roleMenu', function (req, res) {
  // 根据id返回相应数据
  console.log('id: ' + req.query.id)
  res.json(
    {
      "menu": manageData.menu,
      "menuData": manageData.menuData
    })
})

apiRoutes.post('/roleMenuAdd', function (req, res) {
  // {"id":["1","2","3","4","5"]}
  manageData.menuData[1].operation = true
  res.send({msg: true})
})
apiRoutes.post('/roleMenuDel', function (req, res) {
  // {"id":["1","2","3","4","5"]}
  manageData.menuData[1].operation = false
  res.send({msg: true})
})

apiRoutes.get('/roleMember', function (req, res) {
  // 根据id返回相应数据
  console.log('id: ' + req.query.id)
  res.json(
    {
      "member": manageData.member
    })
})

apiRoutes.post('/roleMemberAdd', function (req, res) {
  // {"id":["1","2","3","4","5"]}
  manageData.menuData[1].operation = true
  res.send({msg: true})
})

apiRoutes.post('/roleMemberDel', function (req, res) {
  // {"id":["1","2","3","4","5"]}
  manageData.menuData[1].operation = false
  res.send({msg: true})
})

module.exports = apiRoutes;
