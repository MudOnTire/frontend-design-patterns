![Banner](http://lc-3Cv4Lgro.cn-n1.lcfile.com/c1af7a4c1b765d6fb777/banner.png)

# 什么是设计模式？

设计模式是对软件设计开发过程中反复出现的某类问题的通用解决方案。设计模式更多的是指导思想和方法论，而不是现成的代码，当然每种设计模式都有每种语言中的具体实现方式。学习设计模式更多的是理解各种模式的内在思想和解决的问题，毕竟这是前人无数经验总结成的最佳实践，而代码实现则是对加深理解的辅助。

# 设计模式的类型

设计模式可以分为三大类：

1. 结构型模式（Structural Patterns）：通过识别系统中组件间的简单关系来简化系统的设计。

1. 创建型模式（Creational Patterns）：处理对象的创建，根据实际情况使用合适的方式创建对象。常规的对象创建方式可能会导致设计上的问题，或增加设计的复杂度。创建型模式通过以某种方式控制对象的创建来解决问题。

1. 行为型模式（Behavioral Patterns）：用于识别对象之间常见的交互模式并加以实现，如此，增加了这些交互的灵活性。

以上定义非常的抽象和晦涩，对于我们初学者并没有太多帮助，要了解这些设计模式真正的作用和价值还是需要通过实践去加以理解。这三大类设计模式又可以分成更多的小类，如下图：

![design patterns](http://lc-3Cv4Lgro.cn-n1.lcfile.com/960df36ee5a693833541/patterns.svg)

下面我们选择一些在前端开发过程中常见的模式进行一一讲解。

# 一. 结构型模式（Structural Patterns）

## 1. 外观模式（Facade Pattern）

![facade](http://lc-3Cv4Lgro.cn-n1.lcfile.com/23064fc82c0d5b7b8d2d/facade.png)

外观模式是最常见的设计模式之一，它为子系统中的一组接口提供一个统一的高层接口，使子系统更容易使用。简而言之外观设计模式就是把多个子系统中复杂逻辑进行抽象，从而提供一个更统一、更简洁、更易用的API。很多我们常用的框架和库基本都遵循了外观设计模式，比如JQuery就把复杂的原生DOM操作进行了抽象和封装，并消除了浏览器之间的兼容问题，从而提供了一个更高级更易用的版本。其实在平时工作中我们也会经常用到外观模式进行开发，只是我们不自知而已。

比如，我们可以应用外观模式封装一个统一的DOM元素事件绑定/取消方法，用于兼容不同版本的浏览器和更方便的调用：

```
// 绑定事件
function addEvent(element, event, handler) {
  if (element.addEventListener) {
    element.addEventListener(event, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  } else {
    element['on' + event] = fn;
  }
}

// 取消绑定
function removeEvent(element, event, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(event, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, handler);
  } else {
    element['on' + event] = null;
  }
}
```

## 2. 代理模式（Proxy Pattern）

![proxy](http://lc-3Cv4Lgro.cn-n1.lcfile.com/5529c921e862b72a3746/proxy.png)

首先，一切皆可代理，不管是在实现世界还是计算机世界。现实世界中买房有中介、打官司有律师、投资有经纪人，他们都是代理，由他们帮你处理由于你缺少时间或者专业技能而无法完成的事务。类比到计算机领域，代理也是一样的作用，当访问一个对象本身的代价太高（比如太占内存、初始化时间太长等）或者需要增加额外的逻辑又不修改对象本身时便可以使用代理。ES6中也增加了 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的功能。

归纳一下，代理模式可以解决以下的问题：

1. 增加对一个对象的访问控制

1. 当访问一个对象的过程中需要增加额外的逻辑

要实现代理模式需要三部分：

1. `Real Subject`：真实对象

1. `Proxy`：代理对象

1. `Subject`接口：Real Subject 和 Proxy都需要实现的接口，这样Proxy才能被当成Real Subject的“替身”使用

比如有一个股票价格查询接口，调用这个接口需要比较久的时间（用 `setTimeout` 模拟2s的调用时间）：

**StockPriceAPI：**

```
function StockPriceAPI() {
  // Subject Interface实现
  this.getValue = function (stock, callback) {
    console.log('Calling external API ... ');
    setTimeout(() => {
      switch (stock) {
        case 'GOOGL':
          callback('$1265.23');
          break;
        case 'AAPL':
          callback('$287.05');
          break;
        case 'MSFT':
          callback('$173.70');
          break;
        default:
          callback('');
      }
    }, 2000);
  }
}
```

我们不希望每次都去请求远程接口，而是增加缓存机制，当有缓存的时候就直接从缓存中获取，否则再去请求远程接口。我们可以通过一个proxy来实现：

**StockPriceAPIProxy：**

```
function StockPriceAPIProxy() {
  // 缓存对象
  this.cache = {};
  // 真实API对象
  this.realAPI = new StockPriceAPI();
  // Subject Interface实现
  this.getValue = function (stock, callback) {
    const cachedPrice = this.cache[stock];
    if (cachedPrice) {
      console.log('Got price from cache');
      callback(cachedPrice);
    } else {
      this.realAPI.getValue(stock, (price) => {
        this.cache[stock] = price;
        callback(price);
      });
    }
  }
}
```

注意，Proxy需要和真实对象一样实现 `getValue()` 方法，`getValue()`就属于 **Subject 接口**。

测试一下：

```
const api = new StockPriceAPIProxy();
api.getValue('GOOGL', (price) => { console.log(price) });
api.getValue('AAPL', (price) => { console.log(price) });
api.getValue('MSFT', (price) => { console.log(price) });

setTimeout(() => {
  api.getValue('GOOGL', (price) => { console.log(price) });
  api.getValue('AAPL', (price) => { console.log(price) });
  api.getValue('MSFT', (price) => { console.log(price) });
}, 3000)
```

**输出：**

```
Calling external API ... 
Calling external API ... 
Calling external API ... 
$1265.23
$287.05
$173.70
Got price from cache
$1265.23
Got price from cache
$287.05
Got price from cache
$173.70
```


# 二. 创建型模式（Creational Patterns）

## 1. 工厂模式（Factory Pattern）

![factory](http://lc-3Cv4Lgro.cn-n1.lcfile.com/3af93a26cdc73dd6b492/factory.png)

现实生活中的工厂按照既定程序制造产品，随着生产原料和流程不同生产出来的产品也会有区别。应用到软件工程的领域，工厂可以看成是一个制造其他对象的对象，制造出的对象也会随着传入工厂对象参数的不同而有所区别。

什么场景适合应用工厂模式而不是直接 `new` 一个对象呢？当构造函数过多不方便管理，且需要创建的对象之间存在某些关联（有同一个父类、实现同一个接口等）时，不妨使用工厂模式。工厂模式提供一种集中化、统一化的方式，避免了分散创建对象导致的代码重复、灵活性差的问题。

以上图为例，我们构造一个简单的汽车工厂来生产汽车：

```
// 汽车构造函数
function SuzukiCar(color) {
  this.color = color;
  this.brand = 'Suzuki';
}

// 汽车构造函数
function HondaCar(color) {
  this.color = color;
  this.brand = 'Honda';
}

// 汽车构造函数
function BMWCar(color) {
  this.color = color;
  this.brand = 'BMW';
}

// 汽车品牌枚举
const BRANDS = {
  suzuki: 1,
  honda: 2,
  bmw: 3
}

/**
 * 汽车工厂
 */
function CarFactory() {
  this.create = function (brand, color) {
    switch (brand) {
      case BRANDS.suzuki:
        return new SuzukiCar(color);
      case BRANDS.honda:
        return new HondaCar(color);
      case BRANDS.bmw:
        return new BMWCar(color);
      default:
        break;
    }
  }
}
```

**测试一下：**

```
const carFactory = new CarFactory();
const cars = [];

cars.push(carFactory.create(BRANDS.suzuki, 'brown'));
cars.push(carFactory.create(BRANDS.honda, 'grey'));
cars.push(carFactory.create(BRANDS.bmw, 'red'));

function say() {
  console.log(`Hi, I am a ${this.color} ${this.brand} car`);
}

for (const car of cars) {
  say.call(car);
}
```

**输出：**

```
Hi, I am a brown Suzuki car
Hi, I am a grey Honda car
Hi, I am a red BMW car
```

使用工厂模式之后，不再需要重复引入一个个构造函数，只需要引入工厂对象就可以方便的创建各类对象。

## 2. 单例模式（Singleton Pattern）

![singleton](http://lc-3Cv4Lgro.cn-n1.lcfile.com/7c16c62186e7d711218d/singleton.png)

顾名思义，单例模式中Class的实例个数最多为1。当需要一个对象去贯穿整个系统执行某些任务时，单例模式就派上了用场。而除此之外的场景尽量避免单例模式的使用，因为单例模式会引入全局状态，而一个健康的系统应该避免引入过多的全局状态。

实现单例模式需要解决以下几个问题：

1. 如何确定Class只有一个实例？

1. 如何简便的访问Class的唯一实例？

1. Class如何控制实例化的过程？

1. 如何将Class的实例个数限制为1？

我们一般通过实现以下两点来解决上述问题：

1. 隐藏Class的构造函数，避免多次实例化

1. 通过暴露一个 `getInstance()` 方法来创建/获取唯一实例

Javascript中单例模式可以通过以下方式实现：

```
// 单例构造器
const FooServiceSingleton = (function () {
  // 隐藏的Class的构造函数
  function FooService() {}

  // 未初始化的单例对象
  let fooService;

  return {
    // 创建/获取单例对象的函数
    getInstance: function () {
      if (!fooService) {
        fooService = new FooService();
      }
      return fooService;
    }
  }
})();
```

实现的关键点有：1. 使用 [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)创建局部作用域并即时执行；2. `getInstance()` 为一个 [闭包](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) ，使用闭包保存局部作用域中的单例对象并返回。

我们可以验证下单例对象是否创建成功：

```
const fooService1 = FooServiceSingleton.getInstance();
const fooService2 = FooServiceSingleton.getInstance();

console.log(fooService1 === fooService2); // true
```

# 三. 行为型模式（Behavioral Patterns）

## 1. 策略模式（Strategy Pattern）

![strategy](http://lc-3Cv4Lgro.cn-n1.lcfile.com/8371529e9200dba8abc4/strategy.png)

策略模式简单描述就是：对象有某个行为，但是在不同的场景中，该行为有不同的实现算法。比如每个人都要“交个人所得税”，但是“在美国交个人所得税”和“在中国交个人所得税”就有不同的算税方法。最常见的使用策略模式的场景如登录鉴权，鉴权算法取决于用户的登录方式是手机、邮箱或者第三方的微信登录等等，而且登录方式也只有在运行时才能获取，获取到登录方式后再动态的配置鉴权策略。所有这些策略应该实现统一的接口，或者说有统一的行为模式。Node 生态里著名的鉴权库 [Passport.js](http://www.passportjs.org/) API的设计就应用了策略模式。

还是以登录鉴权的例子我们仿照 **passport.js** 的思路通过代码来理解策略模式：

```
/**
 * 登录控制器
 */
function LoginController() {
  this.strategy = undefined;
  this.setStrategy = function (strategy) {
    this.strategy = strategy;
    this.login = this.strategy.login;
  }
}

/**
 * 用户名、密码登录策略
 */
function LocalStragegy() {
  this.login = ({ username, password }) => {
    console.log(username, password);
    // authenticating with username and password... 
  }
}

/**
 * 手机号、验证码登录策略
 */
function PhoneStragety() {
  this.login = ({ phone, verifyCode }) => {
    console.log(phone, verifyCode);
    // authenticating with hone and verifyCode... 
  }
}

/**
 * 第三方社交登录策略
 */
function SocialStragety() {
  this.login = ({ id, secret }) => {
    console.log(id, secret);
    // authenticating with id and secret... 
  }
}

const loginController = new LoginController();

// 调用用户名、密码登录接口，使用LocalStrategy
app.use('/login/local', function (req, res) {
  loginController.setStrategy(new LocalStragegy());
  loginController.login(req.body);
});

// 调用手机、验证码登录接口，使用PhoneStrategy
app.use('/login/phone', function (req, res) {
  loginController.setStrategy(new PhoneStragety());
  loginController.login(req.body);
});

// 调用社交登录接口，使用SocialStrategy
app.use('/login/social', function (req, res) {
  loginController.setStrategy(new SocialStragety());
  loginController.login(req.body);
});
```

从以上示例可以得出使用策略模式有以下优势：

1. 方便在运行时切换算法和策略

1. 代码更简洁，避免使用大量的条件判断

1. 关注分离，每个strategy类控制自己的算法逻辑，strategy和其使用者之间也相互独立

## 2. 迭代器模式（Iterator Pattern）

![iterator](http://lc-3Cv4Lgro.cn-n1.lcfile.com/aeaeff96a83849a91731/Iterator.png)

ES6中的迭代器 [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) 相信大家都不陌生，迭代器用于遍历容器（集合）并访问容器中的元素，而且无论容器的数据结构是什么（Array、Set、Map等），迭代器的接口都应该是一样的，都需要遵循 [迭代器协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)。

迭代器模式解决了以下问题：

1. 提供一致的遍历各种数据结构的方式，而不用了解数据的内部结构

1. 提供遍历容器（集合）的能力而无需改变容器的接口

一个迭代器通常需要实现以下接口：

* `hasNext()`：判断迭代是否结束，返回Boolean

* `next()`：查找并返回下一个元素

为Javascript的数组实现一个迭代器可以这么写：

```
const item = [1, 'red', false, 3.14];

function Iterator(items) {
  this.items = items;
  this.index = 0;
}

Iterator.prototype = {
  hasNext: function () {
    return this.index < this.items.length;
  },
  next: function () {
    return this.items[this.index++];
  }
}
```

验证一下迭代器是否工作：

```
const iterator = new Iterator(item);

while(iterator.hasNext()){
  console.log(iterator.next());
}
```
**输出：**

```
1, red, false, 3.14
```

ES6提供了更简单的迭代循环语法 `for...of`，使用该语法的前提是操作对象需要实现 [可迭代协议（The iterable protocol）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)，简单说就是该对象有个Key为 `Symbol.iterator` 的方法，该方法返回一个iterator对象。

比如我们实现一个 `Range` 类用于在某个数字区间进行迭代：

```
function Range(start, end) {
  return {
    [Symbol.iterator]: function () {
      return {
        next() {
          if (start < end) {
            return { value: start++, done: false };
          }
          return { done: true, value: end };
        }
      }
    }
  }
}
```

**验证一下：**

```
for (num of Range(1, 5)) {
  console.log(num);
}
```

**输出：**
```
1, 2, 3, 4
```

## 3. 观察者模式（Observer Pattern）

![observer](http://lc-3Cv4Lgro.cn-n1.lcfile.com/252c467e10809ca02945/observer.png)

观察者模式又称发布订阅模式（Publish/Subscribe Pattern），是我们经常接触到的设计模式，日常生活中的应用也比比皆是，比如你订阅了某个博主的频道，当有内容更新时会收到推送；又比如JavaScript中的事件订阅响应机制。观察者模式的思想用一句话描述就是：**被观察对象（subject）维护一组观察者（observer），当被观察对象状态改变时，通过调用观察者的某个方法将这些变化通知到观察者**。

比如给DOM元素绑定事件的 `addEventListener()` 方法：

```
target.addEventListener(type, listener [, options]);
```

Target就是被观察对象Subject，listener就是观察者Observer。

观察者模式中Subject对象一般需要实现以下API：

* `subscribe()`: 接收一个观察者observer对象，使其订阅自己

* `unsubscribe()`: 接收一个观察者observer对象，使其取消订阅自己

* `fire()`: 触发事件，通知到所有观察者

用JavaScript手动实现观察者模式：

```
// 被观察者
function Subject() {
  this.observers = [];
}

Subject.prototype = {
  // 订阅
  subscribe: function (observer) {
    this.observers.push(observer);
  },
  // 取消订阅
  unsubscribe: function (observerToRemove) {
    this.observers = this.observers.filter(observer => {
      return observer !== observerToRemove;
    })
  },
  // 事件触发
  fire: function () {
    this.observers.forEach(observer => {
      observer.call();
    });
  }
}
```

验证一下订阅是否成功：

```
const subject = new Subject();

function observer1() {
  console.log('Observer 1 Firing!');
}


function observer2() {
  console.log('Observer 2 Firing!');
}

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.fire();
```

**输出：**

```
Observer 1 Firing! 
Observer 2 Firing!
```

验证一下取消订阅是否成功：

```
subject.unsubscribe(observer2);
subject.fire();
```

**输出：**

```
Observer 1 Firing!
```

## 4. 中介者模式（Mediator Pattern）

![mediator](http://lc-3Cv4Lgro.cn-n1.lcfile.com/f5e2d4040c795599060d/mediator.png)

在中介者模式中，中介者（Mediator）包装了一系列对象相互作用的方式，使得这些对象不必直接相互作用，而是由中介者协调它们之间的交互，从而使它们可以松散偶合。当某些对象之间的作用发生改变时，不会立即影响其他的一些对象之间的作用，保证这些作用可以彼此独立的变化。

中介者模式和观察者模式有一定的相似性，都是一对多的关系，也都是集中式通信，不同的是中介者模式是处理同级对象之间的交互，而观察者模式是处理Observer和Subject之间的交互。中介者模式有些像婚恋中介，相亲对象刚开始并不能直接交流，而是要通过中介去筛选匹配再决定谁和谁见面。中介者模式比较常见的应用比如聊天室，聊天室里面的人之间并不能直接对话，而是通过聊天室这一媒介进行转发。一个简易的聊天室模型可以实现如下：

**聊天室成员类：**

```
function Member(name) {
  this.name = name;
  this.chatroom = null;
}

Member.prototype = {
  // 发送消息
  send: function (message, toMember) {
    this.chatroom.send(message, this, toMember);
  },
  // 接收消息
  receive: function (message, fromMember) {
    console.log(`${fromMember.name} to ${this.name}: ${message}`);
  }
}
```

**聊天室类：**

```
function Chatroom() {
  this.members = {};
}

Chatroom.prototype = {
  // 增加成员
  addMember: function (member) {
    this.members[member.name] = member;
    member.chatroom = this;
  },
  // 发送消息
  send: function (message, fromMember, toMember) {
    toMember.receive(message, fromMember);
  }
}
```

**测试一下：**

```
const chatroom = new Chatroom();
const bruce = new Member('bruce');
const frank = new Member('frank');

chatroom.addMember(bruce);
chatroom.addMember(frank);

bruce.send('Hey frank', frank);
```

**输出：**

```
bruce to frank: hello frank
```

这只是一个最简单的聊天室模型，真正的聊天室还可以加入更多的功能，比如敏感信息拦截、一对多聊天、广播等。得益于中介者模式，Member不需要处理和聊天相关的复杂逻辑，而是全部交给Chatroom，有效的实现了关注分离。


## 5. 访问者模式（Visitor Pattern）

![visitor](http://lc-3Cv4Lgro.cn-n1.lcfile.com/e46eca323512078a4db3/visitor.svg)

访问者模式是一种将算法与对象结构分离的设计模式，通俗点讲就是：访问者模式让我们能够在不改变一个对象结构的前提下能够给该对象增加新的逻辑，新增的逻辑保存在一个独立的访问者对象中。访问者模式常用于拓展一些第三方的库和工具。

访问者模式的实现有以下几个要素：

1. `Visitor Object`：访问者对象，拥有一个 `visit()` 方法

1. `Receiving Object`：接收对象，拥有一个 `accept()` 方法

1. `visit(receivingObj)`：用于Visitor接收一个Receiving Object

1. `accept(visitor)`：用于Receving Object接收一个Visitor，并通过调用Visitor的 `visit()` 为其提供获取Receiving Object数据的能力

简单的代码实现如下：

**Receiving Object：**

```
function Employee(name, salary) {
  this.name = name;
  this.salary = salary;
}

Employee.prototype = {
  getSalary: function () {
    return this.salary;
  },
  setSalary: function (salary) {
    this.salary = salary;
  },
  accept: function (visitor) {
    visitor.visit(this);
  }
}
```

**Visitor Object：**

```
function Visitor() { }

Visitor.prototype = {
  visit: function (employee) {
    employee.setSalary(employee.getSalary() * 2);
  }
}
```

**验证一下：**

```
const employee = new Employee('bruce', 1000);
const visitor = new Visitor();
employee.accept(visitor);

console.log(employee.getSalary());
```

**输出：**
```
2000
```

本文仅仅初步探讨了部分设计模式在前端领域的应用或者实现，旨在消除大部分同学心中对设计模式的陌生感和畏惧感。现有的设计模式就有大约50中，常见的也有20种左右，所以设计模式是一门宏大而深奥的学问需要我们不断的去学习和在实践中总结。本文所涉及到的9种只占了一小部分，未涉及到的模式里面肯定也有对前端开发有价值的，希望以后有机会能一一补上。谢谢阅读🙏！

本文源码请参考：https://github.com/MudOnTire/frontend-design-patterns