const userService = require('../services/userService');

class userController {
    async getAllUsers(req, res, next) {
        try {           
            //fetch the list of users by calling the userService method (getAllUsers)
            const users = await userService.getAllUsers();

            //validation using if statement
            if (users) {
                res.json({
                    success: true,
                    
                    data: users
                });
            }

        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const id = req.params.id;

            //use retrieved id to find brand using the service method
            const user = await userService.getUserById(id);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    async getUserByName(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const name = req.params.name;

            //use retrieved id to find user using the service method
            const user = await userService.getUserByName(name);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    async patchUserRole(req, res, next) {
        try {
            
            //retrieve id from request parameters
            const id = req.params.id;
            const role = req.params.role;

            //use retrieved id to find user using the service method
            const user = await userService.patchUserRole(id,role);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    
    async postNewUser(req, res, next) {
        try {
            
            const {uid,email,displayName} = req.body;

            //use retrieved id to find user using the service method
            const user = await userService.postNewUser(uid,email,displayName);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }






}

module.exports = new userController();