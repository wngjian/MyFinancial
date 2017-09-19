/** common.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['layer'], function(exports) {
	"use strict";

	var $ = layui.jquery,
		layer = layui.layer;

	var common = {
		/**
		 * 抛出一个异常错误信息
		 * @param {String} msg
		 */
		throwError: function(msg) {
			throw new Error(msg);
			return;
		},
		/**
		 * 弹出一个错误提示
		 * @param {String} msg
		 */
		msgError: function(msg) {
			layer.msg(msg, {
				icon: 5
			});
			return;
		}
	};

	exports('common', common);
});


var Public = Public || {};
Public.isIE6 = !window.XMLHttpRequest;
$.browser = {};
$.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
/*获取URL参数值*/
Public.getRequest = function() {
   var param, url = location.search, theRequest = {};
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0, len = strs.length; i < len; i ++) {
     param = strs[i].split("=");
         theRequest[param[0]]=decodeURIComponent(param[1]);
      }
   }
   return theRequest;
};
/*批量绑定页签打开*/
Public.pageTab = function() {
  $(document).on('click', '[rel=pageTab]', function(e){
    e.preventDefault();
    var rightId = $(this).data('requiredright');
    if (rightId && !Business.verifyRight(rightId)) {
      return ;
    }
    var tabid = $(this).attr('tabid'), url = $(this).attr('href'), showClose = $(this).attr('showClose'), text = $(this).attr('tabTxt') || $(this).text(),parentOpen = $(this).attr('parentOpen');
    if(parentOpen){
      parent.tab.addTabItem({tabid: tabid, text: text, url: url, showClose: showClose});
    } else {
      tab.addTabItem({tabid: tabid, text: text, url: url, showClose: showClose});
    }
  });
};
//操作项格式化，适用于有“修改、删除”操作的表格
Public.operFmatter = function (val, opt, row) {
  var html_con = '<div class="operating" data-id="' + row.id + '"><span class="ui-icon ui-icon-pencil" title="修改"></span><span class="ui-icon ui-icon-trash" title="删除"></span></div>';
  return html_con;
};

Public.billsOper = function (val, opt, row) {
  var html_con = '<div class="operating" data-id="' + opt.rowId + '"><span class="ui-icon ui-icon-plus" title="新增行"></span><span class="ui-icon ui-icon-trash" title="删除行"></span></div>';
  return html_con;
};
//设置表格宽高
Public.setGrid = function(adjust,timelineW){
  var adjust = adjust || 64;
  var gridW = $(window).width() - 20 - (timelineW||0), gridH = $(window).height() - $("#dataGrid").offset().top - adjust;
  return {
    w : gridW,
    h : gridH
  }
};
//重置表格宽高
Public.resetGrid = function(adjust,timelineW){
  var resize = Public.setGrid(adjust,timelineW);
  $("#grid").jqGrid('setGridWidth', resize.w);
  $("#grid").jqGrid('setGridHeight', resize.h);
};
//重设表格宽高
Public.resizeGrid = function(adjustH, adjustW){
  var grid = $("#grid");
  var gridWH = Public.setGrid(adjustH, adjustW);
  grid.jqGrid('setGridHeight', gridWH.h);
  grid.jqGrid('setGridWidth', gridWH.w);
};
Public.tips = function(options){ return new Public.Tips(options); }
Public.Tips = function(options){
  var defaults = {
    renderTo: 'body',
    type : 0,
    autoClose : true,
    removeOthers : true,
    time : undefined,
    top : 15,
    onClose : null,
    onShow : null
  }
  this.options = $.extend({},defaults,options);
  this._init();

  !Public.Tips._collection ?  Public.Tips._collection = [this] : Public.Tips._collection.push(this);

}

Public.Tips.removeAll = function(){
  try {
    for(var i=Public.Tips._collection.length-1; i>=0; i--){
      Public.Tips._collection[i].remove();
    }
  }catch(e){}
}

Public.Tips.prototype = {
  _init : function(){
    var self = this,opts = this.options,time;
    if(opts.removeOthers){
      Public.Tips.removeAll();
    }

    this._create();

    this.closeBtn.bind('click',function(){
      self.remove();
    });

    if(opts.autoClose){
      time = opts.time || (opts.type == 1 ? 8000 : 3000);
      window.setTimeout(function(){
        self.remove();
      },time);
    }

  },

  _create : function(){
    var opts = this.options;
    this.obj = $('<div class="ui-tips"><i></i><span class="close"></span></div>').append(opts.content);
    this.closeBtn = this.obj.find('.close');

    switch(opts.type){
      case 0 :
        this.obj.addClass('ui-tips-success');
        break ;
      case 1 :
        this.obj.addClass('ui-tips-error');
        break ;
      case 2 :
        this.obj.addClass('ui-tips-warning');
        break ;
      default :
        this.obj.addClass('ui-tips-success');
        break ;
    }

    this.obj.appendTo('body').hide();
    this._setPos();
    if(opts.onShow){
        opts.onShow();
    }

  },

  _setPos : function(){
    var self = this, opts = this.options;
    if(opts.width){
      this.obj.css('width',opts.width);
    }
    var h =  this.obj.outerHeight(),winH = $(window).height(),scrollTop = $(window).scrollTop();
    //var top = parseInt(opts.top) ? (parseInt(opts.top) + scrollTop) : (winH > h ? scrollTop+(winH - h)/2 : scrollTop);
    // var top = parseInt(opts.top) + scrollTop;
    var top = parseInt(opts.top);
    this.obj.css({
      position : Public.isIE6 ? 'absolute' : 'fixed',
      left : '50%',
      top : top,
      zIndex : '9999',
      marginLeft : -self.obj.outerWidth()/2
    });

    window.setTimeout(function(){
      self.obj.show().css({
        marginLeft : -self.obj.outerWidth()/2
      });
    },150);

    if(Public.isIE6){
      $(window).bind('resize scroll',function(){
        var top = $(window).scrollTop() + parseInt(opts.top);
        self.obj.css('top',top);
      })
    }
  },

  remove : function(){
    var opts = this.options;
    this.obj.fadeOut(200,function(){
      $(this).remove();
      if(opts.onClose){
        opts.onClose();
      }
    });
  }
}

// zhuweiwu add
/*进度条(与jquery.dialog.js配合使用)
**@param {Object} eg.{id : 'tidy-process', content : '正在整理凭证，请耐心等待。', width : 510, height : 100, animateTime : 7000}
**注意id、content这两个属性是必填属性
**@return {Object}
*/
Public.process = function (options){
  var options = options || {};
  if(!options.id || !options.content) return false;
  var pop = $.dialog({
    title :  false,
    width : options.width || 510,
    height : options.height || 100,
    content : '<div class="mod-process" id="' + options.id + '"><p class="tip">' + options.content + '</p><div class="process"><span></span></div></div>',
    lock : true,
    cache : false,
    esc : false,
    parent: options.parent
  });

  var process = $('#' + options.id),
      width = (options.width || 510) - 70,
      timeId;
  process.css('width', width);

  function processAnimate(){
    $('.process span', process).animate({width: width},options.animateTime || 7000,function(){ $(this).css('width', 0) });
  }

  processAnimate();
  timeId = setInterval(processAnimate,options.animateTime);

  return {pop : pop, timeId : timeId};
};
//快捷键
Public.keyCode = {
  ALT: 18,
  BACKSPACE: 8,
  CAPS_LOCK: 20,
  COMMA: 188,
  COMMAND: 91,
  COMMAND_LEFT: 91, // COMMAND
  COMMAND_RIGHT: 93,
  CONTROL: 17,
  DELETE: 46,
  DOWN: 40,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  HOME: 36,
  INSERT: 45,
  LEFT: 37,
  MENU: 93, // COMMAND_RIGHT
  NUMPAD_ADD: 107,
  NUMPAD_DECIMAL: 110,
  NUMPAD_DIVIDE: 111,
  NUMPAD_ENTER: 108,
  NUMPAD_MULTIPLY: 106,
  NUMPAD_SUBTRACT: 109,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PERIOD: 190,
  RIGHT: 39,
  SHIFT: 16,
  SPACE: 32,
  TAB: 9,
  UP: 38,
  F7: 118,
  F12: 123,
  S: 83,
  WINDOWS: 91 // COMMAND
}
/**
   * 节点赋100%高度
   *
   * @param {object} obj 赋高的对象
*/
Public.setAutoHeight = function(obj){
  if(!obj || obj.length < 1){
    return ;
  }

  Public._setAutoHeight(obj);
  $(window).bind('resize', function(){
    Public._setAutoHeight(obj);
  });

}

Public._setAutoHeight = function(obj){
  obj = $(obj);
  //parent = parent || window;
  var winH = $(window).height();
  var h = winH - obj.offset().top - (obj.outerHeight() - obj.height());
  obj.height(h);
}
/*
  通用post请求，返回json
  url:请求地址， params：传递的参数{...}， callback：请求成功回调
*/
Public.ajaxPost = function(url, params, callback){
  $.ajax({
     type: "POST",
     url: url,
     data: params,
     dataType: "json",
     success: function(data, status){
       callback(data);
     },
     error: function(err){
      parent.Public.tips({type: 1, content : '操作失败了哦，请检查您的网络链接！'});
     }
  });
};
Public.ajaxGet = function(url, params, callback){
  $.ajax({
     type: "GET",
     url: url,
     dataType: "json",
     data: params,
     success: function(data, status){
       callback(data);
     },
     error: function(err){
      parent.Public.tips({type: 1, content : '操作失败了哦，请检查您的网络链接！'});
     }
  });
};

