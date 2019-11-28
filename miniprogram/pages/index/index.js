//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    time: null,
    resData: null,
    background: ['../../images/kasha.jpeg', '../../images/jianji.jpeg',
    '../../images/yaoji.jpeg', '../../images/akali.jpeg',
    '../../images/kaer.jpeg', '../../images/timg.jpeg'
    ]
  },
  addPage () {
    if (app.globalData.openid !== 'o3A4M0Rwwtgs7ebYvZasrbZCFqaM') {
      return
    }
    wx.navigateTo({
      url: '../otherAction/otherAction'
    })
  },
  getData(){
    const db = wx.cloud.database()
    db.collection('counters').orderBy('count', 'desc').get({
      success: res => {
        this.setData({
          resData: res.data[0]
        })
      }
    })
  },
  timePlay(){
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();
    var H = hh<10?'0'+hh:hh+'';
    var M = mm<10?'0'+mm:mm+'';
    var S = ss<10?'0'+ss:ss+'';
    this.setData({
      time: `${H}:${M}:${S}`
    })
    const self = this
    setTimeout(self.timePlay,1000)
  },
  onLoad: function() {
    this.onGetOpenid()
    this.getData()
    this.timePlay()
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
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

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
