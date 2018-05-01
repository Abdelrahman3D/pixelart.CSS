import { select } from './utils';

export default class Pixelart {
  constructor (el, settings) {
    this.el = select(el);
    this.settings = {
      ...Pixelart.defaults,
      ...settings
    }
    this._init();
  }

  _init () {
    this.canvas = document.createElement('canvas');
    this.div = document.createElement('div');
    this.div.style.width = '10px';
    this.div.style.height = '10px';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    document.body.appendChild(this.div);
    this.el.addEventListener('change', () => {
      this.handleImage(this.el.files[0]);
    });
  }

  handleCSS () {
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    let boxShadow = '';
    const pixelSize = 10;
    for (let index = 0; index < imgData.length; index += 4) {
      if (imgData[index + 3] === 0) continue;
      const xOffset = Math.floor((index / 4) % this.canvas.width) * this.settings.pixelSize;
      const yOffset = Math.floor((index / 4) / this.canvas.width) * this.settings.pixelSize;
      const {red, green, blue, alpha} = {
        red: imgData[index],
        green: imgData[index + 1],
        blue: imgData[index + 2],
        alpha: imgData[index + 3],
      }
      boxShadow += `
        ${xOffset}px ${yOffset}px rgba(${red}, ${green}, ${blue}, ${alpha}),
        `;
    }
    boxShadow = boxShadow.trim().slice(0, -1);
    this.div.style.boxShadow = boxShadow;
  }

  handleImage (file) {
    // eslint-disable-next-line
    let reader = new FileReader();
    reader.onload = (event) => {
    // eslint-disable-next-line
      var img = new Image();
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.handleCSS();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  static defaults = {
    pixelSize: 10
  }
}
