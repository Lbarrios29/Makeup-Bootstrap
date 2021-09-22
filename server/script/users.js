const casual = require('casual');

module.exports = () => {

    const data = {
        users: []
    }

    for (let index = 0; index < 20; index++) {
        
        data.users.push({
            "id": casual.uuid,
            "username": casual.username
        })
        
    }

    return data;

}