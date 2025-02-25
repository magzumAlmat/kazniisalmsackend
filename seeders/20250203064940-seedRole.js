


const Role=require('../auth/models/Role')
const sequelize = require('../config/db')

module.exports={
    up:async(queryInterface,Sequelize)=>{
        await Role.bulkCreate([
            {name:'admin'},
            {name:'teacher'},//  тот кто держит уже билборды и его  проверяет инспектор
            {name:'student'},// тот  кто будет закупать  рекламу и отдавать на проверку
            
        ])
    },
}

down:async(queryInterface,Sequelize)=>{
    await queryInterface.bulkDelete('Roles',null,{})
}