const express = require("express")
const { getAllUsersController, createUserController, getUserById, updateUser, deleteUser, deleteAllUsers } = require("../controllers/userController")

const router = express.Router()
router.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the MEN-REST-API' });
})

/**
 * @swagger
 * /getAl:
 *   get:
 *     summary: Retrieve all users from the database
 *     description: Fetch all users from the database, including their id, name, email, designation, and timestamps.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the user.
 *                     example: 33
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                     example: Samwel
 *                   email:
 *                     type: string
 *                     description: The email of the user.
 *                     example: samwel@gmail.com
 *                   designation:
 *                     type: string
 *                     description: The user's job designation.
 *                     example: s.j.Fumbi
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the user was created.
 *                     example: 2024-10-09T16:47:48.704Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the user was last updated.
 *                     example: 2024-10-09T16:47:48.704Z
 *       404:
 *         description: No users found in the database.
 *       500:
 *         description: Internal server error.
 */
router.get("/getAll", getAllUsersController);

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Create a new user
 *     description: This API endpoint is used to add a new user to the database. It requires a name, email, and designation. If the user already exists, it will return a message indicating that the user is already in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: Samwel
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: samwe@gmail.com
 *               designation:
 *                 type: string
 *                 description: The job designation of the user.
 *                 example: s.j.Fumbi
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created"
 *                 newUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 34
 *                     name:
 *                       type: string
 *                       example: Samwel
 *                     email:
 *                       type: string
 *                       example: samwe@gmail.com
 *                     designation:
 *                       type: string
 *                       example: s.j.Fumbi
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T16:47:58.326Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T16:47:58.326Z"
 *       400:
 *         description: Bad Request - All fields are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred"
 */
router.post("/addUser", createUserController);

/**
 * @swagger
 * /single/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user from the database by their ID. If the user exists, their details will be returned. If not, a "User not found" message will be sent.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 35
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 35
 *                     name:
 *                       type: string
 *                       example: ibrahimu
 *                     email:
 *                       type: string
 *                       example: ibratimoth@gmail.com
 *                     designation:
 *                       type: string
 *                       example: s.j.Fumbi
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T17:29:13.395Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T17:29:13.395Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching the user"
 */
router.get("/single/:id", getUserById);


/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update the details of an existing user by their ID. The name, email, and designation fields are required in the request body. The user must exist in the database for the update to be successful.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 36
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Husse
 *               email:
 *                 type: string
 *                 example: hussein@gmail.com
 *               designation:
 *                 type: string
 *                 example: s.j.Fumbi
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 36
 *                     name:
 *                       type: string
 *                       example: Husse
 *                     email:
 *                       type: string
 *                       example: hussein@gmail.com
 *                     designation:
 *                       type: string
 *                       example: s.j.Fumbi
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T17:29:35.826Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T16:02:05.882Z"
 *       400:
 *         description: User not updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Not Updated"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the user"
 */
router.put("/update/:id", updateUser);


/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user from the database by their ID. The user must exist for deletion to succeed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 36
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Deleted successfully"
 *       400:
 *         description: User not found or invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found or wrong id"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the user"
 */
router.delete("/delete/:id", deleteUser);


/**
 * @swagger
 * /deleteAll:
 *   delete:
 *     summary: Delete all users from the database
 *     description: This API deletes all users from the database. If there are no users to delete, it returns a "No users found" message.
 *     responses:
 *       200:
 *         description: All users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "All users deleted successfully"
 *       400:
 *         description: No users found to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No users found to delete"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting users"
 */
router.delete("/deleteAll", deleteAllUsers);


module.exports = router