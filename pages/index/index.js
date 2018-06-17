//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var RelativeTime = require('../../relativeTime/relativeTime.js')
const { $Message } = require('../../dist/base/index');
var app = getApp()
Page({
  data: {
      data:[],
  },
  onLoad: function () {
    console.log('onLoad')
    this.initData()
    var that = this
    setTimeout(function () { console.log(that.data.data) }, 2000)
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that,43,['北京','无锡','上海','南京','安吉','杭州']);
    WxSearch.initMindKeys([]);
  },
  clickButton: function(){
    this.setData({test:456})
    console.log("!")
  },
  wxSearchFn: function(e){
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    
  },
  wxSearchInput: function(e){
    var that = this
    WxSearch.wxSearchInput(e,that);
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
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/search',
      method: "POST",
      data:{
        "keyword": "宝山",
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
        "keyword": "宝山",
        "pageSize": 10,
        "page": 1//从1开始
      },
      success: function(res){
        console.log("成功！！")
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          data[i].PublishTime = RelativeTime.relativeTime(data[i].PublishTime)
        }
        that.setData({ data: res.data.data })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();//关闭下拉刷新
        // console.log("成功！！！！")
        that.handleSuccess();
      },
      fail: function(){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        // console.log("失败！！！！")
        that.handleError();
      }
    })
  }
})