//Ajax请求，
//url:请求地址， params：传递的参数{...}， callback：请求成功回调
Public.postAjax = function(url, params, callback, $dom){
  if($dom) {
    if($dom.hasClass('ui-btn-dis')) {
      Public.tips({type: 2, content : '正在处理，请稍后...' });
      return;
    } else {
      $dom.addClass('ui-btn-dis');
      $.ajax({
           type: "POST",
           url: url,
           cache: false,
           async: true,
           dataType: "json",
           data: params,

           //当异步请求成功时调用
           success: function(data, status){
             callback(data);
             $dom.removeClass('ui-btn-dis');
           },

           //当请求出现错误时调用
           error: function(err){
            Public.tips({type: 1, content : '操作失败了哦！' + err });
            $dom.removeClass('ui-btn-dis');
           }
        });
    }
  } else {
    $.ajax({
         type: "POST",
         url: url,
         cache: false,
         async: true,
         dataType: "json",
         data: params,

         //当异步请求成功时调用
         success: function(data, status){
           callback(data);
         },

         //当请求出现错误时调用
         error: function(err){
          Public.tips({type: 1, content : '操作失败了哦！' + err });
         }
      });
  }

};
//Ajax请求，
//url:请求地址， params：传递的参数{...}， callback：请求成功回调
Public.getAjax = function(url, params, callback){
  $.ajax({
     type: "GET",
     url: url,
     cache: false,
     async: true,
     dataType: "json",
     data: params,

     //当异步请求成功时调用
     success: function(data, status){
       callback(data);
     },

     //当请求出现错误时调用
     error: function(err){
      Public.tips({type: 1, content : '操作失败了哦！' + err });
     }
  });
};
//扩展对象方法
$.fn.extend({
  //为对象新增ajaxPost方法
  ajaxPost:function(url, params, callback, errCallback){
    var $this = $(this);
    var loading;
    var myTimer;
    var preventTooFast = 'ui-btn-dis';
    var ajaxOpts = {
       url: url,
       data: params,
       success: callback,
       error: errCallback
    }
    $.extend(true, ajaxOpts, {
      beforeSend : function(){
        $this.addClass(preventTooFast);
        myTimer = setTimeout(function(){
          $this.removeClass(preventTooFast);
        },2000)
        loading = $.dialog.tips('提交中，请稍候...', 1000, 'loading-new.gif', true);
      },
      success : callback,
      complete : function(){
        loading.close();
      },
      error: errCallback
    });
    if($this.hasClass(preventTooFast)){
      return;
    }
    Public.ajax(ajaxOpts);
  }
});
/**
 * [ajax description]
 * @param  {[type]} ajaxOpts [description]
 * 默认json格式
 * 默认post方式
 * @return {[type]}          [description]
 */
Public.ajax = function(ajaxOpts){
  var opts = {
     type: "POST",
     dataType: "json",
     timeout:900000 //15mins
  };
  $.extend(true, opts, ajaxOpts);
  var success = ajaxOpts.success;
  var error = ajaxOpts.error;
  opts.success = function(data, status){
    /*if(data.status != 200){
        var defaultPage = Public.getDefaultPage();
        var msg = data.msg || '出错了=. =||| ,请点击这里拷贝错误信息 :)';
      var errorStr = msg;
      if(data.data.error){
          var errorStr = '<a id="myText" href="javascript:window.clipboardData.setData("Text",data.error);alert("详细信息已经复制到剪切板，请拷贝给管理员！");"'+msg+'</a>'
      }
        defaultPage.Public.tips({type:1, content:errorStr});
        return;
      }*/
    success && success(data, status);
  }
  opts.error = function(err,ms){
    var content = '服务端响应错误！'
    if(ms === 'timeout'){
      content = '请求超时！';
    }
    parent.Public.tips({type: 1, content : content});
    error && error(err);
   }
  $.ajax(opts);
};
//单价
Public.price = function(val) {
  val = parseFloat(val);
  if(val == 0 || isNaN(val)){
    return '&nbsp;';
  }
  val = val.toFixed(4).split('.');
  var reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
  return val[0].replace(reg, "$1,") + '.' + val[1];
};
//金额
Public.currency = function(val) {
  val = parseFloat(val);
  if(val == 0 || isNaN(val)){
    return '&nbsp;';
  }
  val = val.toFixed(2);
  //当val是-0.0038,取两位小数就是"-0.00"
  if(val == 0){
    return '&nbsp;';
  }
  var reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
  return val.replace(reg,"$1,");
};
//金额转换成数字
Public.moneyToFloat = function(val){
    var val = String(val);
    if ($.trim(val) == '') {
        return '';
    }
    val = val.replace(/,/g, '');
    val = parseFloat(val);
    return isNaN(val) ? 0 : val;
};
Public.number = function(val) {

  var val = Number(val);
  return val ? val : '&nbsp;';
};
var Business = Business || {};  //业务对象
/**
   * 科目树弹窗
   *
   * @param {object} target 目标对象
   * @param {function} callback 数据选择后回调
   * @param {boolean} detail 是否只能是明细节点
*/
Business.subjectTreePop = function(target,callback,detail,flag){
  if(frameElement.api) {
    var api = frameElement.api, W = api.opener;
  } else {
    var W = window;
  };
  flag = flag || 0;
  W.$.dialog({
    title : '选择科目',
    content : 'url: /voucher/subject-tree.jsp',
    data: {target : target, onDataSelect : callback, detail : detail, isDelete: flag },
    width : '437px',
    height : '450px',
    max : false,
    min : false,
    cache : false
  });
}

Business.batchSubjectAutoComplete = function(obj, opts, cachename){
  obj = $(obj);
  if (obj.length == 0) {return};
  var opts = $.extend(true,{
    data: function(){
      return parent.SUBJECT_DATA || parent.parent.SUBJECT_DATA || top.SUBJECT_DATA;
    },
    formatText: function(data){
      return data.number + ' ' + data.fullName;
    },
    value: 'id',
    editable: true,
    defaultSelected: -1,
    customMatch: function(text,query,item){
      query = query.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      var idx = text.toLowerCase().search(query);
      var idx_name = item.rawData.name.toLowerCase().search(query);
      if(/^\d+$/.test(query)){
        if(idx == 0){
          return true;
        }
        if(idx_name != -1) {
          return 'add';
        }
      } else {
        if(idx != -1){return true;}
      }
      return false;
    },
    maxListWidth: 350,
    cache: false,
    forceSelection: true,
    maxFilter: 10,
    editable: true,
    trigger: false,
    listHeight: 182,
    listWrapCls: 'ui-droplist-wrap ui-subjectList-wrap',
    callback: {
      onChange: function(data){
        var parentTr = this.input.parents('tr');
        if(data) {
          parentTr.data(cachename, data);

        }
      },
      onListClick: function(){

      }
    }
  },opts);
  return obj.combo(opts).getCombo();
}

Business.initSubjectAutoComplete = function(obj,opts){
  obj = $(obj);
  if (obj.length == 0) {return};
  var opts = $.extend(true,{
    data: function(){
      return parent.SUBJECT_DATA || parent.parent.SUBJECT_DATA || top.SUBJECT_DATA;
    },
    formatText: function(data){
      return data.number + ' ' + data.fullName;
    },
    value: 'id',
    editable: true,
    defaultSelected: -1,
    customMatch: function(text,query,item){
      query = query.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      var idx = text.toLowerCase().search(query);
      var idx_name = item.rawData.name.toLowerCase().search(query);
      if(/^\d+$/.test(query)){
        if(idx == 0){
          return true;
        }
        if(idx_name != -1) {
          return 'add';
        }
      } else {
        if(idx != -1){return true;}
      }
      return false;
    },
    maxListWidth: 350,
    cache: false,
    forceSelection: true,
    maxFilter: 10,
    editable: true,
    trigger: false,
    listHeight: 182,
    listWrapCls: 'ui-droplist-wrap ui-subjectList-wrap'
  },opts);
  return obj.combo(opts).getCombo();
}

Business.initSubjectItem = function(obj, opts, flag){
  var combo = Business.initSubjectAutoComplete(obj,opts);

  var trigger = obj.find('.subject-trigger');
  flag = flag || 0;
  obj.bind('mouseover',function(){
    trigger.css('display','block');
  }).bind('mouseleave',function(){
    trigger.css('display','none');
  });
  trigger.bind('click',function(e){
    e.preventDefault();
    var detail = (opts && opts.detail) ?  opts.detail : '';
    Business.subjectTreePop(combo, onTreeDataSelect, detail, flag);
  });

  var input = obj.find('input');
  input.bind('keydown', function(e){
    if(e.keyCode == 118){ //F7
      e.preventDefault();
      var detail = opts.detail || '';
      Business.subjectTreePop(combo, onTreeDataSelect, detail, flag);
    }
  });


  function onTreeDataSelect(data,combo){
    var val = data.number + ' ' +data.fullName;
    combo.selectByText(val);
  }

  return combo;

}
//科目项目设为disabled，即不可用状态
Business.disSubjectItem = function(obj, clearSelected){
  var combo = obj.getCombo();
  var trigger = obj.find('.subject-trigger');
  combo.disable();
  clearSelected && combo.selectByIndex(-1);
  obj.unbind('mouseover');
}
//科目项目设为enable，即可用状态
//params: {OBJECT}
//params: {ARRAY} eg.[key,value]
Business.enableSubjectItem = function(obj, defaultSelected){
  var combo = obj.getCombo();
  var trigger = obj.find('.subject-trigger');
  combo.enable();
  defaultSelected && combo.selectByKey.apply(combo,defaultSelected);
  obj.unbind('mouseover').bind('mouseover',function(){
    trigger.css('display','block');
  });
}

/**
   * 获取期间数据
   *
   * @param {String}
   * @return {Object} 将格式为 '2012-7' 的期间数据转换成{y : 2012, p : 7}格式
*/
Business.getPeriodData = function (period){
  var arr = period.split('-');
  var y = parseInt(arr[0], 10);
  var p = parseInt(arr[1], 10);

  return {y : y, p : p};
}

/**
   * 初始化期间
   *
   * @param {String}
   * @param {String}
   * @param {String}
*/

Business.initPeriodItem = function(obj, opts){
  if (obj.length == 0) {return};
  $(obj).combo($.extend(true,{
    data: function(){
      return parent.PERIOD_DATA || parent.parent.PERIOD_DATA || top.PERIOD_DATA;
    },
    value: 'yearPeriod',
    text: 'disPeriod',
    width: 100,
    listHeight: 312,
    cache: false,
    editable: true,
    maxFilter: 1000
  },opts));
  return $(obj).getCombo();
}





/**
   * 初始化凭证字
   *
   * @param {String}
   * @param {Boolean}
   * @param {Object}
*/
Business.initVoucherWord = function(obj,opts){
  if (obj.length == 0) {return};
  var opts = $.extend(true, {
    data: function(){
      return parent.VOUCHER_WORD || parent.parent.VOUCHER_WORD || top.VOUCHER_WORD;
    },
    defaultSelected: ['defaultCode', true],
    text: 'name',
    width: 'auto',
    value: 'id',
    maxWidth: '100',
    maxListWidth: '100',
    minWidth: '60',
    cache: false,
    editable: false
  }, opts);
  return $(obj).combo(opts).getCombo();
}

//Js 检测客户端是否安装Acrobat pdf阅读器
function isAcrobatPluginInstall(){
//如果是firefox浏览器
  if (navigator.plugins && navigator.plugins.length) {
    for (var x=0; x<navigator.plugins.length;x++) {
      if (navigator.plugins[x].name== 'Adobe Acrobat')
      return true;
    }
  }
//下面代码都是处理IE浏览器的情况
  else if (window.ActiveXObject){
  for (x=2; x<10; x++){
  try {
    oAcro=eval_r("new ActiveXObject('PDF.PdfCtrl."+x+"');");
    if (oAcro){
      return true;
    }
  }catch(e) {

  }
  }
  try {
  oAcro4=new ActiveXObject('PDF.PdfCtrl.1');
  if (oAcro4)
     return true;
  }
  catch(e) {}
  try {
  oAcro7=new ActiveXObject('AcroPDF.PDF.1');
  if (oAcro7)
    return true;
  }
  catch(e) {}
  }
}

