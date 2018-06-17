//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var RelativeTime = require('../../relativeTime/relativeTime.js')
const { $Message } = require('../../dist/base/index');
var app = getApp()
Page({
  data: {
    data: [],
    PageId: ""
  },
  onLoad: function (options) {
    console.log('onLoad')
    var pageId = options.pageId
    this.setData({PageId:pageId})
    console.log(pageId)
    //this.initData()
    this.initDetail(pageId)
    var that = this
    setTimeout(function () { console.log(that.data.data.CarouselImages) }, 2000)
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
  },
  initDetail: function (PageId){
    console.log("initDetail"+PageId)
    var that=this
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/detail?pageId=' + PageId,
      success:function(res){
        console.log(res)
        console.log("!!!!")
        var data = res.data.data
        data.PublishTime = RelativeTime.relativeTime(data.PublishTime)
        data.CreatedAt = RelativeTime.relativeTime(data.CreatedAt)
        data.UpdatedAt = RelativeTime.relativeTime(data.UpdatedAt)
        that.setData({ data: res.data.data })
      }
    })
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
    var that = this
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/detail?pageId=' + that.data.PageId,
      success: function (res) {
        console.log(that.data.PageId)
        // console.log("成功！！=+=")
        var data = res.data.data
        data.PublishTime = RelativeTime.relativeTime(data.PublishTime)
        data.CreatedAt = RelativeTime.relativeTime(data.CreatedAt)
        data.UpdatedAt = RelativeTime.relativeTime(data.UpdatedAt)
        that.setData({ data: res.data.data })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();//关闭下拉刷新
        that.handleSuccess();
        console.log("刷新成功！");
      },
      fail: function(){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        that.handleError();
      } 
    })
  }
})
