Page({

   gohome(){
     wx.switchTab({
       url: '/pages/index/index',
     })
  },

   gotiku(){
     wx.reLaunch({
       url: '/pages/choose_grade/choose_grade',
     })
  },

})