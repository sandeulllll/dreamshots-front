<script>
// 导入文件处理模块
import fileUtils from "@/utils/fileUtils";
// 导入视频相关的API模块
import videoApi from "@/api/videoApi";

export default {
  // 组件名称
  name: "PostVideo",
  // 混入fileUtils
  mixins:[fileUtils],

  // 数据定义
  data(){
    return {
      // 上传的文件名
      uploadedFileName:null,
      // 上传进度
      uploadProgress:0,
      // 用户选中的文件
      selectedFile:null,
      // 视频的详细信息
      videoInfo:{
        // 视频URL
        url:'',
        // 视频时长
        duration:'',
        // 视频封面URL
        thumbnail:'',
        // 视频标题
        title:'',
        // 视频类型：自制or转载
        type:'',
        // 视频分区
        area:'',
        // 视频标签列表（对象形式）
        videoTagList:[],
        // 视频标签列表（字符串形式）
        tags:[],
        // 视频简介
        description:''
      },
      // 视频封面
      thumbnailBase64:'',
      // 视频分区选项
      areas:[
        {
          value:'0',
          label:'鬼畜'
        },
        {
          value:'1',
          label:'音乐'
        },
        {
          value:'2',
          label:'电影'
        },
        {
          value:'3',
          label:'番剧'
        },
        {
          value:'4',
          label:'游戏'
        }
      ]
    }
  },

  // 方法定义
  methods:{

    // 触发文件选择对话框
    selectVideo(){
      // 通过ref获取文件输入框并触发点击事件
      this.$refs.fileInput.click();
    },

    // 处理文件拖放事件
    handleDrop(event){
      // 阻止浏览器可能的默认行为
      event.preventDefault();
      // 获取拖放的文件
      const files = event.dataTransfer.files;
      if(files.length > 0){
        // 保存选择的文件
        this.selectedFile = files[0];
        // 更新文件名
        this.uploadedFileName = this.selectedFile.name;
      }
    },

    // 处理文件选择事件
    setVideo(){
      // 获取选择的文件
      const files = this.$refs.fileInput.files;
      if(files.length > 0){
        this.selectedFile = files[0];
        this.uploadedFileName = this.selectedFile.name;
      }
    },

    // 上传视频
    async uploadVideo(){
      if(this.selectedFile){
        // 调用混入的uploadFileBySlices 方法分片上传文件
        const response = await this.uploadFileBySlices(this.selectedFile);
        if(response){
          // 获取上传后的视频的URL
          const {data:data} = response;
          // 更新视频URL
          this.videoInfo.url = data;
          console.log(this.videoInfo.url);
          // 获取视频封面
          await this.getFrameAtTime(this.selectedFile);
        }
      }
    },

    // 获取视频封面（从视频的第一帧）
    async getFrameAtTime(selectedFile){
      if(!selectedFile){
        // 如果没有选择文件，弹出提示
        window.alert('没有选择文件');
        return;
      }

      const videoUrl = URL.createObjectURL(selectedFile);
      // 获取video元素
      const videoElement = this.$refs.videoElement;
      // 设置视频源
      videoElement.src = videoUrl;
      // 获取视频时长
      videoElement.addEventListener('loadedmetadata', ()=>{
        this.videoInfo.duration = videoElement.duration;
        // 设置视频当前事件为0
        videoElement.currentTime = 0;
        // 创建画布
        videoElement.addEventListener('timeupdate', async ()=>{

          const canvas = document.createElement('canvas');
          // 获取画布上下文
          const context = canvas.getContext('2d');
          // 设置画布宽度
          canvas.width = videoElement.videoWidth;
          // 设置画布高度
          canvas.height = videoElement.videoHeight;
          //绘制视频帧到画布上
          context.drawImage(videoElement, 0,0, canvas.width, canvas.height);
          //将画布内容转为Base64图像
          this.thumbnailBase64 = canvas.toDataURL('image/jpeg');
          if(this.thumbnailBase64){
            // 将Base64转换为PNG文件上传
            const thumbnailPng = this.convertBase64ToPngFile(this.thumbnailBase64);
            let thumbnailUrl = await this.uploadFileBySlices(thumbnailPng);
            if(thumbnailUrl){
              console.log('thumbnailUrl', thumbnailUrl);
              // 更新封面URL
              this.videoInfo.thumbnail = thumbnailUrl.data;
            }
          }
        });
      });
    },

    // 创建标签
    async createTag(){
      // 获取输入框的值
      const input = this.$refs.tagInput.value.trim();
      if(input){
        const params = {
          // 标签名称
          name:input
        }
        // 调用API添加标签
        const response = await videoApi.addTag(params);
        // 获取标签ID
        const {data:tagId} = response;
        let tag = {
          // 标签对象
          tagId:tagId
        }
        // 添加到标签列表
        this.videoInfo.videoTagList.push(tag);
        // 添加到标签字符串列表
        this.videoInfo.tags.push(input);
        // 清空输入框
        this.$refs.tagInput.value = ''
      }
    },

    // 提交视频
    async postVideo(){
      // 调用API提交视频信息
      await videoApi.postVideo(this.videoInfo);
      window.alert('视频上传成功')
      // 跳转到首页
      await this.$router.push('/')
    }

  }
}
</script>

