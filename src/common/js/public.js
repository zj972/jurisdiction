/**
 * Created by JohnLi on 2017/4/4.
 */
/* eslint-disable */
export function getResult(dataList, keywords, searchItem) {
  let _result = []
  let _input = keywords.trim()
  let regexp = new RegExp(_input, 'i')
  if (_input === '') {
    return dataList
  }

  if (!Array.isArray(dataList) && dataList.length === 0) {
    return []
  }

  dataList.forEach((objItem) => {
    for (let item in objItem) {
      // 如果在查询选项中
      if (searchItem.indexOf(item) > -1) {
        if (item != 'auth') {
          if (typeof objItem[item] === 'object' && regexp.test(objItem[item].name)) {
            _result.push(objItem)
            console.log(1)
            console.log(objItem[item])
            break
          } else if (typeof objItem[item] === 'string' && regexp.test(objItem[item])) {
            _result.push(objItem)
            break
          }
        } else {
          // 如果是权限内容数组，则要进入数组再次搜索
          if (objItem[item] && item === 'auth') {
            for (let _index in objItem[item]) {
              // 如果数组里面元素是字符串
              if (typeof objItem[item][_index] === 'string' && regexp.test(objItem[item][_index])) {
                _result.push(objItem)
                return
              }
              // 如果数组里面元素是对象
              if (typeof objItem[item][_index] === 'object'){
                for (let _i in objItem[item][_index]) {
                  if (typeof objItem[item][_index][_i] === 'string' && regexp.test(objItem[item][_index][_i])) {
                    _result.push(objItem)
                    return
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  return _result
}