function promptDigfunc(excelForm,target){
  if(parent.SYSTEM.promptPDFDig != 0 ||!target){
    excelForm.trigger('submit');
  }else{
    $.dialog({
      title : "温馨提示",
      content : '为保证您能正常打印，请先下载安装Adobe <a href="http://xiazai.zol.com.cn/detail/13/122361.shtml" target="_blank">PDF阅读器！',
      icon: 'confirm.gif',
      max : false,
      min : false,
      cache : false,
      lock: true,
      button: [{
        id: 'confirm',
        name: "不再提示",
        focus: true,
        callback: function() {
          $.post("/bs/systemprofile?m=updateSystemParam3",
            {promptPDFDig:1},function(){
              excelForm.trigger('submit');
              parent.SYSTEM.promptPDFDig=1;
          });

        }
      },{
        id: 'cancel',
        name: "跳过",
        callback: function() {
          excelForm.trigger('submit');
        }
      }]
    });
  }
};
/**
  *导出PDF EXCEL文件 op 1打印列表 2打印凭证 3导出
*/
Business.exportFile = function(opts){
  var dataField = opts.dataField.join('#'), columnTitle = opts.columnTitle.join('#'),sheetName = opts.sheetName,
     $excelForm = $('#excel-form'), data = opts.data, paramStr = '', url;
  if ($excelForm.length < 1) {
    var formHtml = [
      '<form  method="post" id="excel-form" target="_blank" style="display:none;">',
      '<input type="hidden" name="dataField" id="dataField" />',
      '<input type="hidden" name="columnTitle" id="columnTitle" />',
      '<input type="hidden" name="sheetName" id="sheetName"/>',
      '</form>'
    ].join('');
    $excelForm= $(formHtml).appendTo('body');
  };
  if(opts.target){
    /**
    if(navigator.appName == "Microsoft Internet Explorer" && document.documentMode>8 || navigator.appName != "Microsoft Internet Explorer"){
       if(!isAcrobatPluginInstall()){
        Public.tips({type:1, content : "你没有安装Adobe AcrobatPDF插件，请安装！"});
       }
    }
    */
    $excelForm.attr('target', opts.target);
  }else{
    $excelForm.removeAttr('target');
  }
  $('#dataField').val(dataField);
  $('#columnTitle').val(columnTitle);
  $('#sheetName').val(sheetName);
  for (var k in data){
    paramStr += '&' + k + '=' + data[k];
  }
  url = encodeURI(encodeURI(opts.url + paramStr + '&op=' + opts.op));
  $excelForm.attr('action', url);
  promptDigfunc($excelForm,opts.target);
//  $excelForm.trigger('submit');
};

Public.getDefaultPage = function(){
  var win = window.self;
  do{
    if (win.IS_KUAIJI3_DEFAULT_PAGE) {
      return win;
    }
    win = win.parent;
  } while(true);
};

//获取文件
Business.getFile = function(url, args, isNewWinOpen, isExport){
  if (typeof url != 'string') {
    return ;
  }
  var url = url.indexOf('?') == -1 ? url += '?' : url;
  url += '&random=' + new Date().getTime();
  var downloadForm = $('form#downloadForm');
  if (downloadForm.length == 0) {
    downloadForm = $('<form method="post" />').attr('id', 'downloadForm').hide().appendTo('body');
  } else {
    downloadForm.empty();
  }
  downloadForm.attr('action', url);
  for( k in args){
    $('<input type="hidden" />').attr({name: k, value: args[k]}).appendTo(downloadForm);
  }
  if (isNewWinOpen) {
    downloadForm.attr('target', '_blank');
  } else{
    var downloadIframe = $('iframe#downloadIframe');
    if (downloadIframe.length == 0) {
      downloadIframe = $('<iframe />').attr('id', 'downloadIframe').hide().appendTo('body');
    }
    downloadForm.attr('target', 'downloadIframe');
  }
  isExport ? downloadForm.trigger('submit') : promptDigfunc(downloadForm, true);
};



//判断:当前元素是否是被筛选元素的子元素
$.fn.isChildOf = function(b){
    return (this.parents(b).length > 0);
};

//判断:当前元素是否是被筛选元素的子元素或者本身
$.fn.isChildAndSelfOf = function(b){
    return (this.closest(b).length > 0);
};

//数字输入框
$.fn.digital = function() {
  this.each(function(){
    $(this).keyup(function() {
      this.value = this.value.replace(/\D/g,'');
    })
  });
};

/*初始化文本框、textarea
**@param {String, jQuery Object} 文本框对象
*/
function initInput(obj){
  var def_cls = 'ui-input-def';
  if(typeof obj == 'string') obj = $(obj);

  obj.focus(function(){
    if($.trim(this.value) == this.defaultValue){
      this.value = '';
    }
    $(this).removeClass(def_cls);
  }).blur(function(){
    var val = $.trim(this.value);
    if(val == '' || val == this.defaultValue){
      $(this).addClass(def_cls);
    }
    val == '' && $(this).val(this.defaultValue);
  });
}

function numZeroFmatter(val, opt, row){
  val  = fmoney(val,2);
  val = val == "0" ? "&nbsp;" : val;
  return val;
};

/**
* 金额保留两位小数处理(总账)
* @param cellvalue 需要格式化的字符串
*/
function formatForDecimal(cellvalue) {
  if(typeof cellvalue == 'number') {
    return numZeroFmatter(cellvalue);
  }
  $value = $(cellvalue);
  var valueStr = "";
  $value.each(function() {
    var result = fmoney(parseFloat($(this).text()), 2); //保留两位小数
    $(this).text((result == 0) ? " " : result);
    valueStr += this.outerHTML;
  });
  valueStr = valueStr.replace(/[\r\n]/g, "");   //IE下去除换行符
  return valueStr == "" ? "&nbsp;" : valueStr;
};

/**
 * 金额格式转浮点数
 * @param amount
 * @returns
 */
function moneyToFloat(amount) {
  amount = parseFloat((amount + "").replace(/[,]/g, ""));
  return amount;
}

/**
* 数字格式化
* @param s 需要格式化数字
* @param n 取小数点后位数
* @type int
* @returns 字符在数组中的位置，没找到返回'--'
*/
function fmoney(s, n){
   var flag='0';
   if(!s || s==""){
     return '0';
   }
    s=s.toString();
   //记录负号标志
   if (s.substring(0,1)=='-') {
      s=s.substring(1,s.length);
      flag='1';
    }

     n = n >= 0 && n <= 20 ? n : 2;
     s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
     var l = s.split(".")[0].split("").reverse(),
     r = s.split(".")[1];
     t = "";
     for(var i = 0; i < l.length; i ++ )
     {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
     }

     var result=t.split("").reverse().join("");
     if(n>0){
      result += "." + r;
    }
     if (flag==1) result="-"+result;
     var  re=/^(\-)?0.0+$/;
     if(re.test(result)){
      result="0";
     }
   return result;
}


/**
* 根据分辨率设置布局
* ps:请勿改成jquery写法，jquery写法在ie6下无效
*/
Public.changeStyleByScreen = function(){
  if(screen.width <= 1024){
    var link = document.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('type','text/css');
    link.setAttribute('href','../css/layout.css');
    document.getElementsByTagName('head')[0].appendChild(link);
  }
};

$(function(){
  //菜单按钮
  $('.ui-btn-menu .menu-btn').bind('mouseenter.menuEvent',function(e){
    if($(this).hasClass("ui-btn-dis")) {
      return false;
    }
    $(this).parent().toggleClass('ui-btn-menu-cur');
    $(this).blur();
    e.preventDefault();
  });
  $(document).bind('click.menu',function(e){
    var target  = e.target || e.srcElement;
    $('.ui-btn-menu').each(function(){
      var menu = $(this);
      if($(target).closest(menu).length == 0 && $('.con',menu).is(':visible')){
        menu.removeClass('ui-btn-menu-cur');
      }
    })
  });
});


Public.bindEnterSkip = function(obj, func){
  var args = arguments;
  $(obj).on('keydown', 'input:visible:not(:disabled):not(.input-txt)', function(e){
    if (e.keyCode == '13') {
      var inputs = $(obj).find('input:visible:not(:disabled):not(.input-txt)');
      var idx = inputs.index($(this));
      idx = idx + 1;
      if (idx >= inputs.length) {
        if (typeof func == 'function') {
          var _args = Array.prototype.slice.call(args, 2 );
          func.apply(null,_args);
        }
      } else {
        inputs.eq(idx).focus();
      }
    }
  });
};

Public.ajaxSuccessCallback = function(opts){
  var data = opts.data, successCallback = opts.successCallback, failCallback = opts.failCallback, parentOpen = opts.parentOpen;
  var status = data.status;
  var tips = Public.tips, dialog = $.dialog;
  if (parentOpen) {
    tips = parent.Public.tips;
    dialog = parent.$.dialog;
  }
  if (status == 200) {
    tips({content : data.msg});
    if ($.isFunction(successCallback)) {
      successCallback(data.data);
    }
  } else {
    if (status == 6001 || status == 6002) {
      dialog({
        title: '系统提示',
        icon: 'alert.gif',
        fixed: true,
        lock: true,
        resize: false,
        ok: true,
        content: data.msg
      });
    } else {
      tips({type:1, content : data.msg});
    }
    if ($.isFunction(failCallback)) {
      failCallback(data.data);
    }
  }
};

