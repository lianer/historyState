/**
 * historyState
 * --
 * @author Lianer
 * @date 2015.07.09
 * @description history.state一般使用在单页应用中，用于页面切换的数据储存，但并不是所有的网站都是单页应用，这里我把它提取出来，优化网站的用户体验
 *
 * -2015.07.15 兼容不支持的设备
 */
var historyState = function() {
    var title, props;
    title = document.title||"";
    props = {
        length: {
            get: function() { return Object.keys(hs).length; },
            set: function() { return this.length; }
        }
    };

    // 从state中取出数据
    if(history.state instanceof Object){
        Object.keys(history.state).forEach(function (name) {
            props[name]={
                value: history.state[name],
                writable: true,
                configurable: true,
                enumerable: true
            }
        });
    }

    // 规范类似 localStorage
    var hs = Object.create({
        getItem: function(key) {
            return this[key];
        },
        setItem: function(key, value) {
            this[key] = value;
            // state只能通过replaceState修改
            history.replaceState(this, title);
        },
        removeItem: function(key) {
            delete this[key];
            history.replaceState(this, title);
        },
        clear: function() {
            Object.keys(this, function (name) {
                delete this[name];
            });
            history.replaceState({}, null);
        }
    }, props);

    return hs;
}();