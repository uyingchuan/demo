function $(id) {
    return document.getElementById(id)
}
function create(name) {
    return document.createElement(name)
}

const EventUtil = {

    getEvent: function(event) {
        return event ? event : window.event
    },
    getTarget: function(event) {
        return event.target || event.srcElement
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault()
        } else {
            event.returnValue = false
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        }
    },
    addHandler: function(ele, type, handler) {
        if (ele.addEventListener) {
            ele.addEventListener(type, handler, false)
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, handler)
        } else {
            ele['on' + type] = handler
        }
    },
    removeHandler: function(ele, type, handler) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, handler, false)
        } else if (ele.detachEvent) {
            ele.detachEvent('on' + type, handler)
        } else {
            ele['on' + type] = null
        }
    }
}

// AJAX get方法封装
function ajax(options) {
    const params = getParams(options.data)
    const xhr = new XMLHttpRequest()

    if (options.type === 'GET') {
        xhr.open('GET', options.url + '?' + params, options.async)
        xhr.send(null)
    } else if (options.type === 'POST') {
        xhr.open('POST', options.url, options.async)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(params)
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            if (typeof options.success === 'function') {
                options.success(data, options)
            } else {
                return console.log('Request was unsuccessful:' + xhr.status)
            }
        }
    }

    function getParams(data) {
        const params = []
        for (let index in data) {
            if (!data.hasOwnProperty(data[index])) continue
            if (typeof data[data[index]] === 'function') continue
            const name = encodeURIComponent(data[index])
            const value = encodeURIComponent(data[data[index]].toString())
            params.push(name + '=' + value)
        }
        return params
    }
}
