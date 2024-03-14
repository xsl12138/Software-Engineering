const app = getApp()
const db = wx.cloud.database()
Page({
  onLoad(){
    // db.collection('collection').doc(app.globalData.globalUserid).get().then(res=>{
    //   app.globalData.globalCollectionList = res.data.coll_topic
    //   app.globalData.globalCollectionNum = res.data.coll_num
    // })
    // console.log(app.globalData.globalCollectionList)
    // console.log(app.globalData.globalCollectionNum)
  },
   gohome(){
     wx.switchTab({
       url: '/pages/index/index',
     })
  },

})