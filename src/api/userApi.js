import httpRequest from "@/axios/axiosConfig";

export default {

    // 获取RSA公钥
    async getRsaPublicKey(){
        return await httpRequest.get('/rsa-pks');
    },

    // 用户登录：单token
    async getUserToken(params){
        return await httpRequest.post('user-tokens', params);
    },

    // 用户登录：双token
    async getUserTokenAndRefreshToken(params){
        return await httpRequest.post('user-dts', params);
    },

    // 用户注册
    async addUser(params){
        return await httpRequest.post('/users',params);
    },

    // 更新用户信息
    async updateUsers(params){
        return await httpRequest.put('/users',params);
    },

    // 用户登出
    async logout(){
        return await httpRequest.delete('/refresh-tokens');
    }
}