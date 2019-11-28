Page({
  data: {
    resData: null
  },
  onShow () {
    this.getData()
  },
  getData(){
    const db = wx.cloud.database()
    db.collection('any').orderBy('_id','desc').get({
      success: res => {
        this.setData({
          resData: res.data
        })
      }
    })
  }
})