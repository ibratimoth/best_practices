process.env.NODE_ENV = 'test'

const sinon = require('sinon');
const chai = require('chai');
const { getAllUsersController, createUserController, getUserById, updateUser, deleteUser, deleteAllUsers } = require('../../controllers/userController');
const User = require('../../models/userModel');
const expect = chai.expect;

describe('User Controller - Unit Tests', () => {

    describe('getAllUsersController', () => {
        let req, res, stub;

        beforeEach(() => {
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
        });

        afterEach(() => {
            if (stub) stub.restore();
        });

        it('should return 404 if no users are found', async () => {
            stub = sinon.stub(User, 'findAll').resolves([]);

            await getAllUsersController(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('error', 'users not found'))).to.be.true;
        });

        it('should return 200 and a list of users if users are found', async () => {
            const users = [{ id: 1, name: 'John Doe' }];
            stub = sinon.stub(User, 'findAll').resolves(users);

            await getAllUsersController(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(users)).to.be.true;
        });
    });

    describe('createUserController', () => {
        let req, res, stub;

        beforeEach(() => {
            req = {
                body: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    designation: 'Developer'
                }
            };
            res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        });

        afterEach(() => {
            if (stub) stub.restore();
        });

        it('should create a new user when valid input is provided', async () => {
            stub = sinon.stub(User, 'findOne').resolves(null);  // Mock findOne to return null
            sinon.stub(User, 'create').resolves(req.body);       // Mock create method

            await createUserController(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('success', true))).to.be.true;
        });

        it('should return 400 if required fields are missing', async () => {
            req.body.name = '';

            await createUserController(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'All fields are required'))).to.be.true;
        });

        it('should return 200 if user already exists', async () => {
            stub = sinon.stub(User, 'findOne').resolves(req.body); // Mock existing user

            await createUserController(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'User already exists'))).to.be.true;
        });
    });

    describe('getUserById', () => {
        let req, res, stub;

        beforeEach(() => {
            req = {
                params: {
                    id: 1
                }
            };
            res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        });

        afterEach(() => {
            if (stub) stub.restore();
        });

        it('should return 404 if user is not found', async () => {
            stub = sinon.stub(User, 'findByPk').resolves(null);

            await getUserById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'User not found'))).to.be.true;
        });

        it('should return 200 and the user if found', async () => {
            const user = { id: 1, name: 'John Doe' };
            stub = sinon.stub(User, 'findByPk').resolves(user);

            await getUserById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('user', user))).to.be.true;
        });
    });

    describe('updateUser', () => {
        let req, res, stub;

        beforeEach(() => {
            req = {
                params: { id: 1 },
                body: {
                    name: 'Updated Name',
                    email: 'updated.email@example.com',
                    designation: 'Updated Designation'
                }
            };
            res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        });

        afterEach(() => {
            if (stub) stub.restore();
        });

        it('should return 400 if user is not found', async () => {
            stub = sinon.stub(User, 'findByPk').resolves(null);

            await updateUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'Not Updated'))).to.be.true;
        });

        it('should update and return 201 if user is found', async () => {
            const user = { id: 1, save: sinon.stub().resolves() };
            stub = sinon.stub(User, 'findByPk').resolves(user);

            await updateUser(req, res);

            expect(user.save.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'Updated successfully'))).to.be.true;
        });
    });

    describe('deleteUser', () => {
        let req, res, stub;

        beforeEach(() => {
            req = { params: { id: 1 } };
            res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        });

        afterEach(() => {
            if (stub) stub.restore();
        });

        it('should return 400 if user is not found', async () => {
            stub = sinon.stub(User, 'findByPk').resolves(null);

            await deleteUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'User not found or wrong id'))).to.be.true;
        });

        it('should delete user and return 200 if found', async () => {
            const user = { id: 1, destroy: sinon.stub().resolves() };
            stub = sinon.stub(User, 'findByPk').resolves(user);

            await deleteUser(req, res);

            expect(user.destroy.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'Deleted successsfully'))).to.be.true;
        });
    });

    describe('deleteAllUsers', () => {
        let req, res, stub;

        beforeEach(() => {
            res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        });

        afterEach(() => {
            if (stub) stub.restore();
        });

        it('should return 400 if no users are found', async () => {
            stub = sinon.stub(User, 'findAll').resolves([]);

            await deleteAllUsers(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'No users found to delete'))).to.be.true;
        });

        it('should delete all users and return 200', async () => {
            const users = [{ id: 1, name: 'John Doe' }];
            stub = sinon.stub(User, 'findAll').resolves(users);
            sinon.stub(User, 'destroy').resolves();

            await deleteAllUsers(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(sinon.match.has('message', 'All users deleted successfully'))).to.be.true;
        });
    });
});
