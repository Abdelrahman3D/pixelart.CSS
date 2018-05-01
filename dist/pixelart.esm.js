/**
    * v0.0.0
    * (c) 2018 Baianat
    * @license MIT
    */
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
      var pixelSize = 10;
      for (var index = 0; index < imgData.length; index += 4) {
        if (imgData[index + 3] === 0) continue;
        console.log(Math.floor(index / 4 / this.canvas.width), Math.floor(index / 4 % this.canvas.width));
        boxShadow += '\n        ' + Math.floor(index / 4 % this.canvas.width) * pixelSize + 'px \n        ' + Math.floor(index / 4 / this.canvas.width) * pixelSize + 'px \n        rgba(\n          ' + imgData[index] + ',\n          ' + imgData[index + 1] + ',\n          ' + imgData[index + 2] + ',\n          ' + imgData[index + 3] + '\n        ),';
      }
      boxShadow = boxShadow.slice(0, -1);
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

export default Pixelart;
