import dayjs from 'dayjs'
import Vue from 'vue'
// dayjs 默认是英文 这里要更改为中文 加载中文语言包
import 'dayjs/locale/zh-cn'
// 加载导入相对时间的安装包
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn') // 全局使用中文语言包

// dayjs() 获取当前最新时间
console.log(dayjs().format('YYYY-MM-DD'))
// 配置处理相对时间的插件
dayjs.extend(relativeTime)

/*
  定义一个全局过滤器 然后就可以在任务组件的模板中使用了
  其实过滤器就相当于一个全局可用的方法（仅限模板使用）
  参数1：过滤器名称
  参数2：过滤器函数
  使用方式: {{表达式 | 过滤器名称}}
  管道符前面的表达式的结果会作为参数传递到过滤器函数中
  过滤器的返回值会渲染到使用过滤器的模板位置
*/
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// console.log(dayjs().from(dayjs('1990')))
// console.log(dayjs().to(dayjs('2015')))
