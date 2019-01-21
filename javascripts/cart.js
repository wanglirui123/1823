//  变量区域;
// 所有购物车商品的容器;
var $container = $(".box-container");
// 渲染数据的列表;
var list = [];
var cookie = null;
// 加载数据
$.ajax("https://list.mogujie.com/search",{
dataType:"jsonp"
})
.then(render)

function render(res){
list = res.result.wall.list;
var html = template("box-item",{list : list});
$container.html(html);
}

// 购物车逻辑;

// 当一个商品点击加入购物车之后，我把商品的数据存入到cookie之中这个时候我们也就算是成功加入了购物车;

// 利用事件委托给父级绑定一个事件, 当子集按钮加入购物车触发事件时, 我们要分辨谁是当前点击的元素;
$container.on("click","button",addCart);

function addCart(evt){
var e = evt || window.event;
var target = e.target || e.srcElement;
var index = $(target).attr("data-index");
// 利用商品下标在商品列表 list 之中获取到了对应的商品数据;
// console.log(index,list[index])

// 把商品的iid 放入cookie之中?

var iid = list[index].iid;

// $.cookie("carts",iid);

//1. 判定当前页面是否存在 carts cookie;

if(cookie = $.cookie("carts")){
// 转换成数组操作;
var cartsList = JSON.parse(cookie);

// 我要判定当前的iid 是否已经存在于 cartsList之中;
// 如果已经存在那么我就让num 属性自增就可以了;
// 如果不存在我再去创建一个新的结构;

var hasSameId = cartsList.some(function(item,index){
      // 如果id相同数量自增
      if(item.id === iid){
            item.num ++;
      }
      return item.id === iid;
})

//如果没有相同id ， 创建新数据;
if(!hasSameId){
      var item = {
            "id" : iid,
            "num" : 1
      }
      cartsList.push(item);
}

$.cookie("carts",JSON.stringify(cartsList));

}else{
// 建立初始结构;
var cartsList = [
      {
            "id" : iid,
            "num" : 1
      }
]
$.cookie("carts",JSON.stringify(cartsList));
}
// console.log($.cookie("carts"));
$("#showNum").html(getCartsNum())
}

function getCartsNum(){
if(! $.cookie("carts")){ return 0 };
var cartsList = JSON.parse($.cookie("carts"));

var count = 0;
for(var i = 0 ; i < cartsList.length ; i ++){
count += Number(cartsList[i].num);
}

return count;
}

// console.log(getCartsNum());

$("#showNum").html(getCartsNum());

// 清空购物车;

$(".show").on("click",clearCarts);

function  clearCarts(){
var bool =  confirm("是否清空购物车");

if(bool){
$.cookie("carts","");
$("#showNum").html(getCartsNum());
}      
}

$("#jiesuan").on("click",tiaozhuan);

function tiaozhuan(){
location.href = "showCart.html";
}