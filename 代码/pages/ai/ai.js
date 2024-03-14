const app=getApp()
//const util= require("../../utils/utils")

Page({


  data: {
    chatList : []
  },

  onShow(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  // 功能：当点击好友的时候，传输好友信息
  // onLoad(options) {
  //   console.log(options.id)
  //   this.setData({
  //     recordId:options.id
  //   })

  // this.getChatRecord();

  // },
    onLoad(){
      this.setData(
        {
          recordId : app.globalData.globalUserid //todo 修改为真正的用户id
        }
      )
      this.getChatRecord();
    },

  // 功能：当跳转到聊天页面的时候，显示聊天信息
  // 思路：1.更加我们接收到的_id在聊天表中查询，返回查询值
  //      2.在wxml页面进行渲染
  getChatRecord(){//refresh

    var that = this;
    wx.cloud.database().collection('chat_record').doc(that.data.recordId).get({ //recordId即用户id
      success(res){
        console.log(res)
        that.setData({
          chatList: res.data.record
        })
      }
    })
  },


// 功能：当我们发布消息的时候，更新我们的数据库表中的消息
// 思路：1.首先根据页面接收到的值，获取这条消息的_id
//      2.新建一个空白数组，将我们需要记录的信息、聊天内容放到这个数组中
//      3.将这个数组放到我们存放聊天记录的record数组中
//      4.更新我们的数据库表格
//      5.更新之后，再次调用，使刚刚发送的消息出现
//      6.将我们的评论和输入消息内筒赋值为空 

  // publishChat(){
  //   var that = this;
  //   wx.cloud.database().collection('chat_record').doc(that.data.recordId).get({
  //     success(res){
  //       console.log(res)

  //       var record = res.data.record
  //       var msg = {}
  //       msg.userId = app.globalData.userInfo._id
  //       msg.nickName = app.globalData.userInfo.nickName
  //       msg.faceImg = app.globalData.userInfo.faceImg
  //       msg.openid = app.globalData._id
  //       msg.text = that.data.inputValue
  //       //msg.time = util.formatTime(new Date())

  //       record.push(msg)
  //       console.log(msg)
  //       wx.cloud.database().collection('chat_record').doc(that.data.recordId).update({
  //         data: {
  //           record: record
  //         },
  //         success(res){
  //           console.log(res)
  //           wx.showToast({
  //             title: '发布成功！',
  //           })
            
  //           //刷新下
  //           //that.getChatRecord()

  //           that.setData({
  //             inputValue :'',
  //             plcaceHolder:'评论'
  //           })
  //         }
  //       })


  //     }
  //   })
  // },
  publishChat(){ // copy 发送按钮绑定
    var that = this;
    wx.cloud.database().collection('chat_record').doc(that.data.recordId).get({ //get record
      success(res){
    var msg = {};//the msg from user
    var input_tmp = that.data.inputValue  //inputValue输入即赋值
    var record = res.data.record
    //var record = this.data.chatList;
    that.setData({
                   inputValue :'',
                   plcaceHolder:'评论'
                 })
    msg.userId = '114514'
    msg.nickName = "我"//app.globalData.userInfo.nickName
    msg.faceImg = app.globalData.globalUserImage
    msg.text = input_tmp
    record.push(msg)
    console.log(msg)
    // that.setData(
    //   {
    //     chatList : record
    //   }
    // )
    wx.cloud.database().collection('chat_record').doc(that.data.recordId).update({//update for user post
          data: {
            record: record
          },
          success(res){
            console.log(res)
            wx.showToast({
              title: '发布成功！',
            })
            
            //刷新下
            that.getChatRecord()
          }
        })
    wx.vrequest({//request ai
        url: 'http://rjgc.kiedy.xyz:39393/chat',
        method : 'POST',
        data : {
          'word':input_tmp,
          'uid':app.globalData.globalUserid 
        },
        success: ret => {
          console.log(ret.data);
          var bot_msg = {};//the msg from ai
          bot_msg.userId = "1037";
          bot_msg.nickName = "小iws";    //可修改 to do
          //bot_msg.faceImg = app.globalData.userInfo.faceImg;  //to do add ai image
          bot_msg.faceImg = "人工智能.png"
          bot_msg.text = ret.data;
          record.push(bot_msg);
          console.log(bot_msg);
          // that.setData(
          //   {
          //     chatList : record
          //   }
          // )
          wx.cloud.database().collection('chat_record').doc(that.data.recordId).update({//update for ai post
            data: {
              record: record
            },
            success(res){
              console.log(res)
              wx.showToast({
                title: '发布成功！',
              })
              
              //刷新下
              that.getChatRecord()
            }
          })
        }
      });
    }
    })
  },

  // 功能：获取输入框的值
  getInputValue(event){

    console.log(event.detail.value)

    this.data.inputValue = event.detail.value
    
  },
})