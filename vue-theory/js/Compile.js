/**
 * 解析器作用：
 *  1.解析模板指令，并替换模板数据，初始化视图
 *  2.将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器
 */
class Compile {
    constructor(el, vm) {
        this.vm = vm
        this.el = document.querySelector(el)
        this.fragment = null
        this.init()
    }

    /**
     * 初始化解析器：解析dom模板
     */
    init() {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el)
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment)
        } else {
            console.log(`Cannot find this element '${el}'`)
        }
    }

    /**
     * 为解析模板，首先需要获得dom元素
     * 然后对dom元素上含有指令的节点进行处理
     * 因为这个环节对dom操作比较频繁，所以可以使用fragment片段进行处理
     */
    nodeToFragment(el) {
        const oFragment = document.createDocumentFragment()
        let child = el.firstChild

        while (child) {
            // 将DOM元素移入fragment中
            oFragment.appendChild(child)
            child = el.firstChild
        }

        return oFragment
    }

    // 解析dom，寻找指令并解析指令
    compileElement(el) {
        const childNodes = el.childNodes

        // 遍历子节点匹配指令并解析
        childNodes.forEach(node => {
            const reg = /\{\{\s*(.*?)\s*\}\}/
            const text = node.textContent
            const nodeAttrs = node.attributes

            // 匹配文本指令后执行解析指令
            if (this.isTextNode(node)) {
                if (reg.test(text)) {
                    this.compileText(node, reg.exec(text)[1])
                }
                return
            }

            // 遍历以匹配属性指令后执行解析指令
            if (this.isElementNode) {
                Array.prototype.forEach.call(nodeAttrs, (attr) => {
                    const attrName = attr.name
                    if (this.isDirective(attrName)) {
                        // 指令内容
                        const exp = attr.value
                        // 指令类型
                        const directive = attrName.substring(2)
                        // v-on
                        if (this.isEventDirective(attrName)) {
                            this.compileEvent(node, this.vm, exp, directive)
                        } else {    // v-model
                            this.compileModel(node, this.vm, exp, directive)
                        }
                    }
                })
            }            

            // 递归遍历子节点
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node)
            }
        })
    }

    // 解析 `v-model` 指令
    compileModel(node, vm, exp, dir) {
        // v-model 后绑定的变量名
        const value = this.vm[exp]
        // 更新视图
        this.updateModel(node, value)
        // 劫持更新后的新数据创建订阅者
        new Watcher(this.vm, exp, (value) => {
            this.updateModel(node, value)
        })
        /**
         *  双向绑定的另一向，view => data
         *  通过html的input事件从视图获取数据保存到js中
         */
        node.addEventListener('input', function(e) {
            // 获取视图中的数据
            const newValue = e.target.value
            if (value === newValue) {
                return
            }
            // 更新数据
            vm[exp] = newValue
        })
    }

    // 解析 `v-on` 指令
    compileEvent(node, vm, exp, dir) {
        const eventType = dir.split(':')[1]
        const cb = vm.methods && vm.methods[exp]

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false)
        }
    }

    // 解析 `{{ key }}` 指令
    compileText(node, exp) {
        // 初始化的数值
        const initText = this.vm[exp]

        // 初始化视图
        this.updateText(node, initText)

        // 生成订阅者并绑定更新函数
        new Watcher(this.vm, exp, (value) => {
            this.updateText(node, value)
        })
    }

    // 更新视图text函数
    updateText(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    }

    // 更新视图model函数
    updateModel(node, newValue, oldValue) {
        node.value = typeof newValue === 'undefined' ? '' : newValue
    }

    // 判断是否是 v- 指令
    isDirective(attr) {
        return attr.indexOf('v-') === 0
    }

    // 判断是否是 on: 指令
    isEventDirective(attr) {
        return attr.indexOf('on:') === 2
    }

    // 判断是否为文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }

    // 判断是否为元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}