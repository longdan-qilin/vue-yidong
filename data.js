const all = [
  { id: 2, name: '开发者资讯' },
  { id: 3, name: 'ios' },
  { id: 4, name: 'c++' },
  { id: 5, name: 'android' },
  { id: 6, name: 'css' },
  { id: 8, name: '区块链' },
  { id: 9, name: 'go' },
  { id: 10, name: '产品' },
  { id: 11, name: '后端' },
  { id: 12, name: 'linux' },
  { id: 13, name: '人工智能' },
  { id: 14, name: 'php' },
  { id: 15, name: 'javascript' },
  { id: 16, name: '架构' },
  { id: 17, name: '前端' },
  { id: 18, name: 'python' },
  { id: 19, name: 'java' },
  { id: 20, name: '算法' },
  { id: 21, name: '面试' },
  { id: 22, name: '科技动态' },
  { id: 23, name: 'js' },
  { id: 24, name: '设计' },
  { id: 25, name: '数码产品' },
  { id: 1, name: 'html' },
  { id: 7, name: '数据库' },
  { id: 26, name: '软件测试' },
  { id: 27, name: '测试开发' },
  { id: 31, name: 'test4' },
  { id: 32, name: 'test18' },
  { id: 41, name: 'test17' }
]

const my = [
  { id: 0, name: '推荐' },
  { id: 11, name: '后端' },
  { id: 12, name: 'linux' },
  { id: 13, name: '人工智能' },
  { id: 17, name: '前端' },
  { id: 18, name: 'python' },
  { id: 7, name: '数据库' }
]

/* const findArr = [];
all.forEach(item => {
    // 如果说 item 在 my 里面里面找不到，就保留
    // find 的返回值是查找第一个符合条件的那一项，这里是一个对象
    // 如果找不到就返回 undefined
    let r = my.find(per => item.id === per.id);
    if(r === undefined) {
        findArr.push(item);
    }
});
console.log(findArr.length); // 24 */

/* let r = all.filter(item => {
    // 如果说 item 在 my 里面里面找不到，就保留
    // 返回值是 undefined 的时候就是找不到
    let r = my.find(per => item.id === per.id);
    return !r;
});
console.log(r.length); */

const r1 = all.filter(item => !my.find(per => item.id === per.id))

// 下面写法是不对的
/* let r = all.filter(item => {
    // 每次从 my 里面总能找到一个不等于 item.id 的对象并返回
    let r = my.find(per => item.id !== per.id);
    return r;
});
console.log(r.length); */

const _ = require('lodash')
const r3 = _.difference([2, 1, 3, 8], [2, 8])
console.log(r3)

const r = _.differenceBy(all, my, 'id')
console.log(r)
console.log(JSON.stringify(r1) === JSON.stringify(r))