// jQuery Cookie plugin
$.cookie = function (key, value, options) {
    // set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);
        var _expires = new Date();
        _expires.addDays(7);
        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '; expires='+_expires, // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }
    // get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

$(document).click(function(e){
  if(location.href.indexOf('default.jsp') === -1) {
    $(window.parent.document).find(".l-tab-menu").hide();
  }
});

$.fn.artTab = function(options) {
  var defaults = {};
  var opts = $.extend({}, defaults, options);
  var callback = opts.callback || function () {};
  this.each(function(){
    var $tab_a =$("dt>a",this);
    var $this = $(this);
    $tab_a.bind("click", function(){
      var target = $(this);
      target.siblings().removeClass("cur").end().addClass("cur");
      var index = $tab_a.index(this);
      var showContent = $("dd>div", $this).eq(index);
      showContent.siblings().hide().end().show();
      callback(target, showContent, opts);
    });
    if(opts.tab)
      $tab_a.eq(opts.tab).trigger("click");
    if(location.hash) {
      var tabs = location.hash.substr(1);
      $tab_a.eq(tabs).trigger("click");
    }
  });
};


//权限验证
Business.verifyRight = function(rightId,notips){
  var systemData = Public.getDefaultPage().SYSTEM;
  var isAdmin = systemData.isAdmin;
  var rights = systemData.rights;
  rights = $.isArray(rights) ? rights : JSON.parse(rights);
  var siExperied = systemData.siExpired;
  var isReadSite = systemData.isReadSite;
  //console.log(rights);
  //console.log(rightId);
  var isHasRight = false;
  if (isAdmin && !siExperied && !isReadSite) {return true;}
  //删除以下权限项ID,所以不需要验证权限了
  var noNeedRights = [11,13,14,16,21,23,24,25,31,33,34,35,41,43,44,45,46,63,82,83,72,54,55];
  if($.inArray(Number(rightId), noNeedRights) != -1){return true;}

  for (var i = 0, length = rights.length; i <length; i++) {
    if (rights[i].i == rightId) {
      isHasRight = true;
      break ;
    }
  };
  if(isReadSite && !isHasRight) {
    var tipsContent = [
      '<div class="ui-dialog-tips">',
      '<p>本系统为查询系统，请勿进行更新操作！</p>',
      '</div>'
    ].join('');
    if(notips)return false;
      $.dialog({
        width: 400,
        min: false,
        max: false,
        title: '系统提示',
        fixed: true,
        lock: true,
        button: button,
        resize: false,
        content: tipsContent
      });
      return;
  }

  var tmpArr = (document.domain.split('.com')[0]).split('.');
  var domain = tmpArr[tmpArr.length - 1];
  var renewUrl = 'http://www.jdy.com/upgrade_renew?action=renew&accid=' + systemData.DBID + '&lan=zh-CHS&sourceFrom=assistant_btn';
  var accountingUrl = 'http://www.jdy.com/buy/accounting/';
  if (domain === 'youshang') {
    renewUrl = 'http://service.youshang.com/fee/renew.do?langOption=zh-CHS&accIds=' + systemData.DBID;
    accountingUrl = 'http://kuaiji.youshang.com/buy.jsp?accIds=' + systemData.DBID;
  }
  
  if (siExperied && !isHasRight){
    if(systemData.isFree === 0) {
      if(systemData.isTril === 0) {
        var button = [{name: '立即续费', focus: true, callback: function(){ window.open(renewUrl) }}, {name: '下次再说'}];
        var tipsContent = [
          '<div class="ui-dialog-tips">',
          '<p>谢谢您使用本产品，您的当前服务已经到期，到期3个月后数据将被自动清除，如需继续使用请购买/续费！</p>',
          '<p style="color:#AAA; font-size:12px;">(续费后请刷新页面或重新登录。)</p>',
          '</div>'
        ].join('');
      } else {
        var button = [{name: '立即购买', focus: true, callback: function(){ window.open(accountingUrl) }}, {name: '下次再说'}];
        var tipsContent = [
          '<div class="ui-dialog-tips">',
          '<p>谢谢您使用本产品，您的试用已到期，如需继续使用请购买！</p>',
          '<p style="color:#AAA; font-size:12px;">(购买后请刷新页面或重新登录。)</p>',
          '</div>'
        ].join('');
      };
      if(notips)return false;
      $.dialog({
        width: 400,
        min: false,
        max: false,
        title: '系统提示',
        fixed: true,
        lock: true,
        button: button,
        resize: false,
        content: tipsContent
      });
      return;
    } else {
      var button = [{name: '立即购买', focus: true, callback: function(){ window.open(accountingUrl) }}, {name: '下次再说'}];
      var tipsContent = [
        '<div class="ui-dialog-tips">',
        '<p>谢谢您使用本产品已到期，如需继续使用请购买！</p>',
        '<p style="color:#AAA; font-size:12px;">(购买后请刷新页面或重新登录。)</p>',
        '</div>'
      ].join('');
      if(notips)return false;
      $.dialog({
        width: 400,
        min: false,
        max: false,
        title: '系统提示',
        fixed: true,
        lock: true,
        button: button,
        resize: false,
        content: tipsContent
      });
      return;
    }
  };
  if (!isHasRight) {
    if(notips)return false;
    var html = [
      '<div class="ui-dialog-tips">',
      '<h4 class="tit">您没有该功能的使用权限哦！</h4>',
      '<p>请联系管理员为您授权！</p>',
      //'<p><a href="#">查看我的权限&gt;&gt;</a></p>',
      '</div>'
    ].join('');
    $.dialog({
      width: 300,
      title: '系统提示',
      icon: 'alert.gif',
      fixed: true,
      lock: true,
      resize: false,
      ok: true,
      content: html
    });
    return false;
  }
  return true;
};

//文本列表滚动
Public.txtSlide = function(opt){
  var def = {
    notice: '#notices > ul',
    size: 1, //显示出来的条数
    pause_time: 5000, //每次滚动后停留的时间
    speed: 'normal', //滚动动画执行的时间
    stop: true //鼠标移到列表时停止动画
  };
  opt = opt || {};
  opt = $.extend({}, def, opt);

  var $list = $(opt.notice),
    $lis = $list.children(),
    height = $lis.eq(0).outerHeight() * opt.size,
    interval_id;
  if($lis.length <= opt.size) return;
  interval_id = setInterval(begin, opt.pause_time);

  opt.stop && $list.on({
    'mouseover': function(){
      clearInterval(interval_id);
      $list.stop(true,true);
    },
    'mouseleave': function(){
      interval_id = setInterval(begin, opt.pause_time);
    }
  });

  function begin(){
    $list.stop(true, true).animate({marginTop: -height}, opt.speed, function(){
      for(var i=0; i<opt.size; i++){
        $list.append($list.find('li:first'));
      }
      $list.css('margin-top', 0);
    });
  }
};

//限制只能输入允许的字符，不支持中文的控制
Public.limitInput = function(obj,allowedReg){
    var ctrlKey = null;
    obj.css('ime-mode', 'disabled').on('keydown',function(e){
        ctrlKey = e.ctrlKey;
    }).on('keypress',function(e){
        allowedReg = typeof allowedReg == 'string' ? new RegExp(allowedReg) : allowedReg;
        var charCode = typeof e.charCode != 'undefined' ? e.charCode : e.keyCode;
        var keyChar = $.trim(String.fromCharCode(charCode));
        if(!ctrlKey && charCode != 0 && charCode != 13 && !allowedReg.test(keyChar)){
            e.preventDefault();
        }
    });
};
//input占位符
$.fn.placeholder = function(){
  this.each(function() {
    $(this).focus(function(){
      if($.trim(this.value) == this.defaultValue){
        this.value = '';
      }
      $(this).removeClass('ui-input-def');
    }).blur(function(){
      var val = $.trim(this.value);
      if(val == '' || val == this.defaultValue){
        $(this).addClass('ui-input-def');
      }
      val == '' && $(this).val(this.defaultValue);
    });
  });
};

//单选框插件
$.fn.cssRadio = function(opts){
  var opts = $.extend({}, opts);
  var $_radio = $('label.radio', this), $_this = this;
  $_radio.each(function() {
    var self = $(this);
    if (self.find("input")[0].checked) {
      self.addClass("checked");
    };

  }).hover(function() {
    $(this).addClass("over");
  }, function() {
    $(this).removeClass("over");
  }).click(function(event) {
    $_radio.find("input").removeAttr("checked");
    $_radio.removeClass("checked");
    $(this).find("input").attr("checked", "checked");
    $(this).addClass("checked");
    opts.callback($(this));
  });
  return {
    getValue: function() {
      return $_radio.find("input[checked]").val();
    },
    setValue: function(index) {
      return $_radio.eq(index).click();
    }
  }
};
//复选框插件
$.fn.cssCheckbox = function() {
  var $_chk = $(".chk", this);
  $_chk.each(function() {
    if ($(this).find("input")[0].checked) {
      $(this).addClass("checked");
    };
    if ($(this).find("input")[0].disabled) {
      $(this).addClass("dis_check");
    };
  }).hover(function() {
    $(this).addClass("over")
  }, function() {
    $(this).removeClass("over")
  }).click(function(event) {
    if ($(this).find("input")[0].disabled) {
      return;
    };
    $(this).toggleClass("checked");
    $(this).find("input")[0].checked = !$(this).find("input")[0].checked;
    event.preventDefault();
  });

  return {
    chkAll:function(){
      $_chk.addClass("checked");
      $_chk.find("input").attr("checked","checked");
    },
    chkNot:function(){
      $_chk.removeClass("checked");
      $_chk.find("input").removeAttr("checked");
    },
    chkVal:function(){
      var val = [];
      $_chk.find("input:checked").each(function() {
              val.push($(this).val());
          });
      return val;
    }
  }
};
/*
 * 扩展时间对象
 *
*/
Date.prototype.Format = function(fmt)
{
    //author: meizz
    var o =
    {
        "M+" : this.getMonth() + 1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth() + 3) / 3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.prototype.addMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};
Date.prototype.addDays = function(d)
{
    this.setDate(this.getDate() + d);
};

//下面这一段都是生成时间轴的代码，已经可以用了。需求那边又不同意用了，代码先保留
//时间轴
Public.addEvent = (function(window, undefined) {
  var _eventCompat = function(event) {
      var type = event.type;
      if (type == 'DOMMouseScroll' || type == 'mousewheel') {
          event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
      }
      //alert(event.delta);
      if (event.srcElement && !event.target) {
          event.target = event.srcElement;
      }
      if (!event.preventDefault && event.returnValue !== undefined) {
          event.preventDefault = function() {
              event.returnValue = false;
          };
      }
      /*
         ......其他一些兼容性处理 */
      return event;
  };
  if (window.addEventListener) {
      return function(el, type, fn, capture) {
          if (type === "mousewheel" && document.mozHidden !== undefined) {
              type = "DOMMouseScroll";
          }
          el.addEventListener(type, function(event) {
              fn.call(this, _eventCompat(event));
          }, capture || false);
      }
  } else if (window.attachEvent) {
      return function(el, type, fn, capture) {
          el.attachEvent("on" + type, function(event) {
              event = event || window.event;
              fn.call(el, _eventCompat(event));
          });
      }
  }
  return function() {};
})(window);

Public.initTimeLine = function($target,periodData,curType,curperiod,callback,noQuarter){

  var maxLen = Public.createTimeLine($target,periodData,curType,curperiod,noQuarter);
  $target.find('.dtl').height($(window).height()-70);
  //滚轮事件处理
  Public.addEvent($target.find('.dtl')[0], "mousewheel", function(event) {

      var dir = event.delta > 0 ? 'Up' : 'Down';
      if(dir == 'Up' && $('.year').position().top == 0)return false;
      if($('.year').position().top == 0 && (maxLen < $(this).height() || maxLen == $(this).height()))return false;
      var maxDownH = (-1)*(maxLen-$(this).height());
      if(dir == 'Down' && ($('.year').position().top == maxDownH ||$('.year').position().top < maxDownH))return false;

      var top = $('.year').position().top;
      if(dir == 'Up'){
        top += 28;
      }else{
        top -= 28;
      }
      $('.year').css({
        top: top
      });
      return false;
  });
  //选择年
  $(document).on("click",'.year .year-btn',function(){
    // if($(this).parent().hasClass('active'))return false;
    if($(this).parent().find('.show').length>0){  //收起月份
      $(this).parent().find('.show').removeClass('show');
      var hideNum = $(this).parent().find('.month').children().length;
      maxLen = maxLen - hideNum*28;
    }else{
      $(this).parent().find('.month').addClass('show');
      var hideNum = $(this).parent().find('.month').children().length;
      maxLen = maxLen + hideNum*28;
    }
  });
  //选择月
  $(document).on("click",'.year .month li',function(){
    if($(this).hasClass('active-quarter'))return false;
    if($(this).hasClass('active-month'))return false;

    $('.year .active').removeClass('active');
    $('.year .active-quarter').removeClass('active-quarter');
    $('.year .active-month').removeClass('active-month');

    if($(this).hasClass('quarter-dtl')){
      $(this).addClass('active-quarter');
    }else{
      $(this).addClass('active-month');
    }
    $(this).parent().parent().addClass('active');
    callback($(this));
  });
  $(window).resize(function(){
    setTimeout(function(){
      $target.find('.dtl').height($(window).height()-70);
    }, 15);
  });
}
Public.createTimeLine = function($target,periodData,curType,curperiod,noQuarter){
    //curType：1是月，2是季度
    var len = 0;
    var period = {};
    var curYear = curperiod?curperiod.substr(0,4):'',curMonth = curperiod?curperiod.substr(4,2):'';

    //格式化原始数据，同一年的数据放到一个数组中
    for(var i = 0;i < periodData.length;i++){
      var year = periodData[i].yearPeriod.substr(0,4),
      month = periodData[i].yearPeriod.substr(4,2),
      quarter = ['一','一','一','二','二','二','三','三','三','四','四','四'][Number(month)-1]+'季度',
      quarterval = [1,1,1,2,2,2,3,3,3,4,4,4][Number(month)-1];

      if(!period[year]){
        period[year] = [];
      }
      if($.inArray(quarter,period[year])==-1)period[year].push(quarter);
      period[year].push(month);
    }

    //生成html
    var _html = [];
    $.each(period,function(index, el) {
      var lis = [];
      len += 28;
      var acitveYear = '',monthShow = '';
      for(var i = 0 ;i < el.length;i++){

        //要打开最近两年的数据
        if(curYear == index || (curYear-1) == index){
          acitveYear = curYear == index?'active':'';
          monthShow = 'show';
          len += 28;
        }

        var activeMonth = '';
        if($.isNumeric(el[i])){
          if(el[i] == curMonth && curYear == index && curType == 1){
            activeMonth = 'active-month';
          }
          lis.push('<li class="month-dtl '+activeMonth+'" data-val="'+el[i]+'">'+el[i]+'</li>');
        }else{
          if(!noQuarter){
            if(el[i] == curMonth && curYear == index  && curType == 2){
              activeMonth = 'active-quarter';
            }
            lis.push('<li class="quarter-dtl '+activeMonth+'" data-val="'+quarterval+'">'+el[i]+'</li>');
          }else{
            //不显示季度，要去掉先前加的长度
            if(curYear == index || (curYear-1) == index)len -= 28;
          }
        }
      }

      var ul = ['<div class="year-btn" data-val="'+index+'">'+index+'年</div>',
                '<ul class="month '+monthShow+'">',
                lis.join(''),
                '</ul>'];

      _html.unshift('<li class="'+acitveYear+'">'+ul.join('')+'</li>');
    });

    var dtl = '<div class="dtl"><ul class="year">'+_html.join('')+'</ul></div>';
    $target.append('<div class="title">2015年1季度</div>');
    $target.append(dtl);
    return len;
}

//横向时间轴
Public.createHorizontalTimeLine = function(opt){
  // 缺省值设置
  var defOpt = $.extend(true, {
    $el:$('<div></div>'),
    data:[],
    width: 50,
    nodeSelectedCls:'cur', //选中节点的样式
    callback:{
      // onselectNode:function(){}
    }
  }, opt);

  var timeLine = {
    $el: defOpt.$el ||$('div'),
    op: defOpt,
    init: function(){
      // render
      this.render();

      // event init
      this._initEvent();

      // end
      return this;
    },
    render:function(data){
      var $target = this.$el;
      var op = this.op;
      var data = data||op.data;
      var width = op.width;
      var total_width = (data.length)*Number(width), lineWidth =( total_width - Number(width) ) || 0;
      $target.empty();
      for(var i = 0; i < data.length;i++){
        var _dtl = [];
        var item = data[i];
        var disable = item.disable;
        var classes = item.classes;

        if(typeof disable === 'function'){
          disable = disable(item);
        }

        var timeline = $('<div class="horizontal-timeline '+ classes +' '+(disable ? 'disable' : '')+'" style="width:'+ width +'px;"><span class="horizontal-timeline-point"></span></div>');
        if(item.top)timeline.prepend('<div class="top-dtl">'+item.top+'</div>');
        if(item.bottom)timeline.append('<div class="bottom-dtl">'+item.bottom+'</div>');
        $target.append(timeline);
      }

      //中间的那条线
      var line = $('<div class="horizontal-timeline-line" style="width:'+ lineWidth +'px;"></div>');
      $target.append(line);

      $target.width(total_width);
    },

    // 私有方法，请勿外部调用
    _initEvent:function(){
      var
        self = this,
        op = this.op,
        callback = op.callback;

      // 点击节点
      this.$el.on('click', '.horizontal-timeline:not(.disable)', function(e){
        var  $this = $(this);
        // 选中之后不重复
        if($this.hasClass(op.nodeSelectedCls)) return;

        // 添加选中的样式
        if(op.nodeSelectedCls) $this.addClass(op.nodeSelectedCls).siblings('.'+op.nodeSelectedCls).removeClass(op.nodeSelectedCls);

        // 处理回调
        if(typeof callback.onselectNode === 'function')callback.onselectNode($(this));
      });
    }
  };
  return timeLine.init();
};
//限制输入长度
Public.limitlength = function(){
  $('.limitlength:visible').on('keyup',function(e){
    var len = $(this).attr('data-maximumlength');
    if(len && len < $(this).val().length){
      e.preventDefault();
      len = Number(len);
      $(this).val($(this).val().substr(0,len));
    }
  });
}

// 可编辑的表格模块
Public.mode_superGrid = function(){
  var SuperGrid = function(target, options){
    if(arguments.length != 2){
      throw 'target, options is require!'
    }

    var self = this;
    this.$target = $(target);
    var gridId = this.$target[0].id;
    if(!gridId){
      console && console.log('建议生成grid的对象上设置ID属性');
    }

    // 默认参数
    this.opts = $.extend({
      data:[],
      datatype: "clientSide",
      autoHeight:true,
      autowidth: true,
      gridview: true,
      // onselectrow: false,
      idPrefix: gridId || '', // rowid的前缀 取决于grid的id
      cellEdit: false,
      cellsubmit: 'clientArray',
      cmTemplate: {sortable:false},
      shrinkToFit: false,
      // scroll: 1,
      jsonReader: {
        page: 'data.page',
        root: 'data.rows',
        records: 'data.records',
        repeatitems : false,
        total: 'data.total',
        id: 'id'
      }
    }, options);

    // 渲染表格
    this.render();

    eventInit.call(this);
  }
  SuperGrid.prototype = {
    //取消表格编辑状态
    cancelEdit:function(){
      this.jqGrid("saveCells");
    },
    gridUnload: function() {
      this.grid.jqGrid('GridUnload');
    },
    showCol: function(colName) {
      this.grid.jqGrid('showCol', colName);
    },
    hideCol: function(colName) {
      this.grid.jqGrid('hideCol', colName);
    },
    render:function(options){
      if(this.grid){
        // this.grid.trigger('reloadGrid');
        this.grid.jqGrid('setGridParam',options||{}).trigger('reloadGrid');
      };

      // 对外界传入的option做必要的封装
      // 例如 接管 afterEditCell等事件
      optionsHandle.call(this);

      // 如果没有初始化
      this.grid = this.$target;
      this.grid.jqGrid(this.opts);
    },
    // 刷新grid
    refresh: function(options){
      $.extend(true, this.opts, options);
      this.render(options);
    },
    // 获取数据
    // 返回值每一行对象都会附加$comboData集合,储存combo咧的详细数据对象
    getData:function(){
      this.cancelEdit();
      var ids = this.jqGrid('getDataIDs');
      var opts = this.opts;
      var result = [];
      for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var row = this.getRowData(rowId);
        result.push(row);
      }
      return result;
    },
    getRowData:function(rowId){
      var opts = this.opts;
      var row = this.grid.jqGrid('getRowData',rowId); // 这里不能this.jqGrid，不然会造成死循环
      for (var k = 0; k < opts.colModel.length; k++) {
        var col = opts.colModel[k];
        if(col.combo){
          var $wrapper = $('<div>' + row[col.name] + '</div>');
          var $data = $wrapper.find(".data");
          // var data = $data.length ? $.parseJSON($data.data('combo').replace(/'/g, '"')) : null;
          var data = $data.length ? $.parseJSON($data.html()) : null;
          if(data){
            row[col.name+'Id'] = data[col.comboOpts.value];
            row[col.name+'Name'] = data[col.comboOpts.text];
          }
          // 删除用来转载html结构的属性
          delete row[col.name];
        }
      }
      return row;
    },
    // 托管jqGrid的方法
    jqGrid:function(){
      var result;
      var fname = arguments[0];
      if(typeof fname === 'string' && typeof this[fname] === 'function'){
        var args = $.makeArray(arguments).slice(1);
        result = this[fname].apply(this,args)
      }else{
        result = this.grid.jqGrid.apply(this.grid, arguments)
      }
      return result;
    },
    /*
     * 新增行
     */
    addNewRow:function(rowData, pos, src){
      var newId = this.grid.data('newId');
      this.jqGrid('addRowData', newId, rowData||{}, pos, src)
      this.grid.data('newId' , newId+1);
      var iRow = $('#'+ this.grid[0].p.idPrefix + newId).index();
      this.jqGrid("nextCell",iRow,0);
    },
    /*
     * resize表格
     */
    resize:function(){
      var $warp = this.$target.closest('.ui-jqgrid').parent();
      this.jqGrid('setGridWidth', $warp.width() - 2)

      var headHeight = $warp.find('.ui-jqgrid-hdiv').outerHeight();
      var footerHeight = $warp.find('.ui-jqgrid-sdiv').outerHeight();
      var bottomHeight = $warp.find('.ui-jqgrid-pager').outerHeight();
      this.jqGrid('setGridHeight', $warp.height() - headHeight - footerHeight - bottomHeight - 2);
    }
  }

  function optionsHandle(){
    // 代理事件
    gridEventProxy.call(this);

    // 转换列设置
    for (var i = 0; i < this.opts.colModel.length; i++) {
      (function(col){
        var
          $el,
          combo;

        // 下拉框的实现
        if(col.combo){
          // 支持方法返回
          var getCombo = col.combo;

          // 获取下拉框的设置
          col.comboOpts = getCombo($('<div>')).opts;
          // if(typeof combo === 'function') combo = combo();

          if(!(typeof getCombo === 'function')){
            throw 'combo 必须有返回combo插件的生成函数！'
          }

          // 通过jqGrid的自定义编辑功能 实现combo控件的内嵌
          $.extend(true, col, {
            editable:true,
            edittype:'custom',
            editoptions:{
              custom_element: function(value, options) {
                $el = $('<input type="text" class="textbox" autocomplete="off">');
                combo = getCombo($el);
                if(!combo){
                  throw 'combo 必须有返回combo插件的生成函数！'
                }
                // 处理combo初始选中的问题
                if(value){
                  var $wrapper = $('<div>' + value + '</div>');
                  var $data = $wrapper.find('.data');
                  if($data.length) {
                    // var data = $.parseJSON($data.data('combo').replace(/'/g, '"'));
                    var data = $.parseJSON($data.html());
                    combo.selectByValue(data.id);
                  };
                }

                if(value == ''){
                  combo.selectByValue(null);
                }

                return $el[0];
              },
              custom_value: function(elem, operation, value) {
                var parentTr = $(elem).parents('tr');
                if(operation === 'get') {
                   if(combo.getValue() !== '') {
                    // parentTr.data(col.name, combo.getSelectedRow());
                    // return $(elem).val();
                    return  combo.getSelectedRow();
                   } else {
                    // parentTr.removeData(col.name);
                    return '';
                   }
                } else if(operation === 'set') {
                   $('input', elem).val(value);
                }
              },
              handle: function() {
                $el.remove();
              },
              trigger:'ui-icon-triangle-1-s'
            }
          });

          // 接管对应的formatter
          var old_frm = col.formatter;

          col.formatter = function(val, opt, row){
            var
              col = opt.colModel
              isObject = true;

            if(!val){
              isObject = false;
              // 不是通过combo录入的时候， 入调用了addRowData 或者初始化的时候
              var id = row[col.name+'Id'];
              var name = row[col.name+'Name'];
              if(id !== undefined && name !== undefined){
                // 检查信息的完整性
                // 例如，如果是good字段，则需要提供goodId 和 goodName
                val = {};
                val[col.comboOpts.value] = id;
                val[col.comboOpts.text] = name;
              }else{
                // console && console.log('检测出没有提供对应Id 和 Name的combo字段， 可能需要完善后端接口')
                return '&#160;';
              }
            }

            var content = val[col.comboOpts.text];
            // 文本可能存在格式化
            // 也存在combo没设置text对应key的情况
            if((!content || isObject) && typeof col.comboOpts.formatText === 'function') {
              var content = col.comboOpts.formatText(val);

             // 补充缺省的name
              if(!val[col.comboOpts.text]){
                val[col.comboOpts.text] = content;
              }
            }
            var jsonString = JSON.stringify(val); //双引号换成单引号，不然在data属性上会错乱 data= "{" "aa":""
            // var $dataField = $('<i class="dn data">' + jsonString + '</i>') // 这种方式会在title中显示出来
            var $dataField = $('<i class="dn data">'+jsonString+'</i>');

            // 完成表格原本设置的格式化
            if(old_frm){
              content = old_frm(val, opt, row);
            }
            var $wrapper = $('<div> ' + content + '</div>');
            $wrapper.append($dataField)

            return $wrapper.html() || '&#160;';
          }
        }
      })(this.opts.colModel[i]);
    }
  }
  function gridEventProxy(){
    var
      self = this,
      opts = this.opts;

    // 可维护扩展部分
    var eventHandles = {
      afterEditCell:function(rowid,name,val,iRow,iCol){
      },
      afterSaveCell:function(rowid,name,val,iRow,iCol){
      },
      gridComplete: function(){
        // 非异步的模式生成表格的话这个方法会在返回grid对象之前执行，很坑
        // 模拟异步很简单，如下
        setTimeout(function(){
          var rDatas = self.grid.getRowData();
          // 这里处理新增行的ID从哪里开始
          self.grid.data('newId', rDatas.length + 1);
        },0);
        self.resize()
      }
    }
    for(eventName in eventHandles){
      (function(eventName){
        var oldFun = opts[eventName];
        var newFun = eventHandles[eventName] || function(){};
        opts[eventName] = function(){
          newFun && newFun.apply(self, arguments);
          oldFun && oldFun.apply(self, arguments);
        }
      })(eventName)
    }
  }
  function eventInit(){
    var
      self = this,
      timer_resizeCallback; // 自适应使用的计时器

    // 注册事件
    // 点击后取消编辑
    $(document).on('click',function(e){
      var cls_onClickGrid = 'superGrid_temp_forClickByDocument';
      self.grid.addClass(cls_onClickGrid);
      if(!$(e.target).closest('.'+cls_onClickGrid).length){
        self.cancelEdit();
      }
      self.grid.removeClass(cls_onClickGrid);
    })

    // 表格自适应
    $(window).on('resize', function(event) {
      // 性能需要
      clearTimeout(timer_resizeCallback);
      timer_resizeCallback = setTimeout(function(){
        self.resize();
      },10);
    });

    // 表格click事件处理
    self.$target
    .on('click', '.ui-icon-triangle-1-s', function(e){
      var $input = $(this).siblings('input');
      var _combo = $input.getCombo();
        setTimeout(function(){
          _combo.active = true;
          _combo.doQuery();
        }, 10);
    });
  }
  return SuperGrid;
}

