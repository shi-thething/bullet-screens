# bullet-screens
弹幕效果，可以附加到任意元素上

 ```
const options = {
    // 唯一主键，默认使用属性 id, 唯一标识判断，必须有（用于设置幕布中子弹的唯一标识）
    key: 'id',
    // 速度，初始速度1正常（后续对1需要定义）
    speed: 1,
    // 弹幕初始化需要挂载的对象，可以是DOM或者CSS选择器（也可以在初始化完成后选择合适的时机使用mount函数挂载）
    el: ''
}
const player = new BulletScreen(options)


 ```
# methed
| methed | 入参 | 描述 |
| --- | --- | --- |
|setOptions| options | 动态设置 options key无法通过此方法更改 |
|add| Array / Object| 新增弹幕元素，同时开启弹幕动画 |
|play| - |弹幕效果开启|
|pause| - |弹幕效果暂停|
|stop| - |停止并情况所有弹幕|
|mount| DOM对象 |初始化后挂载到dom上|
|destroy| - |销毁弹幕（预留）|

