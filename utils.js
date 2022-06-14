// 1.获取窗口滚动距离
function getScollOffset() {
    if (window.pageXOffset) {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    } else {
        return {
            left: document.body.scrollLeft + document.documentElement.scrollLeft,
            top: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

// 浏览器的怪异模式和标准模式
// BackCompat，CSS1Compat
// 2.获取窗口可视区域
function getViewportSize() {
    if (window.innerWidth) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        if (document.compatMode === 'BackCompat') {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }
}

// 3.窗口可视区距离 + 滚动区域距离
function getScollSize() {
    if (document.body.scrollWidth) {
        return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight
        }
    } else {
        return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
        }
    }
}

// 4.获取一个盒子距离窗口的距离
function getELemDocPosition(el) {
    let parent = el.offsetParent, // 获取父级定位
        offsetLeft = el.offsetLeft, // 距离父亲的top，left距离
        offsetTop = el.offsetTop
    while (parent) {
        offsetLeft += parent.offsetLeft
        offsetTop += parent.offsetTop
        parent = parent.offsetParent // 解决多层嵌套
    }
    return {
        left: offsetLeft,
        top: offsetTop
    }
}

// 5.事件处理函数封装
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, false)
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, function () {
            handle.call(el)
        })
    } else {
        el['on' + type] = fn
    }
}

// 查看计算样式
// 可以通过getcomputed获取元素的样式
function getStyles(elem, prop) {
    if (window.getComputedStyle) {
        if (prop) {
            return parseInt(window.getComputedStyle(elem, null)[prop])
        } else {
            return window.getComputedStyle(elem, null)
        }
    } else {
        if (prop) {
            return parseInt(elem.currentStyle[prop])
        } else {
            return elem.currentStyle
        }
    }
}

// 获取鼠标的坐标（包含滚动距离）
function pagePos(e) {
    var sLeft = getScollOffset().left,
        sTop = getScollOffset().top,
        cLeft = document.documentElement.clientLeft || 0,
        cToP = document.documentElement.clientTop || 0
    return {
        x: e.clientX + sLeft - cLeft,
        y: e.clientY + sTop - cToP
    }
}
