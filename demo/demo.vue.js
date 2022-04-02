import Vue from 'Vue'
import BulletScreen from '../src/bulletScreensSDK'
// 用于构建弹幕子对象
const bulletScreenHoc = function (render) {
  return Vue.extend({
    data() {
      return {
        bullet: {}
      };
    },
    render() {
      return <div>{render({ data: this.bullet })}</div>;
    }
  });
};
// 不使用动态模板时，可以定义模板对象进行渲染，使用固定模板
// const commpont = Vue.extend({
//   data() {
//     return {
//       bullet: {}
//     };
//   },
//   render() {
//     return <div>{ this.bullet } 其他dom</div>;
//   }
// });

// 初始化弹幕
export const initBulletScreens = ({ el, render }) => {
  let options = {
    el,
    key: 'id',
    // 默认样式，可以由播放器组件通过slot实现
    bulletRender: (bullet) => {
      const el = document.createElement('div');
      el.setAttribute('style', 'background: gray;');
      el.innerHTML = bullet.value
      return el
    }
  };
  if (render) {
    options.bulletRender = (bullet) => {
      const BulletScreenConstructor = bulletScreenHoc(render);
      return new BulletScreenConstructor({
        data: {
          bullet
        }
      }).$mount().$el;
    };
  }
  return new BulletScreen(options);
}
