const FormData = require('./formData.js')
import {Base64} from './Base64';
//const fs = require('fs');
wx.urequest = function (options) {
  // 默认配置
  const OPT = Object.assign({
    method: 'POST', // 修改为POST
    // dataType: 'json',
    responseType: 'text'
  }, options);
  let base641 = wx.getFileSystemManager().readFileSync(options.data, 'base64') 
  // 创建FormData对象
  let formData = new FormData();
  formData.appendFile('photo', options.data); // 'photo' should match the field name used in your Flask route
  let data1 = formData.getData();
  //image1 = fs.createReadStream(options.data)
  // 默认header
  OPT['header'] = Object.assign({
    'Content-Type': data1.contentType, // 修改为multipart/form-data
    'UserAgent': 'github@guren-cloud/v-request 20181229'
  }, options.header);
  console.log(data1.contentType);
  console.log(data1.buffer.byteLength);
  // 开始请求
  return new Promise((RES, REJ) => {
    wx.cloud.callFunction({
      name: 'v-request',
      data: {
        options: Object.assign({
          url: options.url,
          method: OPT['method'],
          headers: OPT['header'],
          body: base641, // Use FormData for file upload
        })
      },
      success: res => {
        const { result } = res;
        // 如果datatype='json'，则解析后
        let data = null;
        if (OPT.dataType === 'json') {
          try {
            data = JSON.parse(result.body);
          } catch (err) {
            console.error('[!] v-request： 解析返回数据json失败', err);
          }
        } else {
          // 否则为text数据
          data = result.body;
        }

        const RETURN_DATA = {
          data,
          errMsg: 'request:ok',
          statusCode: result.statusCode,
          header: result.headers
        }

        options.success && options.success(RETURN_DATA);
        RES(RETURN_DATA);
      },
      fail: err => {
        // 错误回调
        options.fail && options.fail({
          errMsg: 'request:fail',
          err
        });
        REJ(err);
      },
      complete: options.complete
    })
  })
}