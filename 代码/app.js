// app.js
require('./v-request');
require('./v-upload');

App({
  globalData:{
    ocr_source_path: "",
    ocr_res: "ocr结果在这里！",
    daka_flag: 0,
    temp_delete:[],  //解决取消收藏的逻辑问题，在做题过程中，取消收藏的题目先暂时缓存至该数组中，待做完本题集后，统一进行删除
    delete_num:0,  //要取消收藏的题目数量
    glboalerrlist:[],     //保存用户所选的错题集，在做错题页面使用
    globalUserid:'origin', //用户id（在用户登录时赋值）
    globalUserImage:'', //用户头像（在用户登录时赋值）
    globalCollectionList:[],  //数据库中当前用户的收藏题集（collection.coll_topic）
    //做收藏夹题目的时候还是便利数据库的，这个全局变量的设置是为了实现“正常做题时若某题已被收藏则收藏标志（星星）要变成黄色”
    globalCollectionNum:0,      //数据库中当前用户的收藏题目的数量
    globaltopic_id:'',  //当前用户做到的题目（在用户登录和新选择题库时赋值）
    globaltopic_warehouse_id:'',//当前用户做到的题库（在用户登录和新选择题库时赋值）
    globalcourse:0,  //当前用户选择题库的科目，1为语文，2为数学，3为英语（在用户登录和选择题库时赋值，在做完题库时赋0）(在保存错题时使用)
    userInfo: {_id:"114514",nickName:"我",faceImg:"/images/star1.png"},
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-6gn2sftx9754343e',
        traceUser: true,
      });
    }
  }
});
