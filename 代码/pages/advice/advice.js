// pages/advice/advice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxWord: 500,
    currentWord: 0,
    input:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  submit(){
    var temp_res = this.data.input;
    //判断输入是否为空
    if(!this.data.input){
      wx.showModal({
        title: '请输入您的意见！', //提示的标题
        success: function(res) {
          if(res.confirm) {
            console.log('用户点击了确定')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
      return;
    }else{
      console.log(temp_res)
      wx.showModal({
        title: '感谢您的意见！',
        success: function(res) {
          if(res.confirm) {
            wx.switchTab({
              url:'/pages/me/me',
            })
          }
        }
      })
    }
  }
})