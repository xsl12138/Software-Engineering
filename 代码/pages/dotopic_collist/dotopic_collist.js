//此为做题页面，但仅用于从题库和继续刷题进入，根据app.globalData.globaltopic_warehouse_id和app.globalData.globaltopic_id来获取题目信息，
//从题库进入：分别为对应题库的id和题库中第一道题目的id
//从继续刷题进入：为用户登录时获取到的信息

//从错题集和收藏夹进入的话，要稍作修改（主要在onLoad函数中）

const app = getApp()
const db = wx.cloud.database()
const _ = db.command
// let danxuan = []
// let error = []
// let obtain = 0  //题目序号（用户已经做到了这个题库的第几题）
// let flag = []
// let submit = []
let cur_topic_warehouse = [] //当前题库（只包含该题库中各题目id）

Page({
  data:{
    // Userid:null,
    subject:null, //具体题目，需要渲染到视图层
    userSelect:null,  //用户对本题的选项，需要渲染到视图层
    // current:1,
    total:0,  //当前题库长度
    isSelect:false,
    iserr:0,  //这道题目是否做错了
    click_submit:false, //是否点击了提交按钮
    click_explanation:false,  //是否点击了查看解析按钮
    timu_num:0, //当前题目序号（从0开始）
    cur_timu_id:null, //当前题目id
    real_answer:null, //当前题目的正确答案
    shoucangstatus:false, //当前题目是否被收藏
    // temp_delete:[],  //解决取消收藏的逻辑问题，在做题过程中，取消收藏的题目先暂时缓存至该数组中，待做完本题集后，统一进行删除
    // delete_num:0  //要取消收藏的题目数量
  },
  changeChoosed : function(event) {
    console.log('选中了：', event.detail.value);
  },



  onLoad:function (options){
    // this.update_collist().then(res=>{
      app.globalData.delete_num = 0
      app.globalData.temp_delete = []
      db.collection('collection').doc(app.globalData.globalUserid).get().then(res=>{
        app.globalData.globalCollectionList = res.data.coll_topic
        app.globalData.globalCollectionNum = res.data.coll_num
        console.log("目前收藏的题目：",app.globalData.globalCollectionList)
        //由于此页面显示给用户的题目就是收藏夹里面的题目，所以必须先更新完globalCollectionList和globalCollectionNum再进行显示题目，因此两个查询进行了嵌套
        this.data.cur_timu_id = app.globalData.globalCollectionList[this.data.timu_num]
        this.data.total = app.globalData.globalCollectionNum
        this.judge_shoucangstatus()
        db.collection('topic').doc(this.data.cur_timu_id).get().then(res=>{
          this.setData({
            subject:res.data,
            real_answer:res.data.answer,
            total:this.data.total
          })
        })
      })
    // })
  },
  // async update_collist(){
  //   var that = this
  //   // return new Promise (function(resolve, reject){
  //     console.log(app.globalData.delete_num)
  //     console.log(app.globalData.temp_delete)
  //     if(app.globalData.delete_num != 0){
  //       await db.collection('collection').doc(app.globalData.globalUserid).update({
  //         data:{
  //           coll_topic:_.pullAll(app.globalData.temp_delete),
  //           coll_num: _.inc(-app.globalData.delete_num)
  //         },
  //         success(){
  //           console.log("取消收藏成功！！")
  //         }
  //       })
  //       app.globalData.globalCollectionNum -= app.globalData.delete_num
  //       app.globalData.delete_num = 0
  //       app.globalData.temp_delete = []
  //     }
      
  //   //   resolve(app.globalData.delete_num)
  //   // })
  // },

  radioChange(e){
        this.setData({
          isSelect:e.detail.value,
          userSelect:e.detail.value
        })
        // flag[this.data.current-1]=e.detail.value
        // console.log('value',e.detail.value)
  },  

  submit(){
    let select = this.data.isSelect
    let ans = this.data.real_answer
    if(!select){//没做选择
      wx.showToast({
        icon: "none",
        title: '你还没有选择哦'
      })
      return
    }
    else{
      if(ans.indexOf(select) > -1){ //indexOf方法：返回某个指定的字符串值在字符串中首次出现的位置，如果要检索的字符串值没有出现，则该方法返回 -1
        console.log("这道题答对了")
      }
      else{
        console.log("这道题答错了")
        // const db = wx.cloud.database()
//         const _ = db.command
        if(app.globalData.globalUserid == 'origin'){
          console.log("用户尚未登录！")
          return
        }
        if(this.data.subject.tiku == 'chinese'){ //加入到语文错题集
          db.collection('mis_chinese').doc(app.globalData.globalUserid).get().then(res=>{
            var len = res.data.err_num
            for(var i = 0; i < len; i++){
              if(res.data.err_topic[i] == this.data.subject._id){
                console.log("该题目已加入错题集")
                return
              }
            }
            //如果该题之前没有加入过错题集
            db.collection('mis_chinese').doc(app.globalData.globalUserid).update({
              data:{
                err_topic: _.push(this.data.subject._id),//当前错题添加到错题本
                err_num: _.inc(1) //错题本数据更新
              },
              success(modify){ 
              console.log('加入错题集成功',modify)
              },
              fail(modify){
              console.log('加入错题集失败',modify)
              }
            })
          })
        }
        else if(this.data.subject.tiku == 'math'){  //加入到数学错题集
          db.collection('mis_math').doc(app.globalData.globalUserid).get().then(res=>{
            var len = res.data.err_num
            for(var i = 0; i < len; i++){
              if(res.data.err_topic[i] == this.data.subject._id){
                console.log("该题目已加入错题集")
                return
              }
            }
            //如果该题之前没有加入过错题集
            db.collection('mis_math').doc(app.globalData.globalUserid).update({
              data:{
                err_topic: _.push(this.data.subject._id),//当前错题添加到错题本
                err_num: _.inc(1) //错题本数据更新
              },
              success(modify){ 
              console.log('加入错题集成功',modify)
              },
              fail(modify){
              console.log('加入错题集失败',modify)
              }
            })
          })
        }
        else{ //加入到英语错题集
          db.collection('mis_english').doc(app.globalData.globalUserid).get().then(res=>{
            var len = res.data.err_num
            for(var i = 0; i < len; i++){
              if(res.data.err_topic[i] == this.data.subject._id){
                console.log("该题目已加入错题集")
                return
              }
            }
            //如果该题之前没有加入过错题集
            db.collection('mis_english').doc(app.globalData.globalUserid).update({
              data:{
                err_topic: _.push(this.data.subject._id),//当前错题添加到错题本
                err_num: _.inc(1) //错题本数据更新
              },
              success(modify){ 
              console.log('加入错题集成功',modify)
              },
              fail(modify){
              console.log('加入错题集失败',modify)
              }
            })
          })
        }
      
      }
    }
      this.setData({
        click_submit:true
      })
  },
  //返回主页（home按钮）
  gohome(){
    for(var i = 0; i < app.globalData.delete_num; i++){
      db.collection('collection').doc(app.globalData.globalUserid).update({
        data:{
          coll_topic:_.pull(app.globalData.temp_delete[i]), //用pull才能删除指定元素，pop不行
          coll_num:_.inc(-1)
        }
      })
    }
    app.globalData.globalCollectionNum -= app.globalData.delete_num
    app.globalData.delete_num = 0
    app.globalData.temp_delete = []

    wx.switchTab({
      url: '/pages/index/index',
    })
  },

judge_shoucangstatus(){ //专门用来更新shoucangstatus的函数
  for(var i = 0; i < app.globalData.globalCollectionNum; i++){
    if(this.data.cur_timu_id == app.globalData.globalCollectionList[i]){
      this.data.shoucangstatus = true
      this.setData({
        shoucangstatus: true
      })
      return
    }
  }
  this.data.shoucangstatus = false
  this.setData({
    shoucangstatus: false
  })
},

shoucang(){
  // 处理收藏，如果当前状态是未收藏，则增加数量，否则减少数量。
  if(!this.data.shoucangstatus){
    // 当前状态是未收藏
    this.setData({
      shoucangstatus:true
    })
    for (var i = 0; i < app.globalData.delete_num; i++) {
      if (app.globalData.temp_delete[i] == this.data.cur_timu_id) {
        app.globalData.temp_delete.splice(i, 1);
        app.globalData.delete_num -= 1
        break
      }
    }
  }else{
    // 当前状态是收藏
    this.setData({
      shoucangstatus:false,
    })
    app.globalData.temp_delete.push(this.data.cur_timu_id) //将题目id缓存到数组，待做完题集或返回时统一进行取消收藏操作
    app.globalData.delete_num += 1
  }
  wx.showToast({
    icon: "none",
    title: this.data.shoucangstatus?"已添加到我的收藏":"已取消收藏",
  })
    return
  },

  next(){ 
    this.setData({
      click_explanation: false,
      click_submit: false,
      isSelect: false
    })
    if(this.data.timu_num < this.data.total - 1){ //如果当前题库还没做完
      this.setData({
        timu_num: this.data.timu_num + 1
      })
      this.data.cur_timu_id = app.globalData.globalCollectionList[this.data.timu_num]
      // app.globalData.globaltopic_id = cur_topic_warehouse[this.data.timu_num]
      this.judge_shoucangstatus()
      // console.log(this.data.shoucangstatus)

      db.collection('topic').doc(this.data.cur_timu_id).get().then(res=>{
        this.setData({
          subject:res.data,
          real_answer:res.data.answer
        })
      })
    }
    else{ //如果做完了
      //将取消收藏的题目一次性取消
      for(var i = 0; i < app.globalData.delete_num; i++){
        db.collection('collection').doc(app.globalData.globalUserid).update({
          data:{
            coll_topic:_.pull(app.globalData.temp_delete[i]), //用pull才能删除指定元素，pop不行
            coll_num:_.inc(-1)
          }
        })
      }
      app.globalData.globalCollectionNum -= app.globalData.delete_num
      app.globalData.delete_num = 0
      app.globalData.temp_delete = []
      wx.navigateTo({
           url: '/pages/jiesuan_errlist/jiesuan_errlist',
      })
    }
  },

  tijie(){
    this.setData({
      click_submit: true,
      click_explanation: true,
    })
  },

   goback(){  //在题解页面点击返回
    app.globalData.globalCollectionNum -= app.globalData.delete_num
    this.setData({
      click_submit: true,
      click_explanation: false,
    })
  },
  
  },
)