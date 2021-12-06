// pages/invoiceList/invoiceList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loaded: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const db = wx.cloud.database();
        var userOpenid = options.openid;
        var invoiceCount = 0;
        db.collection('registeredUsers').where({
          _openid: userOpenid
        }).get().then(res=>{
          invoiceCount = res.data[0].invoiceCount
          this.setData({loaded : true})
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})