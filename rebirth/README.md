# rebirth_mini

#### rebirth_mini健身房介绍
1.产品应用场景:微信小程序。</br>  
2.开发人员:卢韵宇、王凯</br>  

#### 软件架构  
1.使用微信小程序原生开发项目</br>  
2.页面使用组件化。</br>  

#### 全局变量以及全局函数实现
  挂载全局变量 参见 store文件下common.js </br>  

#### 项目目录  
┌─static                存放应用引用静态资源（如图片、视频等）的地方，注意：静态资源只能存放于此</br>  
│  └─common.js          封装函数方法可全局调用</br>  
│  └─images             存放（如图片、视频等）的地方</br>  
├─threeComponents       公共组件</br>   
├─pages                 业务页面文件存放的目录</br>  
│  ├─ operate           </br>  
│  │  └─activityview    //寻找我的健身朋友 点击进入海报页面   </br>       
│  │  └─giftpay         //礼品卡支付页面</br>  
│  │  └─giftview        //礼品卡页面</br>  
│  │  └─mygift          //我的礼品卡</br>  
│  │  └─usegift         //激活卡片</br>  
│  ├─ order
│  │  └─index            //首页</br>  
│  │  └─appointment      //预约界面页面</br>  
│  │  └─appointrecord    //webview页面</br>  
│  │  └─cabinets         //购买储物柜</br>  
│  │  └─cashwithdrawal   //提现页面</br>  
│  │  └─footprint        //我的足迹页面</br>  
│  │  └─incomerecord     //收益记录 分享奖励列表页面</br>  
│  │  └─newlogin         //第一次去健身房页面</br>  
│  │  └─opencabinets     //我的储物柜页面</br>  
│  │  └─public           //健康方案页面</br>  
│  │  └─recharge         //充值会员卡页面</br>  
│  │  └─rechargerecord   //时长记录 退卡记录 充值记录等</br>  
│  │  └─refund            //退款页面</br>  
│  │  └─refundorder      // 退款记录</br>  
│  │  └─statement         //注意事项等合约</br>  
│  ├─ product</br>  
│  │  └─gymlocation      //附近健身房列表</br>  
│  │  └─opendoor         //我的预约页面</br>  
│  ├─ user</br>  
│  │  └─invitationview     //canvas生成海报页面</br>  
│  │  └─subordinatemember    //我的运动伙伴页面</br>  
├─app.js                初始化入口文件</br>  
├─app.wxss              应用配置，用来配置App全局样式以及监听 应用生命周期</br>  
├─app.json              配置页面路由、导航条、选项卡等页面类信息</br>  
└─project.config.json   项目配置文件。</br>  
#### 不允许使用的框架  
...
#### WXML 规范
  wxml 标签可以单独出现的情况，尽量单独出现，如<input/>。</br>  
  控制每行 HTML 的代码数量在 50 个字符以内，方便阅读浏览，多余的代码进行换行处理，标签所带属性每个属性间进行换行。</br>  
  <view  wx:if="{{classic.type===200}}"  
         img="{{classic.img}}"
         content="{{classic.content}}">
  </view>
  合理展现分离内容，尽量不要使用内联样式。
  <view class="mybox-avaurl"></view>

#### 注释 规范
  除组件外的其他块级元素，均需注释出其功能，并在其上下空出一行与其他代码进行区分。</br>  

#### CSS 规范
  在开发过程中 rpx 和 px 均可能用到，如通常情况下间距使用 rpx，开发者根据实际情况而定。
  CSS 代码需有明显的代码缩进。每一个样式类之间空出一行。</br>  

  .centerver{
    font-size: 32rpx;
    color: #999;
    text-align: center;
  }

  .centerver image{
    width: 310rpx;
    height: 300rpx;
  }

  尽量使用简写属性，并且同一属性放置在一起，避免散乱。
  .v-image{
    margin: 0 auto;
  }
  .v-tag{
    <!-- margin-left: 10rpx;
    margin-right: 10rpx -->
    margin: 0 10rpx;
  }
  采用 flex 进行布局，尽量不使用 float 以及 vertical-align。
  .container{
    disaplay: flex;
    flex-dirextion: row
  }
