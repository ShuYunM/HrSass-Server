/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
const Koa = require("koa"),
  Router = require("koa-router"),
  Static = require("koa-static"),
  Session = require("koa-session"),
  BodyParser = require("koa-bodyparser"),
  path = require("path"),
  compress = require("koa-compress"),
  jsonp = require("koa-jsonp");

const app = new Koa();
const router = new Router();

const api = require("./src/routes/api"); // 后端接口
const url = require("url");
require('./src/model/db') // 引入数据库
//配置session
app.keys = ["some secret hurr"];
app.use(
  Session(
    {
      key: "koa:sess",
      maxAge: 5400000,
      overwrite: true,
      httpOnly: true,
      signed: true,
      rolling: true,
      renew: false,
    },
    app
  )
);
//配置静态资源
app.use(Static(path.join(__dirname, "public")));
app.use(Static(path.join(__dirname, "statics")));
//配置post请求数据接收
app.use(BodyParser());
//jsonp
app.use(jsonp());

//gzip
app.use(
  compress({
    filter: function (content_type) {
      return true;
    },
    threshold: 2048,
    flush: require("zlib").Z_SYNC_FLUSH,
  })
);

//全局属性
router.use(async (ctx, next) => {
  var pathname = url.parse(ctx.url).pathname;
   if (pathname === '/api/sys/login') {
      // 如果是登录直接放过
     await next()
   }else {
    let { authorization } = ctx.request.header;
    if (authorization && ctx.session.user && ctx.session.user.token === authorization.split(' ')[1]) {
      console.log("执行请求:" + pathname)
      await  next()
    }
    else {
       ctx.status = 401 // 超时token
       ctx.body = {
         message: authorization ? 'token超时' : '您还未登录',
         success: false,
         code: 10002,
         data: null
       }
    }
   }
});

router.get('/',async ctx => {
  ctx.body = '黑马程序员-人力资源接口服务启动, 欢迎使用!!!';
} )
router.use("/api", api);

app.use(router.routes())
//启动路由
app.use(router.allowedMethods());
//启动服务器
app.listen(3000, (err) =>{
  console.log("人力资源后端接口启动,http://localhost:3000")
});
