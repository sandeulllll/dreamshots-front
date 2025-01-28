<!--模板主要包含了HTML部分的代码-->
<!--页面结构在模板里定义-->
<template>
  <div id="app">
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <router-view></router-view>
  </div>
</template>

<!--脚本主要包含了组件的行为逻辑-->
<!--一般是使用Javascript代码-->
<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  /*components: {
    HelloWorld
  }*/
}
</script>

<!--样式-->
<!--通常使用CSS作为样式处理器-->
<style>
html body{
  margin: 0
}
</style>
