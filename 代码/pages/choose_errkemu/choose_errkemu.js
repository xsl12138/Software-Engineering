// pages/choose_kemu/choose_kemu.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
// let userid = app.globalData.globalUserid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic:'',
    topic_warehouse:'',
    course:0,
    userid:'origin'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.userid = app.globalData.globalUserid
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

  errtimu_math(){
    db.collection('mis_math').doc(app.globalData.globalUserid).get().then(res=>{
      if(res.data.err_num == 0){
        wx.showToast({
          icon:"none",
          title: '当前没有该科目的错题哦',
        })
        return
      }
      app.globalData.globalerrlist = res.data
      app.globalData.globalcourse = 2
      this.jump_dotopic() //必须放在数据库调用下，否则会先调用jump_dotopic函数后get数据库，导致app.globalData.globalerrlist无法正常更新（数据库调用的异步性）
    })
  },
  errtimu_chinese(){
    db.collection('mis_chinese').doc(app.globalData.globalUserid).get().then(res=>{
      if(res.data.err_num == 0){
        wx.showToast({
          icon: "none",
          title: '当前没有该科目的错题哦',
        })
        return
      }
      app.globalData.globalcourse = 1
      app.globalData.globalerrlist = res.data
      this.jump_dotopic()
    })
  },
  errtimu_english(){
    db.collection('mis_english').doc(app.globalData.globalUserid).get().then(res=>{
      if(res.data.err_num == 0){
        wx.showToast({
          icon: "none",
          title: '当前没有该科目的错题哦',
        })
        return
      }
      app.globalData.globalcourse = 3
      app.globalData.globalerrlist = res.data
      this.jump_dotopic()
    })
  },

  jump_dotopic(){
    wx.navigateTo({
      url: '/pages/dotopic_errlist/dotopic_errlist',    //这里放跳转做题页面的
    })
  }

})