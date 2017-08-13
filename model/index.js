const Sequelize=require('sequelize')
/*连接数据库，返回一个sequelize实例 */
module.exports=new Sequelize('blog', 'root', 'root',{
    host:'localhost',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        idle:10000
    }
})