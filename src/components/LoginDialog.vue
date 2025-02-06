<!--点击登录时的弹框-->

<script>
// 导入userUtils模块
import userUtils from "@/utils/userUtils";

export default {
  // 组件名称
  name: "LoginDialog",
  // 混入userUtils
  mixins:[userUtils],

  // 数据定义
  data(){
    return{
      // 账号
      account:'',
      // 密码
      password:''
    }
  },

  // 方法定义
  methods:{

    // 用户注册
    async userRegisterFromDialog(){
      try {
        // 调用混入的userRegister方法，传入账号和密码
        await this.userRegister(this.account,this.password);
        // 注册成功提示
        window.alert('注册成功，请点击登录按钮进行登录')
      }catch (e){
        // 注册失败提示
        window.alert('注册失败')
      }
    },

    // 用户登录
    async userLoginFromDialog(){
      try {
        // 调用混入的userLogin方法，传入账号和密码
        await this.userLogin(this.account,this.password);
        // 登录成功后刷新页面
        location.reload();
      }catch (e){
        window.alert('登录失败');
      }
    }
  }

}
</script>

<template>
<!--  总的div-->
  <div class="login-dialog">
<!--    填写的账号密码信息用一个表单来完成-->
    <form class="login-form">
<!--      填写账号栏-->
      <div class="el-form-item">
<!--        文字提示账号-->
        <div class="form-info">
          账号
        </div>
<!--        输入框-->
        <input v-model="account" autocomplete="on" maxlength="32"
                placeholder="请输入账号" type="text">
      </div>
<!--      分隔线-->
      <div class="separator-line"></div>
<!--      密码栏-->
      <div class="el-form-item">
<!--        文字提示密码-->
        <div class="form-info">
          密码
        </div>
<!--        密码输入框-->
        <input v-model="password" autocomplete="on" maxlength="32"
               placeholder="请输入密码" type="password">
<!--        忘记密码-->
        <div class="forget-password">忘记密码？</div>
      </div>
    </form>
<!--    底栏-->
    <div class="footer">
<!--      注册按钮-->
      <el-button class="user-login-form-footer-btn"
                  @click="userRegisterFromDialog"
                  type="primary">
        注册
      </el-button>
<!--      登录按钮-->
      <el-button class="user-login-form-footer-btn"
                 @click="userLoginFromDialog"
                  type="primary">
        登录
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>