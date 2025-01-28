import httpRequest from "@/axios/axiosConfig";

export default {

    /**
     * 获取加密公钥
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async getRsaPublicKey(){
        return await httpRequest.get('/rsa-pks');
    },

    /**
     * 用户登录（单token）
     */
    async getUserToken(params){
        return await httpRequest.post('user-tokens', params);
    },

    /**
     * 用户登录（双token）
     */
    async getUserTokenAndRefreshToken(params){
        return await httpRequest.post('user-dts', params);
    },

    async addUser(params){
        return await httpRequest.post('/users',params);
    },

    async updateUsers(params){
        return await httpRequest.put('/users',params);
    },

    async logout(){
        return await httpRequest.delete('/refresh-tokens');
    }
}