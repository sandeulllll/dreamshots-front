import axios from 'axios';

const httpRequest = axios.create({
    //后端接口的基础路径
    baseURL:'http://localhost:15005',
    //接口超时响应时间，默认单位是ms，此处设为10s
    timeout:10000
});

//请求拦截器
httpRequest.interceptors.request.use(function (config){

    const token = localStorage.getItem('token');
    //如果token不为null且token不为空,就将token加入请求头
    if (token && token !== ''){
        config.headers['token'] = token;
    }
    return config;

});

//响应拦截器
httpRequest.interceptors.response.use(function (response){
    const data = response.data;
    if(data){
        if(data.code === '500'){
            window.alert(data.msg);
            throw new Error(data.msg);
        }
    }
    return data;
});

export default httpRequest