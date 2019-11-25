const app = getApp();

Page({
  data: {
    form: {
      name: '',
      work: ''
    }
  },
  add () {
    const { form } = this.data
    if (!form.name) {
      app.toast('请输入名字')
      return
    }
    if (!form.work) {
      app.toast('请输入职业')
    }
    this.onAdd(form)
  },
  workValue (e) {
    this.setData({
      'form.work': e.detail.value
    })
  },
  nameValue (e) {
    this.setData({
      'form.name': e.detail.value
    })
  },
  onAdd (obj) {
    const db = wx.cloud.database()
    db.collection('counters').add({
      data: {
        name: obj.name,
        work: obj.work
      },
      success: res => {
        console.log(res)
        app.toast('添加成功')
      },
      fail: res => {
        app.toast('添加失败')
      }
    })
  }
})