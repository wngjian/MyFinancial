! function (a) {
	a.fn.combo = function (b) {
		if (0 == this.length) return this;
		var c, d = arguments;
		return this.each(function () {
			var e = a(this).data("_combo");
			if ("string" == typeof b) {
				if (!e) return;
				"function" == typeof e[b] && (d = Array.prototype.slice.call(d, 1), c = e[b].apply(e, d))
			} else e || (e = new a.Combo(a(this), b), a(this).data("_combo", e))
		}), void 0 === c ? this : c
	}, a.fn.getCombo = function () {
		return a.Combo.getCombo(this)
	}, a.Combo = function (b, c) {
		this.obj = b, this.opts = a.extend(!0, {}, a.Combo.defaults, c), this.dataOpt = this.opts.data, this._selectedIndex = -1, this._disabled = "undefined" != typeof this.opts.disabled ? !!this.opts.disabled : !!this.obj.attr("disabled"), a.extend(this, this.opts.callback), this._init()
	}, a.Combo.getCombo = function (b) {
		if (b = a(b), 0 != b.length) {
			if (1 == b.length) return b.data("_combo");
			if (b.length > 1) {
				var c = [];
				return b.each(function (b) {
					c.push(a(this).data("_combo"))
				}), c
			}
		}
	}, a.Combo.prototype = {
		constructor: a.Combo,
		_init: function () {
			var a = this.opts;
			"select" == this.obj[0].tagName.toLowerCase() && (this.originSelect = this.obj, this.dataOpt = this._getDataFromSelect()), this._createCombo(), this.loadData(this.dataOpt, a.defaultSelected, a.defaultFlag), this._handleDisabled(this._disabled), this._bindEvent()
		},
		loadData: function (a, b, c) {
			this.xhr && this.xhr.abort(), this.empty(!1), this.dataOpt = a, this.mode = this._getRenderMode(), this.mode && ("local" == this.mode ? (this._formatData(), this._populateList(this.formattedData), this._setDefaultSelected(b, c)) : "remote" == this.mode && this._loadAjaxData(b, c))
		},
		activate: function () {
			this.focus || this.input.focus(), this.wrap.addClass(this.opts.activeCls), this.active = !0
		},
		_blur: function () {
			this.active && (this.collapse(), this.opts.editable && this.opts.forceSelection && (this.selectByText(this.input.val()), -1 == this._selectedIndex && this.input.val("")), this.wrap.removeClass(this.opts.activeCls), this.active = !1, "function" == typeof this.onBlur && this.onBlur())
		},
		blur: function () {
			this.focus && this.input.blur(), this._blur()
		},
		_bindEvent: function () {
			var b = this,
				c = this.opts,
				d = "." + c.listItemCls;
			b.list.on("click", d, function (d) {
				a(this).hasClass(c.selectedCls) || b.selectByItem(a(this)), b.collapse(), b.input.focus(), "function" == typeof b.onListClick && b.onListClick()
			}).on("mouseover", d, function (b) {
				a(this).addClass(c.hoverCls).siblings().removeClass(c.hoverCls)
			}).on("mouseleave", d, function (b) {
				a(this).removeClass(c.hoverCls)
			}), b.input.on("focus", function (a) {
				b.wrap.addClass(c.activeCls), b.focus = !0, b.active = !0
			}).on("blur", function (a) {
				b.focus = !1
			}), c.editable ? b.input.on("focus", function (a) {
				this.select()
			}) : b.input.on("click", function (a) {
				b._onTriggerClick()
			}), b.trigger && b.trigger.on("click", function (a) {
				b._onTriggerClick()
			}), a(document).on("click", function (c) {
				var d = c.target || c.srcElement;
				0 == a(d).closest(b.wrap).length && 0 == a(d).closest(b.listWrap).length && b.blur()
			}), this.listWrap.on("click", function (a) {
				a.stopPropagation()
			}), a(window).on("resize", function () {
				b._setListPosition()
			}), this._bindKeyEvent()
		},
		_bindKeyEvent: function () {
			var b = this,
				c = this.opts,
				d = {
					backSpace: 8,
					esc: 27,
					f7: 118,
					up: 38,
					down: 40,
					tab: 9,
					enter: 13,
					home: 36,
					end: 35,
					pageUp: 33,
					pageDown: 34,
					space: 32
				};
			this.input.on("keydown", function (a) {
				switch (a.keyCode) {
					case d.tab:
						b._blur();
						break;
					case d.down:
					case d.up:
						if (b.isExpanded) {
							var e = a.keyCode == d.down ? "next" : "prev";
							b._setItemFocus(e)
						} else b._onTriggerClick();
						a.preventDefault();
						break;
					case d.enter:
						if (b.isExpanded) {
							var f = b.list.find("." + c.hoverCls);
							f.length > 0 && b.selectByItem(f), b.collapse()
						}
						break;
					case d.home:
					case d.end:
						if (b.isExpanded) {
							var f = a.keyCode == d.home ? b.list.find("." + c.listItemCls).eq(0) : b.list.find("." + c.listItemCls).filter(":last");
							b._scrollToItem(f), a.preventDefault()
						}
						break;
					case d.pageUp:
					case d.pageDown:
						if (b.isExpanded) {
							var e = a.keyCode == d.pageUp ? "up" : "down";
							b._scrollPage(e), a.preventDefault()
						}
				}
			}).on("keyup", function (a) {
				if (c.editable) {
					var e = a.which,
						f = 8 == e || 9 == e || 13 == e || 27 == e || 44 == e || 45 == e || e >= 16 && 20 >= e || e >= 33 && 40 >= e || e >= 112 && 123 >= e || 144 == e || 145 == e,
						g = b.input.val();
					f && e != d.backSpace || b.doDelayQuery(g)
				}
			}), a(document).on("keydown", function (a) {
				a.keyCode == d.esc && b.collapse()
			})
		},
		distory: function () {},
		enable: function () {
			this._handleDisabled(!1)
		},
		disable: function (a) {
			a = "undefined" == typeof a ? !0 : !!a, this._handleDisabled(a)
		},
		_handleDisabled: function (a) {
			var b = this.opts;
			this._disabled = a, 1 == a ? this.wrap.addClass(b.disabledCls) : this.wrap.removeClass(b.disabledCls), this.input.attr("disabled", a)
		},
		_createCombo: function () {
			var b, c, d, e = this.opts,
				f = parseInt(this.opts.width);
			this.originSelect && this.originSelect.hide(), "input" == this.obj[0].tagName.toLowerCase() ? this.input = this.obj : (c = this.obj.find("." + e.inputCls), this.input = c.length > 0 ? c : a('<input type="text" class="' + e.inputCls + '"/>')), this.input.attr({
				autocomplete: "off",
				readOnly: !e.editable
			}).css({
				cursor: e.editable ? "" : "default"
			}), d = a(this.obj).find("." + e.triggerCls), d.length > 0 ? this.trigger = d : e.trigger !== !1 && (this.trigger = a('<span class="' + e.triggerCls + '"></span>')), b = this.obj.hasClass(e.wrapCls) ? this.obj : this.obj.find("." + e.wrapCls), b.length > 0 ? this.wrap = b.append(this.input, this.trigger) : this.trigger && (this.wrap = a('<span class="' + e.wrapCls + '"></span>').append(this.input, this.trigger), this.originSelect && this.obj[0] == this.originSelect[0] || this.obj[0] == this.input[0] ? this.obj.next().length > 0 ? this.wrap.insertBefore(this.obj.next()) : this.wrap.appendTo(this.obj.parent()) : this.wrap.appendTo(this.obj)), this.wrap && e.id && this.wrap.attr("id", e.id), this.wrap || (this.wrap = this.input), this._setComboLayout(f), this.list = a("<div />").addClass(e.listCls).css({
				position: "relative",
				overflow: "auto"
			}), this.listWrap = a("<div />").addClass(e.listWrapCls).attr("id", e.listId).hide().append(this.list).css({
				position: "absolute",
				top: 0,
				zIndex: e.zIndex
			}), e.extraListHtml && a("<div />").addClass(e.extraListHtmlCls).append(e.extraListHtml).appendTo(this.listWrap), e.listRenderToBody ? (a.Combo.allListWrap || (a.Combo.allListWrap = a('<div id="COMBO_WRAP"/>').appendTo("body")), this.listWrap.appendTo(a.Combo.allListWrap)) : this.wrap.after(this.listWrap)
		},
		_setListLayout: function () {
			var a, b, c = this.opts,
				d = parseInt(c.listHeight),
				e = 0,
				f = this.trigger ? this.trigger.outerWidth() : 0,
				g = parseInt(c.minListWidth),
				h = parseInt(c.maxListWidth);
			if (this.listWrap.width("auto"), this.list.height("auto"), this.listWrap.show(), this.isExpanded = !0, b = this.list.height(), !isNaN(d) && d >= 0 && (d = Math.min(d, b), this.list.height(d)), "auto" == c.listWidth || "auto" == c.width ? (a = this.listWrap.outerWidth(), b < this.list.height() && (e = 20, a += e)) : (a = parseInt(c.listWidth), isNaN(a) ? a = this.wrap.outerWidth() : null), "auto" == c.width) {
				var i = this.listWrap.outerWidth() + Math.max(f, e);
				this._setComboLayout(i)
			}
			g = isNaN(g) ? this.wrap.outerWidth() : Math.max(g, this.wrap.outerWidth()), !isNaN(g) && g > a && (a = g), !isNaN(h) && a > h && (a = h), a -= this.listWrap.outerWidth() - this.listWrap.width(), this.listWrap.width(a), this.listWrap.hide(), this.isExpanded = !1
		},
		_setComboLayout: function (a) {
			if (a) {
				var b = this.opts,
					c = parseInt(b.maxWidth),
					d = parseInt(b.minWidth);
				!isNaN(c) && a > c && (a = c), !isNaN(d) && d > a && (a = d);
				var e;
				a -= this.wrap.outerWidth() - this.wrap.width(), this.wrap.width(a), this.wrap[0] != this.input[0] && (e = a - (this.trigger ? this.trigger.outerWidth() : 0) - (this.input.outerWidth() - this.input.width()), this.input.width(e))
			}
		},
		_setListPosition: function () {
			if (this.isExpanded) {
				var b, c, d = (this.opts, a(window)),
					e = this.wrap.offset().top,
					f = this.wrap.offset().left,
					g = d.height(),
					h = d.width(),
					i = d.scrollTop(),
					j = d.scrollLeft(),
					k = this.wrap.outerHeight(),
					l = this.wrap.outerWidth(),
					m = this.listWrap.outerHeight(),
					n = this.listWrap.outerWidth(),
					o = parseInt(this.listWrap.css("border-top-width"));
				b = e - i + k + m > g && e > m ? e - m + o : e + k - o, c = f - j + n > h ? f + l - n : f, this.listWrap.css({
					top: b,
					left: c
				})
			}
		},
		_getRenderMode: function () {
			var b, c = this.dataOpt;
			return a.isFunction(c) && (c = c()), a.isArray(c) ? (this.rawData = c, b = "local") : "string" == typeof c && (this.url = c, b = "remote"), b
		},
		_loadAjaxData: function (b, c, d) {
			var e = this,
				f = e.opts,
				g = f.ajaxOptions,
				h = a("<div />").addClass(f.loadingCls).text(g.loadingText);
			e.list.append(h), e.list.find(f.listTipsCls).remove(), e._setListLayout(), e._setListPosition(), e.xhr = a.ajax({
				url: e.url,
				type: g.type,
				dataType: g.dataType,
				timeout: g.timeout,
				success: function (f) {
					h.remove(), a.isFunction(g.success) && g.success(f), a.isFunction(g.formatData) && (f = g.formatData(f)), f && (e.rawData = f, e._formatData(), e._populateList(e.formattedData), "" === b ? (e.lastQuery = d, e.filterData = e.formattedData, e.expand()) : e._setDefaultSelected(b, c), e.xhr = null)
				},
				error: function (b, c, d) {
					h.remove(), a("<div />").addClass(f.tipsCls).text(g.errorText).appendTo(e.list), e.xhr = null
				}
			})
		},
		getDisabled: function () {
			return this._disabled
		},
		getValue: function () {
			return this._selectedIndex > -1 ? this.formattedData[this._selectedIndex].value : this.opts.forceSelection ? "" : this.input.val()
		},
		getText: function () {
			return this._selectedIndex > -1 ? this.formattedData[this._selectedIndex].text : this.opts.forceSelection ? "" : this.input.val()
		},
		getSelectedIndex: function () {
			return this._selectedIndex
		},
		getSelectedRow: function () {
			var a = this._selectedIndex,
				b = this.opts;
			return b.emptyOptions && a--, b.addOptions && (a -= b.addOptions.length), a > -1 ? this.rawData[a] : void 0
		},
		getDataRow: function () {
			return this.getSelectedRow()
		},
		getAllData: function () {
			return this.formattedData
		},
		getAllRawData: function () {
			return this.rawData
		},
		_setDefaultSelected: function (b, c) {
			var d = this.opts;
			if ("function" == typeof b && (defaultSelected = defaultSelected.call(this, this.rawData)), isNaN(parseInt(b)))
				if (a.isArray(b)) this.selectByKey(b[0], b[1], c);
				else if (this.originSelect) {
				var e = this.originSelect[0].selectedIndex;
				this._setSelected(e, c)
			} else d.autoSelect && this._setSelected(0, c);
			else {
				var e = parseInt(b);
				this._setSelected(e, c)
			}
		},
		selectByIndex: function (a, b) {
			this._setSelected(a, b)
		},
		selectByText: function (a, b) {
			if (this.formattedData) {
				for (var c = this.formattedData, d = -1, e = 0, f = c.length; f > e; e++)
					if (c[e].text === a) {
						d = e;
						break
					}
				this._setSelected(d, b)
			}
		},
		selectByValue: function (a, b) {
			if (this.formattedData) {
				for (var c = this.formattedData, d = -1, e = 0, f = c.length; f > e; e++)
					if (c[e].value === a) {
						d = e;
						break
					}
				this._setSelected(d, b)
			}
		},
		selectByKey: function (a, b, c) {
			if (this.rawData) {
				var d = this,
					e = d.opts,
					f = this.rawData,
					g = -1;
				if (e.addOptions) {
					f = this.formattedData;
					for (var h = 0, i = f.length; i > h; h++)
						if (f[h].value === b) {
							g = h;
							break
						}
				} else
					for (var h = 0, i = f.length; i > h; h++)
						if (f[h][a] === b) {
							g = h;
							break
						}
				this._setSelected(g, c)
			}
		},
		selectByItem: function (a, b) {
			if (a && a.parent()[0] == this.list[0]) {
				var c = a.text();
				this.selectByText(c, b)
			}
		},
		_setSelected: function (a, b) {
			var c = this.opts,
				a = parseInt(a),
				b = "undefined" != typeof b ? !!b : !0;
			if (!isNaN(a)) {
				if (!this.formattedData || 0 == this.formattedData.length) return void(this._selectedIndex = -1);
				var d = this.formattedData.length;
				if ((-1 > a || a >= d) && (a = -1), this._selectedIndex != a) {
					var e = -1 == a ? null : this.formattedData[a],
						f = -1 == a ? null : e.rawData,
						g = -1 == a ? "" : e.text;
					this.list.find("." + c.listItemCls);
					(!b || "function" != typeof this.beforeChange || this.beforeChange(f)) && (c.editable && -1 == a && this.focus || this.input.val(g), this._selectedIndex = a, b && "function" == typeof this.onChange && this.onChange(f), this.originSelect && (this.originSelect[0].selectedIndex = a))
				}
			}
		},
		removeSelected: function (a) {
			this.input.val(""), this._setSelected(-1, a)
		},
		_triggerCallback: function (a, b) {},
		_getDataFromSelect: function () {
			var b = this.opts,
				c = [];
			return a.each(this.originSelect.find("option"), function (d) {
				var e = a(this),
					f = {};
				f[b.text] = e.text(), f[b.value] = e.attr("value"), c.push(f)
			}), c
		},
		_formatData: function () {
			if (a.isArray(this.rawData)) {
				var b = this,
					c = b.opts;
				b.formattedData = [], c.emptyOptions && b.formattedData.push({
					text: "(空)",
					value: 0
				}), c.addOptions && b.formattedData.push(c.addOptions), a.each(this.rawData, function (d, e) {
					var f = {};
					f.text = a.isFunction(c.formatText) ? c.formatText(e) : e[c.text], f.value = a.isFunction(c.formatValue) ? c.formatValue(e) : e[c.value], f.rawData = e, b.formattedData.push(f)
				})
			}
		},
		_filter: function (b) {
			b = "undefined" == typeof b ? "" : b, this.input.val() != this.getText() && this.selectByText(this.input.val());
			var c = this.opts,
				d = this,
				e = c.maxFilter;
			if (this.opts.cache || ("local" == this.mode && a.isFunction(this.dataOpt) && (this.rawData = this.dataOpt()), this._formatData()), a.isArray(this.formattedData)) {
				if ("" == b) {
					var f = e < this.formattedData.length ? e : this.formattedData.length;
					this.filterData = [];
					for (var g = 0; f > g; g++) this.filterData.push(this.formattedData[g])
				} else {
					var h = [];
					this.filterData = [], a.each(d.formattedData, function (e, f) {
						var g = f.text;
						if (a.isFunction(c.customMatch)) {
							var i = c.customMatch(g, b, f);
							if (!i) return
						} else {
							var j = c.caseSensitive ? "" : "i",
								k = new RegExp(b.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), j);
							if (-1 == g.search(k)) return
						}
						return "add" === i ? h.push(f) : d.filterData.push(f), d.filterData.length + h.length == c.maxFilter ? !1 : void 0
					}), a.merge(d.filterData, h)
				}
				this.lastQuery = b, this.list.empty(), this._populateList(this.filterData), this.expand()
			}
		},
		doDelayQuery: function (a) {
			var b = this,
				c = b.opts,
				d = parseInt(c.queryDelay);
			isNaN(d) && (d = 0), b.queryDelay && window.clearTimeout(b.queryDelay), b.queryDelay = window.setTimeout(function () {
				b.doQuery(a)
			}, d)
		},
		doQuery: function (a) {
			"local" == this.mode || "remote" == this.mode && this.opts.loadOnce ? this._filter(a) : this._loadAjaxData("", !1, a)
		},
		_populateList: function (b) {
			if (b) {
				var c = this,
					d = c.opts;
				if (0 == b.length) d.forceSelection && (a("<div />").addClass(d.tipsCls).html(d.noDataText).appendTo(c.list), this._setListLayout());
				else {
					for (var e = 0, f = b.length; f > e; e++) {
						var g = b[e],
							h = g.text,
							i = g.value;
						a("<div />").attr({
							"class": d.listItemCls + (e == this._selectedIndex ? " " + d.selectedCls : ""),
							"data-value": i
						}).text(h).appendTo(c.list)
					}
					this._setListLayout()
				}
			}
		},
		expand: function () {
			var b = this.opts;
			if (!this.active || this.isExpanded || 0 == this.filterData.length && !b.noDataText && !b.extraListHtmlCls) return void this.listWrap.hide();
			this.isExpanded = !0, this.listWrap.show(), this._setListPosition(), a.isFunction(this.onExpand) && this.onExpand();
			var c = this.list.find("." + b.listItemCls);
			if (0 != c.length) {
				var d = c.filter("." + b.selectedCls);
				0 == d.length && (d = c.eq(0).addClass(b.hoverCls)), this._scrollToItem(d)
			}
		},
		collapse: function () {
			if (this.isExpanded) {
				var b = this.opts;
				this.listWrap.hide(), this.isExpanded = !1, this.listItems && this.listItems.removeClass(b.hoverCls), a.isFunction(this.onCollapse) && this.onCollapse()
			}
		},
		_onTriggerClick: function () {
			this._disabled || (this.active = !0, this.input.focus(), this.isExpanded ? this.collapse() : this._filter())
		},
		_scrollToItem: function (a) {
			if (a && 0 != a.length) {
				var b = this.list.scrollTop(),
					c = b + a.position().top,
					d = b + this.list.height(),
					e = c + a.outerHeight();
				(b > c || e > d) && this.list.scrollTop(c)
			}
		},
		_scrollPage: function (a) {
			var b, c = this.list.scrollTop(),
				d = this.list.height();
			"up" == a ? b = c - d : "down" == a && (b = c + d), this.list.scrollTop(b)
		},
		_setItemFocus: function (a) {
			var b, c, d = this.opts,
				e = this.list.find("." + d.listItemCls);
			if (0 != e.length) {
				var f = e.filter("." + d.hoverCls).eq(0);
				0 == f.length && (f = e.filter("." + d.selectedCls).eq(0)), 0 == f.length ? b = 0 : (b = e.index(f), b = "next" == a ? b == e.length - 1 ? 0 : b + 1 : 0 == b ? e.length - 1 : b - 1), c = e.eq(b), e.removeClass(d.hoverCls), c.addClass(d.hoverCls), this._scrollToItem(c)
			}
		},
		empty: function (a) {
			this._setSelected(-1, !1), this.input.val(""), this.list.empty(), this.rawData = null, this.formattedData = null
		},
		setEdit: function () {}
	}, a.Combo.defaults = {
		data: null,
		text: "text",
		value: "value",
		formatText: null,
		formatValue: null,
		defaultSelected: void 0,
		defaultFlag: !0,
		autoSelect: !0,
		disabled: void 0,
		editable: !1,
		caseSensitive: !1,
		forceSelection: !0,
		cache: !0,
		queryDelay: 100,
		maxFilter: 1e3,
		minChars: 0,
		customMatch: null,
		noDataText: "没有匹配的选项",
		width: void 0,
		minWidth: void 0,
		maxWidth: void 0,
		listWidth: void 0,
		listHeight: 150,
		maxListWidth: void 0,
		maxListWidth: void 0,
		zIndex: 1e3,
		listRenderToBody: !0,
		extraListHtml: void 0,
		ajaxOptions: {
			type: "post",
			dataType: "json",
			queryParam: "query",
			timeout: 1e4,
			formatData: null,
			loadingText: "Loading...",
			success: null,
			error: null,
			errorText: "数据加载失败"
		},
		loadOnce: !0,
		id: void 0,
		listId: void 0,
		wrapCls: "ui-combo-wrap",
		focusCls: "ui-combo-focus",
		disabledCls: "ui-combo-disabled",
		activeCls: "ui-combo-active",
		inputCls: "input-txt",
		triggerCls: "trigger",
		listWrapCls: "ui-droplist-wrap",
		listCls: "droplist",
		listItemCls: "list-item",
		selectedCls: "selected",
		hoverCls: "on",
		loadingCls: "loading",
		tipsCls: "tips",
		extraListHtmlCls: "extra-list-ctn",
		callback: {
			onFocus: null,
			onBlur: null,
			beforeChange: null,
			onChange: null,
			onExpand: null,
			onCollapse: null
		}
	}
}(jQuery),
function (a) {
	a.fn.numberField = function (b) {
		return a(this).each(function () {
			if ("input" == this.tagName.toLowerCase())
				if ("string" == typeof b) {
					var c = a(this).data("_numberField");
					if (!c) return;
					var d = Array.prototype.slice.call(arguments, 1);
					"function" == typeof c[b] && c[b].apply(c, d)
				} else {
					var c = a(this).data("_numberField");
					if (c) return;
					c = new a.NumberField(a(this), b), a(this).data("_numberField", c)
				}
		})
	}, a.NumberField = function (b, c) {
		this.input = b, this.opts = a.extend(!0, {}, a.NumberField.defaults, c), this._init()
	}, a.fn.getNumberField = function () {
		return a.NumberField.getNumberField(this)
	}, a.NumberField.getNumberField = function (b) {
		if (b = a(b), 0 != b.length) {
			if (1 == b.length) return b.data("_numberField");
			if (b.length > 1) {
				var c = [];
				return b.each(function (a) {
					c.push(this.data("_numberField"))
				}), c
			}
		}
	}, a.NumberField.prototype = {
		constructor: a.NumberField,
		_init: function () {
			var a = this.opts,
				b = parseFloat(a.min),
				c = parseFloat(a.max),
				d = parseFloat(a.step),
				e = parseInt(a.precision);
			this.min = isNaN(b) ? Number.NEGATIVE_INFINITY : b, this.max = isNaN(c) ? Number.MAX_VALUE : c, this.step = isNaN(d) ? 1 : d, this.precision = isNaN(e) || !a.decimal || 0 > e ? 0 : e, this.allowedReg = this._getAllowedReg(), this.input.css("ime-mode", "disabled"), this._initVal(), this._initDisabled(), this._bindEvent()
		},
		_getAllowedReg: function () {
			var a, b = this.opts,
				c = "0123456789";
			return b.decimal && (c += "."), this.min < 0 && (c += "-"), c = c.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), a = new RegExp("[" + c + "]")
		},
		_initVal: function () {
			var a = this._getProcessedVal(this.opts.value);
			a === !1 && (a = this._getProcessedVal(this.input.val()), a === !1 && (a = "")), this._val = this.originVal = a, this.input.val(a)
		},
		_initDisabled: function () {
			var a = this.opts;
			this._disabled = a.disabled === !0 ? !0 : a.disabled === !1 ? !1 : !!this.input.attr("disabled"), this.originDisabled = this._disabled, this._handleDisabled(this._disabled)
		},
		_bindEvent: function () {
			var b = this,
				c = b.opts,
				d = {
					up: 38,
					down: 40
				},
				e = "mousewheel";
			this.input.on("keydown", function (a) {
				var e = a.which;
				if (e == d.up || e == d.down) {
					if (!c.keyEnable) return;
					var f = e == d.up ? "plus" : "minus";
					b._handleAdjusting(f), a.preventDefault()
				}
			}).on("keypress", function (c) {
				var d = "undefined" != typeof c.charCode ? c.charCode : c.keyCode,
					e = a.trim(String.fromCharCode(d));
				0 == d || b.allowedReg.test(e) || c.preventDefault()
			}).on("keyup", function (a) {
				b._clearAutoRepeat()
			}).on("focus", function (a) {
				b.focus = !0
			}).on("blur", function (c) {
				b.focus = !1;
				var d = a.trim(b.input.val());
				d !== b._val && (b.setValue(d) || b.input.val(b._val))
			}).on(e, function (a) {
				if (a.preventDefault(), b.focus && c.wheelEnable) {
					a = a.originalEvent;
					var d = a.wheelDelta ? a.wheelDelta / 120 : -a.detail / 3,
						e = 1 == d ? "plus" : "minus",
						f = b.input.val();
					f === b._val || b.setValue(f) || b.input.val(this._val), b._adjustVal(e)
				}
			})
		},
		_getProcessedVal: function (b) {
			return "string" == typeof b && "" === a.trim(b) ? "" : (b = parseFloat(b), isNaN(b) ? !1 : (b = b > this.max ? this.max : b < this.min ? this.min : b, b = b.toFixed(this.precision), this.opts.forceDecimal || (b = parseFloat(b)), b))
		},
		enable: function () {
			this._handleDisabled(!1)
		},
		disable: function () {
			this._handleDisabled(!0)
		},
		_handleDisabled: function (a) {
			var b = this.opts;
			a === !0 ? this.input.addClass(b.inputDisabledCls) : this.input.removeClass(b.inputDisabledCls), this._disabled = a, this.input.attr("disabled", a)
		},
		_handleAdjusting: function (a) {
			var b = this.input.val();
			b === this._val || this.setValue(b) || this.input.val(this._val), this._val === this.max && "plus" == a || this._val === this.min && "minus" == a || (this.opts.autoRepeat && (this._clearAutoRepeat(), this._setAutoRepeat(a)), this._adjustVal(a))
		},
		_adjustVal: function (a) {
			if (this._val === this.max && "plus" == a || this._val === this.min && "minus" == a) return void this._clearAutoRepeat();
			var b = "" !== this._val ? this._val : this.min < 0 && this.min > Number.NEGATIVE_INFINITY ? this.min : 0,
				c = "plus" == a ? b + this.step : b - this.step;
			this.setValue(c)
		},
		_setAutoRepeat: function (a) {
			var b = this.opts,
				c = this;
			c.autoTimer = window.setTimeout(function () {
				c.autoRepeater = window.setInterval(function () {
					c._adjustVal(a)
				}, b.interval)
			}, b.delay)
		},
		_clearAutoRepeat: function () {
			this.autoTimer && window.clearTimeout(this.autoTimer), this.autoRepeater && window.clearTimeout(this.autoRepeater)
		},
		setValue: function (a) {
			this.opts;
			if (!this._disabled && (a = this._getProcessedVal(a), a !== !1)) return this.input.val(a), this._val = a, !0
		}
	}, a.NumberField.defaults = {
		value: void 0,
		max: void 0,
		min: void 0,
		step: 1,
		decimal: !1,
		precision: 2,
		disabled: void 0,
		keyEnable: !1,
		wheelEnable: !1,
		autoRepeat: !0,
		delay: 400,
		interval: 80,
		inputCls: "ui-input",
		inputDisabledCls: "ui-input-disabled"
	}
}(jQuery),
function (a) {
	a.fn.spinbox = function (b) {
		return a(this).each(function () {
			if ("string" == typeof b) {
				var c = a(this).data("_spinbox");
				if (!c) return;
				var d = Array.prototype.slice.call(arguments, 1);
				"function" == typeof c[b] && c[b].apply(c, d)
			} else {
				var c = a(this).data("_spinbox");
				if (c) return;
				c = new a.Spinbox(a(this), b), a(this).data("_spinbox", c)
			}
		})
	}, a.fn.getSpinbox = function () {
		return a.Spinbox.getSpinbox(this)
	}, a.Spinbox = function (b, c) {
		this.obj = b, this.opts = a.extend(!0, {}, a.Spinbox.defaults, c), this._init()
	}, a.Spinbox.getSpinbox = function (b) {
		if (b = a(b), 0 != b.length) {
			if (1 == b.length) return b.data("_spinbox");
			if (b.length > 1) {
				var c = [];
				return b.each(function (a) {
					c.push(this.data("_spinbox"))
				}), c
			}
		}
	}, a.Spinbox.prototype = {
		constructor: a.Spinbox,
		_init: function () {
			this._createStruture(), this._initDisabled(), this._bindEvent()
		},
		_createStruture: function () {
			var b, c, d = this.opts,
				e = parseInt(d.width);
			"input" == this.obj[0].tagName.toLowerCase() ? (this.input = this.obj, this.obj = this.obj.parent(), b = 0 == this.input.next().length ? null : this.input.next()) : this.input = a('<input type="text" />'), this.input.attr("autocomplete", "off").addClass(d.inputCls).numberField(d), this.numberField = this.input.data("_numberField"), this.downBtn = a("<a />").addClass(d.downBtnCls), this.upBtn = a("<a />").addClass(d.upBtnCls), this.btnWrap = a("<span />").addClass(d.btnWrapCls).append(this.upBtn, this.downBtn), this.btns = this.btnWrap.children(), this.wrap = a("<span />").addClass(d.wrapCls).append(this.input, this.btnWrap), b ? this.wrap.insertBefore(b) : this.wrap.appendTo(this.obj), e && (this.wrap.width(e), c = e - this.btnWrap.outerWidth() - (this.input.outerWidth() - this.input.width()), this.input.width(c))
		},
		_initDisabled: function () {
			var a = this.opts;
			this._disabled = a.disabled === !0 ? !0 : a.disabled === !1 ? !1 : void 0, void 0 === this._disabled && (this._disabled = !!this.input.attr("disabled")), this.defaultDisabled = this._disabled, this._disabled === !0 && this.disable()
		},
		_bindEvent: function () {
			var b = this,
				c = this.opts;
			this.wrap.on("mouseover", function (a) {
				b._disabled || b.wrap.addClass(c.hoverCls)
			}).on("mouseleave", function (a) {
				b._disabled || b.wrap.removeClass(c.hoverCls)
			}), this.btnWrap.on("mouseover", function (d) {
				b._disabled || a(this).addClass(c.btnWrapHoverCls)
			}).on("mouseleave", function (d) {
				b._disabled || a(this).removeClass(c.btnWrapHoverCls)
			});
			var d = "mousedown";
			this.btns.on(d, function (c) {
				if (!b._disabled) {
					var d = a(this)[0] == b.upBtn[0] ? "plus" : "minus";
					b.input.focus(), "mousedown" == c.type ? b.numberField._handleAdjusting(d) : "dblclick" == c.type && b.numberField._adjustVal(d), c.preventDefault()
				}
			}).on("mouseup mouseleave", function (a) {
				b.numberField._clearAutoRepeat()
			}), this.input.on("focus", function (a) {
				b.wrap.addClass(c.activeCls)
			}).on("blur", function () {
				b.wrap.removeClass(c.activeCls)
			}), a(document).on("mousedown", function (d) {
				var e = d.target || d.srcElement;
				0 == a(e).closest(b.wrap).length && b.wrap.removeClass(c.activeCls)
			})
		},
		enable: function () {
			this._handleDisabled(!1)
		},
		disable: function (a) {
			a = "undefined" == typeof a ? !0 : !!a, this._handleDisabled(a)
		},
		_handleDisabled: function (a) {
			var b = this.opts;
			a === !0 ? this.wrap.addClass(b.disabledCls) : this.wrap.removeClass(b.disabledCls), this._disabled = a, this.numberField._handleDisabled(a)
		},
		getDisabled: function () {
			return this._disabled
		},
		getValue: function () {
			this.numberField.getValue()
		},
		setValue: function (a) {
			return this.numberField.setValue(a)
		}
	}, a.Spinbox.defaults = a.extend(!0, a.NumberField.defaults, {
		width: void 0,
		wrapCls: "ui-spinbox-wrap",
		activeCls: "ui-spinbox-active",
		disabledCls: "ui-spinbox-disabled",
		hoverCls: "ui-spinbox-hover",
		inputCls: "input-txt",
		btnWrapCls: "btn-wrap",
		btnWrapHoverCls: "btn-wrap-hover",
		btnCls: "btn",
		downBtnCls: "btn-down",
		upBtnCls: "btn-up"
	})
}(jQuery),
function (a) {
	a.extend(a.fn, {
		validate: function (b) {
			if (!this.length) return void(b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
			var c = a.data(this[0], "validator");
			return c ? c : ("undefined" != typeof Worker && this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), a.data(this[0], "validator", c), c.settings.onsubmit && (this.validateDelegate(":submit", "click", function (b) {
				c.settings.submitHandler && (c.submitButton = b.target), a(b.target).hasClass("cancel") && (c.cancelSubmit = !0), void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0)
			}), this.submit(function (b) {
				function d() {
					var d;
					return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), !1) : !0
				}
				return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), !1)
			})), c)
		},
		valid: function () {
			if (a(this[0]).is("form")) return this.validate().form();
			var b = !0,
				c = a(this[0].form).validate();
			return this.each(function () {
				b = b && c.element(this)
			}), b
		},
		removeAttrs: function (b) {
			var c = {},
				d = this;
			return a.each(b.split(/\s/), function (a, b) {
				c[b] = d.attr(b), d.removeAttr(b)
			}), c
		},
		rules: function (b, c) {
			var d = this[0];
			if (b) {
				var e = a.data(d.form, "validator").settings,
					f = e.rules,
					g = a.validator.staticRules(d);
				switch (b) {
					case "add":
						a.extend(g, a.validator.normalizeRule(c)), delete g.messages, f[d.name] = g, c.messages && (e.messages[d.name] = a.extend(e.messages[d.name], c.messages));
						break;
					case "remove":
						if (!c) return delete f[d.name], g;
						var h = {};
						return a.each(c.split(/\s/), function (a, b) {
							h[b] = g[b], delete g[b]
						}), h
				}
			}
			var i = a.validator.normalizeRules(a.extend({}, a.validator.classRules(d), a.validator.attributeRules(d), a.validator.dataRules(d), a.validator.staticRules(d)), d);
			if (i.required) {
				var j = i.required;
				delete i.required, i = a.extend({
					required: j
				}, i)
			}
			return i
		}
	}), a.extend(a.expr[":"], {
		blank: function (b) {
			return !a.trim("" + a(b).val())
		},
		filled: function (b) {
			return !!a.trim("" + a(b).val())
		},
		unchecked: function (b) {
			return !a(b).prop("checked")
		}
	}), a.validator = function (b, c) {
		this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, this.init()
	}, a.validator.format = function (b, c) {
		return 1 === arguments.length ? function () {
			var c = a.makeArray(arguments);
			return c.unshift(b), a.validator.format.apply(this, c)
		} : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), c.constructor !== Array && (c = [c]), a.each(c, function (a, c) {
			b = b.replace(RegExp("\\{" + a + "\\}", "g"), function () {
				return c
			})
		}), b)
	}, a.extend(a.validator, {
		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			validClass: "valid",
			errorElement: "label",
			focusInvalid: !0,
			errorContainer: a([]),
			errorLabelContainer: a([]),
			onsubmit: !0,
			ignore: ":hidden",
			ignoreTitle: !1,
			onfocusin: function (a) {
				this.lastActive = a, this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.addWrapper(this.errorsFor(a)).hide())
			},
			onfocusout: function (a) {
				this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
			},
			onkeyup: function (a, b) {
				(9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a)
			},
			onclick: function (a) {
				a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
			},
			highlight: function (b, c, d) {
				"radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
			},
			unhighlight: function (b, c, d) {
				"radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
			}
		},
		setDefaults: function (b) {
			a.extend(a.validator.defaults, b)
		},
		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: a.validator.format("Please enter no more than {0} characters."),
			minlength: a.validator.format("Please enter at least {0} characters."),
			rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
			range: a.validator.format("Please enter a value between {0} and {1}."),
			max: a.validator.format("Please enter a value less than or equal to {0}."),
			min: a.validator.format("Please enter a value greater than or equal to {0}.")
		},
		autoCreateRanges: !1,
		prototype: {
			init: function () {
				function b(b) {
					var c = a.data(this[0].form, "validator"),
						d = "on" + b.type.replace(/^validate/, "");
					c.settings[d] && c.settings[d].call(c, this[0], b)
				}
				this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
				var c = this.groups = {};
				a.each(this.settings.groups, function (b, d) {
					"string" == typeof d && (d = d.split(/\s/)), a.each(d, function (a, d) {
						c[d] = b
					})
				});
				var d = this.settings.rules;
				a.each(d, function (b, c) {
					d[b] = a.validator.normalizeRule(c)
				}), a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", b).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", b), this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
			},
			form: function () {
				return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
			},
			checkForm: function () {
				this.prepareForm();
				for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) this.check(b[a]);
				return this.valid()
			},
			element: function (b) {
				b = this.validationTargetFor(this.clean(b)), this.lastElement = b, this.prepareElement(b), this.currentElements = a(b);
				var c = this.check(b) !== !1;
				return c ? delete this.invalid[b.name] : this.invalid[b.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), c
			},
			showErrors: function (b) {
				if (b) {
					a.extend(this.errorMap, b), this.errorList = [];
					for (var c in b) this.errorList.push({
						message: b[c],
						element: this.findByName(c)[0]
					});
					this.successList = a.grep(this.successList, function (a) {
						return !(a.name in b)
					})
				}
				this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
			},
			resetForm: function () {
				a.fn.resetForm && a(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue")
			},
			numberOfInvalids: function () {
				return this.objectLength(this.invalid)
			},
			objectLength: function (a) {
				var b = 0;
				for (var c in a) b++;
				return b
			},
			hideErrors: function () {
				this.addWrapper(this.toHide).hide()
			},
			valid: function () {
				return 0 === this.size()
			},
			size: function () {
				return this.errorList.length
			},
			focusInvalid: function () {
				if (this.settings.focusInvalid) try {
					a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
				} catch (b) {}
			},
			findLastActive: function () {
				var b = this.lastActive;
				return b && 1 === a.grep(this.errorList, function (a) {
					return a.element.name === b.name
				}).length && b
			},
			elements: function () {
				var b = this,
					c = {};
				return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
					return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0, !0)
				})
			},
			clean: function (b) {
				return a(b)[0]
			},
			errors: function () {
				var b = this.settings.errorClass.replace(" ", ".");
				return a(this.settings.errorElement + "." + b, this.errorContext);
			},
			reset: function () {
				this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), this.toHide = a([]), this.currentElements = a([])
			},
			prepareForm: function () {
				this.reset(), this.toHide = this.errors().add(this.containers)
			},
			prepareElement: function (a) {
				this.reset(), this.toHide = this.errorsFor(a)
			},
			elementValue: function (b) {
				var c = a(b).attr("type"),
					d = a(b).val();
				return "radio" === c || "checkbox" === c ? a("input[name='" + a(b).attr("name") + "']:checked").val() : "string" == typeof d ? d.replace(/\r/g, "") : d
			},
			check: function (b) {
				b = this.validationTargetFor(this.clean(b));
				var c, d = a(b).rules(),
					e = !1,
					f = this.elementValue(b);
				for (var g in d) {
					var h = {
						method: g,
						parameters: d[g]
					};
					try {
						if (c = a.validator.methods[g].call(this, f, b, h.parameters), "dependency-mismatch" === c) {
							e = !0;
							continue
						}
						if (e = !1, "pending" === c) return void(this.toHide = this.toHide.not(this.errorsFor(b)));
						if (!c) return this.formatAndAdd(b, h), !1
					} catch (i) {
						throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + h.method + "' method.", i), i
					}
				}
				return e ? void 0 : (this.objectLength(d) && this.successList.push(b), !0)
			},
			customDataMessage: function (b, c) {
				return a(b).data("msg-" + c.toLowerCase()) || b.attributes && a(b).attr("data-msg-" + c.toLowerCase())
			},
			customMessage: function (a, b) {
				var c = this.settings.messages[a];
				return c && (c.constructor === String ? c : c[b])
			},
			findDefined: function () {
				for (var a = 0; arguments.length > a; a++)
					if (void 0 !== arguments[a]) return arguments[a];
				return void 0
			},
			defaultMessage: function (b, c) {
				return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
			},
			formatAndAdd: function (b, c) {
				var d = this.defaultMessage(b, c.method),
					e = /\$?\{(\d+)\}/g;
				"function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), this.errorList.push({
					message: d,
					element: b
				}), this.errorMap[b.name] = d, this.submitted[b.name] = d
			},
			addWrapper: function (a) {
				return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a
			},
			defaultShowErrors: function () {
				var a, b;
				for (a = 0; this.errorList[a]; a++) {
					var c = this.errorList[a];
					this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), this.showLabel(c.element, c.message)
				}
				if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
					for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
				if (this.settings.unhighlight)
					for (a = 0, b = this.validElements(); b[a]; a++) this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
				this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
			},
			validElements: function () {
				return this.currentElements.not(this.invalidElements())
			},
			invalidElements: function () {
				return a(this.errorList).map(function () {
					return this.element
				})
			},
			showLabel: function (b, c) {
				var d = this.errorsFor(b);
				d.length ? (d.removeClass(this.settings.validClass).addClass(this.settings.errorClass), d.html(c)) : (d = a("<" + this.settings.errorElement + ">").attr("for", this.idOrName(b)).addClass(this.settings.errorClass).html(c || ""), this.settings.wrapper && (d = d.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.append(d).length || (this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b))), !c && this.settings.success && (d.text(""), "string" == typeof this.settings.success ? d.addClass(this.settings.success) : this.settings.success(d, b)), this.toShow = this.toShow.add(d)
			},
			errorsFor: function (b) {
				var c = this.idOrName(b);
				return this.errors().filter(function () {
					return a(this).attr("for") === c
				})
			},
			idOrName: function (a) {
				return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
			},
			validationTargetFor: function (a) {
				return this.checkable(a) && (a = this.findByName(a.name).not(this.settings.ignore)[0]), a
			},
			checkable: function (a) {
				return /radio|checkbox/i.test(a.type)
			},
			findByName: function (b) {
				return a(this.currentForm).find("[name='" + b + "']")
			},
			getLength: function (b, c) {
				switch (c.nodeName.toLowerCase()) {
					case "select":
						return a("option:selected", c).length;
					case "input":
						if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length
				}
				return b.length
			},
			depend: function (a, b) {
				return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
			},
			dependTypes: {
				"boolean": function (a) {
					return a
				},
				string: function (b, c) {
					return !!a(b, c.form).length
				},
				"function": function (a, b) {
					return a(b)
				}
			},
			optional: function (b) {
				var c = this.elementValue(b);
				return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
			},
			startRequest: function (a) {
				this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0)
			},
			stopRequest: function (b, c) {
				this.pendingRequest--, 0 > this.pendingRequest && (this.pendingRequest = 0), delete this.pending[b.name], c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
			},
			previousValue: function (b) {
				return a.data(b, "previousValue") || a.data(b, "previousValue", {
					old: null,
					valid: !0,
					message: this.defaultMessage(b, "remote")
				})
			}
		},
		classRuleSettings: {
			required: {
				required: !0
			},
			email: {
				email: !0
			},
			url: {
				url: !0
			},
			date: {
				date: !0
			},
			dateISO: {
				dateISO: !0
			},
			number: {
				number: !0
			},
			digits: {
				digits: !0
			},
			creditcard: {
				creditcard: !0
			}
		},
		addClassRules: function (b, c) {
			b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
		},
		classRules: function (b) {
			var c = {},
				d = a(b).attr("class");
			return d && a.each(d.split(" "), function () {
				this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
			}), c
		},
		attributeRules: function (b) {
			var c = {},
				d = a(b),
				e = d[0].getAttribute("type");
			for (var f in a.validator.methods) {
				var g;
				"required" === f ? (g = d.get(0).getAttribute(f), "" === g && (g = !0), g = !!g) : g = d.attr(f), /min|max/.test(f) && (null === e || /number|range|text/.test(e)) && (g = Number(g)), g ? c[f] = g : e === f && "range" !== e && (c[f] = !0)
			}
			return c.maxlength && /-1|2147483647|524288/.test(c.maxlength) && delete c.maxlength, c
		},
		dataRules: function (b) {
			var c, d, e = {},
				f = a(b);
			for (c in a.validator.methods) d = f.data("rule-" + c.toLowerCase()), void 0 !== d && (e[c] = d);
			return e
		},
		staticRules: function (b) {
			var c = {},
				d = a.data(b.form, "validator");
			return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), c
		},
		normalizeRules: function (b, c) {
			return a.each(b, function (d, e) {
				if (e === !1) return void delete b[d];
				if (e.param || e.depends) {
					var f = !0;
					switch (typeof e.depends) {
						case "string":
							f = !!a(e.depends, c.form).length;
							break;
						case "function":
							f = e.depends.call(c, c)
					}
					f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d]
				}
			}), a.each(b, function (d, e) {
				b[d] = a.isFunction(e) ? e(c) : e
			}), a.each(["minlength", "maxlength"], function () {
				b[this] && (b[this] = Number(b[this]))
			}), a.each(["rangelength", "range"], function () {
				var c;
				b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].split(/[\s,]+/), b[this] = [Number(c[0]), Number(c[1])]))
			}), a.validator.autoCreateRanges && (b.min && b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), b.minlength && b.maxlength && (b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength)), b
		},
		normalizeRule: function (b) {
			if ("string" == typeof b) {
				var c = {};
				a.each(b.split(/\s/), function () {
					c[this] = !0
				}), b = c
			}
			return b
		},
		addMethod: function (b, c, d) {
			a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], 3 > c.length && a.validator.addClassRules(b, a.validator.normalizeRule(b))
		},
		methods: {
			required: function (b, c, d) {
				if (!this.depend(d, c)) return "dependency-mismatch";
				if ("select" === c.nodeName.toLowerCase()) {
					var e = a(c).val();
					return e && e.length > 0
				}
				return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0
			},
			email: function (a, b) {
				return this.optional(b) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a)
			},
			url: function (a, b) {
				return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
			},
			date: function (a, b) {
				return this.optional(b) || !/Invalid|NaN/.test("" + new Date(a))
			},
			dateISO: function (a, b) {
				return this.optional(b) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(a)
			},
			number: function (a, b) {
				return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
			},
			digits: function (a, b) {
				return this.optional(b) || /^\d+$/.test(a)
			},
			creditcard: function (a, b) {
				if (this.optional(b)) return "dependency-mismatch";
				if (/[^0-9 \-]+/.test(a)) return !1;
				var c = 0,
					d = 0,
					e = !1;
				a = a.replace(/\D/g, "");
				for (var f = a.length - 1; f >= 0; f--) {
					var g = a.charAt(f);
					d = parseInt(g, 10), e && (d *= 2) > 9 && (d -= 9), c += d, e = !e
				}
				return 0 === c % 10
			},
			minlength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
				return this.optional(c) || e >= d
			},
			maxlength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
				return this.optional(c) || d >= e
			},
			rangelength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
				return this.optional(c) || e >= d[0] && d[1] >= e
			},
			min: function (a, b, c) {
				return this.optional(b) || a >= c
			},
			max: function (a, b, c) {
				return this.optional(b) || c >= a
			},
			range: function (a, b, c) {
				return this.optional(b) || a >= c[0] && c[1] >= a
			},
			equalTo: function (b, c, d) {
				var e = a(d);
				return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
					a(c).valid()
				}), b === e.val()
			},
			remote: function (b, c, d) {
				if (this.optional(c)) return "dependency-mismatch";
				var e = this.previousValue(c);
				if (this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), e.originalMessage = this.settings.messages[c.name].remote, this.settings.messages[c.name].remote = e.message, d = "string" == typeof d && {
						url: d
					} || d, e.old === b) return e.valid;
				e.old = b;
				var f = this;
				this.startRequest(c);
				var g = {};
				return g[c.name] = b, a.ajax(a.extend(!0, {
					url: d,
					mode: "abort",
					port: "validate" + c.name,
					dataType: "json",
					data: g,
					success: function (d) {
						f.settings.messages[c.name].remote = e.originalMessage;
						var g = d === !0 || "true" === d;
						if (g) {
							var h = f.formSubmitted;
							f.prepareElement(c), f.formSubmitted = h, f.successList.push(c), delete f.invalid[c.name], f.showErrors()
						} else {
							var i = {},
								j = d || f.defaultMessage(c, "remote");
							i[c.name] = e.message = a.isFunction(j) ? j(b) : j, f.invalid[c.name] = !0, f.showErrors(i)
						}
						e.valid = g, f.stopRequest(c, g)
					}
				}, d)), "pending"
			}
		}
	}), a.format = a.validator.format
}(jQuery),
function (a) {
	var b = {};
	if (a.ajaxPrefilter) a.ajaxPrefilter(function (a, c, d) {
		var e = a.port;
		"abort" === a.mode && (b[e] && b[e].abort(), b[e] = d)
	});
	else {
		var c = a.ajax;
		a.ajax = function (d) {
			var e = ("mode" in d ? d : a.ajaxSettings).mode,
				f = ("port" in d ? d : a.ajaxSettings).port;
			return "abort" === e ? (b[f] && b[f].abort(), b[f] = c.apply(this, arguments), b[f]) : c.apply(this, arguments)
		}
	}
}(jQuery),
function (a) {
	a.extend(a.fn, {
		validateDelegate: function (b, c, d) {
			return this.bind(c, function (c) {
				var e = a(c.target);
				return e.is(b) ? d.apply(e, arguments) : void 0
			})
		}
	})
}(jQuery),
function (a) {
	var b = {
			shadecolor: "#FFD24D",
			shadeborder: "#FF8000",
			shadeopacity: .5,
			cursor: "move",
			layerleft: null,
			layerwidth: 400,
			layerheight: 300,
			layerborder: "#DDD",
			fade: !0,
			largewidth: 1280,
			largeheight: 960
		},
		c = function (c) {
			c = a.extend({}, b, c), a(this).each(function () {
				var b = a(this),
					d = b.css("position");
				"absolute" === !d && b.css("position", "relative");
				var e, f, g, h = b.children().first(),
					i = function (d, h) {
						d && h && (e = {
							x: b.width() / d,
							y: b.height() / h
						}, f = {
							shade: {
								width: c.layerwidth * e.x - 2,
								height: c.layerheight * e.y - 2
							}
						}, f.shade.width > b.width() && (f.shade.width = b.width(), e.x = 1, l.css({
							width: d
						}), a(m).css({
							left: 0
						})), f.shade.height > b.height() && (f.shade.height = b.height(), e.y = 1, l.css({
							height: h
						}), a(m).css({
							top: 0
						})), g = {
							x: f.shade.width / 2,
							y: f.shade.height / 2
						})
					};
				i(c.largewidth, c.largeheight);
				var j = a("<div>").css({
						position: "absolute",
						left: "0px",
						top: "0px",
						"background-color": c.shadecolor,
						border: "1px solid " + c.shadeborder,
						width: f.shade.width,
						height: f.shade.height,
						opacity: c.shadeopacity,
						cursor: c.cursor
					}),
					k = {
						width: b.innerWidth() - j.outerWidth(),
						height: b.innerHeight() - j.outerHeight()
					};
				j.hide().appendTo(b);
				var l = a("<div>").css({
						position: "absolute",
						left: (c.layerleft || b.width()) + 5,
						top: 0,
						"background-color": "#111",
						overflow: "hidden",
						"z-index": 999,
						width: c.layerwidth,
						height: c.layerheight,
						border: "1px solid " + c.layerborder
					}),
					m = new Image;
				a(m).css({
					position: "absolute",
					display: "block"
				}), m.src = h.attr("href") || h.attr("src"), a(m).appendTo(l), l.hide().appendTo(b);
				var n = b.offset(),
					o = function () {
						var d = b.data("enlarging");
						if (!d) {
							b.data("enlarging", !0), n = b.offset(), j.show(), c.fade ? l.stop().fadeIn(300) : l.show();
							var e = (a(this), m.width),
								g = m.height;
							i(e, g), j.css({
								width: f.shade.width,
								height: f.shade.height
							}), k = {
								width: b.innerWidth() - j.outerWidth(),
								height: b.innerHeight() - j.outerHeight()
							}
						}
					},
					p = function () {
						b.data("enlarging", !1), j.hide(), l.hide()
					},
					q = function () {
						var b = a(window),
							c = b.width(),
							d = b.height(),
							e = l.offset();
						l.css("left");
						e.top + l.height() > d && l.css({
							bottom: "0",
							top: "auto"
						}), e.left + l.width() > c && l.css("left", -20 - l.width())
					};
				b.mousemove(function (c) {
					o(), q();
					var d = c.pageX - n.left,
						f = c.pageY - n.top;
					return 0 > d || d > b.innerWidth() ? p() : 0 > f || f > b.innerHeight() ? p() : (d -= g.x, f -= g.y, 0 > d && (d = 0), 0 > f && (f = 0), d > k.width && (d = k.width), f > k.height && (f = k.height), j.css({
						left: d,
						top: f
					}), void a(m).css({
						left: 1 == e.x ? 0 : 0 - d / e.x,
						top: 1 == e.y ? 0 : 0 - f / e.y
					}))
				}).mouseenter(o).mouseleave(p)
			})
		};
	a.fn.extend({
		enlarge: c
	})
}(jQuery),
function (a) {
	a.fn.powerFloat = function (d) {
		return a(this).each(function () {
			var e, f = a.extend({}, c, d || {}),
				g = function (a, c) {
					b.target && "none" !== b.target.css("display") && b.targetHide(), b.s = a, b.trigger = c
				};
			switch (f.eventType) {
				case "hover":
					a(this).hover(function () {
						b.timerHold && (b.flagDisplay = !0);
						var c = parseInt(f.showDelay, 10);
						g(f, a(this)), c ? (e && clearTimeout(e), e = setTimeout(function () {
							b.targetGet.call(b)
						}, c)) : b.targetGet()
					}, function () {
						e && clearTimeout(e), b.timerHold && clearTimeout(b.timerHold), b.flagDisplay = !1, b.targetHold()
					}), f.hoverFollow && a(this).mousemove(function (a) {
						return b.cacheData.left = a.pageX, b.cacheData.top = a.pageY, b.targetGet.call(b), !1
					});
					break;
				case "click":
					a(this).click(function (c) {
						b.display && b.trigger && c.target === b.trigger.get(0) ? (b.flagDisplay = !1, b.displayDetect(), a(document).data("mouseupBind", !1)) : (g(f, a(this)), b.targetGet(), a(document).data("mouseupBind") || a(document).bind("mouseup", function (c) {
							var d = !1;
							if (b.trigger) {
								var e = b.target.attr("id");
								e || (e = "R_" + Math.random(), b.target.attr("id", e)), a(c.target).parents().each(function () {
									a(this).attr("id") === e && (d = !0)
								}), "click" === f.eventType && b.display && c.target != b.trigger.get(0) && !d && (b.flagDisplay = !1, b.displayDetect())
							}
							return !1
						}).data("mouseupBind", !0))
					});
					break;
				case "focus":
					a(this).focus(function () {
						var c = a(this);
						setTimeout(function () {
							g(f, c), b.targetGet()
						}, 200)
					}).blur(function () {
						b.flagDisplay = !1, setTimeout(function () {
							b.displayDetect()
						}, 190)
					});
					break;
				default:
					g(f, a(this)), b.targetGet(), a(document).unbind("mouseup").data("mouseupBind", !1)
			}
		})
	}, powerFloatDis = b;
	var b = {
		targetGet: function () {
			if (!this.trigger) return this;
			var c = this.trigger.attr(this.s.targetAttr),
				d = "function" == typeof this.s.target ? this.s.target.call(this.trigger) : this.s.target;
			switch (this.s.targetMode) {
				case "common":
					if (d) {
						var e = typeof d;
						"object" === e ? d.size() && (b.target = d.eq(0)) : "string" === e && a(d).size() && (b.target = a(d).eq(0))
					} else c && a("#" + c).size() && (b.target = a("#" + c));
					if (!b.target) return this;
					b.targetShow();
					break;
				case "ajax":
					var f = d || c;
					if (this.targetProtect = !1, !f) return;
					b.cacheData[f] || b.loading();
					var g = new Image;
					g.onload = function () {
						var c = g.width,
							d = g.height,
							e = a(window).width(),
							h = a(window).height(),
							i = c / d,
							j = e / h;
						i > j ? c > e / 2 && (c = e / 2, d = c / i) : d > h / 2 && (d = h / 2, c = d * i);
						var k = '<img class="float_ajax_image" src="' + f + '" width="' + c + '" height = "' + d + '" />';
						b.cacheData[f] = !0, b.target = a(k), b.targetShow()
					}, g.onerror = function () {
						/(\.jpg|\.png|\.gif|\.bmp|\.jpeg)$/i.test(f) ? (b.target = a('<div class="float_ajax_error">图片加载失败。</div>'), b.targetShow()) : a.ajax({
							url: f,
							success: function (c) {
								"string" == typeof c && (b.cacheData[f] = !0, b.target = a('<div class="float_ajax_data">' + c + "</div>"), b.targetShow())
							},
							error: function () {
								b.target = a('<div class="float_ajax_error">数据没有加载成功。</div>'), b.targetShow()
							}
						})
					}, g.src = f;
					break;
				case "list":
					var h, i = '<ul class="float_list_ul">';
					a.isArray(d) && (h = d.length) ? a.each(d, function (a, b) {
						var c, d, e = "",
							f = "";
						0 === a && (f = ' class="float_list_li_first"'), a === h - 1 && (f = ' class="float_list_li_last"'), "object" == typeof b && (c = b.text.toString()) ? e = (d = b.href || "javascript:") ? '<a href="' + d + '" class="float_list_a">' + c + "</a>" : c : "string" == typeof b && b && (e = b), e && (i += "<li" + f + ">" + e + "</li>")
					}) : i += '<li class="float_list_null">列表无数据。</li>', i += "</ul>", b.target = a(i), this.targetProtect = !1, b.targetShow();
					break;
				case "remind":
					var j = d || c;
					this.targetProtect = !1, "string" == typeof j && (b.target = a("<span>" + j + "</span>"), b.targetShow());
					break;
				default:
					var k = d || c,
						e = typeof k;
					k && ("string" === e ? (/^.[^:#\[\.,]*$/.test(k) ? a(k).size() ? (b.target = a(k).eq(0), this.targetProtect = !0) : a("#" + k).size() ? (b.target = a("#" + k).eq(0), this.targetProtect = !0) : (b.target = a("<div>" + k + "</div>"), this.targetProtect = !1) : (b.target = a("<div>" + k + "</div>"), this.targetProtect = !1), b.targetShow()) : "object" === e && !a.isArray(k) && k.size() && (b.target = k.eq(0), this.targetProtect = !0, b.targetShow()))
			}
			return this
		},
		container: function () {
			var c = this.s.container,
				d = this.s.targetMode || "mode";
			return "ajax" === d || "remind" === d ? this.s.sharpAngle = !0 : this.s.sharpAngle = !1, this.s.reverseSharp && (this.s.sharpAngle = !this.s.sharpAngle), "common" !== d && (null === c && (c = "plugin"), "plugin" === c && (a("#floatBox_" + d).size() || a('<div id="floatBox_' + d + '" class="float_' + d + '_box"></div>').appendTo(a("body")).hide(), c = a("#floatBox_" + d)), c && "string" != typeof c && c.size() && (this.targetProtect && b.target.show().css("position", "static"), b.target = c.empty().append(b.target))), this
		},
		setWidth: function () {
			var a = this.s.width;
			return "auto" === a ? this.target.get(0).style.width && this.target.css("width", "auto") : "inherit" === a ? this.target.width(this.trigger.width()) : this.target.css("width", a), this
		},
		position: function () {
			if (!this.trigger || !this.target) return this;
			var c, d, e, f, g, h, i, j = 0,
				k = 0,
				l = 0,
				m = 0,
				n = this.target.data("height"),
				o = this.target.data("width"),
				p = a(window).scrollTop(),
				q = parseInt(this.s.offsets.x, 10) || 0,
				r = parseInt(this.s.offsets.y, 10) || 0,
				s = this.cacheData;
			n || (n = this.target.outerHeight(), this.s.hoverFollow && this.target.data("height", n)), o || (o = this.target.outerWidth(), this.s.hoverFollow && this.target.data("width", o)), c = this.trigger.offset(), j = this.trigger.outerHeight(), k = this.trigger.outerWidth(), d = c.left, e = c.top;
			var t = function () {
					0 > d ? d = 0 : d + j > a(window).width() && (d = a(window).width() - k)
				},
				u = function () {
					0 > e ? e = 0 : e + j > a(document).height() && (e = a(document).height() - j)
				};
			this.s.hoverFollow && s.left && s.top && ("x" === this.s.hoverFollow ? (d = s.left, t()) : "y" === this.s.hoverFollow ? (e = s.top, u()) : (d = s.left, e = s.top, t(), u()));
			var v, w = ["4-1", "1-4", "5-7", "2-3", "2-1", "6-8", "3-4", "4-3", "8-6", "1-2", "7-5", "3-2"],
				x = this.s.position,
				y = !1;
			a.each(w, function (a, b) {
				return b === x ? void(y = !0) : void 0
			}), y || (x = "4-1");
			var z = function (a) {
					var b = "bottom";
					switch (a) {
						case "1-4":
						case "5-7":
						case "2-3":
							b = "top";
							break;
						case "2-1":
						case "6-8":
						case "3-4":
							b = "right";
							break;
						case "1-2":
						case "8-6":
						case "4-3":
							b = "left";
							break;
						case "4-1":
						case "7-5":
						case "3-2":
							b = "bottom"
					}
					return b
				},
				A = function (a) {
					return "5-7" === a || "6-8" === a || "8-6" === a || "7-5" === a ? !0 : !1
				},
				B = function (c) {
					var f = 0,
						g = 0,
						h = b.s.sharpAngle && b.corner ? !0 : !1;
					if ("right" === c) {
						if (g = d + k + o + q, h && (g += b.corner.width()), g > a(window).width()) return !1
					} else if ("bottom" === c) {
						if (f = e + j + n + r, h && (f += b.corner.height()), f > p + a(window).height()) return !1
					} else if ("top" === c) {
						if (f = n + r, h && (f += b.corner.height()), f > e - p) return !1
					} else if ("left" === c && (g = o + q, h && (g += b.corner.width()), g > d)) return !1;
					return !0
				};
			v = z(x), this.s.sharpAngle && this.createSharp(v), this.s.edgeAdjust && (B(v) ? ! function () {
				if (!A(x)) {
					var a, b = {
							top: {
								right: "2-3",
								left: "1-4"
							},
							right: {
								top: "2-1",
								bottom: "3-4"
							},
							bottom: {
								right: "3-2",
								left: "4-1"
							},
							left: {
								top: "1-2",
								bottom: "4-3"
							}
						},
						c = b[v];
					if (c)
						for (a in c) B(a) || (x = c[a])
				}
			}() : ! function () {
				if (A(x)) {
					var a = {
						"5-7": "7-5",
						"7-5": "5-7",
						"6-8": "8-6",
						"8-6": "6-8"
					};
					x = a[x]
				} else {
					var b = {
							top: {
								left: "3-2",
								right: "4-1"
							},
							right: {
								bottom: "1-2",
								top: "4-3"
							},
							bottom: {
								left: "2-3",
								right: "1-4"
							},
							left: {
								bottom: "2-1",
								top: "3-4"
							}
						},
						c = b[v],
						d = [];
					for (name in c) d.push(name);
					x = B(d[0]) || !B(d[1]) ? c[d[0]] : c[d[1]]
				}
			}());
			var C = z(x),
				D = x.split("-")[0];
			if (this.s.sharpAngle && (this.createSharp(C), l = this.corner.width(), m = this.corner.height()), this.s.hoverFollow) "x" === this.s.hoverFollow ? (f = d + q, f = "1" === D || "8" === D || "4" === D ? d - (o - k) / 2 + q : d - (o - k) + q, "1" === D || "5" === D || "2" === D ? (g = e - r - n - m, i = e - m - r - 1) : (g = e + j + r + m, i = e + j + r + 1), h = c.left - (l - k) / 2) : "y" === this.s.hoverFollow ? (g = "1" === D || "5" === D || "2" === D ? e - (n - j) / 2 + r : e - (n - j) + r, "1" === D || "8" === D || "4" === D ? (f = d - o - q - l, h = d - l - q - 1) : (f = d + k - q + l, h = d + k + q + 1), i = c.top - (m - j) / 2) : (f = d + q, g = e + r);
			else switch (C) {
				case "top":
					g = e - r - n - m, f = "1" == D ? d - q : "5" === D ? d - (o - k) / 2 - q : d - (o - k) - q, i = e - m - r - 1, h = d - (l - k) / 2;
					break;
				case "right":
					f = d + k + q + l, g = "2" == D ? e + r : "6" === D ? e - (n - j) / 2 + r : e - (n - j) + r, h = d + k + q + 1, i = e - (m - j) / 2;
					break;
				case "bottom":
					g = e + j + r + m, f = "4" == D ? d + q : "7" === D ? d - (o - k) / 2 + q : d - (o - k) + q, i = e + j + r + 1, h = d - (l - k) / 2;
					break;
				case "left":
					f = d - o - q - l, g = "2" == D ? e - r : "6" === D ? e - (o - k) / 2 - r : e - (n - j) - r, h = f + l, i = e - (o - l) / 2
			}
			return m && l && this.corner && this.corner.css({
				left: h,
				top: i,
				zIndex: this.s.zIndex + 1
			}), this.target.css({
				position: "absolute",
				left: f,
				top: g,
				zIndex: this.s.zIndex
			}), this
		},
		createSharp: function (b) {
			var c, d, e = "",
				f = "",
				g = {
					left: "right",
					right: "left",
					bottom: "top",
					top: "bottom"
				},
				h = g[b] || "top";
			this.target && (c = this.target.css("background-color"), parseInt(this.target.css("border-" + h + "-width")) > 0 && (d = this.target.css("border-" + h + "-color")), e = d && "transparent" !== d ? 'style="color:' + d + ';"' : 'style="display:none;"', f = c && "transparent" !== c ? 'style="color:' + c + ';"' : 'style="display:none;"');
			var i = '<div id="floatCorner_' + b + '" class="float_corner float_corner_' + b + '"><span class="corner corner_1" ' + e + '>◆</span><span class="corner corner_2" ' + f + ">◆</span></div>";
			return a("#floatCorner_" + b).size() || a("body").append(a(i)), this.corner = a("#floatCorner_" + b), this
		},
		targetHold: function () {
			if (this.s.hoverHold) {
				var a = parseInt(this.s.hideDelay, 10) || 200;
				this.target && this.target.hover(function () {
					b.flagDisplay = !0
				}, function () {
					b.timerHold && clearTimeout(b.timerHold), b.flagDisplay = !1, b.targetHold()
				}), b.timerHold = setTimeout(function () {
					b.displayDetect.call(b)
				}, a)
			} else this.displayDetect();
			return this
		},
		loading: function () {
			return this.target = a('<div class="float_loading"></div>'), this.targetShow(), this.target.removeData("width").removeData("height"), this
		},
		displayDetect: function () {
			return !this.flagDisplay && this.display && (this.targetHide(), this.timerHold = null), this
		},
		targetShow: function () {
			return b.cornerClear(), this.display = !0, this.container().setWidth().position(), this.target.show(), a.isFunction(this.s.showCall) && this.s.showCall.call(this.trigger, this.target), this
		},
		targetHide: function () {
			return this.display = !1, this.targetClear(), this.cornerClear(), a.isFunction(this.s.hideCall) && this.s.hideCall.call(this.trigger), this.target = null, this.trigger = null, this.s = {}, this.targetProtect = !1, this
		},
		targetClear: function () {
			this.target && (this.target.data("width") && this.target.removeData("width").removeData("height"), this.targetProtect && this.target.children().hide().appendTo(a("body")), this.target.unbind().hide())
		},
		cornerClear: function () {
			this.corner && this.corner.remove()
		},
		target: null,
		trigger: null,
		s: {},
		cacheData: {},
		targetProtect: !1
	};
	a.powerFloat = {}, a.powerFloat.hide = function () {
		b.targetHide()
	};
	var c = {
		width: "auto",
		offsets: {
			x: 0,
			y: 0
		},
		zIndex: 999,
		eventType: "hover",
		showDelay: 0,
		hideDelay: 0,
		hoverHold: !0,
		hoverFollow: !1,
		targetMode: "common",
		target: null,
		targetAttr: "rel",
		container: null,
		reverseSharp: !1,
		position: "4-1",
		edgeAdjust: !0,
		showCall: a.noop,
		hideCall: a.noop
	}
}(jQuery),
function (a, b) {
	"use strict";
	var c = "function" == typeof moment,
		d = !!a.addEventListener,
		e = a.document,
		f = a.setTimeout,
		g = function (a, b, c, e) {
			d ? a.addEventListener(b, c, !!e) : a.attachEvent("on" + b, c)
		},
		h = function (a, b, c, e) {
			d ? a.removeEventListener(b, c, !!e) : a.detachEvent("on" + b, c)
		},
		i = function (a, b, c) {
			var d;
			e.createEvent ? (d = e.createEvent("HTMLEvents"), d.initEvent(b, !0, !1), d = u(d, c), a.dispatchEvent(d)) : e.createEventObject && (d = e.createEventObject(), d = u(d, c), a.fireEvent("on" + b, d))
		},
		j = function (a) {
			return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "")
		},
		k = function (a, b) {
			return -1 !== (" " + a.className + " ").indexOf(" " + b + " ")
		},
		l = function (a, b) {
			k(a, b) || (a.className = "" === a.className ? b : a.className + " " + b)
		},
		m = function (a, b) {
			a.className = j((" " + a.className + " ").replace(" " + b + " ", " "))
		},
		n = function (a) {
			return /Array/.test(Object.prototype.toString.call(a))
		},
		o = function (a) {
			return /Date/.test(Object.prototype.toString.call(a)) && !isNaN(a.getTime())
		},
		p = function (a) {
			return new Date(Date.parse(a.replace(/\.|\-/g, "/")))
		},
		q = function (a) {
			return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
		},
		r = function (a, b) {
			return [31, q(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
		},
		s = function (a) {
			o(a) && a.setHours(0, 0, 0, 0)
		},
		t = function (a, b) {
			return a.getTime() === b.getTime()
		},
		u = function (a, c, d) {
			var e, f;
			for (e in c) f = a[e] !== b, f && "object" == typeof c[e] && c[e].nodeName === b ? o(c[e]) ? d && (a[e] = new Date(c[e].getTime())) : n(c[e]) ? d && (a[e] = c[e].slice(0)) : a[e] = u({}, c[e], d) : (d || !f) && (a[e] = c[e]);
			return a
		},
		v = {
			field: null,
			bound: b,
			format: "YYYY-MM-DD",
			defaultDate: null,
			setDefaultDate: !1,
			firstDay: 0,
			minDate: null,
			maxDate: null,
			yearRange: 10,
			minYear: 1990,
			maxYear: 2099,
			minMonth: b,
			maxMonth: b,
			isRTL: !1,
			yearSuffix: "年",
			showMonthAfterYear: !0,
			numberOfMonths: 1,
			i18n: {
				months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
				monthsShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
				weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
				weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"]
			},
			onSelect: null,
			onOpen: null,
			onClose: null,
			onDraw: null
		},
		w = function (a, b, c) {
			for (b += a.firstDay; b >= 7;) b -= 7;
			return c ? a.i18n.weekdaysShort[b] : a.i18n.weekdays[b]
		},
		x = function (a, b, c, d, e) {
			if (e) return '<td class="is-empty"></td>';
			var f = [];
			return d && f.push("is-disabled"), c && f.push("is-today"), b && f.push("is-selected"), '<td data-day="' + a + '" class="' + f.join(" ") + '"><a class="pika-button" href="javascript:void(0);">' + a + "</a></td>"
		},
		y = function (a, b) {
			return "<tr>" + (b ? a.reverse() : a).join("") + "</tr>"
		},
		z = function (a) {
			return "<tbody>" + a.join("") + "</tbody>"
		},
		A = function (a) {
			var b, c = [];
			for (b = 0; 7 > b; b++) c.push('<th scope="col"><abbr title="' + w(a, b) + '">' + w(a, b, !0) + "</abbr></th>");
			return "<thead>" + (a.isRTL ? c.reverse() : c).join("") + "</thead>"
		},
		B = function (a) {
			var b, c, d, e, f, g = a._o,
				h = a._m,
				i = a._y,
				j = i === g.minYear,
				k = i === g.maxYear,
				l = '<div class="pika-title">',
				m = !0,
				o = !0;
			for (l += '<a class="pika-prev' + (m ? "" : " is-disabled") + '" href="javascript:void(0);"><</a>', d = [], b = 0; 12 > b; b++) d.push('<option value="' + b + '"' + (b === h ? " selected" : "") + (j && b < g.minMonth || k && b > g.maxMonth ? "disabled" : "") + ">" + g.i18n.months[b] + "</option>");
			for (e = '<div class="pika-label pika-label-month">' + g.i18n.months[h] + '<select class="pika-select pika-select-month">' + d.join("") + "</select></div>", n(g.yearRange) ? (b = g.yearRange[0], c = g.yearRange[1] + 1) : (b = i - g.yearRange, c = 1 + i + g.yearRange), d = []; c > b && b <= g.maxYear; b++) b >= g.minYear && d.push('<option value="' + b + '"' + (b === i ? " selected" : "") + ">" + b + "</option>");
			return f = '<div class="pika-label pika-label-year">' + i + g.yearSuffix + '<select class="pika-select pika-select-year">' + d.join("") + "</select></div>", l += g.showMonthAfterYear ? f + e : e + f, j && (0 === h || g.minMonth >= h) && (m = !1), k && (11 === h || g.maxMonth <= h) && (o = !1), l += '<a class="pika-next' + (o ? "" : " is-disabled") + '" href="javascript:void(0);">></a>', l += "</div>"
		},
		C = function (a, b) {
			return '<table cellpadding="0" cellspacing="0" class="pika-table">' + A(a) + z(b) + "</table>"
		},
		D = function (b) {
			var h = this,
				i = h.config(b);
			h._onMouseDown = function (b) {
				if (h._v) {
					b = b || a.event;
					var c = b.target || b.srcElement;
					if (c) {
						if (!k(c, "is-disabled")) {
							if (k(c, "pika-button") && !k(c, "is-empty")) return h.setDate(new Date(h._y, h._m, parseInt(c.innerHTML, 10))), void(i.bound && f(function () {
								h.hide()
							}, 100));
							k(c, "pika-prev") ? h.prevMonth() : k(c, "pika-next") && h.nextMonth()
						}
						if (h._c = !0, !k(c, "pika-select")) {
							if (!b.preventDefault) return b.returnValue = !1, b.cancelBubble = !0, !1;
							b.preventDefault(), b.stopPropagation()
						}
					}
				}
			}, h._onChange = function (b) {
				b = b || a.event;
				var c = b.target || b.srcElement;
				c && (k(c, "pika-select-month") ? h.gotoMonth(c.value) : k(c, "pika-select-year") && h.gotoYear(c.value))
			}, h._onInputChange = function (a) {
				var b;
				a.firedBy !== h && (c ? (b = moment(i.field.value, i.format), b = b && b.isValid() ? b.toDate() : null) : b = p(i.field.value), h.setDate(o(b) ? b : null), h._v || h.show())
			}, h._onInputFocus = function () {
				h.show()
			}, h._onInputClick = function () {
				h.show()
			}, h._onInputBlur = function () {
				h._c || (h._b = f(function () {
					h.hide()
				}, 50)), h._c = !1
			}, h._onClick = function (b) {
				b = b || a.event;
				var c = b.target || b.srcElement,
					e = c;
				if (c) {
					!d && k(c, "pika-select") && (c.onchange || (c.setAttribute("onchange", "return;"), g(c, "change", h._onChange)));
					do
						if (k(e, "pika-single")) return;
					while (e = e.parentNode);
					h._v && c !== i.trigger && h.hide()
				}
			}, h.el = e.createElement("div"), h.el.className = "pika-single" + (i.isRTL ? " is-rtl" : ""), g(h.el, "mousedown", h._onMouseDown, !0), g(h.el, "change", h._onChange), i.field && (i.bound ? e.body.appendChild(h.el) : i.field.parentNode.insertBefore(h.el, i.field.nextSibling), g(i.field, "change", h._onInputChange), i.defaultDate || (c && i.field.value ? i.defaultDate = moment(i.field.value, i.format).toDate() : i.defaultDate = p(i.field.value), i.setDefaultDate = !0));
			var j = i.defaultDate;
			o(j) ? i.setDefaultDate ? h.setDate(j, !0) : h.gotoDate(j) : h.gotoDate(new Date), i.bound ? (this.hide(), h.el.className += " is-bound", g(i.trigger, "click", h._onInputClick), g(i.trigger, "focus", h._onInputFocus), g(i.trigger, "blur", h._onInputBlur)) : this.show()
		};
	D.prototype = {
		config: function (a) {
			this._o || (this._o = u({}, v, !0));
			var c = u(this._o, a, !0);
			c.isRTL = !!c.isRTL, c.field = c.field && c.field.nodeName ? c.field : null, c.bound = !!(c.bound !== b ? c.field && c.bound : c.field), c.trigger = c.trigger && c.trigger.nodeName ? c.trigger : c.field;
			var d = parseInt(c.numberOfMonths, 10) || 1;
			if (c.numberOfMonths = d > 4 ? 4 : d, o(c.minDate) || (c.minDate = !1), o(c.maxDate) || (c.maxDate = !1), c.minDate && c.maxDate && c.maxDate < c.minDate && (c.maxDate = c.minDate = !1), c.minDate && (s(c.minDate), c.minYear = c.minDate.getFullYear(), c.minMonth = c.minDate.getMonth()), c.maxDate && (s(c.maxDate), c.maxYear = c.maxDate.getFullYear(), c.maxMonth = c.maxDate.getMonth()), n(c.yearRange)) {
				var e = (new Date).getFullYear() - 10;
				c.yearRange[0] = parseInt(c.yearRange[0], 10) || e, c.yearRange[1] = parseInt(c.yearRange[1], 10) || e
			} else c.yearRange = Math.abs(parseInt(c.yearRange, 10)) || v.yearRange, c.yearRange > 100 && (c.yearRange = 100);
			return c
		},
		toString: function (a) {
			if (!o(this._d)) return "";
			var b = this._d.getFullYear(),
				d = this._d.getMonth() + 1,
				e = this._d.getDate();
			return d = 10 > d ? "0" + d : d, e = 10 > e ? "0" + e : e, o(this._d) ? c ? moment(this._d).format(a || this._o.format) : b + "-" + d + "-" + e : ""
		},
		getMoment: function () {
			return c ? moment(this._d) : null
		},
		setMoment: function (a) {
			c && moment.isMoment(a) && this.setDate(a.toDate());
		},
		getDate: function () {
			return o(this._d) ? new Date(this._d.getTime()) : null
		},
		setDate: function (a, b) {
			if (!a) return this._d = null, this.draw();
			if ("string" == typeof a && (a = p(a)), o(a)) {
				var c = this._o.minDate,
					d = this._o.maxDate;
				o(c) && c > a ? a = c : o(d) && a > d && (a = d), this._d = new Date(a.getTime()), s(this._d), this.gotoDate(this._d), this._o.field && (this._o.field.value = this.toString(), i(this._o.field, "change", {
					firedBy: this
				})), b || "function" != typeof this._o.onSelect || this._o.onSelect.call(this, this.getDate())
			}
		},
		gotoDate: function (a) {
			o(a) && (this._y = a.getFullYear(), this._m = a.getMonth(), this.draw())
		},
		gotoToday: function () {
			this.gotoDate(new Date)
		},
		gotoMonth: function (a) {
			isNaN(a = parseInt(a, 10)) || (this._m = 0 > a ? 0 : a > 11 ? 11 : a, this.draw())
		},
		nextMonth: function () {
			++this._m > 11 && (this._m = 0, this._y++), this.draw()
		},
		prevMonth: function () {
			--this._m < 0 && (this._m = 11, this._y--), this.draw()
		},
		gotoYear: function (a) {
			isNaN(a) || (this._y = parseInt(a, 10), this.draw())
		},
		setMinDate: function (a) {
			this._o.minDate = a
		},
		setMaxDate: function (a) {
			this._o.maxDate = a
		},
		draw: function (a) {
			if (this._v || a) {
				var b = this._o,
					c = b.minYear,
					d = b.maxYear,
					e = b.minMonth,
					g = b.maxMonth;
				if (this._y <= c && (this._y = c, !isNaN(e) && this._m < e && (this._m = e)), this._y >= d && (this._y = d, !isNaN(g) && this._m > g && (this._m = g)), this.el.innerHTML = B(this) + this.render(this._y, this._m), b.bound && (this.adjustPosition(), "hidden" !== b.field.type && f(function () {
						b.trigger.focus()
					}, 1)), "function" == typeof this._o.onDraw) {
					var h = this;
					f(function () {
						h._o.onDraw.call(h)
					}, 0)
				}
			}
		},
		adjustPosition: function () {
			var b, c, d, f = this._o.trigger,
				g = f,
				h = this.el.offsetWidth,
				i = this.el.offsetHeight,
				j = a.innerWidth || e.documentElement.clientWidth,
				k = a.innerHeight || e.documentElement.clientHeight,
				n = a.pageYOffset || e.body.scrollTop || e.documentElement.scrollTop;
			if (l(this.el, "is-hidden"), "function" == typeof f.getBoundingClientRect) d = f.getBoundingClientRect(), b = d.left + a.pageXOffset, c = d.bottom + a.pageYOffset;
			else
				for (b = g.offsetLeft, c = g.offsetTop + g.offsetHeight; g = g.offsetParent;) b += g.offsetLeft, c += g.offsetTop;
			m(this.el, "is-hidden"), b + h > j && (b = b - h + f.offsetWidth), c + i > k + n && (c = c - i - f.offsetHeight), this.el.style.cssText = "position:absolute;left:" + b + "px;top:" + c + "px;"
		},
		render: function (a, b) {
			var c = this._o,
				d = new Date,
				e = r(a, b),
				f = new Date(a, b, 1).getDay(),
				g = [],
				h = [];
			s(d), c.firstDay > 0 && (f -= c.firstDay, 0 > f && (f += 7));
			for (var i = e + f, j = i; j > 7;) j -= 7;
			i += 7 - j;
			for (var k = 0, l = 0; i > k; k++) {
				var m = new Date(a, b, 1 + (k - f)),
					n = c.minDate && m < c.minDate || c.maxDate && m > c.maxDate,
					p = o(this._d) ? t(m, this._d) : !1,
					q = t(m, d),
					u = f > k || k >= e + f;
				h.push(x(1 + (k - f), p, q, n, u)), 7 === ++l && (g.push(y(h, c.isRTL)), h = [], l = 0)
			}
			return C(c, g)
		},
		isVisible: function () {
			return this._v
		},
		show: function () {
			this._v || (this._o.bound && g(e, "click", this._onClick), m(this.el, "is-hidden"), this._v = !0, this.draw(), "function" == typeof this._o.onOpen && this._o.onOpen.call(this))
		},
		hide: function () {
			var a = this._v;
			a !== !1 && (this._o.bound && h(e, "click", this._onClick), this.el.style.cssText = "", l(this.el, "is-hidden"), this._v = !1, a !== b && "function" == typeof this._o.onClose && this._o.onClose.call(this))
		},
		destroy: function () {
			this.hide(), h(this.el, "mousedown", this._onMouseDown, !0), h(this.el, "change", this._onChange), this._o.field && (h(this._o.field, "change", this._onInputChange), this._o.bound && (h(this._o.trigger, "click", this._onInputClick), h(this._o.trigger, "focus", this._onInputFocus), h(this._o.trigger, "blur", this._onInputBlur))), this.el.parentNode && this.el.parentNode.removeChild(this.el)
		}
	}, a.Pikaday = D
}(window),
function (a, b) {
	a.define && "function" == typeof define ? define(function (c) {
		b($, a.Pikaday)
	}) : b(a.jQuery, a.Pikaday)
}(this, function (a, b) {
	a && (a.fn.datepicker = a.fn.pikaday = function () {
		var c = arguments;
		return c && c.length || (c = [{}]), this.each(function () {
			var d = a(this),
				e = d.data("pikaday");
			if (e instanceof b) "string" == typeof c[0] && "function" == typeof e[c[0]] && e[c[0]].apply(e, Array.prototype.slice.call(c, 1));
			else if ("object" == typeof c[0]) {
				var f = a.extend({}, c[0]);
				f.field = d[0], d.data("pikaday", new b(f))
			}
		})
	})
}),
function (q) {
	var I, J, K, L, M, N, v, s = {},
		w = {},
		x = {},
		O = {
			treeId: "",
			treeObj: null,
			view: {
				addDiyDom: null,
				autoCancelSelected: !0,
				dblClickExpand: !0,
				expandSpeed: "fast",
				fontCss: {},
				nameIsHTML: !1,
				selectedMulti: !0,
				showIcon: !0,
				showLine: !0,
				showTitle: !0,
				txtSelectedEnable: !1
			},
			data: {
				key: {
					children: "children",
					name: "name",
					title: "",
					url: "url",
					icon: "icon"
				},
				simpleData: {
					enable: !1,
					idKey: "id",
					pIdKey: "pId",
					rootPId: null
				},
				keep: {
					parent: !1,
					leaf: !1
				}
			},
			async: {
				enable: !1,
				contentType: "application/x-www-form-urlencoded",
				type: "post",
				dataType: "text",
				url: "",
				autoParam: [],
				otherParam: [],
				dataFilter: null
			},
			callback: {
				beforeAsync: null,
				beforeClick: null,
				beforeDblClick: null,
				beforeRightClick: null,
				beforeMouseDown: null,
				beforeMouseUp: null,
				beforeExpand: null,
				beforeCollapse: null,
				beforeRemove: null,
				onAsyncError: null,
				onAsyncSuccess: null,
				onNodeCreated: null,
				onClick: null,
				onDblClick: null,
				onRightClick: null,
				onMouseDown: null,
				onMouseUp: null,
				onExpand: null,
				onCollapse: null,
				onRemove: null
			}
		},
		y = [function (a) {
			var b = a.treeObj,
				c = f.event;
			b.bind(c.NODECREATED, function (b, c, d) {
				j.apply(a.callback.onNodeCreated, [b, c, d])
			}), b.bind(c.CLICK, function (b, c, d, e, f) {
				j.apply(a.callback.onClick, [c, d, e, f])
			}), b.bind(c.EXPAND, function (b, c, d) {
				j.apply(a.callback.onExpand, [b, c, d])
			}), b.bind(c.COLLAPSE, function (b, c, d) {
				j.apply(a.callback.onCollapse, [b, c, d])
			}), b.bind(c.ASYNC_SUCCESS, function (b, c, d, e) {
				j.apply(a.callback.onAsyncSuccess, [b, c, d, e])
			}), b.bind(c.ASYNC_ERROR, function (b, c, d, e, f, g) {
				j.apply(a.callback.onAsyncError, [b, c, d, e, f, g])
			}), b.bind(c.REMOVE, function (b, c, d) {
				j.apply(a.callback.onRemove, [b, c, d])
			}), b.bind(c.SELECTED, function (b, c, d) {
				j.apply(a.callback.onSelected, [c, d])
			}), b.bind(c.UNSELECTED, function (b, c, d) {
				j.apply(a.callback.onUnSelected, [c, d])
			})
		}],
		z = [function (a) {
			var b = f.event;
			a.treeObj.unbind(b.NODECREATED).unbind(b.CLICK).unbind(b.EXPAND).unbind(b.COLLAPSE).unbind(b.ASYNC_SUCCESS).unbind(b.ASYNC_ERROR).unbind(b.REMOVE).unbind(b.SELECTED).unbind(b.UNSELECTED)
		}],
		A = [function (a) {
			var b = h.getCache(a);
			b || (b = {}, h.setCache(a, b)), b.nodes = [], b.doms = []
		}],
		B = [function (a, b, c, d, e, f) {
			if (c) {
				var g = h.getRoot(a),
					i = a.data.key.children;
				c.level = b, c.tId = a.treeId + "_" + ++g.zId, c.parentTId = d ? d.tId : null, c.open = "string" == typeof c.open ? j.eqs(c.open, "true") : !!c.open, c[i] && c[i].length > 0 ? (c.isParent = !0, c.zAsync = !0) : (c.isParent = "string" == typeof c.isParent ? j.eqs(c.isParent, "true") : !!c.isParent, c.open = c.isParent && !a.async.enable ? c.open : !1, c.zAsync = !c.isParent), c.isFirstNode = e, c.isLastNode = f, c.getParentNode = function () {
					return h.getNodeCache(a, c.parentTId)
				}, c.getPreNode = function () {
					return h.getPreNode(a, c)
				}, c.getNextNode = function () {
					return h.getNextNode(a, c)
				}, c.getIndex = function () {
					return h.getNodeIndex(a, c)
				}, c.getPath = function () {
					return h.getNodePath(a, c)
				}, c.isAjaxing = !1, h.fixPIdKeyValue(a, c)
			}
		}],
		u = [function (a) {
			var b = a.target,
				c = h.getSetting(a.data.treeId),
				d = "",
				e = null,
				g = "",
				i = "",
				k = null,
				l = null,
				m = null;
			if (j.eqs(a.type, "mousedown") ? i = "mousedown" : j.eqs(a.type, "mouseup") ? i = "mouseup" : j.eqs(a.type, "contextmenu") ? i = "contextmenu" : j.eqs(a.type, "click") ? j.eqs(b.tagName, "span") && null !== b.getAttribute("treeNode" + f.id.SWITCH) ? (d = j.getNodeMainDom(b).id, g = "switchNode") : (m = j.getMDom(c, b, [{
					tagName: "a",
					attrName: "treeNode" + f.id.A
				}])) && (d = j.getNodeMainDom(m).id, g = "clickNode") : j.eqs(a.type, "dblclick") && (i = "dblclick", m = j.getMDom(c, b, [{
					tagName: "a",
					attrName: "treeNode" + f.id.A
				}])) && (d = j.getNodeMainDom(m).id, g = "switchNode"), i.length > 0 && 0 == d.length && (m = j.getMDom(c, b, [{
					tagName: "a",
					attrName: "treeNode" + f.id.A
				}])) && (d = j.getNodeMainDom(m).id), d.length > 0) switch (e = h.getNodeCache(c, d), g) {
				case "switchNode":
					e.isParent && (j.eqs(a.type, "click") || j.eqs(a.type, "dblclick") && j.apply(c.view.dblClickExpand, [c.treeId, e], c.view.dblClickExpand)) ? k = I : g = "";
					break;
				case "clickNode":
					k = J
			}
			switch (i) {
				case "mousedown":
					l = K;
					break;
				case "mouseup":
					l = L;
					break;
				case "dblclick":
					l = M;
					break;
				case "contextmenu":
					l = N
			}
			return {
				stop: !1,
				node: e,
				nodeEventType: g,
				nodeEventCallback: k,
				treeEventType: i,
				treeEventCallback: l
			}
		}],
		C = [function (a) {
			var b = h.getRoot(a);
			b || (b = {}, h.setRoot(a, b)), b[a.data.key.children] = [], b.expandTriggerFlag = !1, b.curSelectedList = [], b.noSelection = !0, b.createdNodes = [], b.zId = 0, b._ver = (new Date).getTime()
		}],
		D = [],
		E = [],
		F = [],
		G = [],
		H = [],
		h = {
			addNodeCache: function (a, b) {
				h.getCache(a).nodes[h.getNodeCacheId(b.tId)] = b
			},
			getNodeCacheId: function (a) {
				return a.substring(a.lastIndexOf("_") + 1)
			},
			addAfterA: function (a) {
				E.push(a)
			},
			addBeforeA: function (a) {
				D.push(a)
			},
			addInnerAfterA: function (a) {
				G.push(a)
			},
			addInnerBeforeA: function (a) {
				F.push(a)
			},
			addInitBind: function (a) {
				y.push(a)
			},
			addInitUnBind: function (a) {
				z.push(a)
			},
			addInitCache: function (a) {
				A.push(a)
			},
			addInitNode: function (a) {
				B.push(a)
			},
			addInitProxy: function (a, b) {
				b ? u.splice(0, 0, a) : u.push(a)
			},
			addInitRoot: function (a) {
				C.push(a)
			},
			addNodesData: function (a, b, c, d) {
				var e = a.data.key.children;
				b[e] ? c >= b[e].length && (c = -1) : (b[e] = [], c = -1), b[e].length > 0 && 0 === c ? (b[e][0].isFirstNode = !1, i.setNodeLineIcos(a, b[e][0])) : b[e].length > 0 && 0 > c && (b[e][b[e].length - 1].isLastNode = !1, i.setNodeLineIcos(a, b[e][b[e].length - 1])), b.isParent = !0, 0 > c ? b[e] = b[e].concat(d) : (a = [c, 0].concat(d), b[e].splice.apply(b[e], a))
			},
			addSelectedNode: function (a, b) {
				var c = h.getRoot(a);
				h.isSelectedNode(a, b) || c.curSelectedList.push(b)
			},
			addCreatedNode: function (a, b) {
				(a.callback.onNodeCreated || a.view.addDiyDom) && h.getRoot(a).createdNodes.push(b)
			},
			addZTreeTools: function (a) {
				H.push(a)
			},
			exSetting: function (a) {
				q.extend(!0, O, a)
			},
			fixPIdKeyValue: function (a, b) {
				a.data.simpleData.enable && (b[a.data.simpleData.pIdKey] = b.parentTId ? b.getParentNode()[a.data.simpleData.idKey] : a.data.simpleData.rootPId)
			},
			getAfterA: function (a, b, c) {
				for (var d = 0, e = E.length; e > d; d++) E[d].apply(this, arguments)
			},
			getBeforeA: function (a, b, c) {
				for (var d = 0, e = D.length; e > d; d++) D[d].apply(this, arguments)
			},
			getInnerAfterA: function (a, b, c) {
				for (var d = 0, e = G.length; e > d; d++) G[d].apply(this, arguments)
			},
			getInnerBeforeA: function (a, b, c) {
				for (var d = 0, e = F.length; e > d; d++) F[d].apply(this, arguments)
			},
			getCache: function (a) {
				return x[a.treeId]
			},
			getNodeIndex: function (a, b) {
				if (!b) return null;
				for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : h.getRoot(a), e = 0, f = d[c].length - 1; f >= e; e++)
					if (d[c][e] === b) return e;
				return -1
			},
			getNextNode: function (a, b) {
				if (!b) return null;
				for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : h.getRoot(a), e = 0, f = d[c].length - 1; f >= e; e++)
					if (d[c][e] === b) return e == f ? null : d[c][e + 1];
				return null
			},
			getNodeByParam: function (a, b, c, d) {
				if (!b || !c) return null;
				for (var e = a.data.key.children, f = 0, g = b.length; g > f; f++) {
					if (b[f][c] == d) return b[f];
					var i = h.getNodeByParam(a, b[f][e], c, d);
					if (i) return i
				}
				return null
			},
			getNodeCache: function (a, b) {
				if (!b) return null;
				var c = x[a.treeId].nodes[h.getNodeCacheId(b)];
				return c ? c : null
			},
			getNodeName: function (a, b) {
				return "" + b[a.data.key.name]
			},
			getNodePath: function (a, b) {
				if (!b) return null;
				var c;
				return (c = b.parentTId ? b.getParentNode().getPath() : []) && c.push(b), c
			},
			getNodeTitle: function (a, b) {
				return "" + b["" === a.data.key.title ? a.data.key.name : a.data.key.title]
			},
			getNodes: function (a) {
				return h.getRoot(a)[a.data.key.children]
			},
			getNodesByParam: function (a, b, c, d) {
				if (!b || !c) return [];
				for (var e = a.data.key.children, f = [], g = 0, i = b.length; i > g; g++) b[g][c] == d && f.push(b[g]), f = f.concat(h.getNodesByParam(a, b[g][e], c, d));
				return f
			},
			getNodesByParamFuzzy: function (a, b, c, d) {
				if (!b || !c) return [];
				for (var e = a.data.key.children, f = [], d = d.toLowerCase(), g = 0, i = b.length; i > g; g++) "string" == typeof b[g][c] && b[g][c].toLowerCase().indexOf(d) > -1 && f.push(b[g]), f = f.concat(h.getNodesByParamFuzzy(a, b[g][e], c, d));
				return f
			},
			getNodesByFilter: function (a, b, c, d, e) {
				if (!b) return d ? null : [];
				for (var f = a.data.key.children, g = d ? null : [], i = 0, k = b.length; k > i; i++) {
					if (j.apply(c, [b[i], e], !1)) {
						if (d) return b[i];
						g.push(b[i])
					}
					var l = h.getNodesByFilter(a, b[i][f], c, d, e);
					if (d && l) return l;
					g = d ? l : g.concat(l)
				}
				return g
			},
			getPreNode: function (a, b) {
				if (!b) return null;
				for (var c = a.data.key.children, d = b.parentTId ? b.getParentNode() : h.getRoot(a), e = 0, f = d[c].length; f > e; e++)
					if (d[c][e] === b) return 0 == e ? null : d[c][e - 1];
				return null
			},
			getRoot: function (a) {
				return a ? w[a.treeId] : null
			},
			getRoots: function () {
				return w
			},
			getSetting: function (a) {
				return s[a]
			},
			getSettings: function () {
				return s
			},
			getZTreeTools: function (a) {
				return (a = this.getRoot(this.getSetting(a))) ? a.treeTools : null
			},
			initCache: function (a) {
				for (var b = 0, c = A.length; c > b; b++) A[b].apply(this, arguments)
			},
			initNode: function (a, b, c, d, e, f) {
				for (var g = 0, h = B.length; h > g; g++) B[g].apply(this, arguments)
			},
			initRoot: function (a) {
				for (var b = 0, c = C.length; c > b; b++) C[b].apply(this, arguments)
			},
			isSelectedNode: function (a, b) {
				for (var c = h.getRoot(a), d = 0, e = c.curSelectedList.length; e > d; d++)
					if (b === c.curSelectedList[d]) return !0;
				return !1
			},
			removeNodeCache: function (a, b) {
				var c = a.data.key.children;
				if (b[c])
					for (var d = 0, e = b[c].length; e > d; d++) h.removeNodeCache(a, b[c][d]);
				h.getCache(a).nodes[h.getNodeCacheId(b.tId)] = null
			},
			removeSelectedNode: function (a, b) {
				for (var c = h.getRoot(a), d = 0, e = c.curSelectedList.length; e > d; d++) b !== c.curSelectedList[d] && h.getNodeCache(a, c.curSelectedList[d].tId) || (c.curSelectedList.splice(d, 1), a.treeObj.trigger(f.event.UNSELECTED, [a.treeId, b]), d--, e--)
			},
			setCache: function (a, b) {
				x[a.treeId] = b
			},
			setRoot: function (a, b) {
				w[a.treeId] = b
			},
			setZTreeTools: function (a, b) {
				for (var c = 0, d = H.length; d > c; c++) H[c].apply(this, arguments)
			},
			transformToArrayFormat: function (a, b) {
				if (!b) return [];
				var c = a.data.key.children,
					d = [];
				if (j.isArray(b))
					for (var e = 0, f = b.length; f > e; e++) d.push(b[e]), b[e][c] && (d = d.concat(h.transformToArrayFormat(a, b[e][c])));
				else d.push(b), b[c] && (d = d.concat(h.transformToArrayFormat(a, b[c])));
				return d
			},
			transformTozTreeFormat: function (a, b) {
				var c, d, e = a.data.simpleData.idKey,
					f = a.data.simpleData.pIdKey,
					g = a.data.key.children;
				if (!e || "" == e || !b) return [];
				if (j.isArray(b)) {
					var h = [],
						i = {};
					for (c = 0, d = b.length; d > c; c++) i[b[c][e]] = b[c];
					for (c = 0, d = b.length; d > c; c++) i[b[c][f]] && b[c][e] != b[c][f] ? (i[b[c][f]][g] || (i[b[c][f]][g] = []), i[b[c][f]][g].push(b[c])) : h.push(b[c]);
					return h
				}
				return [b]
			}
		},
		l = {
			bindEvent: function (a) {
				for (var b = 0, c = y.length; c > b; b++) y[b].apply(this, arguments)
			},
			unbindEvent: function (a) {
				for (var b = 0, c = z.length; c > b; b++) z[b].apply(this, arguments)
			},
			bindTree: function (a) {
				var b = {
						treeId: a.treeId
					},
					c = a.treeObj;
				a.view.txtSelectedEnable || c.bind("selectstart", v).css({
					"-moz-user-select": "-moz-none"
				}), c.bind("click", b, l.proxy), c.bind("dblclick", b, l.proxy), c.bind("mouseover", b, l.proxy), c.bind("mouseout", b, l.proxy), c.bind("mousedown", b, l.proxy), c.bind("mouseup", b, l.proxy), c.bind("contextmenu", b, l.proxy)
			},
			unbindTree: function (a) {
				a.treeObj.unbind("selectstart", v).unbind("click", l.proxy).unbind("dblclick", l.proxy).unbind("mouseover", l.proxy).unbind("mouseout", l.proxy).unbind("mousedown", l.proxy).unbind("mouseup", l.proxy).unbind("contextmenu", l.proxy)
			},
			doProxy: function (a) {
				for (var b = [], c = 0, d = u.length; d > c; c++) {
					var e = u[c].apply(this, arguments);
					if (b.push(e), e.stop) break
				}
				return b
			},
			proxy: function (a) {
				var b = h.getSetting(a.data.treeId);
				if (!j.uCanDo(b, a)) return !0;
				for (var b = l.doProxy(a), c = !0, d = 0, e = b.length; e > d; d++) {
					var f = b[d];
					f.nodeEventCallback && (c = f.nodeEventCallback.apply(f, [a, f.node]) && c), f.treeEventCallback && (c = f.treeEventCallback.apply(f, [a, f.node]) && c)
				}
				return c
			}
		};
	I = function (a, b) {
		var c = h.getSetting(a.data.treeId);
		if (b.open) {
			if (0 == j.apply(c.callback.beforeCollapse, [c.treeId, b], !0)) return !0
		} else if (0 == j.apply(c.callback.beforeExpand, [c.treeId, b], !0)) return !0;
		return h.getRoot(c).expandTriggerFlag = !0, i.switchNode(c, b), !0
	}, J = function (a, b) {
		var c = h.getSetting(a.data.treeId),
			d = c.view.autoCancelSelected && (a.ctrlKey || a.metaKey) && h.isSelectedNode(c, b) ? 0 : c.view.autoCancelSelected && (a.ctrlKey || a.metaKey) && c.view.selectedMulti ? 2 : 1;
		return 0 == j.apply(c.callback.beforeClick, [c.treeId, b, d], !0) ? !0 : (0 === d ? i.cancelPreSelectedNode(c, b) : i.selectNode(c, b, 2 === d), c.treeObj.trigger(f.event.CLICK, [a, c.treeId, b, d]), !0)
	}, K = function (a, b) {
		var c = h.getSetting(a.data.treeId);
		return j.apply(c.callback.beforeMouseDown, [c.treeId, b], !0) && j.apply(c.callback.onMouseDown, [a, c.treeId, b]), !0
	}, L = function (a, b) {
		var c = h.getSetting(a.data.treeId);
		return j.apply(c.callback.beforeMouseUp, [c.treeId, b], !0) && j.apply(c.callback.onMouseUp, [a, c.treeId, b]), !0
	}, M = function (a, b) {
		var c = h.getSetting(a.data.treeId);
		return j.apply(c.callback.beforeDblClick, [c.treeId, b], !0) && j.apply(c.callback.onDblClick, [a, c.treeId, b]), !0
	}, N = function (a, b) {
		var c = h.getSetting(a.data.treeId);
		return j.apply(c.callback.beforeRightClick, [c.treeId, b], !0) && j.apply(c.callback.onRightClick, [a, c.treeId, b]), "function" != typeof c.callback.onRightClick
	}, v = function (a) {
		return a = a.originalEvent.srcElement.nodeName.toLowerCase(), "input" === a || "textarea" === a
	};
	var j = {
			apply: function (a, b, c) {
				return "function" == typeof a ? a.apply(P, b ? b : []) : c
			},
			canAsync: function (a, b) {
				var c = a.data.key.children;
				return a.async.enable && b && b.isParent && !(b.zAsync || b[c] && b[c].length > 0)
			},
			clone: function (a) {
				if (null === a) return null;
				var b, c = j.isArray(a) ? [] : {};
				for (b in a) c[b] = a[b] instanceof Date ? new Date(a[b].getTime()) : "object" == typeof a[b] ? j.clone(a[b]) : a[b];
				return c
			},
			eqs: function (a, b) {
				return a.toLowerCase() === b.toLowerCase()
			},
			isArray: function (a) {
				return "[object Array]" === Object.prototype.toString.apply(a)
			},
			$: function (a, b, c) {
				return b && "string" != typeof b && (c = b, b = ""), "string" == typeof a ? q(a, c ? c.treeObj.get(0).ownerDocument : null) : q("#" + a.tId + b, c ? c.treeObj : null)
			},
			getMDom: function (a, b, c) {
				if (!b) return null;
				for (; b && b.id !== a.treeId;) {
					for (var d = 0, e = c.length; b.tagName && e > d; d++)
						if (j.eqs(b.tagName, c[d].tagName) && null !== b.getAttribute(c[d].attrName)) return b;
					b = b.parentNode
				}
				return null
			},
			getNodeMainDom: function (a) {
				return q(a).parent("li").get(0) || q(a).parentsUntil("li").parent().get(0)
			},
			isChildOrSelf: function (a, b) {
				return q(a).closest("#" + b).length > 0
			},
			uCanDo: function () {
				return !0
			}
		},
		i = {
			addNodes: function (a, b, c, d, e) {
				if (!a.data.keep.leaf || !b || b.isParent)
					if (j.isArray(d) || (d = [d]), a.data.simpleData.enable && (d = h.transformTozTreeFormat(a, d)), b) {
						var g = k(b, f.id.SWITCH, a),
							l = k(b, f.id.ICON, a),
							m = k(b, f.id.UL, a);
						b.open || (i.replaceSwitchClass(b, g, f.folder.CLOSE), i.replaceIcoClass(b, l, f.folder.CLOSE), b.open = !1, m.css({
							display: "none"
						})), h.addNodesData(a, b, c, d), i.createNodes(a, b.level + 1, d, b, c), e || i.expandCollapseParentNode(a, b, !0)
					} else h.addNodesData(a, h.getRoot(a), c, d), i.createNodes(a, 0, d, null, c)
			},
			appendNodes: function (a, b, c, d, e, f, g) {
				if (!c) return [];
				var j, k, l = [],
					m = a.data.key.children,
					n = (d ? d : h.getRoot(a))[m];
				(!n || e >= n.length) && (e = -1);
				for (var o = 0, p = c.length; p > o; o++) {
					var q = c[o];
					f && (j = (0 === e || n.length == c.length) && 0 == o, k = 0 > e && o == c.length - 1, h.initNode(a, b, q, d, j, k, g), h.addNodeCache(a, q)), j = [], q[m] && q[m].length > 0 && (j = i.appendNodes(a, b + 1, q[m], q, -1, f, g && q.open)), g && (i.makeDOMNodeMainBefore(l, a, q), i.makeDOMNodeLine(l, a, q), h.getBeforeA(a, q, l), i.makeDOMNodeNameBefore(l, a, q), h.getInnerBeforeA(a, q, l), i.makeDOMNodeIcon(l, a, q), h.getInnerAfterA(a, q, l), i.makeDOMNodeNameAfter(l, a, q), h.getAfterA(a, q, l), q.isParent && q.open && i.makeUlHtml(a, q, l, j.join("")), i.makeDOMNodeMainAfter(l, a, q), h.addCreatedNode(a, q))
				}
				return l
			},
			appendParentULDom: function (a, b) {
				var c = [],
					d = k(b, a);
				!d.get(0) && b.parentTId && (i.appendParentULDom(a, b.getParentNode()), d = k(b, a));
				var e = k(b, f.id.UL, a);
				e.get(0) && e.remove(), e = i.appendNodes(a, b.level + 1, b[a.data.key.children], b, -1, !1, !0), i.makeUlHtml(a, b, c, e.join("")), d.append(c.join(""))
			},
			asyncNode: function (b, a, c, d) {
				var e, g;
				if (a && !a.isParent) return j.apply(d), !1;
				if (a && a.isAjaxing) return !1;
				if (0 == j.apply(b.callback.beforeAsync, [b.treeId, a], !0)) return j.apply(d), !1;
				a && (a.isAjaxing = !0, k(a, f.id.ICON, b).attr({
					style: "",
					"class": f.className.BUTTON + " " + f.className.ICO_LOADING
				}));
				var m = {};
				for (e = 0, g = b.async.autoParam.length; a && g > e; e++) {
					var o = b.async.autoParam[e].split("="),
						n = o;
					o.length > 1 && (n = o[1], o = o[0]), m[n] = a[o]
				}
				if (j.isArray(b.async.otherParam))
					for (e = 0, g = b.async.otherParam.length; g > e; e += 2) m[b.async.otherParam[e]] = b.async.otherParam[e + 1];
				else
					for (var l in b.async.otherParam) m[l] = b.async.otherParam[l];
				var r = h.getRoot(b)._ver;
				return q.ajax({
					contentType: b.async.contentType,
					cache: !1,
					type: b.async.type,
					url: j.apply(b.async.url, [b.treeId, a], b.async.url),
					data: m,
					dataType: b.async.dataType,
					success: function (e) {
						if (r == h.getRoot(b)._ver) {
							var g = [];
							try {
								g = e && 0 != e.length ? "string" == typeof e ? eval("(" + e + ")") : e : []
							} catch (m) {
								g = e
							}
							a && (a.isAjaxing = null, a.zAsync = !0), i.setNodeLineIcos(b, a), g && "" !== g ? (g = j.apply(b.async.dataFilter, [b.treeId, a, g], g), i.addNodes(b, a, -1, g ? j.clone(g) : [], !!c)) : i.addNodes(b, a, -1, [], !!c), b.treeObj.trigger(f.event.ASYNC_SUCCESS, [b.treeId, a, e]), j.apply(d)
						}
					},
					error: function (c, d, e) {
						r == h.getRoot(b)._ver && (a && (a.isAjaxing = null), i.setNodeLineIcos(b, a), b.treeObj.trigger(f.event.ASYNC_ERROR, [b.treeId, a, c, d, e]))
					}
				}), !0
			},
			cancelPreSelectedNode: function (a, b, c) {
				var d, e, g = h.getRoot(a).curSelectedList;
				for (d = g.length - 1; d >= 0; d--)
					if (e = g[d], b === e || !b && (!c || c !== e)) {
						if (k(e, f.id.A, a).removeClass(f.node.CURSELECTED), b) {
							h.removeSelectedNode(a, b);
							break
						}
						g.splice(d, 1), a.treeObj.trigger(f.event.UNSELECTED, [a.treeId, e])
					}
			},
			createNodeCallback: function (a) {
				if (a.callback.onNodeCreated || a.view.addDiyDom)
					for (var b = h.getRoot(a); b.createdNodes.length > 0;) {
						var c = b.createdNodes.shift();
						j.apply(a.view.addDiyDom, [a.treeId, c]), a.callback.onNodeCreated && a.treeObj.trigger(f.event.NODECREATED, [a.treeId, c])
					}
			},
			createNodes: function (a, b, c, d, e) {
				if (c && 0 != c.length) {
					var g = h.getRoot(a),
						j = a.data.key.children,
						j = !d || d.open || !!k(d[j][0], a).get(0);
					g.createdNodes = [];
					var l, m, b = i.appendNodes(a, b, c, d, e, !0, j);
					d ? (d = k(d, f.id.UL, a), d.get(0) && (l = d)) : l = a.treeObj, l && (e >= 0 && (m = l.children()[e]), e >= 0 && m ? q(m).before(b.join("")) : l.append(b.join(""))), i.createNodeCallback(a)
				}
			},
			destroy: function (a) {
				a && (h.initCache(a), h.initRoot(a), l.unbindTree(a), l.unbindEvent(a), a.treeObj.empty(), delete s[a.treeId])
			},
			expandCollapseNode: function (a, b, c, d, e) {
				var g, l = h.getRoot(a),
					m = a.data.key.children;
				if (b)
					if (l.expandTriggerFlag && (g = e, e = function () {
							g && g(), b.open ? a.treeObj.trigger(f.event.EXPAND, [a.treeId, b]) : a.treeObj.trigger(f.event.COLLAPSE, [a.treeId, b])
						}, l.expandTriggerFlag = !1), !b.open && b.isParent && (!k(b, f.id.UL, a).get(0) || b[m] && b[m].length > 0 && !k(b[m][0], a).get(0)) && (i.appendParentULDom(a, b), i.createNodeCallback(a)), b.open == c) j.apply(e, []);
					else {
						var c = k(b, f.id.UL, a),
							l = k(b, f.id.SWITCH, a),
							n = k(b, f.id.ICON, a);
						b.isParent ? (b.open = !b.open, b.iconOpen && b.iconClose && n.attr("style", i.makeNodeIcoStyle(a, b)), b.open ? (i.replaceSwitchClass(b, l, f.folder.OPEN), i.replaceIcoClass(b, n, f.folder.OPEN), 0 == d || "" == a.view.expandSpeed ? (c.show(), j.apply(e, [])) : b[m] && b[m].length > 0 ? c.slideDown(a.view.expandSpeed, e) : (c.show(), j.apply(e, []))) : (i.replaceSwitchClass(b, l, f.folder.CLOSE), i.replaceIcoClass(b, n, f.folder.CLOSE), 0 != d && "" != a.view.expandSpeed && b[m] && b[m].length > 0 ? c.slideUp(a.view.expandSpeed, e) : (c.hide(), j.apply(e, [])))) : j.apply(e, [])
					}
				else j.apply(e, [])
			},
			expandCollapseParentNode: function (a, b, c, d, e) {
				b && (b.parentTId ? (i.expandCollapseNode(a, b, c, d), b.parentTId && i.expandCollapseParentNode(a, b.getParentNode(), c, d, e)) : i.expandCollapseNode(a, b, c, d, e))
			},
			expandCollapseSonNode: function (a, b, c, d, e) {
				var f = h.getRoot(a),
					g = a.data.key.children,
					f = b ? b[g] : f[g],
					g = b ? !1 : d,
					j = h.getRoot(a).expandTriggerFlag;
				if (h.getRoot(a).expandTriggerFlag = !1, f)
					for (var k = 0, l = f.length; l > k; k++) f[k] && i.expandCollapseSonNode(a, f[k], c, g);
				h.getRoot(a).expandTriggerFlag = j, i.expandCollapseNode(a, b, c, d, e)
			},
			isSelectedNode: function (a, b) {
				if (!b) return !1;
				var c, d = h.getRoot(a).curSelectedList;
				for (c = d.length - 1; c >= 0; c--)
					if (b === d[c]) return !0;
				return !1
			},
			makeDOMNodeIcon: function (a, b, c) {
				var d = h.getNodeName(b, c),
					d = b.view.nameIsHTML ? d : d.replace(/&/g, "&").replace(/</g, "&lt;").replace(/>/g, ">");
				a.push("<span id='", c.tId, f.id.ICON, "' title='' treeNode", f.id.ICON, " class='", i.makeNodeIcoClass(b, c), "' style='", i.makeNodeIcoStyle(b, c), "'></span><span id='", c.tId, f.id.SPAN, "' class='", f.className.NAME, "'>", d, "</span>")
			},
			makeDOMNodeLine: function (a, b, c) {
				a.push("<span id='", c.tId, f.id.SWITCH, "' title='' class='", i.makeNodeLineClass(b, c), "' treeNode", f.id.SWITCH, "></span>")
			},
			makeDOMNodeMainAfter: function (a) {
				a.push("</li>")
			},
			makeDOMNodeMainBefore: function (a, b, c) {
				a.push("<li id='", c.tId, "' class='", f.className.LEVEL, c.level, "' tabindex='0' hidefocus='true' treenode>")
			},
			makeDOMNodeNameAfter: function (a) {
				a.push("</a>")
			},
			makeDOMNodeNameBefore: function (a, b, c) {
				var d, e = h.getNodeTitle(b, c),
					g = i.makeNodeUrl(b, c),
					k = i.makeNodeFontCss(b, c),
					l = [];
				for (d in k) l.push(d, ":", k[d], ";");
				a.push("<a id='", c.tId, f.id.A, "' class='", f.className.LEVEL, c.level, "' treeNode", f.id.A, ' onclick="', c.click || "", '" ', null != g && g.length > 0 ? "href='" + g + "'" : "", " target='", i.makeNodeTarget(c), "' style='", l.join(""), "'"), j.apply(b.view.showTitle, [b.treeId, c], b.view.showTitle) && e && a.push("title='", e.replace(/'/g, "'").replace(/</g, "&lt;").replace(/>/g, ">"), "'"), a.push(">")
			},
			makeNodeFontCss: function (a, b) {
				var c = j.apply(a.view.fontCss, [a.treeId, b], a.view.fontCss);
				return c && "function" != typeof c ? c : {}
			},
			makeNodeIcoClass: function (a, b) {
				var c = ["ico"];
				return b.isAjaxing || (c[0] = (b.iconSkin ? b.iconSkin + "_" : "") + c[0], b.isParent ? c.push(b.open ? f.folder.OPEN : f.folder.CLOSE) : c.push(f.folder.DOCU)), f.className.BUTTON + " " + c.join("_")
			},
			makeNodeIcoStyle: function (a, b) {
				var c = [];
				if (!b.isAjaxing) {
					var d = b.isParent && b.iconOpen && b.iconClose ? b.open ? b.iconOpen : b.iconClose : b[a.data.key.icon];
					d && c.push("background:url(", d, ") 0 0 no-repeat;"), (0 == a.view.showIcon || !j.apply(a.view.showIcon, [a.treeId, b], !0)) && c.push("width:0px;height:0px;")
				}
				return c.join("")
			},
			makeNodeLineClass: function (a, b) {
				var c = [];
				return a.view.showLine ? 0 == b.level && b.isFirstNode && b.isLastNode ? c.push(f.line.ROOT) : 0 == b.level && b.isFirstNode ? c.push(f.line.ROOTS) : b.isLastNode ? c.push(f.line.BOTTOM) : c.push(f.line.CENTER) : c.push(f.line.NOLINE), b.isParent ? c.push(b.open ? f.folder.OPEN : f.folder.CLOSE) : c.push(f.folder.DOCU), i.makeNodeLineClassEx(b) + c.join("_")
			},
			makeNodeLineClassEx: function (a) {
				return f.className.BUTTON + " " + f.className.LEVEL + a.level + " " + f.className.SWITCH + " "
			},
			makeNodeTarget: function (a) {
				return a.target || "_blank"
			},
			makeNodeUrl: function (a, b) {
				var c = a.data.key.url;
				return b[c] ? b[c] : null
			},
			makeUlHtml: function (a, b, c, d) {
				c.push("<ul id='", b.tId, f.id.UL, "' class='", f.className.LEVEL, b.level, " ", i.makeUlLineClass(a, b), "' style='display:", b.open ? "block" : "none", "'>"), c.push(d), c.push("</ul>")
			},
			makeUlLineClass: function (a, b) {
				return a.view.showLine && !b.isLastNode ? f.line.LINE : ""
			},
			removeChildNodes: function (a, b) {
				if (b) {
					var c = a.data.key.children,
						d = b[c];
					if (d) {
						for (var e = 0, g = d.length; g > e; e++) h.removeNodeCache(a, d[e]);
						h.removeSelectedNode(a), delete b[c], a.data.keep.parent ? k(b, f.id.UL, a).empty() : (b.isParent = !1, b.open = !1, c = k(b, f.id.SWITCH, a), d = k(b, f.id.ICON, a), i.replaceSwitchClass(b, c, f.folder.DOCU), i.replaceIcoClass(b, d, f.folder.DOCU), k(b, f.id.UL, a).remove())
					}
				}
			},
			scrollIntoView: function (a) {
				if (a)
					if (a.scrollIntoViewIfNeeded) a.scrollIntoViewIfNeeded();
					else if (a.scrollIntoView) a.scrollIntoView(!1);
				else try {
					a.focus().blur()
				} catch (b) {}
			},
			setFirstNode: function (a, b) {
				var c = a.data.key.children;
				b[c].length > 0 && (b[c][0].isFirstNode = !0)
			},
			setLastNode: function (a, b) {
				var c = a.data.key.children,
					d = b[c].length;
				d > 0 && (b[c][d - 1].isLastNode = !0)
			},
			removeNode: function (a, b) {
				var c = h.getRoot(a),
					d = a.data.key.children,
					e = b.parentTId ? b.getParentNode() : c;
				if (b.isFirstNode = !1, b.isLastNode = !1, b.getPreNode = function () {
						return null
					}, b.getNextNode = function () {
						return null
					}, h.getNodeCache(a, b.tId)) {
					k(b, a).remove(), h.removeNodeCache(a, b), h.removeSelectedNode(a, b);
					for (var g = 0, j = e[d].length; j > g; g++)
						if (e[d][g].tId == b.tId) {
							e[d].splice(g, 1);
							break
						}
					i.setFirstNode(a, e), i.setLastNode(a, e);
					var l, g = e[d].length;
					if (a.data.keep.parent || 0 != g) {
						if (a.view.showLine && g > 0) {
							var m = e[d][g - 1],
								g = k(m, f.id.UL, a),
								j = k(m, f.id.SWITCH, a);
							l = k(m, f.id.ICON, a), e == c ? 1 == e[d].length ? i.replaceSwitchClass(m, j, f.line.ROOT) : (c = k(e[d][0], f.id.SWITCH, a), i.replaceSwitchClass(e[d][0], c, f.line.ROOTS), i.replaceSwitchClass(m, j, f.line.BOTTOM)) : i.replaceSwitchClass(m, j, f.line.BOTTOM), g.removeClass(f.line.LINE)
						}
					} else e.isParent = !1, e.open = !1, g = k(e, f.id.UL, a), j = k(e, f.id.SWITCH, a), l = k(e, f.id.ICON, a), i.replaceSwitchClass(e, j, f.folder.DOCU), i.replaceIcoClass(e, l, f.folder.DOCU), g.css("display", "none")
				}
			},
			replaceIcoClass: function (a, b, c) {
				if (b && !a.isAjaxing && (a = b.attr("class"), void 0 != a)) {
					switch (a = a.split("_"), c) {
						case f.folder.OPEN:
						case f.folder.CLOSE:
						case f.folder.DOCU:
							a[a.length - 1] = c
					}
					b.attr("class", a.join("_"))
				}
			},
			replaceSwitchClass: function (a, b, c) {
				if (b) {
					var d = b.attr("class");
					if (void 0 != d) {
						switch (d = d.split("_"), c) {
							case f.line.ROOT:
							case f.line.ROOTS:
							case f.line.CENTER:
							case f.line.BOTTOM:
							case f.line.NOLINE:
								d[0] = i.makeNodeLineClassEx(a) + c;
								break;
							case f.folder.OPEN:
							case f.folder.CLOSE:
							case f.folder.DOCU:
								d[1] = c
						}
						b.attr("class", d.join("_")), c !== f.folder.DOCU ? b.removeAttr("disabled") : b.attr("disabled", "disabled")
					}
				}
			},
			selectNode: function (a, b, c) {
				c || i.cancelPreSelectedNode(a, null, b), k(b, f.id.A, a).addClass(f.node.CURSELECTED), h.addSelectedNode(a, b), a.treeObj.trigger(f.event.SELECTED, [a.treeId, b])
			},
			setNodeFontCss: function (a, b) {
				var c = k(b, f.id.A, a),
					d = i.makeNodeFontCss(a, b);
				d && c.css(d)
			},
			setNodeLineIcos: function (a, b) {
				if (b) {
					var c = k(b, f.id.SWITCH, a),
						d = k(b, f.id.UL, a),
						e = k(b, f.id.ICON, a),
						g = i.makeUlLineClass(a, b);
					0 == g.length ? d.removeClass(f.line.LINE) : d.addClass(g), c.attr("class", i.makeNodeLineClass(a, b)), b.isParent ? c.removeAttr("disabled") : c.attr("disabled", "disabled"), e.removeAttr("style"), e.attr("style", i.makeNodeIcoStyle(a, b)), e.attr("class", i.makeNodeIcoClass(a, b))
				}
			},
			setNodeName: function (a, b) {
				var c = h.getNodeTitle(a, b),
					d = k(b, f.id.SPAN, a);
				d.empty(), a.view.nameIsHTML ? d.html(h.getNodeName(a, b)) : d.text(h.getNodeName(a, b)), j.apply(a.view.showTitle, [a.treeId, b], a.view.showTitle) && k(b, f.id.A, a).attr("title", c ? c : "")
			},
			setNodeTarget: function (a, b) {
				k(b, f.id.A, a).attr("target", i.makeNodeTarget(b))
			},
			setNodeUrl: function (a, b) {
				var c = k(b, f.id.A, a),
					d = i.makeNodeUrl(a, b);
				null == d || 0 == d.length ? c.removeAttr("href") : c.attr("href", d)
			},
			switchNode: function (a, b) {
				b.open || !j.canAsync(a, b) ? i.expandCollapseNode(a, b, !b.open) : a.async.enable ? i.asyncNode(a, b) || i.expandCollapseNode(a, b, !b.open) : b && i.expandCollapseNode(a, b, !b.open)
			}
		};
	q.fn.zTree = {
		consts: {
			className: {
				BUTTON: "button",
				LEVEL: "level",
				ICO_LOADING: "ico_loading",
				SWITCH: "switch",
				NAME: "node_name"
			},
			event: {
				NODECREATED: "ztree_nodeCreated",
				CLICK: "ztree_click",
				EXPAND: "ztree_expand",
				COLLAPSE: "ztree_collapse",
				ASYNC_SUCCESS: "ztree_async_success",
				ASYNC_ERROR: "ztree_async_error",
				REMOVE: "ztree_remove",
				SELECTED: "ztree_selected",
				UNSELECTED: "ztree_unselected"
			},
			id: {
				A: "_a",
				ICON: "_ico",
				SPAN: "_span",
				SWITCH: "_switch",
				UL: "_ul"
			},
			line: {
				ROOT: "root",
				ROOTS: "roots",
				CENTER: "center",
				BOTTOM: "bottom",
				NOLINE: "noline",
				LINE: "line"
			},
			folder: {
				OPEN: "open",
				CLOSE: "close",
				DOCU: "docu"
			},
			node: {
				CURSELECTED: "curSelectedNode"
			}
		},
		_z: {
			tools: j,
			view: i,
			event: l,
			data: h
		},
		getZTreeObj: function (a) {
			return (a = h.getZTreeTools(a)) ? a : null
		},
		destroy: function (a) {
			if (a && a.length > 0) i.destroy(h.getSetting(a));
			else
				for (var b in s) i.destroy(s[b])
		},
		init: function (a, b, c) {
			var d = j.clone(O);
			return q.extend(!0, d, b), d.treeId = a.attr("id"), d.treeObj = a, d.treeObj.empty(), s[d.treeId] = d, "undefined" == typeof document.body.style.maxHeight && (d.view.expandSpeed = ""), h.initRoot(d), a = h.getRoot(d), b = d.data.key.children, c = c ? j.clone(j.isArray(c) ? c : [c]) : [], a[b] = d.data.simpleData.enable ? h.transformTozTreeFormat(d, c) : c, h.initCache(d), l.unbindTree(d), l.bindTree(d), l.unbindEvent(d), l.bindEvent(d), c = {
				setting: d,
				addNodes: function (a, b, c, e) {
					function f() {
						i.addNodes(d, a, b, h, 1 == e)
					}
					if (a || (a = null), a && !a.isParent && d.data.keep.leaf) return null;
					var g = parseInt(b, 10);
					if (isNaN(g) ? (e = !!c, c = b, b = -1) : b = g, !c) return null;
					var h = j.clone(j.isArray(c) ? c : [c]);
					return j.canAsync(d, a) ? i.asyncNode(d, a, e, f) : f(), h
				},
				cancelSelectedNode: function (a) {
					i.cancelPreSelectedNode(d, a)
				},
				destroy: function () {
					i.destroy(d)
				},
				expandAll: function (a) {
					return a = !!a, i.expandCollapseSonNode(d, null, a, !0), a
				},
				expandNode: function (a, b, c, e, f) {
					function g() {
						var b = k(a, d).get(0);
						b && e !== !1 && i.scrollIntoView(b)
					}
					return a && a.isParent ? (b !== !0 && b !== !1 && (b = !a.open), (f = !!f) && b && 0 == j.apply(d.callback.beforeExpand, [d.treeId, a], !0) ? null : f && !b && 0 == j.apply(d.callback.beforeCollapse, [d.treeId, a], !0) ? null : (b && a.parentTId && i.expandCollapseParentNode(d, a.getParentNode(), b, !1), b !== a.open || c ? (h.getRoot(d).expandTriggerFlag = f, !j.canAsync(d, a) && c ? i.expandCollapseSonNode(d, a, b, !0, g) : (a.open = !b, i.switchNode(this.setting, a), g()), b) : null)) : null
				},
				getNodes: function () {
					return h.getNodes(d)
				},
				getNodeByParam: function (a, b, c) {
					return a ? h.getNodeByParam(d, c ? c[d.data.key.children] : h.getNodes(d), a, b) : null
				},
				getNodeByTId: function (a) {
					return h.getNodeCache(d, a)
				},
				getNodesByParam: function (a, b, c) {
					return a ? h.getNodesByParam(d, c ? c[d.data.key.children] : h.getNodes(d), a, b) : null
				},
				getNodesByParamFuzzy: function (a, b, c) {
					return a ? h.getNodesByParamFuzzy(d, c ? c[d.data.key.children] : h.getNodes(d), a, b) : null
				},
				getNodesByFilter: function (a, b, c, e) {
					return b = !!b, a && "function" == typeof a ? h.getNodesByFilter(d, c ? c[d.data.key.children] : h.getNodes(d), a, b, e) : b ? null : []
				},
				getNodeIndex: function (a) {
					if (!a) return null;
					for (var b = d.data.key.children, c = a.parentTId ? a.getParentNode() : h.getRoot(d), e = 0, f = c[b].length; f > e; e++)
						if (c[b][e] == a) return e;
					return -1
				},
				getSelectedNodes: function () {
					for (var a = [], b = h.getRoot(d).curSelectedList, c = 0, e = b.length; e > c; c++) a.push(b[c]);
					return a
				},
				isSelectedNode: function (a) {
					return h.isSelectedNode(d, a)
				},
				reAsyncChildNodes: function (a, b, c) {
					if (this.setting.async.enable) {
						var e = !a;
						if (e && (a = h.getRoot(d)), "refresh" == b) {
							for (var b = this.setting.data.key.children, g = 0, j = a[b] ? a[b].length : 0; j > g; g++) h.removeNodeCache(d, a[b][g]);
							h.removeSelectedNode(d), a[b] = [], e ? this.setting.treeObj.empty() : k(a, f.id.UL, d).empty()
						}
						i.asyncNode(this.setting, e ? null : a, !!c)
					}
				},
				refresh: function () {
					this.setting.treeObj.empty();
					var a = h.getRoot(d),
						b = a[d.data.key.children];
					h.initRoot(d), a[d.data.key.children] = b, h.initCache(d), i.createNodes(d, 0, a[d.data.key.children], null, -1)
				},
				removeChildNodes: function (a) {
					if (!a) return null;
					var b = a[d.data.key.children];
					return i.removeChildNodes(d, a), b ? b : null
				},
				removeNode: function (a, b) {
					a && (b = !!b, b && 0 == j.apply(d.callback.beforeRemove, [d.treeId, a], !0) || (i.removeNode(d, a), b && this.setting.treeObj.trigger(f.event.REMOVE, [d.treeId, a])))
				},
				selectNode: function (a, b, c) {
					function e() {
						if (!c) {
							var b = k(a, d).get(0);
							i.scrollIntoView(b)
						}
					}
					if (a && j.uCanDo(d)) {
						if (b = d.view.selectedMulti && b, a.parentTId) i.expandCollapseParentNode(d, a.getParentNode(), !0, !1, e);
						else if (!c) try {
							k(a, d).focus().blur()
						} catch (f) {}
						i.selectNode(d, a, b)
					}
				},
				transformTozTreeNodes: function (a) {
					return h.transformTozTreeFormat(d, a)
				},
				transformToArray: function (a) {
					return h.transformToArrayFormat(d, a)
				},
				updateNode: function (a) {
					a && k(a, d).get(0) && j.uCanDo(d) && (i.setNodeName(d, a), i.setNodeTarget(d, a), i.setNodeUrl(d, a), i.setNodeLineIcos(d, a), i.setNodeFontCss(d, a))
				}
			}, a.treeTools = c, h.setZTreeTools(d, c), a[b] && a[b].length > 0 ? i.createNodes(d, 0, a[b], null, -1) : d.async.enable && d.async.url && "" !== d.async.url && i.asyncNode(d), c
		}
	};
	var P = q.fn.zTree,
		k = j.$,
		f = P.consts
}(jQuery),
function (a) {
	var b, c, d, e = {
			event: {
				CHECK: "ztree_check"
			},
			id: {
				CHECK: "_check"
			},
			checkbox: {
				STYLE: "checkbox",
				DEFAULT: "chk",
				DISABLED: "disable",
				FALSE: "false",
				TRUE: "true",
				FULL: "full",
				PART: "part",
				FOCUS: "focus"
			},
			radio: {
				STYLE: "radio",
				TYPE_ALL: "all",
				TYPE_LEVEL: "level"
			}
		},
		f = {
			check: {
				enable: !1,
				autoCheckTrigger: !1,
				chkStyle: e.checkbox.STYLE,
				nocheckInherit: !1,
				chkDisabledInherit: !1,
				radioType: e.radio.TYPE_LEVEL,
				chkboxType: {
					Y: "ps",
					N: "ps"
				}
			},
			data: {
				key: {
					checked: "checked"
				}
			},
			callback: {
				beforeCheck: null,
				onCheck: null
			}
		};
	b = function (a, b) {
		if (b.chkDisabled === !0) return !1;
		var c = j.getSetting(a.data.treeId),
			d = c.data.key.checked;
		return 0 == g.apply(c.callback.beforeCheck, [c.treeId, b], !0) ? !0 : (b[d] = !b[d], i.checkNodeRelation(c, b), d = k(b, h.id.CHECK, c), i.setChkClass(c, d, b), i.repairParentChkClassWithSelf(c, b), c.treeObj.trigger(h.event.CHECK, [a, c.treeId, b]), !0)
	}, c = function (a, b) {
		if (b.chkDisabled === !0) return !1;
		var c = j.getSetting(a.data.treeId),
			d = k(b, h.id.CHECK, c);
		return b.check_Focus = !0, i.setChkClass(c, d, b), !0
	}, d = function (a, b) {
		if (b.chkDisabled === !0) return !1;
		var c = j.getSetting(a.data.treeId),
			d = k(b, h.id.CHECK, c);
		return b.check_Focus = !1, i.setChkClass(c, d, b), !0
	}, a.extend(!0, a.fn.zTree.consts, e), a.extend(!0, a.fn.zTree._z, {
		tools: {},
		view: {
			checkNodeRelation: function (a, b) {
				var c, d, e, f = a.data.key.children,
					g = a.data.key.checked;
				if (c = h.radio, a.check.chkStyle == c.STYLE) {
					var l = j.getRadioCheckedList(a);
					if (b[g])
						if (a.check.radioType == c.TYPE_ALL) {
							for (d = l.length - 1; d >= 0; d--) c = l[d], c[g] && c != b && (c[g] = !1, l.splice(d, 1), i.setChkClass(a, k(c, h.id.CHECK, a), c), c.parentTId != b.parentTId && i.repairParentChkClassWithSelf(a, c));
							l.push(b)
						} else
							for (l = b.parentTId ? b.getParentNode() : j.getRoot(a), d = 0, e = l[f].length; e > d; d++) c = l[f][d], c[g] && c != b && (c[g] = !1, i.setChkClass(a, k(c, h.id.CHECK, a), c));
					else if (a.check.radioType == c.TYPE_ALL)
						for (d = 0, e = l.length; e > d; d++)
							if (b == l[d]) {
								l.splice(d, 1);
								break
							}
				} else b[g] && (!b[f] || 0 == b[f].length || a.check.chkboxType.Y.indexOf("s") > -1) && i.setSonNodeCheckBox(a, b, !0), !b[g] && (!b[f] || 0 == b[f].length || a.check.chkboxType.N.indexOf("s") > -1) && i.setSonNodeCheckBox(a, b, !1), b[g] && a.check.chkboxType.Y.indexOf("p") > -1 && i.setParentNodeCheckBox(a, b, !0), !b[g] && a.check.chkboxType.N.indexOf("p") > -1 && i.setParentNodeCheckBox(a, b, !1)
			},
			makeChkClass: function (a, b) {
				var c = a.data.key.checked,
					d = h.checkbox,
					e = h.radio,
					f = "",
					f = b.chkDisabled === !0 ? d.DISABLED : b.halfCheck ? d.PART : a.check.chkStyle == e.STYLE ? b.check_Child_State < 1 ? d.FULL : d.PART : b[c] ? 2 === b.check_Child_State || -1 === b.check_Child_State ? d.FULL : d.PART : b.check_Child_State < 1 ? d.FULL : d.PART,
					c = a.check.chkStyle + "_" + (b[c] ? d.TRUE : d.FALSE) + "_" + f,
					c = b.check_Focus && b.chkDisabled !== !0 ? c + "_" + d.FOCUS : c;
				return h.className.BUTTON + " " + d.DEFAULT + " " + c
			},
			repairAllChk: function (a, b) {
				if (a.check.enable && a.check.chkStyle === h.checkbox.STYLE)
					for (var c = a.data.key.checked, d = a.data.key.children, e = j.getRoot(a), f = 0, g = e[d].length; g > f; f++) {
						var k = e[d][f];
						k.nocheck !== !0 && k.chkDisabled !== !0 && (k[c] = b), i.setSonNodeCheckBox(a, k, b)
					}
			},
			repairChkClass: function (a, b) {
				if (b && (j.makeChkFlag(a, b), b.nocheck !== !0)) {
					var c = k(b, h.id.CHECK, a);
					i.setChkClass(a, c, b)
				}
			},
			repairParentChkClass: function (a, b) {
				if (b && b.parentTId) {
					var c = b.getParentNode();
					i.repairChkClass(a, c), i.repairParentChkClass(a, c)
				}
			},
			repairParentChkClassWithSelf: function (a, b) {
				if (b) {
					var c = a.data.key.children;
					b[c] && b[c].length > 0 ? i.repairParentChkClass(a, b[c][0]) : i.repairParentChkClass(a, b)
				}
			},
			repairSonChkDisabled: function (a, b, c, d) {
				if (b) {
					var e = a.data.key.children;
					if (b.chkDisabled != c && (b.chkDisabled = c), i.repairChkClass(a, b), b[e] && d)
						for (var f = 0, g = b[e].length; g > f; f++) i.repairSonChkDisabled(a, b[e][f], c, d)
				}
			},
			repairParentChkDisabled: function (a, b, c, d) {
				b && (b.chkDisabled != c && d && (b.chkDisabled = c), i.repairChkClass(a, b), i.repairParentChkDisabled(a, b.getParentNode(), c, d))
			},
			setChkClass: function (a, b, c) {
				b && (c.nocheck === !0 ? b.hide() : b.show(), b.attr("class", i.makeChkClass(a, c)))
			},
			setParentNodeCheckBox: function (a, b, c, d) {
				var e = a.data.key.children,
					f = a.data.key.checked,
					g = k(b, h.id.CHECK, a);
				if (d || (d = b), j.makeChkFlag(a, b), b.nocheck !== !0 && b.chkDisabled !== !0 && (b[f] = c, i.setChkClass(a, g, b), a.check.autoCheckTrigger && b != d && a.treeObj.trigger(h.event.CHECK, [null, a.treeId, b])), b.parentTId) {
					if (g = !0, !c)
						for (var e = b.getParentNode()[e], l = 0, m = e.length; m > l; l++)
							if (e[l].nocheck !== !0 && e[l].chkDisabled !== !0 && e[l][f] || (e[l].nocheck === !0 || e[l].chkDisabled === !0) && e[l].check_Child_State > 0) {
								g = !1;
								break
							}
					g && i.setParentNodeCheckBox(a, b.getParentNode(), c, d)
				}
			},
			setSonNodeCheckBox: function (a, b, c, d) {
				if (b) {
					var e = a.data.key.children,
						f = a.data.key.checked,
						g = k(b, h.id.CHECK, a);
					d || (d = b);
					var l = !1;
					if (b[e])
						for (var m = 0, n = b[e].length; n > m; m++) {
							var o = b[e][m];
							i.setSonNodeCheckBox(a, o, c, d), o.chkDisabled === !0 && (l = !0)
						}
					b != j.getRoot(a) && b.chkDisabled !== !0 && (l && b.nocheck !== !0 && j.makeChkFlag(a, b), b.nocheck !== !0 && b.chkDisabled !== !0 ? (b[f] = c, l || (b.check_Child_State = b[e] && b[e].length > 0 ? c ? 2 : 0 : -1)) : b.check_Child_State = -1, i.setChkClass(a, g, b), a.check.autoCheckTrigger && b != d && b.nocheck !== !0 && b.chkDisabled !== !0 && a.treeObj.trigger(h.event.CHECK, [null, a.treeId, b]))
				}
			}
		},
		event: {},
		data: {
			getRadioCheckedList: function (a) {
				for (var b = j.getRoot(a).radioCheckedList, c = 0, d = b.length; d > c; c++) j.getNodeCache(a, b[c].tId) || (b.splice(c, 1), c--, d--);
				return b
			},
			getCheckStatus: function (a, b) {
				if (!a.check.enable || b.nocheck || b.chkDisabled) return null;
				var c = a.data.key.checked;
				return {
					checked: b[c],
					half: b.halfCheck ? b.halfCheck : a.check.chkStyle == h.radio.STYLE ? 2 === b.check_Child_State : b[c] ? b.check_Child_State > -1 && b.check_Child_State < 2 : b.check_Child_State > 0
				}
			},
			getTreeCheckedNodes: function (a, b, c, d) {
				if (!b) return [];
				for (var e = a.data.key.children, f = a.data.key.checked, g = c && a.check.chkStyle == h.radio.STYLE && a.check.radioType == h.radio.TYPE_ALL, d = d ? d : [], i = 0, k = b.length; k > i && (b[i].nocheck === !0 || b[i].chkDisabled === !0 || b[i][f] != c || (d.push(b[i]), !g)) && (j.getTreeCheckedNodes(a, b[i][e], c, d), !(g && d.length > 0)); i++);
				return d
			},
			getTreeChangeCheckedNodes: function (a, b, c) {
				if (!b) return [];
				for (var d = a.data.key.children, e = a.data.key.checked, c = c ? c : [], f = 0, g = b.length; g > f; f++) b[f].nocheck !== !0 && b[f].chkDisabled !== !0 && b[f][e] != b[f].checkedOld && c.push(b[f]), j.getTreeChangeCheckedNodes(a, b[f][d], c);
				return c
			},
			makeChkFlag: function (a, b) {
				if (b) {
					var c = a.data.key.children,
						d = a.data.key.checked,
						e = -1;
					if (b[c])
						for (var f = 0, g = b[c].length; g > f; f++) {
							var i = b[c][f],
								j = -1;
							if (a.check.chkStyle == h.radio.STYLE) {
								if (j = i.nocheck === !0 || i.chkDisabled === !0 ? i.check_Child_State : i.halfCheck === !0 ? 2 : i[d] ? 2 : i.check_Child_State > 0 ? 2 : 0, 2 == j) {
									e = 2;
									break
								}
								0 == j && (e = 0)
							} else if (a.check.chkStyle == h.checkbox.STYLE) {
								if (j = i.nocheck === !0 || i.chkDisabled === !0 ? i.check_Child_State : i.halfCheck === !0 ? 1 : i[d] ? -1 === i.check_Child_State || 2 === i.check_Child_State ? 2 : 1 : i.check_Child_State > 0 ? 1 : 0, 1 === j) {
									e = 1;
									break
								}
								if (2 === j && e > -1 && f > 0 && j !== e) {
									e = 1;
									break
								}
								if (2 === e && j > -1 && 2 > j) {
									e = 1;
									break
								}
								j > -1 && (e = j)
							}
						}
					b.check_Child_State = e
				}
			}
		}
	});
	var a = a.fn.zTree,
		g = a._z.tools,
		h = a.consts,
		i = a._z.view,
		j = a._z.data,
		k = g.$;
	j.exSetting(f), j.addInitBind(function (a) {
		a.treeObj.bind(h.event.CHECK, function (b, c, d, e) {
			b.srcEvent = c, g.apply(a.callback.onCheck, [b, d, e])
		})
	}), j.addInitUnBind(function (a) {
		a.treeObj.unbind(h.event.CHECK)
	}), j.addInitCache(function () {}), j.addInitNode(function (a, b, c, d) {
		c && (b = a.data.key.checked, "string" == typeof c[b] && (c[b] = g.eqs(c[b], "true")), c[b] = !!c[b], c.checkedOld = c[b], "string" == typeof c.nocheck && (c.nocheck = g.eqs(c.nocheck, "true")), c.nocheck = !!c.nocheck || a.check.nocheckInherit && d && !!d.nocheck, "string" == typeof c.chkDisabled && (c.chkDisabled = g.eqs(c.chkDisabled, "true")), c.chkDisabled = !!c.chkDisabled || a.check.chkDisabledInherit && d && !!d.chkDisabled, "string" == typeof c.halfCheck && (c.halfCheck = g.eqs(c.halfCheck, "true")), c.halfCheck = !!c.halfCheck, c.check_Child_State = -1, c.check_Focus = !1, c.getCheckStatus = function () {
			return j.getCheckStatus(a, c)
		}, a.check.chkStyle == h.radio.STYLE && a.check.radioType == h.radio.TYPE_ALL && c[b] && j.getRoot(a).radioCheckedList.push(c))
	}), j.addInitProxy(function (a) {
		var e = a.target,
			f = j.getSetting(a.data.treeId),
			i = "",
			k = null,
			l = "",
			m = null;
		if (g.eqs(a.type, "mouseover") ? f.check.enable && g.eqs(e.tagName, "span") && null !== e.getAttribute("treeNode" + h.id.CHECK) && (i = g.getNodeMainDom(e).id, l = "mouseoverCheck") : g.eqs(a.type, "mouseout") ? f.check.enable && g.eqs(e.tagName, "span") && null !== e.getAttribute("treeNode" + h.id.CHECK) && (i = g.getNodeMainDom(e).id, l = "mouseoutCheck") : g.eqs(a.type, "click") && f.check.enable && g.eqs(e.tagName, "span") && null !== e.getAttribute("treeNode" + h.id.CHECK) && (i = g.getNodeMainDom(e).id, l = "checkNode"), i.length > 0) switch (k = j.getNodeCache(f, i), l) {
			case "checkNode":
				m = b;
				break;
			case "mouseoverCheck":
				m = c;
				break;
			case "mouseoutCheck":
				m = d
		}
		return {
			stop: "checkNode" === l,
			node: k,
			nodeEventType: l,
			nodeEventCallback: m,
			treeEventType: "",
			treeEventCallback: null
		}
	}, !0), j.addInitRoot(function (a) {
		j.getRoot(a).radioCheckedList = []
	}), j.addBeforeA(function (a, b, c) {
		a.check.enable && (j.makeChkFlag(a, b), c.push("<span ID='", b.tId, h.id.CHECK, "' class='", i.makeChkClass(a, b), "' treeNode", h.id.CHECK, b.nocheck === !0 ? " style='display:none;'" : "", "></span>"))
	}), j.addZTreeTools(function (a, b) {
		b.checkNode = function (a, b, c, d) {
			var e = this.setting.data.key.checked;
			a.chkDisabled === !0 || (b !== !0 && b !== !1 && (b = !a[e]), d = !!d, a[e] === b && !c || d && 0 == g.apply(this.setting.callback.beforeCheck, [this.setting.treeId, a], !0) || !g.uCanDo(this.setting) || !this.setting.check.enable || a.nocheck === !0) || (a[e] = b, b = k(a, h.id.CHECK, this.setting), (c || this.setting.check.chkStyle === h.radio.STYLE) && i.checkNodeRelation(this.setting, a), i.setChkClass(this.setting, b, a), i.repairParentChkClassWithSelf(this.setting, a), d && this.setting.treeObj.trigger(h.event.CHECK, [null, this.setting.treeId, a]))
		}, b.checkAllNodes = function (a) {
			i.repairAllChk(this.setting, !!a)
		}, b.getCheckedNodes = function (a) {
			var b = this.setting.data.key.children;
			return j.getTreeCheckedNodes(this.setting, j.getRoot(this.setting)[b], a !== !1)
		}, b.getChangeCheckedNodes = function () {
			var a = this.setting.data.key.children;
			return j.getTreeChangeCheckedNodes(this.setting, j.getRoot(this.setting)[a])
		}, b.setChkDisabled = function (a, b, c, d) {
			b = !!b, c = !!c, i.repairSonChkDisabled(this.setting, a, b, !!d), i.repairParentChkDisabled(this.setting, a.getParentNode(), b, c)
		};
		var c = b.updateNode;
		b.updateNode = function (a, d) {
			if (c && c.apply(b, arguments), a && this.setting.check.enable && k(a, this.setting).get(0) && g.uCanDo(this.setting)) {
				var e = k(a, h.id.CHECK, this.setting);
				(1 == d || this.setting.check.chkStyle === h.radio.STYLE) && i.checkNodeRelation(this.setting, a), i.setChkClass(this.setting, e, a), i.repairParentChkClassWithSelf(this.setting, a)
			}
		}
	});
	var l = i.createNodes;
	i.createNodes = function (a, b, c, d, e) {
		l && l.apply(i, arguments), c && i.repairParentChkClassWithSelf(a, d)
	};
	var m = i.removeNode;
	i.removeNode = function (a, b) {
		var c = b.getParentNode();
		m && m.apply(i, arguments), b && c && (i.repairChkClass(a, c), i.repairParentChkClass(a, c))
	};
	var n = i.appendNodes;
	i.appendNodes = function (a, b, c, d, e, f, g) {
		var h = "";
		return n && (h = n.apply(i, arguments)), d && j.makeChkFlag(a, d), h
	}
}(jQuery),
function (a) {
	var b = {
			event: {
				DRAG: "ztree_drag",
				DROP: "ztree_drop",
				RENAME: "ztree_rename",
				DRAGMOVE: "ztree_dragmove"
			},
			id: {
				EDIT: "_edit",
				INPUT: "_input",
				REMOVE: "_remove"
			},
			move: {
				TYPE_INNER: "inner",
				TYPE_PREV: "prev",
				TYPE_NEXT: "next"
			},
			node: {
				CURSELECTED_EDIT: "curSelectedNode_Edit",
				TMPTARGET_TREE: "tmpTargetzTree",
				TMPTARGET_NODE: "tmpTargetNode"
			}
		},
		c = {
			onHoverOverNode: function (a, b) {
				var d = h.getSetting(a.data.treeId),
					e = h.getRoot(d);
				e.curHoverNode != b && c.onHoverOutNode(a), e.curHoverNode = b, g.addHoverDom(d, b)
			},
			onHoverOutNode: function (a) {
				var a = h.getSetting(a.data.treeId),
					b = h.getRoot(a);
				b.curHoverNode && !h.isSelectedNode(a, b.curHoverNode) && (g.removeTreeDom(a, b.curHoverNode), b.curHoverNode = null)
			},
			onMousedownNode: function (c, d) {
				function j(c) {
					if (0 == p.dragFlag && Math.abs(I - c.clientX) < o.edit.drag.minMoveSize && Math.abs(J - c.clientY) < o.edit.drag.minMoveSize) return !0;
					var d, j, l, m, n;
					if (n = o.data.key.children, A.css("cursor", "pointer"), 0 == p.dragFlag) {
						if (0 == e.apply(o.callback.beforeDrag, [o.treeId, t], !0)) return k(c), !0;
						for (d = 0, j = t.length; j > d; d++) 0 == d && (p.dragNodeShowBefore = []), l = t[d], l.isParent && l.open ? (g.expandCollapseNode(o, l, !l.open), p.dragNodeShowBefore[l.tId] = !0) : p.dragNodeShowBefore[l.tId] = !1;
						if (p.dragFlag = 1, q.showHoverDom = !1, e.showIfameMask(o, !0), l = !0, m = -1, t.length > 1) {
							var r = t[0].parentTId ? t[0].getParentNode()[n] : h.getNodes(o);
							for (n = [], d = 0, j = r.length; j > d; d++)
								if (void 0 !== p.dragNodeShowBefore[r[d].tId] && (l && m > -1 && m + 1 !== d && (l = !1), n.push(r[d]), m = d), t.length === n.length) {
									t = n;
									break
								}
						}
						for (l && (x = t[0].getPreNode(), y = t[t.length - 1].getNextNode()), u = i("<ul class='zTreeDragUL'></ul>", o), d = 0, j = t.length; j > d; d++) l = t[d], l.editNameFlag = !1, g.selectNode(o, l, d > 0), g.removeTreeDom(o, l), d > o.edit.drag.maxShowNodeNum - 1 || (m = i("<li id='" + l.tId + "_tmp'></li>", o), m.append(i(l, f.id.A, o).clone()), m.css("padding", "0"), m.children("#" + l.tId + f.id.A).removeClass(f.node.CURSELECTED), u.append(m), d == o.edit.drag.maxShowNodeNum - 1 && (m = i("<li id='" + l.tId + "_moretmp'><a>  ...  </a></li>", o), u.append(m)));
						u.attr("id", t[0].tId + f.id.UL + "_tmp"), u.addClass(o.treeObj.attr("class")), u.appendTo(A), v = i("<span class='tmpzTreeMove_arrow'></span>", o), v.attr("id", "zTreeMove_arrow_tmp"), v.appendTo(A), o.treeObj.trigger(f.event.DRAG, [c, o.treeId, t])
					}
					if (1 == p.dragFlag) {
						w && v.attr("id") == c.target.id && G && c.clientX + z.scrollLeft() + 2 > a("#" + G + f.id.A, w).offset().left ? (l = a("#" + G + f.id.A, w), c.target = l.length > 0 ? l.get(0) : c.target) : w && (w.removeClass(f.node.TMPTARGET_TREE), G && a("#" + G + f.id.A, w).removeClass(f.node.TMPTARGET_NODE + "_" + f.move.TYPE_PREV).removeClass(f.node.TMPTARGET_NODE + "_" + b.move.TYPE_NEXT).removeClass(f.node.TMPTARGET_NODE + "_" + b.move.TYPE_INNER)), G = w = null, B = !1, C = o, l = h.getSettings();
						for (var s in l) l[s].treeId && l[s].edit.enable && l[s].treeId != o.treeId && (c.target.id == l[s].treeId || a(c.target).parents("#" + l[s].treeId).length > 0) && (B = !0, C = l[s]);
						s = z.scrollTop(), m = z.scrollLeft(), n = C.treeObj.offset(), d = C.treeObj.get(0).scrollHeight, l = C.treeObj.get(0).scrollWidth, j = c.clientY + s - n.top;
						var D = C.treeObj.height() + n.top - c.clientY - s,
							L = c.clientX + m - n.left,
							M = C.treeObj.width() + n.left - c.clientX - m;
						n = j < o.edit.drag.borderMax && j > o.edit.drag.borderMin;
						var r = D < o.edit.drag.borderMax && D > o.edit.drag.borderMin,
							N = L < o.edit.drag.borderMax && L > o.edit.drag.borderMin,
							O = M < o.edit.drag.borderMax && M > o.edit.drag.borderMin,
							D = j > o.edit.drag.borderMin && D > o.edit.drag.borderMin && L > o.edit.drag.borderMin && M > o.edit.drag.borderMin,
							L = n && C.treeObj.scrollTop() <= 0,
							M = r && C.treeObj.scrollTop() + C.treeObj.height() + 10 >= d,
							P = N && C.treeObj.scrollLeft() <= 0,
							Q = O && C.treeObj.scrollLeft() + C.treeObj.width() + 10 >= l;
						if (c.target && e.isChildOrSelf(c.target, C.treeId)) {
							for (var R = c.target; R && R.tagName && !e.eqs(R.tagName, "li") && R.id != C.treeId;) R = R.parentNode;
							var S = !0;
							for (d = 0, j = t.length; j > d; d++) {
								if (l = t[d], R.id === l.tId) {
									S = !1;
									break
								}
								if (i(l, o).find("#" + R.id).length > 0) {
									S = !1;
									break
								}
							}
							S && c.target && e.isChildOrSelf(c.target, R.id + f.id.A) && (w = a(R), G = R.id)
						}
						if (l = t[0], D && e.isChildOrSelf(c.target, C.treeId) && (!w && (c.target.id == C.treeId || L || M || P || Q) && (B || !B && l.parentTId) && (w = C.treeObj), n ? C.treeObj.scrollTop(C.treeObj.scrollTop() - 10) : r && C.treeObj.scrollTop(C.treeObj.scrollTop() + 10), N ? C.treeObj.scrollLeft(C.treeObj.scrollLeft() - 10) : O && C.treeObj.scrollLeft(C.treeObj.scrollLeft() + 10), w && w != C.treeObj && w.offset().left < C.treeObj.offset().left && C.treeObj.scrollLeft(C.treeObj.scrollLeft() + w.offset().left - C.treeObj.offset().left)), u.css({
								top: c.clientY + s + 3 + "px",
								left: c.clientX + m + 3 + "px"
							}), j = d = 0, w && w.attr("id") != C.treeId) {
							var T = null == G ? null : h.getNodeCache(C, G);
							n = (c.ctrlKey || c.metaKey) && o.edit.drag.isMove && o.edit.drag.isCopy || !o.edit.drag.isMove && o.edit.drag.isCopy, m = !(!x || G !== x.tId), N = !(!y || G !== y.tId), r = l.parentTId && l.parentTId == G, l = (n || !N) && e.apply(C.edit.drag.prev, [C.treeId, t, T], !!C.edit.drag.prev), m = (n || !m) && e.apply(C.edit.drag.next, [C.treeId, t, T], !!C.edit.drag.next), n = (n || !r) && !(C.data.keep.leaf && !T.isParent) && e.apply(C.edit.drag.inner, [C.treeId, t, T], !!C.edit.drag.inner), r = function () {
								w = null, G = "", H = f.move.TYPE_INNER, v.css({
									display: "none"
								}), window.zTreeMoveTimer && (clearTimeout(window.zTreeMoveTimer), window.zTreeMoveTargetNodeTId = null)
							}, l || m || n ? (N = a("#" + G + f.id.A, w), O = T.isLastNode ? null : a("#" + T.getNextNode().tId + f.id.A, w.next()), D = N.offset().top, L = N.offset().left, M = l ? n ? .25 : m ? .5 : 1 : -1, P = m ? n ? .75 : l ? .5 : 0 : -1, s = (c.clientY + s - D) / N.height(), (1 == M || M >= s && s >= -.2) && l ? (d = 1 - v.width(), j = D - v.height() / 2, H = f.move.TYPE_PREV) : (0 == P || s >= P && 1.2 >= s) && m ? (d = 1 - v.width(), j = null == O || T.isParent && T.open ? D + N.height() - v.height() / 2 : O.offset().top - v.height() / 2, H = f.move.TYPE_NEXT) : n ? (d = 5 - v.width(), j = D, H = f.move.TYPE_INNER) : r(), w && (v.css({
								display: "block",
								top: j + "px",
								left: L + d + "px"
							}), N.addClass(f.node.TMPTARGET_NODE + "_" + H), (E != G || F != H) && (K = (new Date).getTime()), T && T.isParent && H == f.move.TYPE_INNER && (s = !0, window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== T.tId ? (clearTimeout(window.zTreeMoveTimer), window.zTreeMoveTargetNodeTId = null) : window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === T.tId && (s = !1), s) && (window.zTreeMoveTimer = setTimeout(function () {
								H == f.move.TYPE_INNER && T && T.isParent && !T.open && (new Date).getTime() - K > C.edit.drag.autoOpenTime && e.apply(C.callback.beforeDragOpen, [C.treeId, T], !0) && (g.switchNode(C, T), C.edit.drag.autoExpandTrigger && C.treeObj.trigger(f.event.EXPAND, [C.treeId, T]))
							}, C.edit.drag.autoOpenTime + 50), window.zTreeMoveTargetNodeTId = T.tId))) : r()
						} else H = f.move.TYPE_INNER, w && e.apply(C.edit.drag.inner, [C.treeId, t, null], !!C.edit.drag.inner) ? w.addClass(f.node.TMPTARGET_TREE) : w = null, v.css({
							display: "none"
						}), window.zTreeMoveTimer && (clearTimeout(window.zTreeMoveTimer), window.zTreeMoveTargetNodeTId = null);
						E = G, F = H, o.treeObj.trigger(f.event.DRAGMOVE, [c, o.treeId, t])
					}
					return !1
				}

				function k(c) {
					if (window.zTreeMoveTimer && (clearTimeout(window.zTreeMoveTimer), window.zTreeMoveTargetNodeTId = null), F = E = null, z.unbind("mousemove", j), z.unbind("mouseup", k), z.unbind("selectstart", l), A.css("cursor", "auto"), w && (w.removeClass(f.node.TMPTARGET_TREE), G && a("#" + G + f.id.A, w).removeClass(f.node.TMPTARGET_NODE + "_" + f.move.TYPE_PREV).removeClass(f.node.TMPTARGET_NODE + "_" + b.move.TYPE_NEXT).removeClass(f.node.TMPTARGET_NODE + "_" + b.move.TYPE_INNER)), e.showIfameMask(o, !1), q.showHoverDom = !0, 0 != p.dragFlag) {
						p.dragFlag = 0;
						var d, m, n;
						for (d = 0, m = t.length; m > d; d++) n = t[d], n.isParent && p.dragNodeShowBefore[n.tId] && !n.open && (g.expandCollapseNode(o, n, !n.open), delete p.dragNodeShowBefore[n.tId]);
						u && u.remove(), v && v.remove();
						var r = (c.ctrlKey || c.metaKey) && o.edit.drag.isMove && o.edit.drag.isCopy || !o.edit.drag.isMove && o.edit.drag.isCopy;
						if (!r && w && G && t[0].parentTId && G == t[0].parentTId && H == f.move.TYPE_INNER && (w = null), w) {
							var s = null == G ? null : h.getNodeCache(C, G);
							if (0 == e.apply(o.callback.beforeDrop, [C.treeId, t, s, H, r], !0)) g.selectNodes(D, t);
							else {
								var x = r ? e.clone(t) : t;
								d = function () {
									if (B) {
										if (!r)
											for (var a = 0, b = t.length; b > a; a++) g.removeNode(o, t[a]);
										H == f.move.TYPE_INNER ? g.addNodes(C, s, -1, x) : g.addNodes(C, s.getParentNode(), H == f.move.TYPE_PREV ? s.getIndex() : s.getIndex() + 1, x)
									} else if (r && H == f.move.TYPE_INNER) g.addNodes(C, s, -1, x);
									else if (r) g.addNodes(C, s.getParentNode(), H == f.move.TYPE_PREV ? s.getIndex() : s.getIndex() + 1, x);
									else if (H != f.move.TYPE_NEXT)
										for (a = 0, b = x.length; b > a; a++) g.moveNode(C, s, x[a], H, !1);
									else
										for (a = -1, b = x.length - 1; b > a; b--) g.moveNode(C, s, x[b], H, !1);
									g.selectNodes(C, x), a = i(x[0], o).get(0), g.scrollIntoView(a), o.treeObj.trigger(f.event.DROP, [c, C.treeId, x, s, H, r])
								}, H == f.move.TYPE_INNER && e.canAsync(C, s) ? g.asyncNode(C, s, !1, d) : d()
							}
						} else g.selectNodes(D, t), o.treeObj.trigger(f.event.DROP, [c, o.treeId, t, null, null, null])
					}
				}

				function l() {
					return !1
				}
				var m, n, o = h.getSetting(c.data.treeId),
					p = h.getRoot(o),
					q = h.getRoots();
				if (2 == c.button || !o.edit.enable || !o.edit.drag.isCopy && !o.edit.drag.isMove) return !0;
				var r = c.target,
					s = h.getRoot(o).curSelectedList,
					t = [];
				if (h.isSelectedNode(o, d))
					for (m = 0, n = s.length; n > m; m++) {
						if (s[m].editNameFlag && e.eqs(r.tagName, "input") && null !== r.getAttribute("treeNode" + f.id.INPUT)) return !0;
						if (t.push(s[m]), t[0].parentTId !== s[m].parentTId) {
							t = [d];
							break
						}
					} else t = [d];
				g.editNodeBlur = !0, g.cancelCurEditNode(o);
				var u, v, w, x, y, z = a(o.treeObj.get(0).ownerDocument),
					A = a(o.treeObj.get(0).ownerDocument.body),
					B = !1,
					C = o,
					D = o,
					E = null,
					F = null,
					G = null,
					H = f.move.TYPE_INNER,
					I = c.clientX,
					J = c.clientY,
					K = (new Date).getTime();
				return e.uCanDo(o) && z.bind("mousemove", j), z.bind("mouseup", k), z.bind("selectstart", l), c.preventDefault && c.preventDefault(), !0
			}
		};
	a.extend(!0, a.fn.zTree.consts, b), a.extend(!0, a.fn.zTree._z, {
		tools: {
			getAbs: function (a) {
				return a = a.getBoundingClientRect(), [a.left + (document.body.scrollLeft + document.documentElement.scrollLeft), a.top + (document.body.scrollTop + document.documentElement.scrollTop)]
			},
			inputFocus: function (a) {
				a.get(0) && (a.focus(), e.setCursorPosition(a.get(0), a.val().length))
			},
			inputSelect: function (a) {
				a.get(0) && (a.focus(), a.select())
			},
			setCursorPosition: function (a, b) {
				if (a.setSelectionRange) a.focus(), a.setSelectionRange(b, b);
				else if (a.createTextRange) {
					var c = a.createTextRange();
					c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", b), c.select()
				}
			},
			showIfameMask: function (a, b) {
				for (var c = h.getRoot(a); c.dragMaskList.length > 0;) c.dragMaskList[0].remove(), c.dragMaskList.shift();
				if (b)
					for (var d = i("iframe", a), f = 0, g = d.length; g > f; f++) {
						var j = d.get(f),
							k = e.getAbs(j),
							j = i("<div id='zTreeMask_" + f + "' class='zTreeMask' style='top:" + k[1] + "px; left:" + k[0] + "px; width:" + j.offsetWidth + "px; height:" + j.offsetHeight + "px;'></div>", a);
						j.appendTo(i("body", a)), c.dragMaskList.push(j)
					}
			}
		},
		view: {
			addEditBtn: function (a, b) {
				if (!(b.editNameFlag || i(b, f.id.EDIT, a).length > 0) && e.apply(a.edit.showRenameBtn, [a.treeId, b], a.edit.showRenameBtn)) {
					var c = i(b, f.id.A, a),
						d = "<span class='" + f.className.BUTTON + " edit' id='" + b.tId + f.id.EDIT + "' title='" + e.apply(a.edit.renameTitle, [a.treeId, b], a.edit.renameTitle) + "' treeNode" + f.id.EDIT + " style='display:none;'></span>";
					c.append(d), i(b, f.id.EDIT, a).bind("click", function () {
						return e.uCanDo(a) && 0 != e.apply(a.callback.beforeEditName, [a.treeId, b], !0) ? (g.editNode(a, b), !1) : !1
					}).show()
				}
			},
			addRemoveBtn: function (a, b) {
				if (!(b.editNameFlag || i(b, f.id.REMOVE, a).length > 0) && e.apply(a.edit.showRemoveBtn, [a.treeId, b], a.edit.showRemoveBtn)) {
					var c = i(b, f.id.A, a),
						d = "<span class='" + f.className.BUTTON + " remove' id='" + b.tId + f.id.REMOVE + "' title='" + e.apply(a.edit.removeTitle, [a.treeId, b], a.edit.removeTitle) + "' treeNode" + f.id.REMOVE + " style='display:none;'></span>";
					c.append(d), i(b, f.id.REMOVE, a).bind("click", function () {
						return e.uCanDo(a) && 0 != e.apply(a.callback.beforeRemove, [a.treeId, b], !0) ? (g.removeNode(a, b), a.treeObj.trigger(f.event.REMOVE, [a.treeId, b]), !1) : !1
					}).bind("mousedown", function () {
						return !0
					}).show()
				}
			},
			addHoverDom: function (a, b) {
				h.getRoots().showHoverDom && (b.isHover = !0, a.edit.enable && (g.addEditBtn(a, b), g.addRemoveBtn(a, b)), e.apply(a.view.addHoverDom, [a.treeId, b]))
			},
			cancelCurEditNode: function (a, b, c) {
				var d = h.getRoot(a),
					j = a.data.key.name,
					k = d.curEditNode;
				if (k) {
					var l = d.curEditInput,
						b = b ? b : c ? k[j] : l.val();
					if (e.apply(a.callback.beforeRename, [a.treeId, k, b, c], !0) === !1) return !1;
					k[j] = b, i(k, f.id.A, a).removeClass(f.node.CURSELECTED_EDIT), l.unbind(), g.setNodeName(a, k), k.editNameFlag = !1, d.curEditNode = null, d.curEditInput = null, g.selectNode(a, k, !1), a.treeObj.trigger(f.event.RENAME, [a.treeId, k, c])
				}
				return d.noSelection = !0
			},
			editNode: function (a, b) {
				var c = h.getRoot(a);
				if (g.editNodeBlur = !1, h.isSelectedNode(a, b) && c.curEditNode == b && b.editNameFlag) setTimeout(function () {
					e.inputFocus(c.curEditInput)
				}, 0);
				else {
					var d = a.data.key.name;
					b.editNameFlag = !0, g.removeTreeDom(a, b), g.cancelCurEditNode(a), g.selectNode(a, b, !1), i(b, f.id.SPAN, a).html("<input type=text class='rename' id='" + b.tId + f.id.INPUT + "' treeNode" + f.id.INPUT + " >");
					var j = i(b, f.id.INPUT, a);
					j.attr("value", b[d]), a.edit.editNameSelectAll ? e.inputSelect(j) : e.inputFocus(j), j.bind("blur", function () {
						g.editNodeBlur || g.cancelCurEditNode(a)
					}).bind("keydown", function (b) {
						"13" == b.keyCode ? (g.editNodeBlur = !0, g.cancelCurEditNode(a)) : "27" == b.keyCode && g.cancelCurEditNode(a, null, !0)
					}).bind("click", function () {
						return !1
					}).bind("dblclick", function () {
						return !1
					}), i(b, f.id.A, a).addClass(f.node.CURSELECTED_EDIT), c.curEditInput = j, c.noSelection = !1, c.curEditNode = b
				}
			},
			moveNode: function (a, b, c, d, e, j) {
				var k = h.getRoot(a),
					l = a.data.key.children;
				if (b != c && (!a.data.keep.leaf || !b || b.isParent || d != f.move.TYPE_INNER)) {
					var m = c.parentTId ? c.getParentNode() : k,
						n = null === b || b == k;
					n && null === b && (b = k), n && (d = f.move.TYPE_INNER), k = b.parentTId ? b.getParentNode() : k, d != f.move.TYPE_PREV && d != f.move.TYPE_NEXT && (d = f.move.TYPE_INNER), d == f.move.TYPE_INNER && (n ? c.parentTId = null : (b.isParent || (b.isParent = !0, b.open = !!b.open, g.setNodeLineIcos(a, b)), c.parentTId = b.tId));
					var o;
					n ? o = n = a.treeObj : (j || d != f.move.TYPE_INNER ? j || g.expandCollapseNode(a, b.getParentNode(), !0, !1) : g.expandCollapseNode(a, b, !0, !1), n = i(b, a), o = i(b, f.id.UL, a), n.get(0) && !o.get(0) && (o = [], g.makeUlHtml(a, b, o, ""), n.append(o.join(""))), o = i(b, f.id.UL, a));
					var p = i(c, a);
					p.get(0) ? n.get(0) || p.remove() : p = g.appendNodes(a, c.level, [c], null, -1, !1, !0).join(""), o.get(0) && d == f.move.TYPE_INNER ? o.append(p) : n.get(0) && d == f.move.TYPE_PREV ? n.before(p) : n.get(0) && d == f.move.TYPE_NEXT && n.after(p);
					var q = -1,
						r = 0,
						s = null,
						n = null,
						t = c.level;
					if (c.isFirstNode) q = 0, m[l].length > 1 && (s = m[l][1], s.isFirstNode = !0);
					else if (c.isLastNode) q = m[l].length - 1, s = m[l][q - 1], s.isLastNode = !0;
					else
						for (o = 0, p = m[l].length; p > o; o++)
							if (m[l][o].tId == c.tId) {
								q = o;
								break
							} if (q >= 0 && m[l].splice(q, 1), d != f.move.TYPE_INNER)
						for (o = 0, p = k[l].length; p > o; o++) k[l][o].tId == b.tId && (r = o);
					d == f.move.TYPE_INNER ? (b[l] || (b[l] = []), b[l].length > 0 && (n = b[l][b[l].length - 1], n.isLastNode = !1), b[l].splice(b[l].length, 0, c), c.isLastNode = !0, c.isFirstNode = 1 == b[l].length) : b.isFirstNode && d == f.move.TYPE_PREV ? (k[l].splice(r, 0, c), n = b, n.isFirstNode = !1, c.parentTId = b.parentTId, c.isFirstNode = !0, c.isLastNode = !1) : b.isLastNode && d == f.move.TYPE_NEXT ? (k[l].splice(r + 1, 0, c), n = b, n.isLastNode = !1, c.parentTId = b.parentTId, c.isFirstNode = !1, c.isLastNode = !0) : (d == f.move.TYPE_PREV ? k[l].splice(r, 0, c) : k[l].splice(r + 1, 0, c), c.parentTId = b.parentTId, c.isFirstNode = !1, c.isLastNode = !1), h.fixPIdKeyValue(a, c), h.setSonNodeLevel(a, c.getParentNode(), c), g.setNodeLineIcos(a, c), g.repairNodeLevelClass(a, c, t), !a.data.keep.parent && m[l].length < 1 ? (m.isParent = !1, m.open = !1, b = i(m, f.id.UL, a), d = i(m, f.id.SWITCH, a), l = i(m, f.id.ICON, a), g.replaceSwitchClass(m, d, f.folder.DOCU), g.replaceIcoClass(m, l, f.folder.DOCU), b.css("display", "none")) : s && g.setNodeLineIcos(a, s), n && g.setNodeLineIcos(a, n), a.check && a.check.enable && g.repairChkClass && (g.repairChkClass(a, m), g.repairParentChkClassWithSelf(a, m), m != c.parent && g.repairParentChkClassWithSelf(a, c)), j || g.expandCollapseParentNode(a, c.getParentNode(), !0, e)
				}
			},
			removeEditBtn: function (a, b) {
				i(b, f.id.EDIT, a).unbind().remove()
			},
			removeRemoveBtn: function (a, b) {
				i(b, f.id.REMOVE, a).unbind().remove()
			},
			removeTreeDom: function (a, b) {
				b.isHover = !1, g.removeEditBtn(a, b), g.removeRemoveBtn(a, b), e.apply(a.view.removeHoverDom, [a.treeId, b])
			},
			repairNodeLevelClass: function (a, b, c) {
				if (c !== b.level) {
					var d = i(b, a),
						e = i(b, f.id.A, a),
						a = i(b, f.id.UL, a),
						c = f.className.LEVEL + c,
						b = f.className.LEVEL + b.level;
					d.removeClass(c), d.addClass(b), e.removeClass(c), e.addClass(b), a.removeClass(c), a.addClass(b)
				}
			},
			selectNodes: function (a, b) {
				for (var c = 0, d = b.length; d > c; c++) g.selectNode(a, b[c], c > 0)
			}
		},
		event: {},
		data: {
			setSonNodeLevel: function (a, b, c) {
				if (c) {
					var d = a.data.key.children;
					if (c.level = b ? b.level + 1 : 0, c[d])
						for (var b = 0, e = c[d].length; e > b; b++) c[d][b] && h.setSonNodeLevel(a, c, c[d][b])
				}
			}
		}
	});
	var d = a.fn.zTree,
		e = d._z.tools,
		f = d.consts,
		g = d._z.view,
		h = d._z.data,
		i = e.$;
	h.exSetting({
		edit: {
			enable: !1,
			editNameSelectAll: !1,
			showRemoveBtn: !0,
			showRenameBtn: !0,
			removeTitle: "remove",
			renameTitle: "rename",
			drag: {
				autoExpandTrigger: !1,
				isCopy: !0,
				isMove: !0,
				prev: !0,
				next: !0,
				inner: !0,
				minMoveSize: 5,
				borderMax: 10,
				borderMin: -5,
				maxShowNodeNum: 5,
				autoOpenTime: 500
			}
		},
		view: {
			addHoverDom: null,
			removeHoverDom: null
		},
		callback: {
			beforeDrag: null,
			beforeDragOpen: null,
			beforeDrop: null,
			beforeEditName: null,
			beforeRename: null,
			onDrag: null,
			onDragMove: null,
			onDrop: null,
			onRename: null
		}
	}), h.addInitBind(function (a) {
		var b = a.treeObj,
			c = f.event;
		b.bind(c.RENAME, function (b, c, d, f) {
			e.apply(a.callback.onRename, [b, c, d, f])
		}), b.bind(c.DRAG, function (b, c, d, f) {
			e.apply(a.callback.onDrag, [c, d, f])
		}), b.bind(c.DRAGMOVE, function (b, c, d, f) {
			e.apply(a.callback.onDragMove, [c, d, f])
		}), b.bind(c.DROP, function (b, c, d, f, g, h, i) {
			e.apply(a.callback.onDrop, [c, d, f, g, h, i])
		})
	}), h.addInitUnBind(function (a) {
		var a = a.treeObj,
			b = f.event;
		a.unbind(b.RENAME), a.unbind(b.DRAG), a.unbind(b.DRAGMOVE), a.unbind(b.DROP)
	}), h.addInitCache(function () {}), h.addInitNode(function (a, b, c) {
		c && (c.isHover = !1, c.editNameFlag = !1)
	}), h.addInitProxy(function (a) {
		var b = a.target,
			d = h.getSetting(a.data.treeId),
			g = a.relatedTarget,
			i = "",
			j = null,
			k = "",
			l = null,
			m = null;
		if (e.eqs(a.type, "mouseover") ? (m = e.getMDom(d, b, [{
				tagName: "a",
				attrName: "treeNode" + f.id.A
			}])) && (i = e.getNodeMainDom(m).id, k = "hoverOverNode") : e.eqs(a.type, "mouseout") ? (m = e.getMDom(d, g, [{
				tagName: "a",
				attrName: "treeNode" + f.id.A
			}]), m || (i = "remove", k = "hoverOutNode")) : e.eqs(a.type, "mousedown") && (m = e.getMDom(d, b, [{
				tagName: "a",
				attrName: "treeNode" + f.id.A
			}])) && (i = e.getNodeMainDom(m).id, k = "mousedownNode"), i.length > 0) switch (j = h.getNodeCache(d, i), k) {
			case "mousedownNode":
				l = c.onMousedownNode;
				break;
			case "hoverOverNode":
				l = c.onHoverOverNode;
				break;
			case "hoverOutNode":
				l = c.onHoverOutNode
		}
		return {
			stop: !1,
			node: j,
			nodeEventType: k,
			nodeEventCallback: l,
			treeEventType: "",
			treeEventCallback: null
		}
	}), h.addInitRoot(function (a) {
		var a = h.getRoot(a),
			b = h.getRoots();
		a.curEditNode = null, a.curEditInput = null, a.curHoverNode = null, a.dragFlag = 0, a.dragNodeShowBefore = [], a.dragMaskList = [], b.showHoverDom = !0
	}), h.addZTreeTools(function (a, b) {
		b.cancelEditName = function (a) {
			h.getRoot(this.setting).curEditNode && g.cancelCurEditNode(this.setting, a ? a : null, !0)
		}, b.copyNode = function (a, b, c, d) {
			if (!b) return null;
			if (a && !a.isParent && this.setting.data.keep.leaf && c === f.move.TYPE_INNER) return null;
			var h = this,
				i = e.clone(b);
			return a || (a = null, c = f.move.TYPE_INNER), c == f.move.TYPE_INNER ? (b = function () {
				g.addNodes(h.setting, a, -1, [i], d)
			}, e.canAsync(this.setting, a) ? g.asyncNode(this.setting, a, d, b) : b()) : (g.addNodes(this.setting, a.parentNode, -1, [i], d), g.moveNode(this.setting, a, i, c, !1, d)), i
		}, b.editName = function (a) {
			a && a.tId && a === h.getNodeCache(this.setting, a.tId) && (a.parentTId && g.expandCollapseParentNode(this.setting, a.getParentNode(), !0), g.editNode(this.setting, a))
		}, b.moveNode = function (a, b, c, d) {
			function h() {
				g.moveNode(j.setting, a, b, c, !1, d)
			}
			if (!b) return b;
			if (a && !a.isParent && this.setting.data.keep.leaf && c === f.move.TYPE_INNER) return null;
			if (a && (b.parentTId == a.tId && c == f.move.TYPE_INNER || i(b, this.setting).find("#" + a.tId).length > 0)) return null;
			a || (a = null);
			var j = this;
			return e.canAsync(this.setting, a) && c === f.move.TYPE_INNER ? g.asyncNode(this.setting, a, d, h) : h(), b
		}, b.setEditable = function (a) {
			return this.setting.edit.enable = a, this.refresh()
		}
	});
	var j = g.cancelPreSelectedNode;
	g.cancelPreSelectedNode = function (a, b) {
		for (var c = h.getRoot(a).curSelectedList, d = 0, e = c.length; e > d && (b && b !== c[d] || (g.removeTreeDom(a, c[d]), !b)); d++);
		j && j.apply(g, arguments)
	};
	var k = g.createNodes;
	g.createNodes = function (a, b, c, d, e) {
		k && k.apply(g, arguments), c && g.repairParentChkClassWithSelf && g.repairParentChkClassWithSelf(a, d)
	};
	var l = g.makeNodeUrl;
	g.makeNodeUrl = function (a, b) {
		return a.edit.enable ? null : l.apply(g, arguments)
	};
	var m = g.removeNode;
	g.removeNode = function (a, b) {
		var c = h.getRoot(a);
		c.curEditNode === b && (c.curEditNode = null), m && m.apply(g, arguments)
	};
	var n = g.selectNode;
	g.selectNode = function (a, b, c) {
		var d = h.getRoot(a);
		return h.isSelectedNode(a, b) && d.curEditNode == b && b.editNameFlag ? !1 : (n && n.apply(g, arguments), g.addHoverDom(a, b), !0)
	};
	var o = e.uCanDo;
	e.uCanDo = function (a, b) {
		var c = h.getRoot(a);
		return b && (e.eqs(b.type, "mouseover") || e.eqs(b.type, "mouseout") || e.eqs(b.type, "mousedown") || e.eqs(b.type, "mouseup")) ? !0 : (c.curEditNode && (g.editNodeBlur = !1, c.curEditInput.focus()), !c.curEditNode && (o ? o.apply(g, arguments) : !0))
	}
}(jQuery), "object" != typeof JSON && (JSON = {}),
	function () {
		"use strict";

		function f(a) {
			return 10 > a ? "0" + a : a
		}

		function quote(a) {
			return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) {
				var b = meta[a];
				return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
			}) + '"' : '"' + a + '"'
		}

		function str(a, b) {
			var c, d, e, f, g, h = gap,
				i = b[a];
			switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
				case "string":
					return quote(i);
				case "number":
					return isFinite(i) ? String(i) : "null";
				case "boolean":
				case "null":
					return String(i);
				case "object":
					if (!i) return "null";
					if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
						for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
						return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
					}
					if (rep && "object" == typeof rep)
						for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
					else
						for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
					return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
			}
		}
		"function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		}, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
			return this.valueOf()
		});
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap, indent, meta = {
				"\b": "\\b",
				"	": "\\t",
				"\n": "\\n",
				"\f": "\\f",
				"\r": "\\r",
				'"': '\\"',
				"\\": "\\\\"
			},
			rep;
		"function" != typeof JSON.stringify && (JSON.stringify = function (a, b, c) {
			var d;
			if (gap = "", indent = "", "number" == typeof c)
				for (d = 0; c > d; d += 1) indent += " ";
			else "string" == typeof c && (indent = c);
			if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
			return str("", {
				"": a
			})
		}), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
			function walk(a, b) {
				var c, d, e = a[b];
				if (e && "object" == typeof e)
					for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
				return reviver.call(a, b, e)
			}
			var j;
			if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (a) {
					return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				})), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
				"": j
			}, "") : j;
			throw new SyntaxError("JSON.parse")
		})
	}();
