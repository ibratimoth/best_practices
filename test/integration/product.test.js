process.env.NODE_ENV = 'test'

const User = require('../../models/userModel')
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp)

it('test default API welcome route....', (done) => {

    chai.request(server)
        .get('/api/')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Welcome to the MEN-REST-API');
            done();
        });

});

describe('User API', function () {
    this.timeout(10000); // Increase the timeout for all tests in this suite

    // Scenario 1: Successful Retrieval of Users
    describe('GET /api/getAll', () => {
        before(async () => {
            // Insert test data into your database
            await User.create({ name: 'Test User', email: 'test@example.com', designation: 'Tester' });
        });

        it('should get all users', (done) => {
            chai.request(server)
                .get('/api/getAll')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0); // Check that there are users
                    done();
                });
        });

        // Clean up after the test
        after(async () => {
            await User.destroy({ where: {}, truncate: true }); // Clear users after test
        });
    });

    // Scenario 2: No Users Found
    describe('GET /api/getAll when no users exist', () => {
        it('should return an error message when no users are found', (done) => {
            // Ensure the database is empty before the test
            // Add a delay to ensure the cleanup has been completed before this test
            setTimeout(async () => {
                chai.request(server)
                    .get('/api/getAll')
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('error', 'users not found');
                        done();
                    });
            }, 100); // Adjust timeout as necessary
        });
    });

    // Test for creating a user
    describe('POST /api/addUser', () => {
        it('should create a new user', (done) => {
            const newUser = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                designation: 'Developer'
            };

            chai.request(server)
                .post('/api/addUser')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body.newUser).to.include(newUser);
                    done();
                });
        });

        it('should not create a user without required fields', (done) => {
            const newUser = {
                name: '',
                email: '',
                designation: ''
            };

            chai.request(server)
                .post('/api/addUser')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'All fields are required');
                    done();
                });
        });

        it('should not create a user if email already exists', async () => {
            // First, create a user with a unique email
            const existingUser = {
                name: 'Existing User',
                email: 'existing@example.com',
                designation: 'Tester'
            };

            // Create the first user
            await chai.request(server)
                .post('/api/addUser')
                .send(existingUser);

            // Now try to create another user with the same email
            const newUser = {
                name: 'New User',
                email: 'existing@example.com', // Same email as existing user
                designation: 'Developer'
            };

            const res = await chai.request(server)
                .post('/api/addUser')
                .send(newUser);

            // Assert that the response is correct
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('message', 'User already exists');
        });

    });

    // Test for getting a single user by ID
    describe('GET /api/users/single/:id', () => {

        let testUserId;

        before(async () => {
            // Insert test data into the database
            const user = await User.create({ name: 'Test User', email: 'test@example.com', designation: 'Tester' });
            testUserId = user.id; // Store the created user's ID for later use
        });

        it('should return a single user by ID', (done) => {

            chai.request(server)
                .get(`/api/single/${testUserId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body.user).to.have.property('id', testUserId);
                    done();
                });
        });

        it('should return user not found if ID does not exist', (done) => {
            const userId = 9999;  // Non-existent ID

            chai.request(server)
                .get(`/api/single/${userId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'User not found');
                    done();
                });
        });

        // Clean up after the test
        after(async () => {
            await User.destroy({ where: {}, truncate: true }); // Clear users after test
        });
    });

    // Test for updating a user
    describe('PUT /api/update/:id', () => {

        let testUserId;
        before(async () => {
            // Insert test data into the database

            const user = await User.create({
                name: 'Test User',
                email: 'test.user@example.com',
                designation: 'Tester'
            });
            testUserId = user.id; // Store the created user's ID for later use
        });

        it('should update a user', (done) => {  // Replace with an existing user ID
            const updatedUser = {
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                designation: 'Designer'
            };

            chai.request(server)
                .put(`/api/update/${testUserId}`)
                .send(updatedUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body.user).to.include(updatedUser);
                    done();
                });
        });

        it('should return user not found if ID does not exist', (done) => {
            const userId = 9999;  // Non-existent ID

            chai.request(server)
                .put(`/api/update/${userId}`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Not Updated');
                    done();
                });
        });

        // Clean up after the test
        after(async () => {
            await User.destroy({ where: {}, truncate: true }); // Clear users after test
        });
    });

    // Test for deleting a user
    describe('DELETE /api/delete/:id', () => {

        let testUserId;

        before(async () => {
            // Insert test data into the database
            const user = await User.create({ name: 'Test User', email: 'test@example.com', designation: 'Tester' });
            testUserId = user.id; // Store the created user's ID for later use
        });

        it('should delete a user by ID', (done) => {

            chai.request(server)
                .delete(`/api/delete/${testUserId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Deleted successsfully');
                    done();
                });
        });

        it('should return user not found if ID does not exist', (done) => {
            const userId = 9999;  // Non-existent ID

            chai.request(server)
                .delete(`/api/delete/${userId}`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'User not found or wrong id');
                    done();
                });
        });

        // Clean up after the test
        after(async () => {
            await User.destroy({ where: {}, truncate: true }); // Clear users after test
        });
    });

    describe('DELETE /api/users/deleteAll', () => {

        before(async () => {
            // Insert test data into your database
            await User.create({ name: 'Test User', email: 'test@example.com', designation: 'Tester' });
        });

        it('should delete all users', (done) => {
            chai.request(server)
                .delete('/api/deleteAll')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'All users deleted successfully');
                    done();
                });
        });

        it('should return user not found if ID does not exist', (done) => {
            const userId = 9999;  // Non-existent ID

            chai.request(server)
                .delete('/api/deleteAll')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'No users found to delete');
                    done();
                });
        });

        // Clean up after the test
        after(async () => {
            await User.destroy({ where: {}, truncate: true }); // Clear users after test
        });
    });

});
