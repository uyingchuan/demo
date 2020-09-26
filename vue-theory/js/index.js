/**
 * 简易版Vue
 */
class Vue {
    constructor(options) {
        this.el = options.el
        /**
         * 在组件中，data必须是一个函数
         * 组件以函数返回值的方式传入数据
         * 这样每复用一次组件，就会返回一份新的data
         * 让各个组件实例维护各自的数据
         */
        this.data = options.data()
        this.methods = options.methods
        this.mounted = options.mounted
        this.init()
    }

    init() {
        /**
         * 对数据使用代理模式
         * 将实例对属性的操作代理为对实例data的属性操作
         */
        Object.keys(this.data).forEach((key) => {
            this.proxyKeys(key)
        })

        // 监视数据
        observe(this.data)
        
        // 解析模板并初始化
        new Compile(this.el, this)

        // 初始化的最后执行mounted函数
        this.mounted()
        return this
    }

    // 数据代理模式
    proxyKeys(key) {
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get() {
                return this.data[key]
            },
            set(newValue) {
                this.data[key] = newValue
            }
        })
    }
}