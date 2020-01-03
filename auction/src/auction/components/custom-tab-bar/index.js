// Component({
//   data: {
//     selected: 0,
//     color: "#7A7E83",
//     selectedColor: "#3cc51f",
//     list: [
//       {
//         pagePath: "pages/index/index",
//         text: "首页",
//         iconPath: "./static/1.png",
//        selectedIconPath: "./static/1+.png"
//       },
//       {
//         "pagePath": "pages/initiate/initiate",
//         "text": "发起拍卖",
//         "iconPath": "./static/2.png",
//         "selectedIconPath": "./static/2+.png"
//       },
//       {
//         "pagePath": "pages/joined/joined",
//         "text": "已参与",
//         "iconPath": "./static/3.png",
//         "selectedIconPath": "./static/3+.png"
//       },
//       {
//         "pagePath": "pages/mine/mine",
//         "text": "我的",
//         "iconPath": "./static/4.png",
//         "selectedIconPath": "./static/4+.png"
//       }
//     ]
//   },
//   attached() {
//   },
//   methods: {
//     switchTab(e) {
//       const data = e.currentTarget.dataset
//       const url = data.path
//       wx.switchTab({url})
//       this.setData({
//         selected: data.index
//       })
//     }
//   }
// })

Component({
  properties: {
    active: {
      type: String,
      value: 'index'
    },
  },
  methods: {
    onChange(event) {
      wx.redirectTo({
        url: `/pages/${event.detail}/index`,
      })
    }
  }
})