<template>
  <div class="post-video-container">
    <div class="post-video-body" @dragover.prevent @drop="handleDrop">
      <i class="el-icon-upload2"></i>
      <div v-if="uploadedFileName">{{uploadedFileName}}</div>
      <div v-else>拖拽到此处也可上传</div>
      <input type="file" ref="fileInput" @change="setVideo"
             style="display: none" accept="video/*">
      <el-button @click="selectVideo" class="video-operation-btn" type="primary">
        选择视频
      </el-button>
      <el-button @click="uploadVideo" class="video-operation-btn" type="primary">
        上传视频
      </el-button>
      <div v-if="uploadProgress > 0" class="upload-progress">
        <progress :value="uploadProgress" max="100" ></progress>
        {{uploadProgress}}%
      </div>
      <video ref="videoElement" style="display: none"></video>
    </div>

    <div class="video-form">
      <div class="video-thumbnail" v-if="videoInfo.url">
        <div class="video-thumbnail-text">
          封面
        </div>
        <div class="video-thumbnail-img">
          <img :src="thumbnailBase64" alt="">
        </div>
      </div>
      <div class="video-title">
        <div class="video-title-text">标题</div>
        <div class="video-title-input">
          <input type="text" v-model="videoInfo.title" maxlength="80"
                 placeholder="请输入标题" class="input-val">
        </div>
      </div>
      <div class="video-type">
        <div class="video-type-text">类型</div>
        <div class="video-type-selector">
          <el-radio v-model="videoInfo.type" label="1">自制</el-radio>
          <el-radio v-model="videoInfo.type" label="2">转载</el-radio>
        </div>
      </div>
      <div class="video-area">
        <div class="video-area-text">分区</div>
        <div class="video-area-selector">
          <el-select v-model="videoInfo.area" placeholder="请选择">
            <el-option v-for="area in areas" :key="area.value"
                       :label="area.label" :value="area.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="video-tag">
        <div class="video-tag-container">
          <div class="video-tag-text">标签</div>
          <div class="video-tag-input">
            <input type="text" maxlength="80"
                   placeholder="按回车键Enter创建标签"
                   class="input-val" ref="tagInput" @keyup.enter="createTag">
          </div>
        </div>
        <div v-if="videoInfo.tags.length > 0" class="video-tag-show">
          <el-tag type="info" v-for="(tag, index) in videoInfo.tags" :key="index"
                  style="margin-right: 20px; margin-top: 10px; font-size: 16px">
            {{tag}}
          </el-tag>
        </div>
      </div>
      <div class="video-description">
        <div class="video-description-text">简介</div>
        <div class="video-description-input">
          <input type="text" v-model="videoInfo.description"
                 maxlength="80" placeholder="请输入简介" class="input-val">
        </div>
      </div>
      <div class="submit-video">
        <el-button @click="postVideo" type="primary"
                   style="margin: 40px; width: 200px;">
          立即投稿
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

.post-video-container{
  max-width: 830px;
  margin: 0 auto;
  position: relative;
  .post-video-body{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
    position: relative;
    color: #999;
    font-size: 14px;
    border: 2px dashed #ccc;
    padding: 30px;
    .el-icon-upload2{
      font-size: 30px;
    }
    .video-operation-btn{
      margin-top: 20px;
      font-size: 16px;
      margin-left:0;
    }
    .upload-progress{
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 20px;
      font-size: 16px;
      margin-left:0;
    }
  }

  .video-form{
    display: flex;
    flex-direction: column;
    justify-content: center;

    .video-thumbnail{
      display: flex;
      .video-thumbnail-text{
        width: 100px;
      }
      .video-thumbnail-img{
        img{
          width: 320px;
          height: 180px;
          border-radius: 4px;
        }
      }
    }

    .video-title{
      display: flex;
      justify-content: space-between;
      margin-top: 40px;

      .video-title-text{
        width: 100px;
      }

      .video-title-input{
        border-radius: 4px;
        padding: 0 12px;
        border: 1px solid #ccd0d7;
        min-width: 200px;
        width: 100%;
        .input-val{
          width: 100%;
          border: none;
          color: #222;
          line-height: 22px;
          height: 22px;
          outline: 0;
          border: 0;
          background-color: transparent;
          font-size: 16px;
        }
      }
    }

    .video-type{
      display: flex;
      margin-top: 40px;
      align-items: center;

      .video-type-text{
        width: 100px;
      }
      .video-type-selector{
        display: flex;
      }
    }

    .video-area{
      display: flex;
      margin-top: 40px;
      align-items: center;

      .video-area-text{
        width: 100px;
      }
      .video-area-selector{
        display: flex;
      }
    }

    .video-tag{
      display: flex;
      margin-top: 40px;
      flex-direction: column;

      .video-tag-container{
        display: flex;
        align-items: center;
        .video-tag-text{
          width: 100px;
        }
        .video-tag-input{
          border-radius: 4px;
          padding: 0 12px;
          border: 1px solid #ccd0d7;
          min-width: 200px;
          width: 100%;
          .input-val{
            width: 100%;
            border: none;
            color: #222;
            line-height: 22px;
            height: 22px;
            outline: 0;
            border: 0;
            background-color: transparent;
            font-size: 16px;
          }
        }
      }
      .video-tag-show{
      }
    }

    .video-description{
      display: flex;
      justify-content: space-between;
      margin-top: 40px;

      .video-description-text{
        width: 100px;
      }
      .video-description-input{
        border-radius: 4px;
        padding: 0 12px;
        border: 1px solid #ccd0d7;
        min-width: 200px;
        width: 100%;
        height: 60px;
        .input-val{
          width: 100%;
          border: none;
          color: #222;
          line-height: 22px;
          height: 22px;
          outline: 0;
          border: 0;
          background-color: transparent;
          font-size: 16px;
        }
      }
    }

    .submit-video{
      display: flex;
      justify-content: center;
    }

  }
}
</style>