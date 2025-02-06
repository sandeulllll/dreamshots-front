// 导入axios库，用于发送HTTP请求
import axios from 'axios';

// 创建一个自动逸axios实例，命名为httpRequest
const httpRequest = axios.create({
    //设置后端接口的基础路径，所有请求都会基于这个路径
    baseURL:'http://localhost:15005',
    //设置请求的超时时间，单位为毫秒，这里设置为10s
    // 如果请求超过10s没有响应，请求会被自动取消
    timeout:10000
});

//请求拦截器：在发送请求之前，对请求配置进行处理
httpRequest.interceptors.request.use(function (config){

    // 从localstorage中获取token（用于用户认证）
    const token = localStorage.getItem('token');
    //如果token存在且不为空字符串，将其添加到请求头中
    if (token && token !== ''){
        // 将token添加到请求头的'token'字段
        config.headers['token'] = token;
    }
    // 返回处理后的请求配置
    return config;

});

//响应拦截器：在接受到响应后，对响应数据进行处理
httpRequest.interceptors.response.use(function (response){
    // 从响应中提取数据
    const data = response.data;
    // 如果响应数据存在
    if(data){
        // 如果后端返回的状态码是‘500’，表示服务器内部错误
        if(data.code === '500'){
            // 弹窗显示错误信息
            window.alert(data.msg);
            // 抛出错误，阻止后续代码执行
            throw new Error(data.msg);
        }
    }
    // 返回处理后的响应数据
    return data;
});

// 导出httpRequest实例，供其他模块使用
export default httpRequest