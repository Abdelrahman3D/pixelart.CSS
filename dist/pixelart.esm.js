/**
    * v0.0.0
    * (c) 2018 Baianat
    * @license MIT
    */
/**
 * Utilities
 */
function css(element, styles) {
  Object.entries(styles).forEach(function (pair) {
    element.style[pair[0]] = pair[1];
  });
}
function camelCaseToDash(myStr) {
  return myStr.replace(/([A-Z])/g, function (g) {
    return '-' + g[0].toLowerCase();
  });
}

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

var Pixelart = function () {
  function Pixelart() {
    classCallCheck(this, Pixelart);

    this._init();
  }

  createClass(Pixelart, [{
    key: '_init',
    value: function _init() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.width = 0;
      this.height = 0;
    }
  }, {
    key: 'generateStyle',
    value: function generateStyle(data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var imgData = data || _this.ctx.getImageData(0, 0, _this.width, _this.height).data;
        var boxShadow = '';
        var pixelSize = _this.settings.pixelSize;
        for (var index = 0; index < imgData.length; index += 4) {
          if (imgData[index + 3] === 0) continue;
          var xOffset = Math.floor(index / 4 % _this.width) * pixelSize;
          var yOffset = Math.floor(index / 4 / _this.width) * pixelSize;
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

          boxShadow += xOffset + 'px ' + yOffset + 'px rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + '),\n    ';
        }        var style = {
          width: pixelSize + 0.5 + 'px',
          height: pixelSize + 0.5 + 'px',
          boxShadow: boxShadow.trim().slice(0, -1)
        };
        resolve(style);
      });
    }
  }, {
    key: 'convertImage',
    value: function convertImage(file, settings) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.settings = Object.assign({}, Pixelart.defaults, settings);
        // eslint-disable-next-line
        var reader = new FileReader();
        var img = new Image();

        reader.onload = function (event) {
          img.onload = function () {
            _this2.canvas.width = _this2.width = img.width;
            _this2.canvas.height = _this2.height = img.height;
            if (_this2.width * _this2.height > _this2.settings.maxImagePixels) {
              console.log('Max pixels count (' + _this2.settings.maxImagePixels + ')');
              reject();
            }
            _this2.ctx.drawImage(img, 0, 0);
            _this2.generateStyle().then(function (style) {
              return resolve(style);
            });
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
  }, {
    key: 'applyStyle',
    value: function applyStyle(el, style) {
      css(el, style);
    }
  }, {
    key: 'parseCSS',
    value: function parseCSS(el, style) {
      var className = el.classList.item(0);
      var css$$1 = '';
      Object.entries(style).forEach(function (pair) {
        css$$1 += '  ' + camelCaseToDash(pair[0]) + ': ' + camelCaseToDash(pair[1]) + '\n';
      });
      return '.' + className + ' { \n' + css$$1 + ' }';
    }
  }]);
  return Pixelart;
}();

Pixelart.defaults = {
  pixelSize: 10,
  maxImagePixels: 10000
};

export default Pixelart;
