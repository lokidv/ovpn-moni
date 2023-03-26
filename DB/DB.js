var DBCon   = require("./DBConnection.js");

module.exports = {

    DBCon : DBCon,

    query   : async function(query, param){
        let q = null;
        if(param)
            q = await DBCon.Query(query, param);
        else
            q = await DBCon.Query(query);
        return q;
    },

    update : async function(table, set, where){
        let _set = " ";
        let _where = "";
        let _data = [];

        for(let _item in set){

            _set += "`"+ _item +"` = ?,"
            _data.push(set[_item]);

        }

        _set = _set.substr(0, _set.length-1);

        if(where)
            _where = " where " + where;

        return await this.query("UPDATE `"+ table +"` SET "+ _set + _where, _data);

    },


    create_table:async function(table,amount,rec1,type1,rec2,type2,rec3,type3,rec4,type4,rec5,type5,rec6,type6,rec7,type7){
        console.log(amount)
        switch(amount) {
            case 1:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+" )")
                break;
            case 2:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+","+rec2+ " "+type2+" )")
                break;
            case 3:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+","+rec2+ " "+type2+","+rec3+ " "+type3+"  )")
                break;
            case 4:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+","+rec2+ " "+type2+","+rec3+ " "+type3+","+rec4+ " "+type4+")")
                break;
            case 5:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+","+rec2+ " "+type2+","+rec3+ " "+type3+","+rec4+ " "+type4+","+rec5+ " "+type5+")")
                break;
            case 6:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+","+rec2+ " "+type2+","+rec3+ " "+type3+","+rec4+ " "+type4+","+rec5+ " "+type5+","+rec6+ " "+type6+")")
                break;
            case 7:
                await this.query("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY ,"+rec1+ " "+type1+","+rec2+ " "+type2+","+rec3+ " "+type3+","+rec4+ " "+type4+","+rec5+ " "+type5+","+rec6+ " "+type6+","+rec7+ " "+type7+")")
                break;

            default:
                console.log('amount is default')
        }

        return 'ok'
    },


    getAllUserInStorage: async function(name){
        return await this.query("select * from storage");
    },


    addUserInStorate : async function(name,recive,sent,allusage){

        return await this.query("INSERT INTO storage(`username`, `total_received`, `total_sent`,`allusage`)VALUES(?, ?, ?,?)",
            [name, recive,sent,allusage]);
    },

    getUserInStorate: async function(name){
        return await this.query("select * from storage where username = ? ", [name]);
    },


    updateUserInStorate: async function(recive,sent,name,allusage){
        return await this.query("UPDATE storage SET total_received = ?, total_sent = ? , allusage = ? WHERE username = ?", [recive,sent,allusage,name]);
    },


    getsOneUser: async function(common_name){
        return await this.query("select * from vpn_logs where common_name = ?", [common_name]);
    },

    ///status 0 == new , 1 == followed ,2== followed and replyed , 3 == unfollow after followed and replyed
    addUser : async function(name,recive,sent,status,time){

        return await this.query("INSERT INTO vpn_logs(`common_name`, `bytes_received`, `bytes_sent`,`status`,`connected_since`)VALUES(?, ?, ?,?,?)",
            [name, recive,sent, status,time]);
    },

    getUserGroup : async function(){

        return await this.query("SELECT * FROM vpn_logs ");
    },

    getUser: async function(common_name,connected_since){
        return await this.query("select * from vpn_logs where common_name = ? AND connected_since = ?", [common_name,connected_since]);
    },
    updateUser: async function(recive,sent,time,name){
        return await this.query("UPDATE vpn_logs SET bytes_received = ?, bytes_sent = ? WHERE connected_since = ? AND common_name = ?", [recive,sent,time,name]);
    },

    getAllUser: async function(id){
        return await this.query("select * from vpn_logs where status = ? ", [id]);
    },
    addGm : async function(tweetId,tweet,status){

        return await this.query("INSERT INTO gm(`tweet_id`, `tweet`,`status`)VALUES(?, ?,?)",
            [tweetId, tweet, status]);
    },

    getRecords : async function(table, page, where, columns, per_page){
        let _where = "";
        if(where)
            _where = " where " + where;

        page = ((parseInt(page)-1) * 15);
        page = (page > -1 ? page : 0);

        return await this.query("SELECT "+ (columns ? columns : " * ") +" FROM "+ table +" " + _where + " limit " + page + "," + (per_page || 15));

    },


    getGm: async function(id){
        return await this.query("select * from gm where tweet_id = ?", [id]);
    },
    getOneUser: async function(id){
        return await this.query("select * from users where status = ? limit 1", [id]);
    },



    updatePunkIndexAddress : async function(PunkIndex){
        let id = PunkIndex.id;
        delete PunkIndex['id'];
        return await this.update('punk_index_to_address', PunkIndex, "id = " + id);
    }

};