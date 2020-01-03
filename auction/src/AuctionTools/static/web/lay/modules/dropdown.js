/** layui-v2.2.4 MIT License By http://www.layui.com */ ;
layui.define("jquery", function(n) {
	var i, o = layui.$,
		e = layui.device(),
		t = "dropdown",
		d = ".layui-dropdown-menu",
		r = e.android || e.ios ? "click" : "mouseover";
	Dropdown = function() {
		this.inst = null, this.currReElem = null
	};
	var l = function(n) {
			a(n.target) && a(n.target.parentElement) && a(n.target.parentElement.parentElement) && i.hide()
		},
		a = function(n) {
			return n && n.className.indexOf("layui-btn-dropdown") == -1 && n.className.indexOf("layui-dropdown-menu") == -1
		};
	Dropdown.prototype.hide = function() {
		i && i.inst && i.inst.is(":visible") && (i.inst.css("display", "none"), o("body").off(r, l))
	}, Dropdown.prototype.render = function() {
		i = this, o(".layui-btn-dropdown").each(function(n, t) {
			var a = o(t);
			a.data("id", "dropdown-" + n), r = e.android || e.ios ? "click" : "mouseover", a[r](function() {
				if(!i.inst || i.currReElem.data("id") != a.data("id") || i.currReElem.data("id") == a.data("id") && !i.inst.is(":visible")) {
					i.hide();
					var n = a.find(d),
						e = a.offset().left - o(window).scrollLeft(),
						t = a.offset().top + a.height() - o(window).scrollTop() - 2,
						s = a.width(),
						c = n.width(),
						u = e + s,
						p = e + c > o(window).width(),
						f = {
							display: "block",
							position: "fixed",
							top: t + "px",
							left: e + "px"
						};
					p && o.extend(!0, f, {
						left: u - c + "px"
					}), n.css(f).on("click", "li", function() {
						n.css("display", "none")
					}), i.inst = n, i.currReElem = a, o("body").on(r, l)
				}
			})
		})
	};
	var s = new Dropdown;
	s.render(), o(window).scroll(function() {
		s.hide()
	}), n(t, s)
});