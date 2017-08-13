const router = require('koa-router')()
/*引入user模块，获得Model实例，对数据库进行操作 */
const User=require('../model/user')
const crypto=require('crypto')
router.prefix('/users')

//登录成功跳转url
router.get('/login-success',async ctx=>{
  //按session中保存的id查询出一条记录
  let user=await User.findOne({where:{id:ctx.session.userId}})
  await ctx.render('login_success',{
    username:user.username
  })
})

router.get('/login', async ctx=>{
  //如果session存在，则直接跳转到登录成功界面
  if(ctx.session.userId){
    ctx.redirect('/users/login-success')
  }else{
    await ctx.render('login')
  }
})

router.get('/signup', async ctx=>{
  await ctx.render('signup')
})

router.post('/login', async ctx=>{
  /*解构获取username和password字段 */
  let {username,password}=ctx.request.body 
  let md5password=crypto.createHash('md5').update(password).digest('hex')
  //User.findOne返回一个promise，再await自动执行后就得到resolve的数据，也就是查询结果user
  //用where做条件查询，当键值对变量重名时可以用一个名字简写，否则应该是where:{username:username}
  let user=await User.findOne({where:{username}})
  //如果不用await，就需要手动执行promise得到resolve结果
  /*
  User.findOne({username}).then(user=>{
    console.log(user)
  })
  */
  if(!user){
    await ctx.render('login_fail',{
      reason:'用户不存在'
    })
    return
  }
  if(user.password!=md5password){
    await ctx.render('login_fail',{
      reason:'密码错误'
    })
    return
  }
  //将userid作为session，这里并不是生成session，而是在已有的session中保存了userid，便于后端其他部分对这个用户的session做处理
  ctx.session.userId=user.id
  //实用中登录成功不能渲染页面，而是要跳转页面，否则每次刷新都会发送post请求
  /*
  await ctx.render('login_success',{
    username:user.username
  })
  */
  ctx.redirect('/users/login-success')
})

router.post('/signup', async ctx=>{
  let {username,password,pwdrpt}=ctx.request.body
  let hasuser=await User.findOne({where:{username}})
  if(hasuser){
    await ctx.render('signup_fail',{
      reason:'用户名已存在'
    })
    return
  }
  if(!/\w{6,18}/.test(username)){
    await ctx.render('signup_fail',{
      reason:'用户名必须大于6个字符小于18个字符'
    })
    return
  }
  if(!/\w{6,18}/.test(password)){
    await ctx.render('signup_fail',{
      reason:'密码长度必须大于6个字符小于18个字符'
    })
    return
  }
  if(password!=pwdrpt){
    await ctx.render('signup_fail',{
      reason:'两次输入密码不一致'
    })
    return
  }


  let tempdata=ctx.request.body
  //将密码进行MD5加密
  let md5password=crypto.createHash('md5').update(password).digest('hex')
  tempdata.password=md5password
  /*ctx.request.body是koa-bodyparser插件引入的，表示请求参数对象*/
  //await console.log(ctx.request.body)
  //将请求出入插入user表，这里user表的字段定义与请求数据名一致，可以自动解构赋值
  let user=await User.create(tempdata)
  console.log(tempdata)
  //渲染成功注册页面
  await ctx.render('signup_success',{
    username:user.username
  })
})
//用户注销路由
router.get('/signout',async ctx=>{
  ctx.session=null
  await ctx.render('signout_success')
})
module.exports = router