#### 命名规范
  变量名以及函数名统一采用驼峰命名法，正常情况下函数名前缀需加上清晰的动词表示函数功能，私有函数或者属性以下划线开头表明。
  常量需用 const 声明。
  //定义常量  const a = 1
  //定义变量  let imageContent =  res.data
  //函数命名
  getInfo:function(){
    return '';
  }
  回调函数统一使用 Promise 函数的方式进行编写，回调成功的参数统一为 res，错误参数为 err
  let back = new Promise((resolve, reject) => {
    if(<!--异步操作成功 -->){
        resolve(value);
      } else {
        reject(error);
      }
  });
  back.then((res) => {
      console.log('成功回调！', res);
  }).catch((err) => {
      console.log('失败回调！', error);
  });
  函数以及回调函数统一放置在生命周期函数后。
  删除 js 文件中未用到的生命周期函数，保持代码的整洁。</br>  
  Pages({
    data:{

    },
    onLoad:function(event){

    },
    self:function(){

    }
  })
  所有涉及到数据绑定的变量均需在 data 中初始化。禁止在不定义的情况下直接 setData。
  点击事件函数命名方式为 on + 事件名 或者业务名。
  onLike: function(event){

  }
#### 注意事项   

1 要区分一下一个新的页面的业务逻辑适合放在onload里面去做请求还是适合在onshow里面去请求数据。</br>  
2 页面的各种请求可以放到onShow 中,这样的话可以从返回上一个页面时,上一个页面的数据进行重新加载,以便于获取最新的数据; 同时也可以避免wx.getCurrentPage来取数据。</br>  
3 每个页面中的data 数据,尽量使用对象的方式,可以设置多个属性值。避免以后维护过程中不知道每个变量的含义。</br>  
4 获取用户输入的内容,尽量用bindinput ,验证的时候使用bindblur。</br>  
5 数据分页加载的功能,其实是声名一个空数组,这个空数组carlist就是页面的数据列表,每次请求到的数据,利用数组的concat() 方式将新请求到的数据跟之前的数组链接起来,形成分页加载的效果,如果请求的数据是空,则显示到底了,如果第一次请求数据就是空,则显示时暂无数据; 这样不以依据默认的carlist.length==0来显示暂无数据图片造成的闪现。</br>  
6 把JS功能封装成单独的模块,不要再放在同一个common中。为了以后方便迁移和结构的升级。</br>  
7 公共样式也要进行封装，避免后期太多、太乱。</br>  
8 每个页面要对上一个页面的传值就行验证，避免因为传值不对造成功能不能使用或者页面崩溃的情况。</br>  
9 开发的过程中,首页对整个业务流程进行构思,根据业务流程开发,一定要合理安排好每个业务的功能模板中最核心的业务，核心模板不仅仅涉及个人,还关系到测试方面,甚至其他人的进度工作。</br>  
10 能用一个页面的 ,尽量整合成一个页面。比如:详情页和sku。甚至以后的活动页面。</br>  
11 对于已经加载到底的图标,由于图片和文字两边各有一个”---------”,可以用两个空盒子,然后设置border-top的方式形成两边的横线。</br>  
12 所有的按钮都要有交互反馈。确保让用户能感受到我确实点击了按钮。</br>  
13 所有的按钮,尤其是提交类型的按钮,最好都要进行单击次数的限制,目的是为了避免数据的重复提交,在交易网站中的目的是避免重复下单。</br>  
14 所有的数据下载或上传的时候,预加载效果不仅仅是个样式,也是保证每次的数据能够有时间上传或者下载的过程。</br>  
15 确保git中的代码与最新项目版本能够有一套完全相同的,同时也要预估好线上项目突发机制，另外确保项目再git中有各个历史版本,确保项目如果有突发风险,可以及时利用上一个版本进行替换,不至于导致项目无法使用;但是最好是检查好,不要出现突发情况。</br>  
16 首先要想到的并且加入到项目的首要功能是版本更新机制,比如小程序的版本更新机制,原因:可能因为版本不及时更新导致很多不良后果;另外版本号要在上线项目中表明,以便于进行区分工作。</br>  
17 每次修改一个内容,都要看一下是否把原本没问题的流程影响了,导致bug</br>  
18 代码上线前,一定要审核是否有相关的重要代码被注销了,否在带来的后果是不堪设想的。</br>  
19 代码发布时一定要考虑到有一个版本,保证核心业务流程能够不受影响的正常使用。</br>  
#### API 的条件编译  
#endif   
####  组件的条件编译  
<!--  #ifdef  %PLATFORM% -->  
平台特有的组件  
<!--  #endif -->  
####  样式的条件编译
/*  #ifdef  %PLATFORM%  */
平台特有样式
/*  #endif  */
