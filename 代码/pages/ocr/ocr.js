// pages/ocr/ocr.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    ocr_result: '',
    screenWidth: 0,
		screenHeight:0,
		imgwidth:0,
		imgheight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.cut_array();
    this.setData({
      tempFilePaths: app.globalData.ocr_source_path,
      //ocr_result: app.globalData.ocr_res
    })
    
    var _this = this;
		wx.getSystemInfo({
			success: function(res) {
				_this.setData({
					screenHeight: res.windowHeight,
					screenWidth: res.windowWidth,
				});
			}
		});
  },

  cut_array: function(){
    var do_array = app.globalData.ocr_res;
    var str_res = '';
    for(var i = 0; i < do_array.length ; i++){
      str_res +=  do_array[i];
      str_res += '\n';
    }
    this.setData({
      ocr_result : str_res
    })
    console.log(str_res);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  imageLoad: function(e) {
    var _this=this;
    var $width=e.detail.width,    //获取图片真实宽度
        $height=e.detail.height,  //获取图片真实高度
        ratio=$width/$height;   //图片的真实宽高比例
    wx.getSystemInfo({
			success: function(res) {
        _this.setData({
          imgheight: res.windowHeight * 0.30,
          imgwidth: res.windowHeight * 0.30 * ratio,
        });
			}
		});
  }

})