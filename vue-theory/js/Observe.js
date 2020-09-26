/**
 * Observer 是一个数据监听器
 * 核心方法是 Object.defineProperty
 * 其主要功能是将数据对象的所有属性进行监听（递归遍历子属性值）
 * 如果数据发生改变则通过消息订阅器 Dep 通知订阅者 watcher 
 * 而后订阅者接收到相应属性的变化，执行对应的更新函数
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  // 遍历对象属性进行监听
  walk(data) {
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  // 监听
  defineReactive(data, key, value) {
    const dep = new Dep()
    // 递归监听子对象
    observe(value)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        /**
         * 在生成订阅者watcher的过程中会读取一次数据
         * 届时便会将订阅者本身暂时寄存在Dep.target中
         * 在这一步将订阅者添加至消息订阅器
         */
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return value
      },
      set(newValue) {
        if (newValue === value) {
          return
        }
        // 赋新的值
        value = newValue
        // 对新值进行监听
        observe(newValue)
        /**
         * 数据改变，调用订阅器的 notify 方法
         * 通知所有接受订阅的订阅者
         */
        dep.notify()
      }
    })
  }
}

// 生成返回监听器并监听传入的对象属性
function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}

/* 消息订阅器Dep，订阅器Dep主要负责收集订阅者 watcher
 * 然后在属性变化时通知订阅者并执行对应订阅者的更新函数
 */
class Dep {
    constructor() {
        // 包含接受订阅的订阅者
        this.subs = []
    }

    // 增加接受订阅的订阅者
    addSub(sub) {
        this.subs.push(sub)
    }

    // 通知订阅者更新
    notify() {
        this.subs.forEach((sub) => {
            // 订阅者执行更新
            sub.update()
        })
    }
}
// 订阅者的中转站
Dep.target = null
