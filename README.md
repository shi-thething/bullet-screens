# bullet-screens
弹幕效果，可以附加到任意元素上


new BulletScreen(options)


options: {
    // 唯一主键，默认使用属性 id, 唯一标识判断，必须有（用于设置幕布中子弹的唯一标识）
    key: 'id',
    // 速度，初始速度1正常（后续对1需要定义）
    speed: 1,
    // 弹幕初始化需要挂载的对象，可以是DOM或者CSS选择器（也可以在初始化完成后选择合适的时机使用mount函数挂载）
    el: ''
}


methed:
    // 设置options
    setOptions
    // 添加弹幕 Array | Object
    add
    // 弹幕效果开启
    play
    // 弹幕效果暂停
    pause
    // 停止并情况所有弹幕
    stop
    // 初始化后挂载到dom上
    mount
    // 销毁弹幕（预留）
    destroy

