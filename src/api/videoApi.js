import httpRequest from "@/axios/axiosConfig";

export default {
    async pageListVideos(params){
        return await httpRequest.get('/videos',params);
    },
}