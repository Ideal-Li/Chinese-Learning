const Koa = require('koa');
// const router = require('./route')
const koaBody = require('koa-body');
var nodejieba = require("nodejieba");
const Router = require('koa-router');
var router = new Router();

const cors = require('@koa/cors');

var logger = require('koa-pino-logger')

var app = new Koa()

app.use(logger({
  name: 'dyw-app',
  prettyPrint: true
}))

app.use(cors())

router.post('/cut', koaBody(), async function(ctx, next) {
  const { word } = ctx.request.body
  try {
    var result = nodejieba.cut(word);
    ctx.body = { code: 200, message: 'success', result }
  } catch (e) {
    ctx.body = { code: 500, message: e.message }
  }
})

app.use(router.routes(), router.allowedMethods());

// 404 middleware from Koa-examples/404
app.use(async function pageNotFound(ctx) {
  ctx.log.error('404 not Found')
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

app.listen(3000);