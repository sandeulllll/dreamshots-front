//导入vue库
import Vue from 'vue'
// 导入应用查询的根组件
import App from './App.vue'
import router from "@/router";
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入瀑布流加载
import InfiniteLoading from "vue-infinite-loading";
Vue.use(InfiniteLoading);

Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.config.devtools = true
/*
main.js文件是Vue.js应用程序的入口文件
主要负责初始化Vue实例，
并将根组件挂载到HTML文档中的某个元素上
*/

new Vue({
  // Vue提供了一个叫render的函数
  // render返回一个完整的虚拟DOM树
  // h是缩写，它也是Vue中的一个函数，
  // h是createElement函数，用于创建虚拟DOM树的元素
  /*render的输入参数就是createElement函数，
  返回createElement函数创建的虚拟DOM树.
  写法一：
  render(createElement){
    return createElement(App);
  }
  写法二：
  render:(createElement) => {
  return createElement(App);
  }
  写法三：
  render:createElement =>createElement(App);
  写法四：
  render:h => h(App);
  */
  //初始化Vue实例时使用render函数
  router, //引入router
  render: h => h(App),
}).$mount('#app') //实现挂载功能
