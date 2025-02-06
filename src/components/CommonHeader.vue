<script>
// 导入userUtils模块
import userUtils from "@/utils/userUtils";

// 导入登录对话框组件 LoginDialog
import LoginDialog from "@/components/LoginDialog.vue";

// 导出vue组件
export default {
  name: "CommonHeader", // 组件名称
  components: {LoginDialog}, // 注册当前组件使用的子组件

  // 数据定义
  data() {
    return {
      // 布尔值，控制登录对话框的显示与隐藏
      dialogVisible: false,
      // 数组，存储导航栏的条目
      entries: [
        {id: 1, name: '首页', path: '/'},
        {id: 2, name: '番剧', path: '/'},
        {id: 3, name: '直播', path: '/'},
        {id: 4, name: '游戏中心', path: '/'}
      ],
      // 字符串，绑定搜索框的输入内容
      searchTxt: ''
    };
  },

  // mixins用于混入其他组件的逻辑
  mixins: [userUtils],

  // 方法定义
  methods: {
    // 跳转页面并检查用户是否登录
    jumpWithLoginUser(path) {
      // 如果用户未登录
      if (!this.isUserLoggedIn) {
        // 显示登录对话框
        this.dialogVisible = true;
      } else {
        // 如果用户已登录
        // 跳转到指定路径
        if (this.$route.path !== path) {
          this.$router.push(path); // 使用 Vue Router 跳转
        } else {
          // 当前路径与目标路径相同则刷新页面
          location.reload(); // 如果当前路径与目标路径相同，刷新页面
        }
      }
    },

    // 跳转到指定路径的方法
    jumpToPath(path) {
      if (this.$route.path !== path) {
        this.$router.push(path); // 使用 Vue Router 跳转
      } else {
        location.reload(); // 如果当前路径与目标路径相同，刷新页面
      }
    },

    // 搜索内容（暂未实现）
    searchContents() {
      // 可以在这里实现搜索逻辑
    }
  },

  // 组件挂载后执行的逻辑
  async mounted() {
    // 如果用户已登录
    // 使用计算属性isUserLoggerIn判断用户是否登录
    if (this.isUserLoggedIn) {
      // 如果用户已经登录
      // 使用从userUtils混入的方法getUserBasicInfo来获取用户基本信息
      // 将用户信息存储到Vuex状态中
      this.$store.state.userInfo = await this.getUserBasicInfo();
    }
  },

  // 计算属性
  computed: {
    // 计算用户头像
    avatar() {
      const userInfo = this.$store.state.userInfo;
      // 如果用户信息中存在头像且不为空，返回用户头像；否则返回默认头像
      if (userInfo && userInfo.avatar && userInfo.avatar !== '') {
        return userInfo.avatar;
      } else {
        return require('@/assets/bilibiliavatar.png'); // 默认头像
      }
    }
  }
};
</script>

<template>

<!--  通用头部-->
  <div class="bili-header">

    <!-- 导航栏容器 -->
    <div class="header-nav-container">

      <!-- 左侧导航条目 -->
      <div class="left-entry">

        <div v-for="entry in entries" :key="entry.id">

          <span @click="jumpToPath(entry.path)">{{ entry.name }}</span>

        </div>

      </div>

      <!-- 中间搜索栏 -->
      <div class="center-search-bar">

<!--        搜索的表单-->
        <form class="nav-search-form">

<!--          搜索栏的内容部分-->
          <div class="nav-search-content">

<!--            输入框部分-->
            <input class="nav-search-input"
                   type="text" autocomplete="off"
                   maxlength="100" placeholder="请输入要搜索的内容"
                   v-model="searchTxt"> <!-- 绑定搜索框输入内容 -->

          </div>
<!--          搜索按钮-->
          <div class="nav-search-btn">
            <el-button icon="el-icon-search"
                       circle size="mini" @click="searchContents">
            </el-button>
          </div>
        </form>
      </div>

      <!-- 右侧导航条目 -->
      <div class="right-entry">

        <!-- 用户中心 -->
        <div v-if="isUserLoggedIn" class="user-center">
<!--          下拉菜单组件-->
          <el-dropdown>
            <span class="el-dropdown-link">
              <img style="height: 50px; width: 50px; border-radius: 50%"
                   :src="avatar" alt=""> <!-- 显示用户头像 -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" style="color: black"
                           @click="jumpToPath('/mySpace')">
                  个人中心
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item style="color: black">
                <el-button type="text" style="color: black"
                           @click="logout"> <!-- 退出登录 -->
                  退出登录
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- 登录按钮 -->
        <div v-else class="user-center">
          <el-button class="login-button" type="text" @click="dialogVisible = true">
            登录
          </el-button>
          <!-- 登录对话框 -->
          <el-dialog
              title="密码登录"
              :visible.sync="dialogVisible"
              width="30%">
            <LoginDialog/>
          </el-dialog>
        </div>

        <!-- 动态内容 -->
        <div class="right-entry-moments">
<!--          弹出框组件-->
          <el-popover
              placement="top-start"
              width="200"
              trigger="hover">
            <div v-if="isUserLoggedIn">
              <div>这里是动态内容</div>
              <el-button type="info">查看更多</el-button>
            </div>
            <div v-else>
              <div>登录即可查看动态</div>
              <el-button type="info">立即登录</el-button>
            </div>
            <el-button slot="reference" class="el-btn-moments">hover 激活</el-button>
          </el-popover>
        </div>

        <!-- 历史记录 -->
        <div class="right-entry-content">
          <el-button type="warning" icon="el-icon-time" circle></el-button>
          <span>历史</span>
        </div>

        <!-- 投稿 -->
        <div class="right-entry-content">
          <el-button type="warning" icon="el-icon-upload2" circle
                     @click="jumpWithLoginUser('postContent')"></el-button>
          <span>投稿</span>
        </div>
      </div>
    </div>

    <!-- 头部横幅 -->
    <div class="header-banner-container">
      <img class="banner"
           :src="require('@/assets/header/header-banner.png')" alt="">
    </div>
  </div>
</template>

<style scoped lang="less">
.bili-header {
  .header-nav-container {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-entry {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 40px;

      span {
        margin-right: 20px;
        color: white;
        font-weight: bolder;
        cursor: pointer;
      }
    }

    .center-search-bar {
      flex: 1 auto;
      min-width: 181px;
      max-width: 500px;

      .nav-search-form {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px 0 4px;
        height: 40px;
        background-color: white;
        border-radius: 8px;
        opacity: 0.8;

        .nav-search-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 36px;
          border: 2px solid transparent;
          border-radius: 6px;

          .nav-search-input {
            width: 100%;
            font-size: 14px;
            padding-right: 8px;
            background-color: transparent;
            border: none;
            box-shadow: none;
            outline: none;
          }
        }

        .nav-search-btn {
          margin: 0;
          padding: 0;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }

    .right-entry {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px;

      .user-center {
        margin-right: 10px;

        .login-button {
          color: #00a1d6;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-weight: bold;
          background-color: #fff;
        }
      }

      .right-entry-moments {
        margin-right: 10px;

        .el-btn-moments {
          height: 100%;
        }
      }

      .right-entry-content {
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          margin-top: 5px;
          color: white;
        }
      }
    }
  }

  .header-banner-container {
    .banner {
      width: 100%;
    }
  }
}
</style>