const User = require('../models/userModel')

const getAllUsersController = async (req, res) => {
    try {
        const users = await User.findAll()
        if (users.length == 0) {
            return res.status(404).json({
                "error": "users not found"
            })
        }
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}

const createUserController = async (req, res) => {
    try {
        const { name, email, designation } = req.body;

        // Validate input
        if (!name || !email || !designation) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if the user already exists
        const user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(200).send({
                success: true,
                message: "User already exists"
            });
        }

        // Create a new user
        const newUser = await User.create(req.body);

        return res.status(201).send({
            success: true,
            message: "User created",
            newUser
        });

    } catch (error) {
        console.error(error); // Use console.error for error logging
        return res.status(500).send({
            success: false,
            message: "An error occurred"
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            return res.status(200).send({
                success: true,
                user,
            });
        }
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching the user",
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        if (user) {
            user.name = req.body.name
            user.email = req.body.email
            user.designation = req.body.designation

            await user.save()

            return res.status(201).send({
                success: true,
                message: "Updated successfully",
                user
            })
        }
        return res.status(400).send({
            success: false,
            message: "Not Updated",
        })

    } catch (error) {
        console.log(error)
    }
}


const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)

        if (user) {

            await user.destroy()
            return res.status(200).send({
                success: true,
                message: "Deleted successsfully"
            })
        }

        return res.status(400).send({
            success: true,
            message: "User not found or wrong id"
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if (users.length > 0) {
            await User.destroy({ where: {}, truncate: true });
            return res.status(200).send({
                success: true,
                message: "All users deleted successfully"
            });
        }

        return res.status(400).send({
            success: false,
            message: "No users found to delete"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while deleting users"
        });
    }
};

module.exports = {
    getAllUsersController,
    createUserController,
    getUserById,
    updateUser,
    deleteUser,
    deleteAllUsers
}