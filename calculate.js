const mysql = require('mysql');
const DB = require('./DB/DB')

async function calculateUser(){
    let user = await DB.getUserGroup()

    let listUsers=[]
    for(let usr in user){
        // console.log(user[usr].common_name)
        let tmpuser = await DB.getUserInStorate(user[usr].common_name)
        console.log(isEmptyObject(tmpuser))
        if(isEmptyObject(tmpuser)){
            let allusage = user[usr].bytes_received/1000000+parseInt(user[usr].bytes_sent/1000000)
            await DB.addUserInStorate(user[usr].common_name,parseInt( user[usr].bytes_received)/1000000,parseInt(user[usr].bytes_sent/1000000),allusage)
        }else{
            // console.log(user[usr].common_name)
            // console.log(user[usr].bytes_sent)
            let userRecived=0
            let userSent =0
            try {
                let userdata = await DB.getsOneUser(user[usr].common_name)

                console.log('fi',userRecived)

                for(item in userdata){
                    userRecived += parseInt(userdata[item].bytes_received)
                    userSent += parseInt(userdata[item].bytes_sent)
                }
            } catch (e) {
                console.log('fucked')
            }
            // console.log(userRecived)




            try {
                let totalUse = parseInt(userRecived/1000000+userSent/1000000)
                //   console.log(totalUse)
                let update = await DB.updateUserInStorate(parseInt(userRecived/1000000),parseInt(userSent/1000000),user[usr].common_name,totalUse)
            } catch (e) {
                console.log(e)
            }

        }



    }

    let getAllUsers =await DB.getAllUserInStorage()
    for(item in getAllUsers){
        console.log('---------------------')
        console.log(getAllUsers[item])
        console.log('---------------------')
    }

}


// This should work both there and elsewhere.
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
calculateUser()
