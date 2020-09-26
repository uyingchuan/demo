class Watcher {
    constructor(vm, exp, cb) {
        // 属性更新后需要执行的变更方法
        this.cb = cb
        // 需要接受订阅的数据对象
        this.vm = vm
        // 需要接受订阅的数据对象属性名
        this.exp = exp
        // 将自身添加到订阅器 Dep，并保存监视的属性值
        this.value = this.get()
    }

    update() {
        // 执行变更方法
        this.run()
    }

    run() {
        // 被监视的属性值更新值
        const newValue = this.vm.data[this.exp]
        // 被监视的属性值原值
        const oldValue = this.value
        if (newValue !== oldValue) {
            // 更新订阅者中保存的值
            this.value = newValue
            // 执行变更
            this.cb(newValue, oldValue)
        }
    }

    get() {
        // 缓存订阅者自身
        Dep.target = this
        /**
         * 读取被监视的属性值，触发监听器 Observer 的 get 方法
         * 将订阅者添加到消息订阅器 Dep
         */
        const value = this.vm.data[this.exp]
        // 添加之后释放内存
        Dep.target = null
        // 返回被监视的属性值
        return value
    }
}