Page({
  data: {
    resData: null
  },
  onShow () {
    this.getData()
  },
  getData () {
    const db = wx.cloud.database()
    db.collection('mysay').orderBy('_id','desc').get({
      success: (res) => {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        this.setData({
          resData: res.data
        })
      }
    })
  }
})