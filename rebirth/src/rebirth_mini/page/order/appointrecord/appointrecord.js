Page({

  data: {
    src: 'https://mp.weixin.qq.com/s/6AT7wqRslDFKW9TqGX3kQA'
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    if (options.src) {
      _self.setData({
        src: options.src
      })
    }
  },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () {

  },

})
