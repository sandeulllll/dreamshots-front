// 导入用户相关的api模块
import userApi from "@/api/userApi";
// 导入JSEncrypt库，用户RSA加密
import JSEncrypt from 'jsencrypt';

//判断是否使用刷新令牌（refresh token），默认为false
export const usingRefreshToken = false;
export default {
    data() {
        return {
            // 默认头像的路径
            defaultAvatar:require('@/assets/defaultAvatar.png'),
        };
    },
    methods: {

        /**
         * 用户密码RSA加密
         * @param password - 用户输入的密码
         * @param publicKey - RSA公钥
         * @returns {string | false} - 加密后的密码
         */
        encryptPassword(password, publicKey) {
            // 创建JSEncrypt实例
            const encryptStr = new JSEncrypt();
            // 设置加密公钥
            encryptStr.setPublicKey(publicKey.toString());
            // 进行加密
            return encryptStr.encrypt(password);
        },

        /**
         * 用户注册
         * @param account 用户账号（通常是手机号）
         * @param password 用户密码
         * @returns {Promise<void>}
         */
        async userRegister(account, password){
            // 获取RSA公钥
            let response = await userApi.getRsaPublicKey();
            //使用ES6解构语法，从响应中提取公钥数据
            const {data:rsaPk} = response;
            // 对密码进行RSA加密
            let encryptPwd = this.encryptPassword(password, rsaPk);
            // 构造注册参数
            const params = {
                // 手机号
                phone: account,
                // 加密后的密码
                password: encryptPwd
            }
            // 调用注册接口
            response = await userApi.addUser(params);
        },

        /**
         * 用户登录
         * @param account 手机号作为用户账号
         * @param password 用户密码
         * @returns {Promise<void>}
         */
        async userLogin(account, password) {
            try {
                // 获取RSA公钥
                let response = await userApi.getRsaPublicKey();
                //ES6 解构语句
                const {data:rsaPk} = response;
                // 对密码进行RSA加密
                let encryptPwd = this.encryptPassword(password, rsaPk);
                // 构造登录参数
                const params = {
                    phone: account,
                    password: encryptPwd
                }
                // 用于存储登录成功后的token
                let token = null;
                // 如果使用双token模式
                if(usingRefreshToken){
                    // 接收使用双token登录接口的响应数据
                    response = await userApi.getUserTokenAndRefreshToken(params);
                    // 使用ES6结构语法从响应中提取token数据
                    const {data:map} = response;
                    const {accessToken:accessToken, refreshToken:refreshToken} = map;
                    token = accessToken;
                    // 存储refresh token
                    localStorage.setItem('refreshToken', refreshToken);
                }else{
                    // 获取单token模式下的响应
                    response = await userApi.getUserToken(params);
                    // 从响应中提取access token
                    const {data:accessToken} = response;
                    token = accessToken;
                }
                // 如果token存在且不为null
                if (token && token !== 'null') {
                    // 将token存储到localstorage中
                    localStorage.setItem('token', token);
                }
            }catch (error){
                // 登录失败时弹出提示
                window.alert('登录失败')
            }
        },

        /**
         * 查询用户基本信息
         * @returns {Promise<*>} 用户信息（使用对象存储）
         */
        async getUserBasicInfo(){
            //调用API获取用户基本信息
            let response = await userApi.getUserBasicInfo();
            // 如果响应数据存在，返回用户信息
            if(response.data){
                return response.data.userInfo;
            }
        },

        /**
         * 退出登录
         */
        logout() {
            // 移除localStorage中的token
            localStorage.removeItem('token');
            // 刷新页面
            location.reload();
        },

    },

    computed: {
        /**
         * 判断用户是否登录
         * @returns {""|boolean}
         */
        isUserLoggedIn() {
            // 从localStorage中获取token
            let token = localStorage.getItem('token');
            // 如果token存在且不为null，返回true，否则返回false
            return token && token !== 'null';
        }
    }
}