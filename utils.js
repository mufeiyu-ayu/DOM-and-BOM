// 1.获取窗口滚动距离
function getScrollOffset() {
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
        if (document.compatMode === 'BackCompute') {
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
function getScrollSize() {
    if (document.body.scrollHeight) {
        return {
            height: document.body.scrollHeight,
            width: document.body.scrollWidth
        }
    } else {
        return {
            height: document.documentElement.scrollHeight,
            width: document.documentElement.scrollWidth
        }
    }
}

// 4.获取一个盒子距离窗口的距离（即使有父级有多层定位）,因为offset的参照物是父级以上有定位的元素
function getElemDocPosition(el) {
    var parent = el.offsetParent,
        offsetLeft = el.offsetLeft,
        offsetTop = el.offsetTop
    while (parent) {
        offsetLeft += parent.offsetLeft
        offsetTop += parent.offsetTop
        parent = parent.offsetParent
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
            fn.call(el)
        })
    } else {
        el['on' + type] = fn
    }
}

// 查看计算样式可以通过getcomputed获取元素的样式
function getStyles(el, prop) {
    if (window.getComputedStyle) {
        if (prop) {
            return parseInt(window.getComputedStyle(el, null)[prop])
        } else {
            return window.getComputedStyle(el, null)[prop]
        }
    } else {
        if (prop) {
            return el.currentStyle[prop]
        } else {
            return el.currentStyle
        }
    }
}

//  取消冒泡
function cancelBubble(e) {
    var e = e || window.event

    if (e.stopPropagation) {
        e.stopPropagation()
    } else {
        e.cancelBubble = true
    }
}

//删除事件
function removeEvent(el, type, fn) {
    if (el.removeEventListener) {
        el.removeEventListener(type, fn, false)
    } else if (el.detachEvent) {
        el.detachEvent('on' + type, fn)
    } else {
        el['on' + type] = null
    }
}

// 获取鼠标的坐标（包含滚动距离）
function pagePos(e) {
    var sTop = getScrollOffset().top,
        sLeft = getScrollOffset().left,
        cTop = document.documentElement.clientTop || 0,
        cLeft = document.documentElement.clientLeft || 0

    return {
        X: e.clientX + sTop - cTop,
        Y: e.clientY + sLeft - cLeft
    }
}

// 取消默认事件
function preventDefaultEvent(e) {
    var e = e || window.event

    if (e.preventDefault) {
        e.preventDefault()
    } else {
        e.returnValue = true
    }
}

// 封装 物体拖曳函数
function elemDrag(elem) {
    let x, y
    addEvent(elem, 'mousedown', function (e) {
        var e = e || window.event
        x = pagePos(e).X - getStyles(elem, 'left')
        y = pagePos(e).Y - getStyles(elem, 'top')
        addEvent(document, 'mousemove', mouseMove)
        addEvent(document, 'mouseup', mouseUp)
        cancelBubble(e)
        preventDefeaultEvent(e)
    })

    function mouseMove(e) {
        var e = e || window.event
        elem.style.left = pagePos(e).X - x + 'px'
        elem.style.top = pagePos(e).Y - y + 'px'
    }

    function mouseUp(e) {
        var e = e || window.event
        removeEvent(document, 'mousemove', mouseMove)
        removeEvent(document, 'mouseup', mouseUp)
    }
}

// 获取父节点的所有子节点以数组存储
function elemChildren(node) {
    var tamp = {
        length: 0,
        splice: Array.prototype.splice
    }
    len = node.childNodes.length
    for (let i = 0; i < len; i++) {
        var childItem = node.childNodes[i]
        if (childItem.nodeType === 1) {
            tamp[tamp.length] = childItem
            tamp['length']++
        }
    }
    return tamp
}

// 模板渲染 tpl 模板 regExp正则匹配规则，opt 模板变量赋值（Obj）
function selTplHTML(tpl, regExp, opt) {
    return tpl.replace(regExp(), function (node, key) {
        return opt[key]
    })
}

function regTpl() {
    return new RegExp(/{{(.*?)}}/, 'gim')
}
