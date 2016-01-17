(function init(){
    if(location.hostname===""){
        alert("请在服务器环境下打开，history.replaceState不支持文件路径");
        return false;
    }

    var elem={
        list: document.querySelector("#list"),
        load: document.querySelector("#load")
    };

    // 该对象中的属性会储存在history中
    var state=historyState.getItem("list")||{
        page: 0,  // 页码
        stack: []  // 储存的列表数据
    };

    var rows=10,
        lastIndex=0; // 上次渲染结束的位置
    
    // 点击加载
    elem.load.addEventListener("click", function (){
        request();
    });

    // mock.js ajax请求模拟
    Mock.mock("test", {
        err: 0,
        message: "",
        data: {
            // 伪造一个长度为10的数组
            get list(){
                for (var i = 0, list=[]; i < rows; i++) {
                    list.push("我是第"+(state.page*rows+i)+"条数据");
                };
                return list;
            }
        }
    });
    
    // 如果页数大于0，说明已经从history中恢复了数据，直接render列表即可
    if(state.page>0){
        render();
    }
    else{
        request();
    }
    
    // 请求
    function request(){
        $.ajax({
            url: "test",
            dataType: "json",
            success: function (res) {
                if(res && !res.err && res.data && res.data.list && res.data.list.length){
                    // 页码+1
                    state.page++;
                    // 追加到stack中
                    state.stack=state.stack.concat(res.data.list);
                    historyState.setItem("list", state);
                    render();
                }
            }
        })
    }
    
    // 渲染
    function render(){
        var fragment=document.createDocumentFragment();

        // 每次渲染从上一次结束的index开始
        for (var i = lastIndex; item=state.stack[i]; i++) {
            var li=document.createElement("li");
            li.textContent=item;
            fragment.appendChild(li);
        };
        elem.list.appendChild(fragment);

        // 更新lastIndex
        lastIndex=state.stack.length;
    }
})();
