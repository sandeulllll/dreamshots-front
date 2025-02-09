<script>
import userUtils from "@/utils/userUtils";
import LoginDialog from "@/components/LoginDialog.vue";

export default {
  name: "VideoComment",
  components: {LoginDialog},
  mixins:[userUtils],
  data(){
    return{
      commentCount:0,
      comment:'',
      showLoginDialog:false
    }
  }
}
</script>

<template>
<div class="comment-container">
<!--  评论header-->
  <div class="comment-header">
    <div class="comment-header-title">
      评论
      <div class="comment-count">
        {{commentCount}}
      </div>
    </div>
    <div class="comment-header-sort">
      <div class="hot-sort">
        最热
      </div>
      <div class="part-symbol">

      </div>
      <div class="time-sort">
        最新
      </div>
    </div>
  </div>
  <div class="comment-body">
<!--    用户没有登录的情况-->
    <div v-if="!this.isUserLoggedIn" class="comment-body-before-login">
      <div class="comment-send-area-before-login">
        <div class="user-avatar-before-login">
          <img :src="require('@/assets/bilibiliavatar.png')" alt="">
        </div>
        <div class="comment-input-before-login">
          <textarea class="comment-input-textarea"
                    placeholder="请登录后再观看和发表评论" v-model="comment">
          </textarea>
          <div class="comment-button-before-login">
            <el-button type="primary" @click="showLoginDialog = true">
              发布
            </el-button>
            <el-dialog title="密码登录" :visible.sync="showLoginDialog" width="30%">
              <LoginDialog/>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="less">

</style>