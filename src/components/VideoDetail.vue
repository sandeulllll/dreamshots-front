<script>
import CommonHeader from "@/components/CommonHeader.vue";
import videoApi from "@/api/videoApi";

// import Player from "xgplayer/es/player";
import Player from 'xgplayer';
import 'xgplayer/dist/xgplayer.css';
import Danmu from 'xgplayer/es/plugins/danmu'
import 'xgplayer/es/plugins/danmu/index.css'
import {Events} from "xgplayer";

export default {
  name: "VideoDetail",
  components: {CommonHeader},
  data(){
    return{
      videoDetail:{
        title:'',
        createTime:''
      },
      viewCount:'',
      danmuCount:'',
      videoUpInfo:{},
      player:null
    }
  },
  methods:{
    async getVideoDetail(){
      const videoId = this.$route.query.videoId;
      if(videoId){
        const response = await videoApi.getVideoDetail(videoId);
        console.log(response);
        this.videoDetail = response.data.video;
        this.videoUpInfo = response.data.userInfo;
        await this.initPlayer();
      }
    },
    async initPlayer() {
      const videoUrl = 'http://localhost:15005/video-slices?url=' + this.videoDetail.url;
      this.player = new Player({
        id:'bili-player',
        url:videoUrl,
        width:'800px',
        height:'450px',
        plugins:[Danmu],
        danmu:{
          comments:[]
        }
      });
      this.player.on(Events.ENDED,async ()=>{
        let params = {
          videoId:this.$route.query.videoId
        }
        await videoApi.addVideoViews(params);
        this.viewCount++;
      })
    }
  },
  mounted() {
    this.getVideoDetail();
  }
}
</script>

<template>
<div>
  <CommonHeader/>
  <div class="video-detail-container">
    <div class="left-container">
      <div class="video-info-container">
        <div class="video-info-title">
          {{this.videoDetail.title}}
        </div>
        <div class="video-info-count">
          <span>
            <img :src="require('@/assets/icon/viewCount.png')" alt="">
            {{viewCount}}
          </span>
          <span>
            <img :src="require('@/assets/icon/danmuCount.png')" alt="">
            {{danmuCount}}
          </span>
          <span>
            {{videoDetail.createTime}}
          </span>
          <span>
            <img :src="require('@/assets/icon/jinzhi.png')" alt="">
            未经作者授权，禁止转载
          </span>

        </div>
      </div>
<!--      播放器页面占位DOM-->
      <div id="bili-player"></div>
      
    </div>
    <div class="right-container">
      
    </div>
  </div>
  
</div>
</template>

<style scoped lang="less">

.video-detail-container {
  display: flex;
  justify-content: center;

  .left-container {
    display: flex;
    flex-direction: column;

    .video-info-container {
      display: flex;
      height: 108px;
      flex-direction: column;
      justify-content: center;

      .video-info-title {
        font-size: 24px;
        margin-bottom: 5px;
      }

      .video-info-count {
        font-size: 13px;
        align-items: center;
        color: gray;
        display: flex;

        span {
          display: flex;
          align-items: center;
          margin-right: 20px;

          img {
            height: 25px;
            width: 25px;
            border-radius: 2px;
            margin-right: 5px;
          }
        }

      }
    }
  }
}


</style>