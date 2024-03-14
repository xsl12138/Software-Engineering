// pages/translate_/translate_.js
Page({
  data: {
    //字数限制
    maxWord: 500,
    currentWord: 0,
    translate_result: '待输入需要翻译的文本',
    input: '',
    picker: ['汉语','西班牙语','英语','阿拉伯语','印地语','孟加拉语','葡萄牙语','俄语','日语','韩语','德语','法语'],
    mubiao_lang: ['zh', 'es', 'en', 'ar', 'hi', 'bn', 'pt', 'ru', 'ja', 'ko', 'de', 'fr'],
    index: null,
    language: '汉语'
  },

  // remarkInputAction: function (options) {
  //   //获取输入框输入的内容
  //   let value = options.detail.value;
  //   this.setData({
  //     input: value
  //   });
  // },

  limitWord:function(e){
    var that = this;
    var value = e.detail.value;
    //解析字符串长度转换成整数。
    var wordLength = parseInt(value.length); 
    if (that.data.maxWord < wordLength) {
      return ;
    }
    that.setData({
      currentWord: wordLength,
      input: value
    });
  },

  PickerChange(e){
      this.setData({
        index : e.detail.value,  //用户选择的目标语言的序号
        language: this.data.picker[e.detail.value]
      })
      console.log(this.data.language)
  },


  start_translate(){
    var temp_res = this.data.input;
    //判断输入是否为空
    if(!this.data.input){
      wx.showModal({
        title: '请输入需要翻译的内容！', //提示的标题
        success: function(res) {
          if(res.confirm) {
            console.log('用户点击了确定')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
  //设置translate_result
      this.setData({
        translate_result: temp_res
      });
      return;
    }else{
      wx.vrequest({
        url: 'http://rjgc.kiedy.xyz:39393/translate_txt',
        method : 'POST',
        data : {
          'word' : this.data.input,
          'trans_to' : this.data.mubiao_lang[this.data.index],
        },
        success: ret => {
          temp_res = ret.data;
          console.log(ret.data);
          this.setData({
            translate_result: temp_res
          });
        }
      });   
    }

  }
})