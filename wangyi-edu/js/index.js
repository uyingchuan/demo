// 初始化页面
window.onload = function () {
    setShower()
}

// 获取cookie，根据cookie更改样式
function setShower() {
    const cookie = getCookies()
    // 根据cookie判断公告栏的显隐
    if (cookie.noRemind === 'true') {
        $('notice').style.display = 'none'
    } else {
        $('notice').style.display = 'block'
    }
}

// 公告栏显示
function closeNotice() {
    setCookit('noRemind', true, '/', 90)
    $('notice').style.display = 'none'
}

// following
function following() {
    const event = EventUtil.getEvent()
    const oEle = EventUtil.getTarget(event)
    if (oEle.className === 'following') {
        oEle.style.display = 'none'
        oEle.nextSibling.nextSibling.style.display = 'inline'
    }
}

// search
function search() {
    const event = EventUtil.getEvent()
    const oEle = EventUtil.getTarget(event)
    oEle.style.display = 'none'
    oEle.nextSibling.nextSibling.style.display = 'block'
    oEle.nextSibling.nextSibling.style.clear = 'both'
    console.log(oEle.nextSibling.nextSibling.style.display)
}

// 读取 Cookie, 将 Cookie 转化为JS对象
function getCookies() {
    const cookie = {}
    const data = document.cookie
    if (data === '') return cookie
    const arr = data.split(';')
    for (let i in arr) {
        const index  = arr[i].indexOf('=')
        const name = encodeURIComponent(arr[i].substring(0, index))
        const value = encodeURIComponent(arr[i].substring(index + 1))
        cookie[name] = value
    }
    return cookie
}

// set cookie
function setCookit(name, value, path, iDay, domain, secure) {
    const date = new Date()
    let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)
    if (iDay) {
        cookie += ';expires' + date.setDate(date.getDate() + iDay)
    }
    if (path) {
        cookie += ';path=' + path
    }
    if (domain) {
        cookie += ';domain' + domain
    }
    if (secure) {
        cookie += ';secure' + secure
    }
    document.cookie = cookie
}