const app = getApp();

Page({
  data: {
    form: {
      name: '',
      work: ''
    },
    desc: '',
    val: ''
  },
  descVal(e){
    this.setData({
      desc: e.detail.value
    })
  },
  jsVal(e){
    this.setData({
      val: e.detail.value
    })
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
  descSub () {
    if (!this.data.desc) {
      app.toast('不能为空')
      return
    }
    this.addDesc('mysay', this.data.desc)
  },
  codeSub () {
    if (!this.data.val) {
      app.toast('不能为空')
      return
    }
    this.addDesc('any', this.data.val)
  },
  addDesc (type,val) {
    const db = wx.cloud.database()
    let data = {}
    if (type === 'mysay') {
      data.say = val
    } else {
      data.codes = val
    }
    db.collection(type).add({
      data,
      success: res => {
        app.toast('添加成功')
      },
      fail: err => {
        app.toast('添加失败')
      }
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