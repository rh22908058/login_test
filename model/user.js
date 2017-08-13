const sequelize=require('./index')
const Sequelize=require('sequelize')
/*定义user表并导出Model类型的表 */
/*建表会对表名自动加s */
let User=sequelize.define('user',{
    id:{
        primaryKey: true,//是主键
        type:Sequelize.INTEGER,//整形
        autoIncrement: true,//自增长
        allowNull: false//不许为空
    },
    username:{
        type:Sequelize.STRING,//字符串
        unique: true,//唯一
        allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false
    },
    email:{
        type:Sequelize.STRING,
    }
})
/*同步到数据库,这是一个异步操作 */
User.sync()
console.log('123')

module.exports=User