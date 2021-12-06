//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') // 如需尝试获取用户信息可改为false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
    if (!this.data.logged){
      wx.login({
        success(res){
          
        }
      })
    }
  },

  onAvatarTapped() {
    console.log("Avatar Tapped")
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '获取您的微信号以登录系统', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功")
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        this.setData({logged:true})
        this.GetOpenid()
        wx.showToast({
          title: '登陆成功',
        })
      },
      fail: (res)=>{
        wx.showToast({
          icon: 'error',
          title: '登陆失败',
        })
        console.log(res)
      },
      complete: (res)=>{

      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },

  GetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        //wx.navigateTo({
        //  url: '../userConsole/userConsole',
        //})
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'error',
          title: '无法获取openid',
        })
        //wx.navigateTo({
        //  url: '../deployFunctions/deployFunctions',
        //})
      }
    })
  },

  uploadPDF: function(){
    wx.chooseMessageFile({
      count: 100,
      type: "file",
      extension: ["pdf"],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        res.tempFiles.forEach((tempFile)=>{
          const filePath = tempFile.path
        
          // 上传图片
          //const cloudPath = `my-pdf${filePath.match(/\.[^.]+?$/)[0]}`
          const cloudPath = `${app.globalData.openid}/${tempFile.name}`
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)
  
              //app.globalData.fileID = res.fileID
              //app.globalData.cloudPath = cloudPath
              //app.globalData.imagePath = filePath
              
              //wx.navigateTo({
              //  url: '../storageConsole/storageConsole'
              //})
              wx.showToast({
                title: '上传成功',
              })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'error',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  uploadImage:function(){
    const userInfo = this.data.userInfo
    console.log(userInfo)
    wx.chooseImage({
      count: 100,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        res.tempFilePaths.forEach((tempFilePath)=>{
          // 上传图片
          var filePath = tempFilePath
          //const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
          const cloudPath = `${app.globalData.openid}/my-image${filePath.match(/\.[^.]+?$/)[0]}`
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)
  
              //app.globalData.fileID = res.fileID
              //app.globalData.cloudPath = cloudPath
              //app.globalData.imagePath = filePath
              
              //wx.navigateTo({
              //  url: '../storageConsole/storageConsole'
              //})
              wx.showToast({
                title: '上传成功',
              })
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 上传发票
  doUpload: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ["pdf","图片"],
      success(res){
        console.log(res.tapIndex)
        if(res.tapIndex==0){
          that.uploadPDF()
        }
        else if(res.tapIndex==1){
          that.uploadImage()
        }
      },
      fail(res){
        wx.showToast({
          icon: "error",
          title: console.log(res.errMsg),
        })
      }
    })
  },

  checkDatabase: function(){
    wx.navigateTo({
      url: `../invoiceList/invoiceList?openid=${app.globalData.openid}`,
    })
  }
})
