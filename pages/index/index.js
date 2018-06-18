//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var RelativeTime = require('../../relativeTime/relativeTime.js')
const { $Message } = require('../../dist/base/index');
var app = getApp()
Page({
  data: {
      data:[],
      keyword:"",
      page:1,
      
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    setTimeout(function () { console.log(that.data.data) }, 2000)
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that,43,['宝山','浦东','北蔡','花木']);
    WxSearch.initMindKeys([]);
  },
  wxSearchFn: function(e){
    var that = this
    WxSearch.wxSearchAddHisKey(that); 
    that.initData()     //初始化数据
  },
  wxSearchInput: function(e){
    var that = this
    WxSearch.wxSearchInput(e,that);
    that.setData({ keyword: e.detail.value})
    //console.log(e)
  },
  wxSerchFocus: function(e){
    var that = this
    WxSearch.wxSearchFocus(e,that);
  },
  wxSearchBlur: function(e){
    var that = this
    WxSearch.wxSearchBlur(e,that);
  },
  wxSearchKeyTap:function(e){
    var that = this
    WxSearch.wxSearchKeyTap(e,that);
    console.log(e, e.currentTarget.dataset.key)
    that.setData({keyword:e.currentTarget.dataset.key})
    that.initData()
  },
  wxSearchDeleteKey: function(e){
    var that = this
    WxSearch.wxSearchDeleteKey(e,that);
  },
  wxSearchDeleteAll: function(e){
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e){
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  initData: function(){
    var that=this
    that.data.page=1
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/search',
      method: "POST",
      data:{
        "keyword": that.data.keyword,
        "pageSize": 10,
        "page": 1//从1开始
      },
      success: function(res){
        console.log(res)
        var data = res.data.data
        for(var i=0;i<data.length;i++){
          data[i].PublishTime = RelativeTime.relativeTime(data[i].PublishTime)
        }
        that.setData({data:res.data.data})
      },
      fail: function(err){
        console.log("fail")
      }
    })
  },
  clickCard: function(event){
    console.log(event)
    wx.navigateTo({
      url: '../info/info?pageId=' + this.data.data[event.currentTarget.dataset.index].PageId
    })
    console.log("!!!")
  },
  handleSuccess: function() {
    $Message({
      content: '刷新成功',
      type: 'success'
    });
  },
  handleError: function() {
    $Message({
      content: '刷新失败',
      type: 'error'
    });
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/search',
      method: "POST",
      data: {
        "keyword": that.data.keyword,
        "pageSize": 10,
        "page": that.data.page//从1开始
      },
      success: function(res){
        if(res.data.code==="SUCCESS"){
          console.log("成功！！")
          var data = res.data.data
          for (var i = 0; i < data.length; i++) {
            data[i].PublishTime = RelativeTime.relativeTime(data[i].PublishTime)
          }
          that.setData({ data: data })
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();//关闭下拉刷新
          // console.log("成功！！！！")
          that.handleSuccess();
        }else{
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          console.log("失败！！！！")
          that.handleError();
        }
      },
      fail: function(){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        console.log("失败！！！！")
        that.handleError();
      }
    })
  },
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '玩命加载中',
    })
    that.data.page = that.data.page + 1 //页数加1(不知道写的对不对)
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/search',
      method:'POST',
      data: {
        "keyword": that.data.keyword,
        "pageSize": 10,
        "page": that.data.page//从1开始
      },
      success: function(res){
        var data = res.data.data
        var thisData = that.data.data
        console.log("1",thisData,data)
        for(var i=0;i<data.length;i++){
          data[i].PublishTime = RelativeTime.relativeTime(data[i].PublishTime)
          thisData.push(data[i])
        }
        console.log("2",thisData)
        that.setData({data:thisData})
        wx.hideLoading();

      }
    })
  }
})
