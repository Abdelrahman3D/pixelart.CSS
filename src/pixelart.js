import { camelCaseToDash, css } from './utils';

export default class Pixelart {
  constructor () {
    this._init();
  }

  _init () {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
  }

  generateStyle (data) {
    return new Promise((resolve, reject) => {
      const imgData = data || this.ctx.getImageData(0, 0, this.width, this.height).data;
      let boxShadow = '';
      const pixelSize = this.settings.pixelSize;
      for (let index = 0; index < imgData.length; index += 4) {
        if (imgData[index + 3] === 0) continue;
        const xOffset = Math.floor((index / 4) % this.width) * pixelSize;
        const yOffset = Math.floor((index / 4) / this.width) * pixelSize;
        const {red, green, blue, alpha} = {
          red: imgData[index],
          green: imgData[index + 1],
          blue: imgData[index + 2],
          alpha: imgData[index + 3],
        }
        boxShadow += `${xOffset}px ${yOffset}px rgba(${red}, ${green}, ${blue}, ${alpha}),\n    `;
      };
      const style = {
        width: `${pixelSize + 0.5}px`,
        height: `${pixelSize + 0.5}px`,
        boxShadow: boxShadow.trim().slice(0, -1)
      }
      resolve(style);
    });
  }

  convertImage (file, settings) {
    return new Promise((resolve, reject) => {
      this.settings = {
        ...Pixelart.defaults,
        ...settings
      }
      // eslint-disable-next-line
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (event) => {
        img.onload = () => {
          this.canvas.width = this.width = img.width;
          this.canvas.height = this.height = img.height;
          if (this.width * this.height > this.settings.maxImagePixels) {
            console.log(`Max pixels count (${this.settings.maxImagePixels})`);
            reject();
          }
          this.ctx.drawImage(img, 0, 0);
          this.generateStyle().then(style =>  resolve(style));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  applyStyle (el, style) {
    css(el, style);
  }

  parseCSS (el, style) {
    const className = el.classList.item(0);
    let css = ''
    Object.entries(style).forEach(pair => {
      css += `  ${camelCaseToDash(pair[0])}: ${camelCaseToDash(pair[1])}\n`
    });
    return `.${className} { \n${css} }`;
  }

  static defaults = {
    pixelSize: 10,
    maxImagePixels: 10000
  }
}
