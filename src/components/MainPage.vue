
<template>
  <div>
    <CommonHeader/>
    <MainPageContent/>
  </div>
</template>

<script>
import userApi from "@/api/userApi";
import CommonHeader from "@/components/CommonHeader.vue";
import MainPageContent from "@/components/MainPageContent.vue";
export default {
  name: "MainPage",
  components: {MainPageContent, CommonHeader},
  data(){
    return{
      pk:''
    }
  },
  methods:{
    async getRsaPublicKey(){
      let response = await userApi.getRsaPublicKey();
      if(response.data){
        this.pk = response.data;
      }
    },

    async addUser(){
      let params = {
        phone:'3131',
        password:'dada'
      };
      let response = await userApi.addUser(params);
      console.log(response);
    },

    async updateUsers(){
      let params = {
        phone:'3131',
        password:'dada'
      };
      let response = await userApi.updateUsers(params);
      console.log(response);
    },

    async logout(){
      let response = await userApi.logout();
      console.log(response);
    }
  },
  mounted() {
    // this.getRsaPublicKey();
    // this.addUser();
    // this.updateUsers();
    // this.logout();
  }
}
</script>

<style scoped lang="less">

</style>
