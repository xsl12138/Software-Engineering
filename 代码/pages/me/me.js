const app = getApp()
const db=wx.cloud.database()

Page({
    data:
    {
        userInfo:'',
        picker:['小学一年级','小学二年级','小学三年级','小学四年级','小学五年级','小学六年级'],
        index:null,
        grade:'',
        userOpenId:'',
        s:0
    },
  onLoad(){
    
  },
    //授权登錄
  login()
  {
    wx.cloud.callFunction({
      name:"getopenid",
      complete:res=>{
        this.setData({
          userOpenId:res.result.openid
        })
        app.globalData.globalUserid = this.data.userOpenId
       console.log('获取openid成功',res)
    }
  })
      wx.getUserProfile({
          desc:'用于完善会员信息',
          success:(res)=>{
            console.log('授权成功',res)
            this.setData({
                userInfo:res.userInfo
            })
            app.globalData.globalUserImage = this.data.userInfo.avatarUrl
            db.collection('user_information').add({
              data:{
                _id:this.data.userOpenId,
                grade:null,
                image:this.data.userInfo.avatarUrl,
                name:this.data.userInfo.nickName,
                topic_id:null,
                topic_warehouse_id:null
              },success(res){
                console.log('添加数据成功',res)
              },fail(res){
                console.log('添加失败',res)
              }})
              db.collection('colletion').add({
                data:{
                  _id:this.data.userOpenId,
                  coll_num:0,
                  coll_topic:[]
                },
                success(res){
                  console.log('创建收藏夹成功',res)
                },
                fail(res){
                  console.log('创建收藏夹失败',res)
                }
              })
              db.collection('mis_chinese').add({
                data:{
                  _id:this.data.userOpenId,
                  err_num:0,
                  err_topic:[]
                },
                success(res){
                  console.log('创建语文错题集成功',res)
                },
                fail(res){
                  console.log('创建语文错题集失败',res)
                }
              })
              db.collection('colletion').add({
                data:{
                  _id:this.data.userOpenId,
                  coll_num:0,
                  coll_topic:[]
                },
                success(res){
                  console.log('创建收藏夹成功',res)
                },
                fail(res){
                  console.log('创建收藏夹失败',res)
                }
              })
              db.collection('mis_math').add({
                data:{
                  _id:this.data.userOpenId,
                  err_num:0,
                  err_topic:[]
                },
                success(res){
                  console.log('创建数学错题集成功',res)
                },
                fail(res){
                  console.log('创建数学错题集失败',res)
                }
              })
              db.collection('collection').add({
                data:{
                  _id:this.data.userOpenId,
                  coll_num:0,
                  coll_topic:[]
                },
                success(res){
                  console.log('创建收藏夹成功',res)
                },
                fail(res){
                  console.log('创建收藏夹失败',res)
                }
              })
              db.collection('mis_english').add({
                data:{
                  _id:this.data.userOpenId,
                  err_num:0,
                  err_topic:[]
                },
                success(res){
                  console.log('创建英语错题集成功',res)
                },
                fail(res){
                  console.log('创建英语错题集失败',res)
                }
              })
              db.collection('chat_record').add({
                data:{
                  _id:this.data.userOpenId,
                  record:[]
                },
                success(res){
                  console.log('创建聊天记录成功',res)
                },
                fail(res){
                  console.log('创建聊天记录失败',res)
                }
              })
              //获取当前用户的收藏夹
              db.collection('collection').doc(app.globalData.globalUserid).get().then(res=>{
                app.globalData.globalCollectionList = res.data.coll_topic
                app.globalData.globalCollectionNum = res.data.coll_num
                console.log(app.globalData.globalCollectionList)
                console.log(app.globalData.globalCollectionNum)
              })
              db.collection('user_information').doc(app.globalData.globalUserid).get().then(res=>{
                app.globalData.globaltopic_id = res.data.topic_id
                app.globalData.globaltopic_warehouse_id = res.data.topic_warehouse_id
              })
          },
          fail(res)
          {
              console.log('授权失敗',res)
          }
      })  //end of getUserProfile
      
  },
  //退出登錄
  logOut()
  {
    app.globalData.globalUserid = 'origin'
    app.globalData.globalCollectionList = []
    app.globalData.globalCollectionNum = 0
    app.globalData.daka_flag = 0
    app.globalData.temp_delete = []
    app.globalData.delete_num = 0
    app.globalData.globalerrlist = []
    app.globalData.globalUserImage = ''
    app.globalData.globaltopic_id = ''
    app.globalData.globaltopic_warehouse_id = ''
    app.globalData.course = 0
    this.setData({
          userInfo:'',
          grade:''
    })
  },

  // mistakes()
  // {
  //   wx.switchTab({
  //     url: '/pages/errorclt/errorclt',
  //   })
  // },

  // collections()
  // {
  //   wx.navigateTo({
  //       url:"/pages/collections/collections"
  //   })
  // },

    PickerChange(e){
      console.log(e)
      this.setData({
        index:e.detail.value
      })
      //app.globalData.globalUserGrade=e.detail.value
      if(this.data.index==0){
        this.setData({
          grade:'小学一年级'
        })
      }
      else  if(this.data.index==1){
        this.setData({
          grade:'小学二年级'
        })
      }
      else  if(this.data.index==2){
        this.setData({
          grade:'小学三年级'
        })
      }
      else  if(this.data.index==3){
        this.setData({
          grade:'小学四年级'
        })
      }
      else  if(this.data.index==4){
        this.setData({
          grade:'小学五年级'
        })
      }
      else  if(this.data.index==5){
        this.setData({
          grade:'小学六年级'
        })
      }
      else  if(this.data.index==6){
        this.setData({
          grade:'初中一年级'
        })
      }
      else  if(this.data.index==7){
        this.setData({
          grade:'初中二年级'
        })
      }
      else  if(this.data.index==8){
        this.setData({
          grade:'初中三年级'
        })
      }
      else  if(this.data.index==9){
        this.setData({
          grade:'高中一年级'
        })
      }
      else  if(this.data.index==10){
        this.setData({
          grade:'高中二年级'
        })
      }
      else{
        this.setData({
          grade:'高中三年级'
        })
      }
      db.collection('user_information').doc(this.data.userOpenId).update({
        data:{
          grade:this.data.grade
        },
        success(res){
          console.log('添加数据成功',res)
        },
        fail(res){
          console.log('添加失败',res)
        }
        })
    },
  report(){
    // wx.navigateTo({
    //   url: '/pages/record/record',
    // })
  },
  collections(){  //跳转到收藏夹页面
    if(app.globalData.globalUserid == 'origin'){
      wx.showToast({
        icon: "none",
        title: '你还没有登录哦'
      })
      return
    }else if(app.globalData.globalCollectionNum == 0){
      wx.showToast({
        icon: "none",
        title: '当前没有收藏的题目哦'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/dotopic_collist/dotopic_collist',
    })
  },

  errorlist(){  //跳转到错题集页面
    if(app.globalData.globalUserid == 'origin'){
      wx.showToast({
        icon: "none",
        title: '你还没有登录哦'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/choose_errkemu/choose_errkemu',
    })
  },

  feedback(){
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  }

})
