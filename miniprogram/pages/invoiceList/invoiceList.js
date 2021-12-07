// pages/invoiceList/invoiceList.js
const MAX_LIMIT = 20
Page({

    /**
     * 页面的初始数据
     */
    data: {
      loaded: false,
      pageCount: 0,
      loadedCount:0,
      totalCount:0,
      invoiceList:[

      ],
    },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      const db = wx.cloud.database();
      var userOpenid = options.openid;
      db.collection('registeredUsers')
        .skip(this.data.pageCount*MAX_LIMIT)
        .limit(MAX_LIMIT)
        .where({
          _openid: userOpenid
        })
        .get()
        .then(res=>{
          res.data[0].invoices.map(item=>{
            item.uploadDate=item.uploadDate.toLocaleString().match(/\d+\/\d+\/\d+/)[0];
            return item
          })
          this.setData({
            loaded : true,
            loadedCount : Math.min(res.data[0].invoiceCount,MAX_LIMIT),
            pageCount: 1,
            totalCount : res.data[0].invoiceCount,
            invoiceList: res.data[0].invoices
          })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.setData({loaded : true})
      const db = wx.cloud.database();
      var userOpenid = options.openid;
      db.collection('registeredUsers')
        .skip(this.data.pageCount*MAX_LIMIT)
        .limit(MAX_LIMIT)
        .where({
          _openid: userOpenid
        }).get()
          .then(res=>{
          this.setData({
            loaded : true,
            loadedCount : Math.min(res.data[0].invoiceCount,MAX_LIMIT),
            pageCount: 1,
            totalCount : res.data[0].invoiceCount,
            invoiceList: res.data[0].invoices
        })
      })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      const db = wx.cloud.database();
      var userOpenid = options.openid;
      db.collection('registeredUsers')
        .skip(this.data.pageCount*MAX_LIMIT)
        .limit(MAX_LIMIT)
        .where({
          _openid: userOpenid
        }).get()
          .then(res=>{
          this.setData({
            loaded : true,
            loadedCount : Math.min(res.data[0].invoiceCount,MAX_LIMIT),
            pageCount: 1,
            totalCount : res.data[0].invoiceCount,
            invoiceList: res.data[0].invoices
        })
      })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },
    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },
    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection =='left'){
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
    onItemTapped(e){
      console.log(e.currentTarget.dataset.invoiceId)
    },
})