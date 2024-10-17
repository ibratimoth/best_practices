const express = require("express")
const { getAllUsersController, createUserController, getUserById, updateUser, deleteUser, deleteAllUsers } = require("../controllers/userController")

const router = express.Router()
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the MEN-REST-API' });
})

router.get("/getAll", getAllUsersController);

router.post("/addUser", createUserController);

router.get("/single/:id", getUserById);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

router.delete("/deleteAll", deleteAllUsers);

module.exports = router