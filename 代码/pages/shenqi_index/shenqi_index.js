// pages/shenqi_index/shenqi_index.js
const app = getApp()

Page({

  data: {
    optionList:['相机','图库'],
    value:'所有',

    hideFlag: true,//true-隐藏  false-显示
    animationData: {},//
  },

    // 点击选项
    getOption:function(e){
      var that = this;
      that.setData({
        value:e.currentTarget.dataset.value,
        hideFlag: true
      });
      console.log(e.currentTarget.dataset.value);
      if(e.currentTarget.dataset.value == '相机') that.photograph();
      else that.xiangce();
    },

    //取消
    mCancel: function () {
      var that = this;
      that.hideModal();
    },

    do_ocr: function(){
      var that = this;
      wx.urequest({
        url: 'http://rjgc.kiedy.xyz:39393/translate_pic/114515',
        method : 'POST',
        data : app.globalData.ocr_source_path,
        success: ret => {
          console.log(typeof ret.data);
          var JOSN_res = JSON.parse(ret.data);
          console.log(JOSN_res)
          app.globalData.ocr_res = JOSN_res.data.msg;
          that.to_ocr();
       }
      });
    },

    photograph:function() {
      var that = this;
      wx.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: function (res) {
          // if(res.tempFilePaths[1] < (5120 * 1024) ){
            console.log(res.tempFilePaths);
            app.globalData.ocr_source_path = res.tempFilePaths[0];
            console.log(app.globalData.ocr_source_path);
            that.do_ocr();
          // }else{
          //   wx.showToast({
          //     icon:"none",
          //     title: '图片过大，请选择小于5120kb的图片！',
          //   })
          //   return
          // }
        },
        fail: function (res) {
          console.log(res.errMsg);
        }
      })
    },

    xiangce:function(){
      var that = this;
      //从相册获取照片
      wx.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: function (res) {
          console.log(res.tempFiles[0].size) //这个参数是图片大小
          if(res.tempFiles[0].size < (5120 * 1024) ){
            // console.log(res.tempFilePaths);
            app.globalData.ocr_source_path = res.tempFilePaths[0];
            console.log(app.globalData.ocr_source_path);
            that.do_ocr();
          }else{
            wx.showToast({
              icon:"none",
              title: '图片过大，请选择小于5mb的图片！',
            })
            return
          }
        },
        fail: function (res) {
          console.log(res.errMsg);
        }
      });
    },
  
    // ----------------------------------------------------------------------modal
    // 显示遮罩层
    ocr: function () {
      var that = this;
      that.setData({
        hideFlag: false
      })
      // 创建动画实例
      var animation = wx.createAnimation({
        duration: 400,//动画的持续时间
        timingFunction: 'ease',//动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
      })
      this.animation = animation; //将animation变量赋值给当前动画
      var time1 = setTimeout(function () {
        that.slideIn();//调用动画--滑入
        clearTimeout(time1);
        time1 = null;
      }, 100)
    },
  
    // 隐藏遮罩层
    hideModal: function () {
      var that = this;
      var animation = wx.createAnimation({
        duration: 400,//动画的持续时间 默认400ms
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      that.slideDown();//调用动画--滑出
      var time1 = setTimeout(function () {
        that.setData({
          hideFlag: true
        })
        clearTimeout(time1);
        time1 = null;
      }, 220)//先执行下滑动画，再隐藏模块
      
    },
    //动画 -- 滑入
    slideIn: function () {
      this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
      this.setData({
        //动画实例的export方法导出动画数据传递给组件的animation属性
        animationData: this.animation.export()
      })
    },
    //动画 -- 滑出
    slideDown: function () {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },

  to_ocr(){
    wx.navigateTo({
      url: '/pages/ocr/ocr',
    })
  },

  translate(){
    wx.navigateTo({
      url: '/pages/translate_/translate_',
    })
  },

  ai(){
    wx.navigateTo({
      url: '/pages/ai/ai',
    })
  }
})