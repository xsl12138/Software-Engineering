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
  },
  changeChoosed : function(event) {
    console.log('选中了：', event.detail.value);
  },

  onLoad:function (options){
    //重新获取收藏夹
    db.collection('collection').doc(app.globalData.globalUserid).get().then(res=>{
      app.globalData.globalCollectionList = res.data.coll_topic
      app.globalData.globalCollectionNum = res.data.coll_num

    })
    console.log(app.globalData.globalerrlist.err_topic)
    this.data.cur_timu_id = app.globalData.globalerrlist.err_topic[this.data.timu_num]
    this.data.total = app.globalData.globalerrlist.err_num
    // console.log(this.data.cur_timu_id)
    this.judge_shoucangstatus()
    db.collection('topic').doc(this.data.cur_timu_id).get().then(res=>{
      this.setData({
        subject:res.data,
        real_answer:res.data.answer,
        total:this.data.total
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
      // console.log(ans)  
      // console.log(select)
      if(ans.indexOf(select) > -1){ //indexOf方法：返回某个指定的字符串值在字符串中首次出现的位置，如果要检索的字符串值没有出现，则该方法返回 -1
        console.log("这道题答对了")
      }
      else{
        console.log("这道题答错了")  
      }
    }
      this.setData({
        click_submit:true
      })
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
      this.data.cur_timu_id = app.globalData.globalerrlist.err_topic[this.data.timu_num]
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
      app.globalData.globalcourse = 0
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
    this.setData({
      click_submit: true,
      click_explanation: false,
    })
  },
  
  delete(){
    var that = this
    wx.showModal({
      title: '确定将本题移出错题本吗？', //提示的标题
      success: function(res) {
        if(res.confirm) {
          // console.log('用户点击了确定') 
          if(app.globalData.globalcourse == 1){ //语文错题集
            db.collection('mis_chinese').doc(app.globalData.globalUserid).update({
              data:{
                err_topic:_.pull(that.data.cur_timu_id),
                err_num:_.inc(-1)
              }
            })
          }else if(app.globalData.globalcourse == 2){ //数学错题集
            db.collection('mis_math').doc(app.globalData.globalUserid).update({
              data:{
                err_topic:_.pull(that.data.cur_timu_id),
                err_num:_.inc(-1)
              }
            })
          }else{  //英语错题集
            db.collection('mis_english').doc(app.globalData.globalUserid).update({
              data:{
                err_topic:_.pull(that.data.cur_timu_id),
                err_num:_.inc(-1)
              }
            })
          }
          //更新globalerrlist
          for (var i = 0; i < app.globalData.globalCollectionNum; i++) {
            if (app.globalData.globalerrlist.err_topic[i] == that.data.cur_timu_id) {
              app.globalData.globalerrlist.err_topic.splice(i, 1);
              that.data.total -= 1
              break
            }
          }
          //对删除题集中的最后一题进行特判
          // console.log(that.data.total)
          // console.log(that.data.timu_num)
          if(that.data.total == that.data.timu_num){  
            wx.navigateTo({
              url: '/pages/jiesuan_errlist/jiesuan_errlist',
            })
          }
          else{
            //更新页面
            that.data.click_submit = false
            that.data.click_explanation = false
            that.data.cur_timu_id = app.globalData.globalerrlist.err_topic[that.data.timu_num]
            that.judge_shoucangstatus()
            console.log("执行更新页面")
            db.collection('topic').doc(that.data.cur_timu_id).get().then(res=>{
              that.setData({
                click_submit: false,
                click_explanation: false,
                subject:res.data,
                real_answer:res.data.answer,
                total:that.data.total
              })
            })
          }
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })
  }

})