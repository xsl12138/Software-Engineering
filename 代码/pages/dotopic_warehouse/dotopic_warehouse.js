//此为做题页面，但仅用于从题库和继续刷题进入，根据app.globalData.globaltopic_warehouse_id和app.globalData.globaltopic_id来获取题目信息，
//从题库进入：分别为对应题库的id和题库中第一道题目的id
//从继续刷题进入：为用户登录时获取到的信息

//从错题集和收藏夹进入的话，要稍作修改（主要在onLoad函数中）

const app = getApp()
const db = wx.cloud.database()
const _ = db.command
let cur_topic_warehouse = [] //当前题库（只包含该题库中各题目id）

Page({
  data:{
    // subject:null, //具体题目，需要渲染到视图层
    subject: null,
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
    radios: [
      {value : "1", text : "逍遥游", checked : false},
      {value : "2", text : "齐物论", checked : false},
      {value : "3", text : "秋水", checked : false},
      {value : "4", text : "养生主", checked : false}
    ]
  },
  changeChoosed : function(event) {
    console.log('选中了：', event.detail.value);
  },

  onLoad:function (options){
    //重新获取收藏夹
    if(app.globalData.globalUserid != 'origin'){
      db.collection('collection').doc(app.globalData.globalUserid).get().then(res=>{
        app.globalData.globalCollectionList = res.data.coll_topic
        app.globalData.globalCollectionNum = res.data.coll_num
      })
    }
    this.gettopic_num().then(res=>{ //这样子调用，防止数据库异步操作，可以在then函数中成功使用在gettopic_num函数中赋过的值
      //console.log(this.data.timu_num) //这里打印出的值已经是gettopic_num函数中赋的值了
      this.judge_shoucangstatus()
      db.collection('topic').doc(app.globalData.globaltopic_id).get().then(res=>{
        this.setData({
          subject:res.data,
          real_answer:res.data.answer
        })
      })
    }) 
    //console.log(this.data.timu_num) //这一句比起this.gettopic_num.then这一句还是会先执行（但是因为同在onLoad函数中，写在其他函数里面就好了）
  },

  gettopic_num(){
    // const db = wx.cloud.database()
    var that = this
    return new Promise (function(resolve, reject){  //在此函数中，this指的是function对象，还想用setData的话，需要在前面先var that = this保存状态，后面用that.setData即可
      db.collection('topic_warehouse').doc(app.globalData.globaltopic_warehouse_id).get().then(res=>{
        cur_topic_warehouse = res.data.include
        that.setData({
          total:res.data.length,
          // cur_topic_warehouse:res.data.include
        })
        console.log(cur_topic_warehouse)
        for(var i = 0; i < res.data.length; i++){
          if(res.data.include[i] == app.globalData.globaltopic_id){
            that.data.cur_timu_id = res.data.include[i]
            that.setData({
              timu_num:i
            })
            break
          }
        }
        resolve(that.data.timu_num)
      })
    })
  },

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
      this.setData({
        click_submit:true
      })
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
        if(app.globalData.globalcourse == 1){ //加入到语文错题集
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
        else if(app.globalData.globalcourse == 2){  //加入到数学错题集
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
  },

  gohome(){
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
  if(app.globalData.globalUserid == 'origin'){
    wx.showToast({
      icon:"none",
      title: '请先登录!',
    })
    return 
  }
  // 处理收藏，如果当前状态是未收藏，则增加数量，否则减少数量。
  if(!this.data.shoucangstatus){
    // 当前状态是未收藏
    this.setData({
      shoucangstatus:true
    })
    app.globalData.globalCollectionNum += 1
    db.collection('collection').doc(app.globalData.globalUserid).update({
      data:{
        coll_topic:_.push(this.data.cur_timu_id),
        coll_num:_.inc(1)
      },
      success(res){
        console.log('题目收藏成功',res)
      },
      fail(res){
        console.log('题目收藏失败',res)
      }
    })
    app.globalData.globalCollectionList.push(this.data.cur_timu_id)
    console.log(app.globalData.globalCollectionList)
  }else{
    // 当前状态是收藏
    this.setData({
      shoucangstatus:false,
    })
    // app.globalData.globalCollectionNum -= 1
    db.collection('collection').doc(app.globalData.globalUserid).update({
      data:{
        coll_topic:_.pull(this.data.cur_timu_id), //用pull才能删除指定元素，pop不行
        coll_num:_.inc(-1)
      },
      success(res){
        console.log('题目取消收藏成功',res)
      },
      fail(res){
        console.log('题目取消收藏失败',res)
      }
    })
    //app.globalData.globalCollectionList.pull(this.data.cur_timu_id)
    //下面这个for循环使用数组的splice方法删除指定元素
    for (var i = 0; i < app.globalData.globalCollectionNum; i++) {
      if (app.globalData.globalCollectionList[i] == this.data.cur_timu_id) {
        app.globalData.globalCollectionList.splice(i, 1);
        app.globalData.globalCollectionNum -= 1
        break
      }
    }
    console.log(app.globalData.globalCollectionList)
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
      this.data.cur_timu_id = cur_topic_warehouse[this.data.timu_num]
      app.globalData.globaltopic_id = cur_topic_warehouse[this.data.timu_num]
      this.judge_shoucangstatus()
      console.log(this.data.shoucangstatus)
      // this.setData({
      //   cur_timu_id:cur_topic_warehouse[this.data.timu_num]
      // })
      db.collection('topic').doc(this.data.cur_timu_id).get().then(res=>{
        this.setData({
          subject:res.data,
          real_answer:res.data.answer
        })
      })
      db.collection('user_information').doc(app.globalData.globalUserid).update({
        data:{
          topic_id:app.globalData.globaltopic_id
        }
      })
    }
    else{ //如果做完了
      app.globalData.globalcourse = 0
      wx.navigateTo({
           url: '/pages/jiesuan/jiesuan',
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
    this.setData({
      click_submit: true,
      click_explanation: false,
    })
  },
  
  },
)