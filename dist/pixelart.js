/**
    * v0.0.0
    * (c) 2018 Baianat
    * @license MIT
    */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Pixelart = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Utilities
   */
  function select(element) {
    if (typeof element === 'string') {
      return document.querySelector(element);
    }
    return element;
  }

  var Pixelart = function () {
    function Pixelart(el, settings) {
      classCallCheck(this, Pixelart);

      this.el = select(el);
      this.settings = Object.assign({}, Pixelart.defaults, settings);
      this._init();
    }

    createClass(Pixelart, [{
      key: '_init',
      value: function _init() {
        var _this = this;

        this.canvas = document.createElement('canvas');
        this.div = document.createElement('div');
        this.div.style.width = '10px';
        this.div.style.height = '10px';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        document.body.appendChild(this.div);
        this.el.addEventListener('change', function () {
          _this.handleImage(_this.el.files[0]);
        });
      }
    }, {
      key: 'handleCSS',
      value: function handleCSS() {
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        var boxShadow = '';
        for (var index = 0; index < imgData.length; index += 4) {
          if (imgData[index + 3] === 0) continue;
          var xOffset = Math.floor(index / 4 % this.canvas.width) * this.settings.pixelSize;
          var yOffset = Math.floor(index / 4 / this.canvas.width) * this.settings.pixelSize;
          var _red$green$blue$alpha = {
            red: imgData[index],
            green: imgData[index + 1],
            blue: imgData[index + 2],
            alpha: imgData[index + 3]
          },
              red = _red$green$blue$alpha.red,
              green = _red$green$blue$alpha.green,
              blue = _red$green$blue$alpha.blue,
              alpha = _red$green$blue$alpha.alpha;

          boxShadow += '\n        ' + xOffset + 'px ' + yOffset + 'px rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + '),\n        ';
        }
        boxShadow = boxShadow.trim().slice(0, -1);
        this.div.style.boxShadow = boxShadow;
      }
    }, {
      key: 'handleImage',
      value: function handleImage(file) {
        var _this2 = this;

        // eslint-disable-next-line
        var reader = new FileReader();
        reader.onload = function (event) {
          // eslint-disable-next-line
          var img = new Image();
          img.onload = function () {
            _this2.canvas.width = img.width;
            _this2.canvas.height = img.height;
            _this2.ctx.drawImage(img, 0, 0);
            _this2.handleCSS();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }]);
    return Pixelart;
  }();

  Pixelart.defaults = {
    pixelSize: 10
  };

  return Pixelart;

})));
