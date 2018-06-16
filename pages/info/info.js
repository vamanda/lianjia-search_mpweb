//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var RelativeTime = require('../../relativeTime/relativeTime.js')
var app = getApp()
Page({
  data: {
    data: [],
    test: 123
  },
  onLoad: function () {
    console.log('onLoad')
    this.initData()
    var that = this
    setTimeout(function () { console.log(that.data.data) }, 2000)
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
  },
  clickButton: function () {
    this.setData({ test: 456 })
    console.log("!")
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  initData: function () {
    var that = this
    wx.request({
      url: 'https://mzz.foryung.com/lianjia-search_mp/detail?pageId=107100301883',
      success: function (res) {
        console.log(res)
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          data[i].PublishTime = RelativeTime.relativeTime(data[i].PublishTime)
        }
        that.setData({ data: res.data.data })
      }
    })
  }
})