// 图片预览器
Public.mode_picViewer = function(){
  var PicViewer = function(options){
    var self = this;

    // 默认参数
    this.opts = $.extend({
      $el: options.$el || $('<div></div>'),
      data: [],
      classes: "picViewer"
    }, options);

    this.$el = this.opts.$el.addClass(this.opts.classes);

    // 渲染
    this.render();
  }
  PicViewer.prototype = {
    render:function(){
      var
        self = this,
        op = this.opts,
        files = op.data,
        $el = $([
          '<div class="imgContainer" class="cf">',
            // 大图区域
            '<div class="detail">',
              // 显示
              '<span id="show"></span>',
              // Toolbar
              '<div class="btns" onselectstart="return false" style="-moz-user-select:none;">',
                '<a class="ui-btn resizePic left"> <b></b>',
                '</a>',
                '<a class="ui-btn resizePic right"> <b></b>',
                '</a>',
                '<a class="ui-btn bigger">',
                  '<b></b>',
                '</a>',
                '<a class="ui-btn smaller">',
                  '<b></b>',
                '</a>',
              '</div>',
            '</div>',
            // 小图区域
            '<ul class="imgList"></ul>',
          '</div>'
        ].join('')),
        $imgList = $el.find('.imgList'); // 图片列表区域

      // 生成图片列表
      var ulHtml = '';
      for (var k = 0; k < files.length; k++) {
        var file = files[k];
        // if(!file.fileInfo)return;
        var url = file.filePath;
        if (file.fileInfo) url = file.fileInfo.url;
        if (!url) return;

        ulHtml += [
          '<li>',
            '<a href="javascript:void(0)"><img src="'+ url+'" /></a>',
          '</li>',
        ].join('');
      };
      $imgList.html(ulHtml);

      // 添加到容器中
      this.$el.append($el);

      // 处理图片点击事件
      eventInit.call(this);

      // 开始选中第一个图片
      $imgList.find('img:eq(0)').trigger('click');
    },
    showBiggerPic: function($img){
      if(!$img || !$img.length) return;
      this.$el.find('.on').removeClass('on');
      $img.addClass('on');
      var $newPic = $img.clone();
      var $show = this.$el.find('#show');
      $show.after($newPic.addClass('limit').prop('id', 'show'));
      $show.remove();
      this.resizePic();
    },
    showNextPic:function(diff){
      var $curSelected = this.$el.find('img.on').closest('li');
      if(diff === -1){
        this.showBiggerPic($curSelected.prev().find('img'));
      }else{
        this.showBiggerPic($curSelected.next().find('img'));
      }
    },
    resizePic:function(){
      var self = this;
      if(this.timer){
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(function(){
        var $pic = self.$el.find('#show');
        var $wrap = $pic.parent();
        var wrap_w = $wrap.width();
        var wrap_h = $wrap.height();
        $pic.hide();
        if($pic.width() > $pic.height()){
          $pic.height(wrap_h).css('width', 'auto');
          if($pic.width() > wrap_w){
            $pic.width(wrap_w).css('height', 'auto');
          }
        }else{
          $pic.width(wrap_w).css('height', 'auto');
          if($pic.height() > wrap_h){
            $pic.height(wrap_h).css('width', 'auto');
          }
        }
        $pic.fadeIn(500);
      },100);
    },
    pop:function(){
      var self = this;
      var diff = 50;
      var w = $(window).width() - diff;
      var h = $(window).height()-35 - diff;
      // 无聊做个16:9的感觉吧。。。
      var _w = 16/10 * h;
      w = w > _w ? _w: w;
      w = w < 960 ? 960 : w;//不低于960
      $.dialog({
        title:'图片预览',
        content:this.$el,
        width: w,
        height: h,
        lock: true,
        padding: 0,
        init: function(){
          // console.log(this)
          var _dlg = this;
          var $warp = _dlg.DOM.inner;
          $warp.find('.ui_content').css({
            width: '100%',
            height: '100%',
            margin: 0,
            border: 0
          })
        }
      })
    }
  };

  function eventInit(){
    // !!注意， 图片处理$show对象不能缓存，因为旋转的时候会替换
    var
      self = this,
      $detail = this.$el.find('.detail');

    // 主图特效处理
    $detail.on('mousedown', '#show', function(e) {
      e.preventDefault();
      var $this = $(this);
      $this.addClass('on').data('current',{
        X : e.clientX,
        Y : e.clientY
      });
    }).on('mouseup', '#show', function(e) {
      e.preventDefault();
      var $this = $(this);
      $this.removeClass('on').data('offset',{
        top : $this.offset().top,
        left : $this.offset().left
      });
    }).on('mousemove', '#show', function(e) {
      e.preventDefault();
      var $this = $(this);
      if(!$this.hasClass('on')) return;
      var nowX = e.clientX, nowY = e.clientY;
      var current = $this.data('current') || {};
      var offset = $this.data('offset') || {};
      var disX = nowX - current.X || 0, disY = nowY - current.Y||0;
      $this.offset({
        left: parseInt(offset.left) + disX,
        top: parseInt(offset.top) + disY
      });
    }).on('click', '.resizePic', function(event) {
      event.preventDefault();
      var $show = $detail.find('#show');
      if(this.id === 'bigger' ||  this.id === 'smaller')return;
      $show.addClass('limit');
      self.resizePic();
    });

    //图片左翻转
    this.$el.find('.left').click(function(event) {
      // THISPAGE.$show.rotateLeft();//不能这样写，这里比较坑，看源码用了p.parentNode.replaceChild(canvas, p); $show不复存在，canvas.id = p.id;so $('#show')
      var $show = $detail.find('#show');
      $show.rotateLeft();
    });

    //图片右翻转
    this.$el.find('.right').click(function(event) {
      var $show = $detail.find('#show');
      $show.rotateRight();
    });

    // 图片放大
    this.$el.find('.bigger').click(function(event) {
      var $show = $detail.find('#show');
      var w = $show.width();
      var h = $show.height();
      $show.width(w * 120/100);
      $show.height(h * 120/100).removeClass('limit');
    });

    // 图片缩小
    this.$el.find('.smaller').click(function(event) {
      var $show = $detail.find('#show');
      var w = $show.width();
      var h = $show.height();
      $show.width(w * 100/120);
      $show.height(h * 100/120).removeClass('limit');
    });

    // 选中图片处理
    this.$el.find('.imgList').on('click', 'img', function(event) {
      event.preventDefault();
      /* Act on the event */
      self.showBiggerPic($(this));
    });

    // 阻止按钮ui的选中事件
    this.$el.find('.btn').on('selectstart', function(event) {
      //防止连击选中document
      return false;
    })
    .on('click', function(event) {
      return false;
    });
  };

  return PicViewer;
}

// IE中可能对unicode使用“\uXXXX”格式来编码，可以使用如下来解码：
Public.unicode2Char = function(str) {
  return (str.replace(/\\/g, "%"));
}


Public.tooltips = function(opt) {
  var defOpt = $.extend(true, {
    target: $('<div></div>'),
    id: 1,
    event: 'hover', // 默认鼠标移过显示
    content: '',
    align: 'right', // 文本位置
    callback: {
      hoverEvent: function($this) {},
      leaveEvent: function($this) {},
      clickEvent: function($this) {}
    }
  }, opt);

  var tooltips = {
    $target: defOpt.target,
    $wrap: $('<div class="tooltips-wrap" style="display:none;"></div>'),
    $tooltips: $('<div class="tooltips"></div>'),
    $contentWrap: $('<div class="tooltips-content"></div>'),
    $trigger: $('<div class="triangle">◆</div>'),

    op: defOpt,
    render: function(_content) {
      $('body').append(this.$wrap);
      this.$wrap.append(this.$tooltips);
      this.$tooltips.append(this.$contentWrap);
      this.$tooltips.append(this.$trigger);

      var content = this.op.content;
      if(typeof content === 'function'){
        content = content();
      }
      this.$contentWrap.html(_content || content);

      if (this.op.id) this.$wrap.attr('id', 'tooltips' + this.op.id);
      _setPos();
    },
    destroy: function() {
      this.$wrap.remove();
    },
    show: function() {
      this.render();
      this.$wrap.show();
    }
  };
  var init = function() {
    tooltips.render();
    _initEvent();
  };
  var _initEvent = function() {
    var callback = defOpt.callback;

    tooltips.$target.mouseenter(function(e) {
      e.preventDefault();
      if (defOpt.event != 'hover') return; 
      tooltips.render();
      tooltips.$wrap.show();

      callback.hoverEvent($(this), tooltips.$wrap);      
    });

    tooltips.$target.mouseleave(function(e) {
      e.preventDefault();
      if (defOpt.event != 'hover') return; 
      tooltips.destroy();

      callback.leaveEvent($(this), tooltips.$wrap);     
    });

    tooltips.$target.click(function(e) {
      e.preventDefault();
      if (defOpt.event != 'click') return;
      tooltips.render();
      tooltips.$wrap.show();

      callback.clickEvent($(this), tooltips.$wrap);
      e.stopPropagation();
    });
    $(document).click(function(e){
      if ($(e.target).closest('.tooltips-wrap').length > 0) return false;
      tooltips.destroy();
    });
  };
  var _setPos = function() {
    var target = defOpt.target;
    var top, left, alian = defOpt.align;

    var targetTop = target.offset().top, targetLeft = target.offset().left;
    var targetWidth = target.outerWidth(), targetHeight = target.outerHeight();
    var tooltipsWidth = tooltips.$wrap.outerWidth(), tooltipsHeight = tooltips.$wrap.outerHeight();
    var winWidth = $(window).width(), winHeight = $(window).height();

    if (defOpt.align == 'right') {
      top = targetTop + targetHeight / 2 - tooltipsHeight / 2;
      if ((targetLeft + targetWidth + tooltipsWidth) > winWidth) {
        left = targetLeft - tooltipsWidth;
        alian = 'left';
      } else {
        left = targetLeft + targetWidth;
      }
    }
    if (defOpt.align == 'left') {
      top = targetTop + targetHeight / 2 - tooltipsHeight / 2;
      if (targetLeft < tooltipsWidth) {
        left = targetLeft + targetWidth;
        alian = 'right';
      } else {
        left = targetLeft - targetWidth;
      }
    }
    tooltips.$tooltips.addClass(alian);
    tooltips.$wrap.css({
      left: left,
      top: top
    });
  };
  init();
  return tooltips;
};

// 多选框
$(document).on('click', '.check-box-wrap', function(event) {
  event.preventDefault();
  var $checkbox = $(this).find('.check-box');
  if($checkbox.hasClass('icon-checkbox-unchecked')) {
    $checkbox.addClass('icon-checkbox-checked').removeClass('icon-checkbox-unchecked');
  } else {
    $checkbox.addClass('icon-checkbox-unchecked').removeClass('icon-checkbox-checked');
  }
});

// 单选框
$(document).on('click', '.radio-box-item', function(event) {
  var $checkbox = $(this).find('.radio-box');
  var $wrap = $(this).closest('.radio-box-wrap');
  $wrap.find('.icon-radio-checked').removeClass('icon-radio-checked').addClass('icon-radio-unchecked');
  $checkbox.addClass('icon-radio-checked').removeClass('icon-radio-unchecked');
});


// 生成树
Public.zTree = {
    zTree: {},
    opts: {
      showRoot: true,
      defaultClass: '',
      disExpandAll: false, // showRoot为true时无效
      callback: '',
      rootTxt: '全部',
      defaultSelectValue: ''
    },
    setting: {
      view: {
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'parentId',
          rootPId: ''
        }
      },
      callback: {
      }
    },
    _getTemplate: function(opts) {
      this.id = 'tree' + parseInt(Math.random() * 10000);
        var _defaultClass = 'ztree';
        if (opts) {
          if (opts.defaultClass) {
            _defaultClass += ' ' + opts.defaultClass;
          }
        }
      return '<ul id="' + this.id + '" class="' + _defaultClass + '"></ul>';
    },
    init: function($target, opts, setting ,callback) {
      if ($target.length === 0) {
        return;
      }
      var self = this;
      self.opts = $.extend(true, self.opts, opts);
      self.container = $($target);
      self.obj = $(self._getTemplate(opts)); 
      self.container.append(self.obj);
      setting = $.extend(true, self.setting, setting);

      Public.ajaxPost(opts.url || '/pay/department.do?m=list', {isDel: 0}, function(data) {
        if (data.status === 200 && data.data) {
            self._callback(data.data.items);
        } else {
          Public.tips({
            type: 2,
            content: '加载失败！'
          });
        }
      });
      return self;
    },
    _callback: function(data) {
      var self = this;
      var callback = self.opts.callback;
      if (self.opts.showRoot) {
        data.unshift({name: self.opts.rootTxt, id: self.opts.rootId || 0});
        self.obj.addClass('showRoot');
      }
      if (!data.length) return;
      self.zTree = $.fn.zTree.init(self.obj, self.setting, data);
      self.zTree.selectNode(self.zTree.getNodeByParam('id', self.opts.defaultSelectValue));
      self.zTree.expandAll(!self.opts.disExpandAll);
      if (callback && typeof callback === 'function') {
        callback(self, data);
      }
    }
};

