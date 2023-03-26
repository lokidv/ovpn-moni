const fs = require('fs');
const mysql = require('mysql');
const DB = require('./DB/DB')

const filePath = '/var/log/openvpn/status.log';

fs.watchFile(filePath, (curr, prev) => {
    console.log(`File changed at ${curr.mtime}`);

    fs.readFile(filePath, 'utf8',async (err, data) => {
        if (err) {
            throw err;
        }

        const commonNamePattern = /^(\S+),(\S+),(\d+),(\d+),(.+)$/mg;
        let match;
        while ((match = commonNamePattern.exec(data)) !== null) {
            const [_, commonname, realAddress, bytesReceived, bytesSent, connectedSince] = match;
            // console.log(connectedSince)
            // console.log('check for update')
            // if(commonname == 'loki-log'){

            let user = await DB.getUser(commonname,connectedSince)

            let tmp = await user.length > 0;


            console.log(!tmp || user[0].connected_since != connectedSince)

            if(!tmp || user[0].connected_since != connectedSince){
                console.log('here')
                console.log(commonname)
                await DB.addUser(commonname, bytesReceived,bytesSent,0,connectedSince)

            }else{
                //   console.log(user[0].connected_since == connectedSince)
                console.log('sfds')
                console.log(commonname)
                let user = await DB.updateUser(bytesReceived,bytesSent,connectedSince,commonname)
            }



            // if (!user[0].common_name) {
            //     await DB.addUser(commonname, bytesReceived,bytesSent,0)
            //     console.log('done')

            // }else{
            //     let users = await DB.getAllUser(0)
            //     // console.log(users)

            //     for(let i = 0; i < users.length; i++){
            //         console.log(user[2])
            //         return;
            //     }

            //     // console.log(match.input.includes('loki-test'))
            //     return;
            // //     for(let i = 0; i < user.length; i++){
            // //         console.log('here')
            // //          while ((match = commonNamePattern.exec(data)) !== null) {
            // //          const [_, commonname, realAddress, bytesReceived, bytesSent, connectedSince] = match;
            // //          console.log(commonname)
            // //         if('loki-test' == commonname){
            // //             console.log('exist')
            // //          }
            // //     }
            // //   }
            // }
        }
    });
});
