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
// 盒子拖曳封装
Element.prototype.dragclick = function (fn, menu) {
    let sTime = 0,
        eTime = 0,
        cStime = 0,
        cEtime = 0,
        counter = 0,
        infoArr = [],
        t,
        elWidth = getStyles(this, 'width'), // 盒子宽高
        elHeight = getStyles(this, 'height'),
        wWidth = getViewportSize().width, // 当前视口宽高
        wHeight = getViewportSize().height,
        mWidth = getStyles(menu, 'width'),
        mHeight = getStyles(menu, 'height')
    // 封装 物体拖曳函数
    elemDrag.call(this)
    function elemDrag() {
        let x,
            y,
            _self = this
        addEvent(_self, 'mousedown', function (e) {
            var e = e || window.event,
                btnCode = e.button
            if (btnCode === 2) {
                var mLeft = pagePos(e).X,
                    mTop = pagePos(e).Y
                if (mLeft <= 0) {
                    mLeft = 0
                } else if (mLeft >= wWidth - mWidth) {
                    mLeft = pagePos(e).X - mWidth
                }
                if (mTop <= 0) {
                    mTop = 0
                } else if (mTop >= wHeight - mHeight) {
                    mTop = pagePos(e).Y - mHeight
                }
                menu.style.left = mLeft + 'px'
                menu.style.top = mTop + 'px'
                menu.style.display = 'block'
            } else if (btnCode === 0) {
                sTime = new Date().getTime()
                x = pagePos(e).X - getStyles(_self, 'left')
                y = pagePos(e).Y - getStyles(_self, 'top')
                infoArr = [getStyles(_self, 'left'), getStyles(_self, 'top')]
                addEvent(document, 'mousemove', mouseMove)
                addEvent(document, 'mouseup', mouseUp)
                cancelBubble(e)
                preventDefeaultEvent(e)
            }
        })
        addEvent(document, 'contextmenu', function (e) {
            var e = e || window.event
            preventDefeaultEvent(e)
        })
        addEvent(document, 'click', function (e) {
            menu.style.display = 'none'
        })
        addEvent(menu, 'click', function (e) {
            var e = e || window.event
            cancelBubble(e) // 阻止事件往document上冒泡
        })
        function mouseMove(e) {
            menu.style.display = 'none'
            var e = e || window.event,
                eleLeft = pagePos(e).X - x,
                eleTop = pagePos(e).Y - y
            if (eleLeft <= 0) {
                eleLeft = 0
            } else if (eleLeft >= wWidth - elWidth) {
                eleLeft = wWidth - elWidth
                // console.log(eleLeft)
            }

            if (eleTop <= 0) {
                eleTop = 0
            } else if (eleTop >= wHeight - elHeight) {
                eleTop = wHeight - elHeight - 1
            }
            _self.style.left = eleLeft + 'px'
            _self.style.top = eleTop + 'px'
        }
        function mouseUp(e) {
            var e = e || window.event
            eTime = new Date().getTime()
            if (eTime - sTime < 300) {
                _self.style.left = infoArr[0] + 'px'
                _self.style.top = infoArr[1] + 'px'
                counter++
                if (counter === 1) {
                    cStime = new Date().getTime()
                }
                if (counter === 2) {
                    cEtime = new Date().getTime()
                }
                if (cStime && cEtime && cEtime - cStime < 200) {
                    fn()
                }
                t = setTimeout(function () {
                    cStime = 0
                    cEtime = 0
                    counter = 0
                    clearTimeout(t)
                }, 500)
            }
            removeEvent(document, 'mousemove', mouseMove)
            removeEvent(document, 'mouseup', mouseUp)
        }
    }
}