//下拉框树  (默认查部门)
Public.comboTree = function($obj, opts) {
  if ($obj.length === 0) {
    return;
  }
  opts = opts ? opts : opts = {};
  var opts = $.extend(true, {
    fixedxy: { // 偏移量，因为对应的input被border = 1 的元素包裹着，下拉框要对齐父元素，xy都差1px，所以默认偏移量设置成1
      x: 1,
      y: 1
    },
    inputWidth: '145',
    width: '', // 'auto' or int
    height: '240', // 'auto' or int
    trigger: true,
    defaultClass: 'ztreeCombo',
    disExpandAll: false,// 展开全部
    defaultSelectValue: 0,
    showRoot: true,// 显示root选择
    disableSelected: false, //控制是否要showTree
    rootTxt: '公司',
    treeSettings: {
      callback: {
        beforeClick: function(treeId, treeNode) {
          if (_Combo.obj) {
            _Combo.obj.val(treeNode.name);
            _Combo.obj.data('id', treeNode.id);
            _Combo.hideTree();
          }
        }
      }
    }
  }, opts);
  var _Combo = {
    container: $('<span class="ui-tree-wrap" style="width:'+opts.inputWidth+'px"></span>'),
    obj: $('<input type="text" class="input-txt" style="width:'+(opts.inputWidth-26)+'px" id="'+$obj.attr('id')+'" autocomplete="off" readonly value="'+($obj.val()||$obj.text())+'">'),
    trigger: $('<span class="trigger"></span>'),
    data: {},
    init: function() {
      var _parent = $obj.parent();
      //firefox上，如果没有写position: 'relative'，下拉框位置定位不准
      // _parent.parent().css({position: 'relative'});
      var _this = this;
      $obj.remove();
      this.obj.appendTo(this.container);
      if (opts.trigger) {
        this.container.append(this.trigger);
      }
      this.container.appendTo(_parent);
      opts.callback = function(publicTree ,data) {
        _this.zTree = publicTree;
        //_this.data = data;
        if (publicTree) {
          publicTree.obj.css({
            'max-height': opts.height
          });
          for ( var i = 0, len = data.length; i < len; i++) {
            _this.data[data[i].id] = data[i];
          };
          if (opts.defaultSelectValue !== '') {
            _this.selectByValue(opts.defaultSelectValue);
          };
          _this._eventInit();
        }
      };
      // this.zTree = new myTree.Views.Show({
      //  opts:opts,
      //  setting:opts.treeSettings
      // });
      // _parent.append(this.zTree.render().$el);
      this.zTree = Public.zTree.init($('body'), opts, opts.treeSettings);
      return this;
    },
    showTree: function() {
      if (!this.zTree || opts.disableSelected) return;
      if (this.zTree) {
        var offset = this.obj.offset();
        var topDiff = this.obj.outerHeight();
        var w = opts.width ? opts.width : this.obj.width();
        var _o = this.zTree.obj.hide();
        _o.css({width: w, top: offset.top + topDiff, left: offset.left - 1});
      }
      var _o = this.zTree.obj.show();
      this.isShow = true;
      this.container.addClass('ui-tree-active');
    },
    hideTree: function() {
      if (!this.zTree) return;
      if (!this.zTree.obj.hasClass('ztreeCombo')) return;
      var _o = this.zTree.obj.hide();
      this.isShow = false;
      this.container.removeClass('ui-tree-active');
    },
    _eventInit: function() {
      var _this = this;
      if (opts.trigger) {
        _this.trigger.on('click',function(e) {
          // e.stopPropagation();
          if (_this.trigger.attr('disabled')) return false;
          if (_this.zTree && !_this.isShow) {
            _this.showTree();
          } else {
            _this.hideTree();
          }
        });
      };
      _this.obj.on('click', function(e) {
      }).on('focus', function(event) {
        if (_this.zTree && !_this.isShow) {
          _this.showTree();
        }
      }).on('blur', function(event) {
        if (_this.zTree && _this.isShow) {

        }
      }).on('keydown', function(event) {
        if (event.keyCode === 9 && _this.isShow) {
          _this.hideTree();
          _this.obj.trigger(event);
        }
      });
      if (_this.zTree) {
        _this.zTree.obj.on('click', function(e) {
          e.stopPropagation();
        });
      }
      $(document).click(function(e) {
        if (e.target === _this.obj[0] || e.target === _this.trigger[0]) return;
        _this.hideTree();
      });
    },
    getValue: function() {
      var id = this.obj.data('id') || '';
      if (!id) {
        var text = this.obj.val();
        if (this.data) {
          for (var item in this.data) {
            if (this.data[item].name === text) {
              id = this.data[item].id;
            }
          }
        }
      }
      return id;
    },
    getText: function() {
      if (this.obj.data('id')) return this.obj.val();
      return '';
    },
    selectByValue: function(value) {
      if (value) {
        if (this.data) {
          this.obj.attr('data-id', value);
          this.obj.val(this.data[value] ? this.data[value].name : null);
        }
      }
      return this;
    }
};
return _Combo.init();
};
// 辅助核算
Public.createSubjectItem = function($_obj, data, itemsData) {
  var $_this = $_obj;
  itemsData = itemsData || {};
  if (!Public.assistAcc) Public.assistAcc = {};

  var _checkItems = function($_obj) {
    var success = true, S_dom = $('#isItem');
    if (S_dom.is(':visible')) {
      var comboList = S_dom.find('li:visible');
      comboList.each(function(i) {
        if ($(this).find('.ui-combo-wrap').getCombo().getSelectedIndex() === -1) {
          $(this).find('.ui-combo-wrap').getCombo().activate();
          Public.tips({type: 2, content: '核算项目不能为空！'});
          success = false;
          return false; 
        }
      });
    }
    return success ? true : false;
  };
  var _itemCombo = function(obj, url, val, id) {
    if (id) {
      defaultId = ['id', id];
    } else {
      defaultId = -1;
    };
    var name = obj[0].id;
    return obj.combo({  

      data: function() {
        return url;
      },
      ajaxOptions: {
        formatData: function(data) {
          Public.getDefaultPage().SYSTEM[name] = data.data.items; //更新
          return data.data.items;
        } 
      },
      formatText: function(data) {
        var returnData = data.number + ' ' + data.name;
        if (data.spec) returnData = returnData + ' ' + data.spec;
        return returnData;
      },
      defaultSelected: defaultId,
      value: 'id',
      cache: false,
      editable: true,
      callback: {
        onChange: function(data) {
        }
      }
    }).getCombo();
  };

  var _instantXDItem = function($_obj, origin, id) {
    if (id) {
      defaultId = ['id', id];
    } else {
      defaultId = 0;
    }
    return $_obj.combo({
      data: [{
        id: '2',
        name: '非限定'
      },{
        id: '1',
        name: '限定'
      }],
      defaultSelected: defaultId,
      text: 'name',
      value: 'id',
      editable: false,
      callback: {
        onChange: function(data) {
        }
      }
    }).getCombo();
  };

  var itemLi = $('#isItem').find('li');
  var curItems = [];

  var temp = {
    custom: ['itemKH', 1],
    supplier: ['itemGYS', 5],
    emp: ['itemZY', 2],
    project: ['itemXM', 3],
    dept: ['itemBM', 6],
    inventory: ['itemCH', 4],
    itemClassId: ['itemZDY'],
    limited: ['itemSFXD']
  };

  $.each(temp, function(key, val) {
    var id = val[0];
    if ((key != 'limited' && data[key]) || (key == 'limited' && data[key] == 3)) {
      $('#' + id).closest('li').show();
      if (key == 'itemClassId') $('#' + id).closest('li').find('label').text(data.itemClassName + ':');

      var itemClassId = val[1] || data.itemClassId || '';

      if (!Public.assistAcc[id]) { // 判断下拉框是否已经初始化
        var _id = itemsData[id] ? itemsData[id].id : '';
        var _name = itemsData[id] ? itemsData[id].name : '';

        if (key == 'limited') {
          Public.assistAcc[id] = _instantXDItem($('#' + id), $_obj, limitedId);
        } else {
          Public.assistAcc[id] = _itemCombo($('#' + id), '/bs/item?m=findItem&itemClassId=' + itemClassId + '&effective=1', $_obj, _id);
        }
        $('#' + id).find('input').val(_name);
      } else {
        var _id = itemsData[id] ? itemsData[id].id : -1;
        if (key == 'limited') {
          Public.assistAcc[id].selectByValue(_id, false);
        } else {
          Public.assistAcc[id].loadData('/bs/item?m=findItem&itemClassId=' + itemClassId + '&effective=1', ['id', _id], false);
        }
      }

      curItems.push({name: id, instance: Public.assistAcc[id]});
    } else {
      $('#' + id).closest('li').hide();
    }
  });
  
  var comboList = itemLi.find('li:visible');
  var inputList = comboList.find('input');
  var len = comboList.length;
  inputList.unbind('keydown.fast').bind('keydown.fast', function (e) {
    if (e.which === 13) {

      var pos = parseInt(inputList.index(this));
      comboList.eq(pos).find('.ui-combo-wrap').getCombo().blur();
      if (pos < len - 1) {
        inputList.eq(pos + 1).focus();
      } else {
        
      }
    }
  });
  $('#saveItems').unbind('click').click(function() {
    var itemsData = {};
    var itemsStr = '';
    for (var i = 0, len = curItems.length; i < len; i++) {
      var name = curItems[i].name;
      var instance = curItems[i].instance;
      var data = instance.getSelectedRow();
      if (!data) {
        Public.tips({type: 2, content: '核算项目必须全部选择！'});
        return;
      }
      // if (name === 'itemZDY') {
      //   data.itemClassId = itemClassId;
      // };
      itemsData[name] = data;
      itemsStr += data.number + data.name;
    };
    $_this.data('itemsdata', itemsData);
    $.powerFloat.hide();
  });

  $(document).click(function(e) {
    var target  = e.target;
    if ($(target).closest($('#isItem')).length == 0) {
      if(_checkItems())
        $.powerFloat.hide();
    };
  });
  return inputList;
};

