// pages/index/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      flag: null,
      changliang_1: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      flag: app.globalData.daka_flag,
    })
    // console.log(app.globalData.daka_flag)
    // console.log(this.data.flag)
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

  gomytiku(){
    wx.navigateTo({
      url: '/pages/choose_grade/choose_grade',
    })
  },

  gotiku(){
    if(app.globalData.globaltopic_warehouse_id != ''){
      wx.navigateTo({
        url: '/pages/dotopic_warehouse/dotopic_warehouse',
      })
    }else{
      //（向用户）输出提示：应先选择题库
      // console.error('您还未选择题库！')
      wx.showToast({
        icon:"none",
        title: '请先选择题库哦',
      })
    }
  },

  daka(){
    console.log('click daka')
    var that = this
    that.setData({
      flag: that.data.changliang_1
    })
    console.log(this.data.flag)
    app.globalData.daka_flag = 1;
    console.log(app.globalData.daka_flag)
  }

})