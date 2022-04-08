import { findRandomRange } from './utils'

// 幕布
class Screen {
  constructor({ transitionSpeed, ballistic, key }) {
    this.key = key
    // 当前幕布DOM
    this.$el = null
    // 当前幕布挂载的子弹们
    this.bullets = new Map()
    // 当前场景中子弹飞行动画速度，建议100毫秒，比较顺滑，暂停卡顿感知较低
    // 也可以替换为 requestAnimationFrame
    this.transitionSpeed = transitionSpeed
    // 弹道设置，默认自动随机位置
    this.ballistic = {
      // 弹道模式: fixed固定，auto自动
      model: 'auto',
      // 弹道高度：判定位false时自动计算， model为fixed时必须设置
      height: 0
    }
    // 当前对象用到的枚举
    this.enum = {
      ballisticModel: {
        FIXED: 'fixed',
        AUTO: 'auto'
      }
    }
    this.setBallistic(ballistic)
    // 构建幕布对象
    this.generateDom()
  }
  generateDom() {
    const el = document.createElement('div')
    el.setAttribute('class', 'bullet-screen')
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.position = 'absolute'
    el.style.top = 0
    el.style.left = 0
    el.style.right = 0
    el.style['pointer-events'] = 'none'
    this.$el = el
  }
  // 设置弹道，ballistic：大于0的Number | ballistic对象
  setBallistic(ballistic) {
    let model = this.enum.ballisticModel.AUTO
    let height = 0
    if (typeof ballistic === 'number') {
      if (ballistic <= 0) throw (new Error('fixed ballistic, Height must be greater than 0'))
      model = this.enum.ballisticModel.FIXED
      height = ballistic
    } else if (ballistic) {
      model = Object.values(this.enum.ballisticModel).indexOf(ballistic.model) > -1 ? ballistic.model : 'auto'
      height = Number(ballistic.height)
      if (height < 0) {
        height = 0
      }
      if (model === this.enum.ballisticModel.FIXED && height <= 0) {
        throw (new Error('fixed ballistic, Height must be greater than 0'))
      }
    }
    this.ballistic.model = model
    this.ballistic.height = height
  }
  // 挂载子弹
  loadBullet(bullet) {
    // 检查当前容器，找到合适的位置挂载子弹
    // 可以预先固定并分配弹道  或者 随机生成弹道
    switch (this.ballistic.model) {
      case this.enum.ballisticModel.FIXED:
        // 此处使用固定通道挂载
        this.fixedLoadBullet(bullet)
        break
      default:
        // 默认使用随机挂载
        this.randomLoadBullet(bullet)
        break
    }
  }
  // 寻找弹幕间隙
  randomLoadBullet(bullet) {
    // 从右往左形式寻找空余弹道

    let spareList = this.findRange()
    if (spareList.length) {
      // 预先挂载，用以计算高度
      this.$el.appendChild(bullet.$el)
      let bulletHight = bullet.$el.offsetHeight
      // 空余弹道需能完全放置当前bullet
      spareList.forEach(d => d[1] -= bulletHight)
      spareList = spareList.filter(d => d[1] > d[0])

      if (!spareList.length) {
        this.unmountBullet(bullet)
        return
      }
      // 取随机空间
      let randomRang = findRandomRange(spareList)
      // 取随机点
      let randomTop = Math.floor(Math.random() * (randomRang[1] - randomRang[0])) + randomRang[0]
      this.mountBullet(bullet, { top: randomTop })
    } else {
      this.unmountBullet(bullet)
    }
  }
  // 寻找弹幕间隙
  findRange() {
    let bullets = Array.from(this.bullets.values()).filter(d => !d.hadLeft)
    // 容器最大高度
    let max = this.$el.offsetHeight
    if (!bullets.length) return [[0, max]]
    // 获取已挂载的高度区间，从上往下排序
    bullets = bullets.map(bullet => ([bullet.$el.offsetTop, bullet.$el.offsetTop + bullet.$el.offsetHeight])).sort((d1, d2) => d1[0] - d2[0])
    // 转换并存储可用区域
    let spareList = []
    bullets.forEach((d, i) => {
      if (i === 0) {
        spareList.push([0, d[0]])
      } else {
        spareList.push([bullets[i - 1][1], d[0]])
      }
      if (i === bullets.length - 1) spareList.push([d[1], max])
    })
    return spareList
  }
  // 固定弹道挂载
  fixedLoadBullet(bullet) {
    // 用于识别弹道的key
    let key = '_track'
    // 容器最大高度
    let max = this.$el.offsetHeight
    let ranges = Array.from(new Array(Math.floor(max / this.ballistic.height)))
    ranges = ranges.map((d, i) => ({ track: i, top: i * this.ballistic.height }))
    // 当前正在进入的子弹们
    let bullets = Array.from(this.bullets.values()).filter(d => !d.hadLeft)
    // 未被占用的轨道
    ranges = ranges.filter(d => !bullets.some(b => b[key] === d.track))
    // 没有空余弹道时return
    if (!ranges.length) return
    // 取随机空间
    let randomRang = findRandomRange(ranges)
    bullet[key] = randomRang.track
    this.mountBullet(bullet, { top: randomRang.top })
  }
  // 挂载子弹到指定位置：bullet子弹对象，position位置信息
  mountBullet(bullet, position) {
    // 挂载dom
    this.$el.appendChild(bullet.$el)
    // 挂载到指定位置
    bullet.admission(position, this)
    // 将当前对象放入弹仓
    this.bullets.set(bullet.data[this.key], bullet)
  }
  unmountBullet(bullet) {
    this.$el.removeChild(bullet.$el)
    this.bullets.delete(bullet.data[this.key])
  }
  // 销毁所有弹幕
  destroy() {
    this.bullets.forEach(bullet => {
      this.unmountBullet(bullet)
    })
  }
}
// 子弹
class Bullet {
  constructor({ data, render }, screen) {
    // 当前DOM
    this.$el = null
    // 挂载场景对象
    this.screen = screen
    // 随机分配的位置，使用top值定义
    this.top = 0
    // 滚动位置 （后期支持不同方向的滚动时，此处可以调整为 positionStyle）
    this.left = 0
    // 已经离开起点 / 完全进入弹幕
    this.hadLeft = false
    // 默认构建函数
    this.render = () => {
      this.$el.innerHTML = this.data.value
    }
    // 数据对象
    this.data = data
    if (typeof render === 'function') this.render = render
    // 构建dom
    this.generateDom()
  }
  // 构建dom
  generateDom() {
    const el = document.createElement('div')
    el.setAttribute('class', 'bullet')
    el.style.position = 'absolute'
    el.style['white-space'] = 'nowrap'
    this.$el = el
    // 构建内容
    this.$el.appendChild(this.render.call(this, this.data))
  }
  // 入场/挂载对象: 位置信息暂时只有top属性
  admission({ top }, screen) {
    this.screen = screen
    this.top = top
    this.$el.style.top = this.top + 'px'
    this.left = screen.$el.offsetWidth
    this.$el.style.left = this.left + 'px'
    // 添加动画属性，增加平滑度 （此处的时间）
    this.$el.style.transition = `all ${this.screen.transitionSpeed / 1000}s linear`
  }
  // 更新飞行位置（更新偏移量，当前以从右往左进入）
  updatePosition(offsetLeft) {
    if (this.$el && this.$el.parentElement) {
      let parentWidht = this.$el.parentElement.offsetWidth
      // 便宜到左侧
      this.left -= offsetLeft
      this.$el.style.left = this.left + 'px'
      if (!this.hadLeft) {
        // 计算hadLeft
        if (parentWidht > this.$el.offsetWidth + this.left) {
          this.hadLeft = true
        }
      }
      if (this.left < -this.$el.offsetWidth) {
        // 飞出场景以后移除当前坐标
        this.screen.unmountBullet(this)
      }
    }
  }
  refreshRender() {
    Array.from(this.$el.children).forEach(d => d.remove())
    this.$el.appendChild(this.render.call(this, this.data))
  }
}