// 薪资类型(包含快速新增按钮)
Public.salaryTypeCombo = function(obj, opts) {
  if (obj.length == 0) return;
  var defaultPage = Public.getDefaultPage();
  var opts = $.extend(true, {
    data: function(){
      return defaultPage.SALARY_TYPE;
    },
    defaultSelected: 0,
    value: 'id',
    text: 'name',
    width : 150,
    editable:true,
    extraListHtml: '<a href="javascript:void(0);" id="quickAddSalaryType" class="quick-add-link"><i class="ui-icon-add"></i>新增</a>',
  }, opts);

  var _combo = $(obj).combo(opts).getCombo();

  //新增
  $('#quickAddSalaryType').on('click', function(e) {
    e.preventDefault();
    var _dl = $.dialog({
      title : '新增薪资类型',
      content: '<div style="padding: 20px;">薪资类型： <input type="text" class="ui-input" id="salaryTypeName" style="width: 180px;"/></div>',
      width : 350,
      ok: function() {
        var _self = this;
        var name = $.trim($('#salaryTypeName').val());
        if (!name) {
          Public.tips({type: 2, content: '薪资类型不能为空！'});
          return false;
        }
        Public.postAjax('/bs/assist.do?m=savePayType', {name: name, type: 'salarykind'}, function(data) {
          if (data.status == 200) {
            Public.tips({content: '新增成功！'});
            var item = {
              id: data.data.id,
              name: data.data.name
            }
            defaultPage.SALARY_TYPE.push(item);
            _combo.loadData(defaultPage.SALARY_TYPE, '-1', false);
            _combo.selectByValue(data.data.id);
            _self.close();
          } else {
            Public.tips({type:1, content: '操作失败：' + data.msg || '未知错误'});
          }
        });
        return false;       
      },
      cancel: true
    });
  });
  return _combo;
}

