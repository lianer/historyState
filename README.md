## 使用 history.state 优化网站
> history.state一般使用在单页应用中，用于页面切换的数据储存，但并不是所有的网站都是单页应用，这里我把它提取出来，优化网站的用户体验

## history 简单介绍
  history对象在浏览器中用以储存会话的历史记录，有如下属性：

  * `length` 返回历史记录的长度
  * `go( [ index ] )` 前进或后退到指定的历史，如：history.go(1)
  * `back()` 后退一个历史记录
  * `forward()` 前进一个历史记录
  * `pushState(data, title, [, url] )` 增加一条新的历史记录到会话历史
  * `replaceState(data, title, [, url] )` 修改当前历史记录

  本文的重点不是讲history对象，简单的列一下方法，就此略过

## history.state
  `state` 对象用以储存每条历史记录的数据，它的值可以是任何可以被序列化的JavaScript对象。

  当用户点击浏览器后退或 `history.back()` 到一条历史记录，`history.state`的值就会变成该历史记录对应的 `state` 值，
  这些历史记录的 `state` 的集合储存在浏览器的session stack中。
  
  一个简单的例子：如果有一个页面，里面有ajax生成的列表，我们将这些列表数据储存到 `state` 对象中，当返回到这个历史记录的时候，我们从 `history.state` 中读取之前储存的数据，这样就不用再一次的请求服务器，而直接将数据渲染到页面上，并且恢复滚动的高度、筛选项等。

  是不是觉得很强大？看 [demo]()


## history.replaceState(data, title, [, url] )
  `history.replaceState(data, title, [, url] )` 函数用来更新 state, title, url。此操作不会发生页面跳转。

  1. 当调用该函数的时候，data对象会被克隆结构(克隆对象的结构，原型将不会被储存)，然后储存到session stack中
  2. 大多数浏览器屏蔽了title属性
  3. 如果有url参数，则会替换当前页面的url，替换时，浏览器会将url与页面的url匹配，如果有协议、域名、端口不统一，则会抛出异常，保证安全性

## 注意
  `history.state` 并不是session stack中的某个state的引用，而只是一份拷贝；直接修改 `history.state` 对象是无效的，我们只能通过 `history.replaceState` 来修改。

## 实现
    var data={x: 1};
    history.replaceState(data, document.title); // 将data储存到 session stack
    console.log(history.state); // => {x: 1}

## 封装