// 弹幕
class BulletScreen {
  constructor(options) {
    // dom对象
    this.$el = null
    // 挂载对象
    this.$parentEl = null
    // 幕布/场景
    this.screen = null
    // 配置项(默认配置)
    this.options = {
      // 唯一主键，默认使用属性 id, 唯一标识判断，必须有（用于设置幕布中子弹的唯一标识）
      key: 'id',
      // 速度，初始速度1正常（后续对1需要定义）
      speed: 1,
      // 弹道配置 number | Object:{ model: 'fixed' | 'auto', height: 0 }    （Object:model 弹道模式 固定或自动。height：弹道固定高度，非正整数时自动根据DOM计算，固定弹道必须设置）
      ballistic: null,
      // 弹幕初始化需要挂载的对象，可以是DOM或者CSS选择器（也可以在初始化完成后选择合适的时机使用mount函数挂载）
      el: ''
    }
    // 初始化弹仓
    this.timer
    // 当前是否启用弹幕动画，用于减少性能问题
    this.playing = false
    // 当前场景中子弹飞行动画速度，建议100毫秒，比较顺滑，暂停卡顿感知较低
    this.transitionSpeed = 100
    this.setOptions(options)
    this.init()
    // 便于测试的对象
    window.BulletScreenPlayer = this
  }
  // 设置/更新 属性
  setOptions(options) {
    // 初始化设置
    this.options = Object.assign({}, this.options, options)
  }
  // 初始化弹幕
  init() {
    this.generateScreen()
    this.mount(this.options.el)
    // this.play()
  }
  // 添加弹幕: list 弹幕列表
  add(datas) {
    if (!Array.isArray(datas)) datas = [datas]
    datas.forEach(d => {
      if (!d.hasOwnProperty(this.screen.key)) throw (new Error('The current object has no key, key is require, please set options.key'))
      if (!this.screen.bullets.get(d[this.screen.key])) {
        const bullet = new Bullet({ data: d, render: this.options.bulletRender })
        console.log('----------新入仓', bullet)
        this.screen.loadBullet(bullet)
        this.play()
      }
    })
  }
  // 启用弹幕
  play() {
    if (this.playing) return
    this.playing = true
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      if (this.screen && this.screen.bullets.size) {
        this.screen.bullets.forEach(bullet => {
          bullet.updatePosition(this.options.speed * 5)
        })
      } else {
        this.pause()
      }
    }, this.transitionSpeed)
  }
  // 暂停弹幕
  pause() {
    clearInterval(this.timer)
    this.playing = false
  }
  // 停止弹幕
  stop() {
    this.pause()
    this.screen.destroy()

  }
  // 构建场景
  generateScreen() {
    this.screen = new Screen({
      transitionSpeed: this.transitionSpeed,
      ballistic: this.options.ballistic,
      key: this.options.key // 构建场景的时候传递，唯一标识key，不可变更
    })
    this.$el = this.screen.$el
  }
  // 重新渲染子弹，ids: String  Array[String] ，如果为undefined 或 null 重新渲染所有子弹
  refreshRender(ids) {
    if (ids !== undefined && ids !== null) {
      ids = Array.isArray(ids) ? ids : [ids]
      ids.forEach(id => {
        const bullet = this.screen.bullets.get(id)
        bullet && bullet.refreshRender()
      })
      return
    }
    const bullets = Array.from(this.screen.bullets.values())
    bullets.forEach(bullet => {
      bullet.refreshRender()
    })
  }
  // 挂载
  mount(el) {
    let dom = null
    if (el instanceof Element) {
      dom = el
    } else if (typeof el === 'string' && document.querySelector(el)) {
      dom = document.querySelector(el)
    }
    if (dom) {
      this.$parentEl = dom
      this.$parentEl.appendChild(this.$el)
    }
  }
  destroy() {
    this.stop()
    if (this.$parentEl) {
      this.$parentEl.removeChild(this.$el)
      this.$el = null
      this.$parentEl = null
    }
  }
}

window.BulletScreen = BulletScreen
export default BulletScreen
