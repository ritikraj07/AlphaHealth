const {hashPassword} = require("../utils/auth")

const User = require("../models/user.model")

const createUser = async (req, res) => {
    try{
        let user = User.findOne({email: req.body.email})
        if(user){
            return res.status(409).send({message: "User already exists"})
        }
        
        let {name, email, password, role, hq} = req.body

        let HashedPassword = await hashPassword(password)
        user = new User({name, email, HashedPassword,  role, hq})
        user.save()
        return res.status(201).send({message: "User created successfully"})
    }catch(error){

    }
}

// return everything with manager name and except password 
const getUser = ()=>{}

// delete user 
const deleteUser = ()=>{}



module.exports =  {createUser}