// 辅助核算格式转换
Public.formatSubjectItem = function(entryData) {
  var itemsData = {};
  var temp = {
    inventoryId: ['itemCH', [['id', 'inventoryId'], ['number', 'inventoryNumber'], ['name', 'inventoryName'] ,['spec', 'inventorySpec']]],
    supplierId: ['itemGYS', [['id', 'supplierId'], ['number', 'supplierNumber'], ['name', 'supplierName']]],
    customId: ['itemKH', [['id', 'customId'], ['number', 'customNumber'], ['name', 'customName']]],
    projectId: ['itemXM', [['id', 'projectId'], ['number', 'projectNumber'], ['name', 'projectName']]],
    deptId: ['itemBM', [['id', 'deptId'], ['number', 'deptNumber'], ['name', 'deptName']]],
    empId: ['itemZY', [['id', 'empId'], ['number', 'empNumber'], ['name', 'empName']]],
    itemId: ['itemZDY', [['id', 'itemId'], ['itemClassId', 'itemClassId'], ['number', 'itemNumber'], ['name', 'itemName']]],
    limitedid: ['itemSFXD', [['id', 'limited'], ['name', 'limitedName']]]
  };
  $.each(temp, function(index, val) {
    if (entryData[index] > 0) {
      var val1 = val[0], val2 = val[1];
      for (var i = 0; i < val2.length; i++) {
        if (!itemsData[val1]) itemsData[val1] = {};
        var _temp = {};
        _temp[val2[i][0]] = entryData[val2[i][1]] || '';
        $.extend(true, itemsData[val1], _temp);
      }
    }
  });
  return itemsData;
}
