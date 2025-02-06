// 用于计算md5值
import SparkMD5 from "spark-md5";
// 视频相关的API接口
import videoApi from "@/api/videoApi";


export default {

    // 方法定义
    methods: {

        /**
         * 分片上传文件
         * @param selectedFile - 用户选择的文件
         * @returns {Promise<unknown>} 返回上传结果的Promise
         */
        async uploadFileBySlices(selectedFile){
            // 如果没有选择文件，则弹出提示
            if(!selectedFile){
                window.alert('没有选择文件');
                return;
            }
            //计算文件的MD5值
            const fileMd5 = await this.calculateVideoMD5(selectedFile);
            // 获取文件名
            const fileName = selectedFile.name;
            // 文件名，不含拓展名
            let sliceName = fileName.split(".")[0];
            // 拓展名
            let sliceType = fileName.split(".")[1];
            // 分片大小：2MB
            const sliceSize = 2 * 1024 * 1024; //分片大小：2MB
            // 总分片数
            const totalSliceNo = Math.ceil(selectedFile.size / sliceSize);

            /**
             * 递归上传分片
             * @param sliceIndex 当前分片索引
             * @returns {Promise<unknown>} 返回上传结果的Promise
             */
            const uploadSlice = (sliceIndex) =>{
                // 当前分片的起始位置
                const start = sliceIndex * sliceSize;
                // 当前分片的结束位置
                const end = Math.min(start+sliceSize, selectedFile.size);
                // 截取当前分片
                let slice = selectedFile.slice(start, end);
                return new Promise((resolve)=>{
                    // 将分片重新命名为：sliceName + sliceIndex + sliceType
                    slice = new File([slice], sliceName+sliceIndex+"."+sliceType);
                    // 创建FormData对象，用于上传分片
                    const formData = new FormData();
                    // 文件的MD5值
                    formData.append('fileMd5', fileMd5);
                    // 当前分片编号
                    formData.append('sliceNo', sliceIndex+1);
                    // 总分片数
                    formData.append('totalSliceNo',totalSliceNo);
                    // 当前分片文件
                    formData.append('slice', slice);
                    // 调用API上传分片
                    videoApi.uploadFileBySlices(formData).then((response)=>{
                        // 分片索引加一
                        sliceIndex++;
                        // 更新上传进度
                        this.uploadProgress = (sliceIndex/totalSliceNo * 100).toFixed(1);
                        // 如果所有分片上传完成，返回最终结果
                        if(sliceIndex === totalSliceNo){
                            resolve(response);
                        }else{
                            // 否则继续上传下一个分片
                            uploadSlice(sliceIndex).then(resolve);
                        }
                    })
                })
            };
            // 开始上传第一个分片
            return await uploadSlice(0);
        },

        /**
         * 计算文件的MD5值
         * @param file 需要计算MD5的文件
         * @returns {Promise<unknown>} 返回的MD5值
         */
        async calculateVideoMD5(file) {
            return new Promise((resolve, reject) => {
                // 文件切片方法
                const blobSlice = File.prototype.slice;
                // 每个分片的大小：2MB
                const chunkSize = 2097152; // 2 MB chunks (you can adjust this value)
                // 用于读取文件内容
                const fileReader = new FileReader();
                // 用于计算MD5的SpartkMD5实例
                const spark = new SparkMD5.ArrayBuffer();
                // 当前分片索引
                let currentChunk = 0;
                // 总分片数
                const totalChunks = Math.ceil(file.size / chunkSize);
                // 文件读取完成时的回调
                fileReader.onload = (e) => {
                    // 将分片内容添加到SparkMD5中
                    spark.append(e.target.result);
                    // 分片索引加一
                    currentChunk++;
                    // 如果还有未读取的分片
                    if (currentChunk < totalChunks) {
                        // 继续读取下一个分片
                        loadNextChunk();
                    } else {
                        // 计算最终的MD5值
                        const md5 = spark.end(false);
                        // 返回MD5值
                        resolve(md5);
                    }
                };
                // 文件读取失败时的回调
                fileReader.onerror = (e) => {
                    // 返回错误
                    reject(e);
                };

                /**
                 * 读取下一个分片
                 */
                function loadNextChunk() {
                    // 当前分片的起始位置
                    const start = currentChunk * chunkSize;
                    // 当前分片的结束位置
                    const end = Math.min(start + chunkSize, file.size);
                    // 截取当前分片
                    const chunk = blobSlice.call(file, start, end);
                    fileReader.readAsArrayBuffer(chunk);
                }
                // 开始读取第一个分片
                loadNextChunk();
            });
        },

        /**
         * 将Base64字符串转换为PNG文件
         * @param base64String -Base64编码的图片字符串
         * @returns {module:buffer.File} - 返回PNF文件对象
         */
        convertBase64ToPngFile(base64String) {
            // 将Base64转换为Blob
            const blob = this.base64ToBlob(base64String);
            // 创建一个新的 File 对象，类型为 'image/png'
            const pngFile = new File([blob],
                'image.png', { type: 'image/png' });
            // 打印PNG文件信息
            console.log('png', pngFile);
            // 返回PNG文件
            return pngFile;
        },

        /**
         * 将Base64转换为BLob对象
         * @param base64String Base64编码的字符串
         * @returns {module:buffer.Blob} 返回的Blob对象
         */
        base64ToBlob(base64String) {
            // 将Base64字符串解码为二进制数据
            const byteString = atob(base64String.split(',')[1]);
            // 创建ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);
            // 创建Uint8Array视图
            const ia = new Uint8Array(ab);
            // 将二进制数据写入ArrayBuffer
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            // 返回Blob对象
            return new Blob([ab], { type: 'image/png' });
        },

    }

}