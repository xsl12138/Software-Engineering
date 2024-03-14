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

  timu_math(){
    this.data.topic_warehouse = "Math_1"
    this.data.course = 2
    this.data.topic = 'math_001'
    if(this.data.userid != 'origin'){
      // console.log("已登录！")
      db.collection('user_information').doc(this.data.userid).update({
        data:{
          topic_id: this.data.topic,
          topic_warehouse_id: this.data.topic_warehouse
        }
      })
    }
    this.jump_dotopic()
  },
  timu_chinese(){
    this.data.topic_warehouse = "Chinese_1"
    this.data.course = 1
    this.data.topic = 'chinese_001'
    if(this.data.userid != 'origin'){
      // console.log(app.globalData.globalUserid)
      db.collection('user_information').doc(this.data.userid).update({
        data:{
          topic_id: this.data.topic,
          topic_warehouse_id: this.data.topic_warehouse
        }
      })
    }
    this.jump_dotopic()
  },
  timu_english(){
    this.data.topic_warehouse = "English_1"
    this.data.course = 3
    this.data.topic = 'english_001'
    // console.log(this.data.userid)
    if(this.data.userid != 'origin'){
      // console.log(app.globalData.globalUserid)
      db.collection('user_information').doc(this.data.userid).update({
        data:{
          topic_id: this.data.topic,
          topic_warehouse_id: this.data.topic_warehouse
        }
      })
    }
    this.jump_dotopic()
  },

  jump_dotopic(){
    //不能使用以下的if语句，不然会出现非常奇怪的逻辑，尚不清楚是为什么
    // if(app.globalData.glboalUserid){
    //   console.log(app.globalData.globalUserid)
    //   db.collection('user_information').doc(app.globalData.glboalUserid).update({
    //     data:{
    //       topic_id: app.globalData.globaltopic_id,
    //       topic_warehouse_id: app.globalData.globaltopic_warehouse_id
    //     }
    //   })
    //   console.log(app.globalData.glboalUserid)
    // }
    app.globalData.globaltopic_warehouse_id = this.data.topic_warehouse
    app.globalData.globalcourse = this.data.course
    app.globalData.globaltopic_id = this.data.topic
    wx.navigateTo({
      url: '/pages/dotopic_warehouse/dotopic_warehouse',    //这里放跳转做题页面的
    })
  }

})