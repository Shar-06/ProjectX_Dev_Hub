const data = require('../../config/database');

class userService {
    async getAllUsers() {
        const query = 'SELECT * FROM "User" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getUserById(id) {
        const query = {
            text: 'SELECT * FROM "User" WHERE id = $1',
            values: [id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    async getUserByName(name) {
        const query = {
            text: 'SELECT * FROM "User" WHERE name = $1',
            values: [name]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    async patchUserRole(id,role) {
        const query = {
            text: 'UPDATE "User" SET Role = $2 Where id = $1 Returning *',
            values: [id,role]
        };
    
        const result = await data.query(query);
    
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    
        return result.rows[0];
    }

    async postNewUser(id,email,name) {

        //username,useremail,authid
        const query = {
            text: 'INSERT INTO "User" (id,email,name) VALUES ($1,$2,$3)',
            values: [id,email,name]
        };

        try {
            const result = await data.query(query);
    
            return result.rows;
        } catch (error) {
            if (error.code === '23505') {
                return { error: 'User already registered.' };
            }
    

        return result.rows;
    }
}


    
}

module.exports = new userService();