'use strict';


const user = require('../models/accounts');

exports.registerUser = (nem_id,privateKey) =>

    new Promise((resolve, reject) => {
    
 

        const newUser = new user({
          
           nem_id:nem_id,
           privateKey:privateKey,
           created_at: new Date(),
           });
             console.log(newUser)
        newUser.save()




            .then(() => resolve({
                status: 201,
                message: "created your wallet account"
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Please Register !'
                    });
                }
            });
    });
    