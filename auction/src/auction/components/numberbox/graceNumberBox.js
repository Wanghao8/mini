// graceUI/components/graceNumberBox.js
Component({
  properties: {
		value : {
			type : Number,
			value : 0 
		},
		disabled : {
			type : Boolean,
			value : false
		},
		step:{
			type: Number,
			value: 3
		},
		minNum: {
			type: Number,
			value: 1
		},
		index :{
			type: String,
			value: 0
		}
  },
  data: {
		
  },
  methods: {
		add : function(){
			var newVal = this.data.value + this.data.step;
			if (newVal > this.data.maxNum) { return; }
			this.setData({ value: newVal });
			this.numberChangeDo(newVal);
		},
		reduce: function () {
      var newVal = this.data.value - this.data.step;
			if (newVal < this.data.minNum){return ;}
			this.setData({ value: newVal});
			this.numberChangeDo(newVal);
		},
		blur : function(e){
      console.log(e)
			var newVal = e.detail.value;
			if (newVal > this.data.maxNum) { newVal = this.data.maxNum;}
			if (newVal < this.data.minNum) { newVal = this.data.minNum;}
			this.setData({ value: newVal });
			this.numberChangeDo(newVal);
		},
		numberChangeDo : function(val){
			this.triggerEvent('change', [val, this.data.index])
		}
  }
})
