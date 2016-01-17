(function init(){
    var elem={
        list: document.querySelector("#list"),
        load: document.querySelector("#load")
    };
    var state=historyState.getItem("list")||{
        page: 0,
        stack: []
    };
    var rows=10;
    
    elem.load.addEventListener("click", function(){
        request();
    });

    Mock.mock("test", {
        err: 0,
        message: "",
        data: {
            list: new Array(rows).join(",").split(",").map(function(item, i){ return "我是第"+(state.page*rows+i)+"条数据"; })
        }
    });
    
    if(state.page>0){
        render();
    }
    else{
        request();
    }
    
    function request(){
        $.ajax({
            url: "test",
            dataType: "json",
            success: function (res) {
                console.log(res);
                if(res && !res.err && res.data && res.data.list && res.data.list.length){
                    state.page++;
                    state.stack=res.data.list;
                    render();
                    historyState.setItem("list", state);
                }
            }
        })
    }
    
    function render(){
        var fragment=document.createDocumentFragment();
        state.stack.forEach(function(item, index, stack){
            var li=document.createElement("li");
            li.textContent=item;
            fragment.appendChild(li);
        });
        state.stack.length=0;
        elem.list.appendChild(fragment);
    }
})();
