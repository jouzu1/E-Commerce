// process.env.NODE_ENV = 'test'

// let mongoose = require('mongoose');

// //Memanggil objek user untuk test service auths
// let user = require('../Models/user');


// //Memanggil library testing API
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../index');
// let should = chai.should();

// chai.use(chaiHttp);

// /**
//  * Dengan menggunakan fungsi describe(), kita akan mengosongkan cache agar setiap testing tidak ada data sisaan cache
//  */
// describe('Auth Service', () => {
//     beforeEach((done) => {user.remove({},(err)=>{done()})})
// })

// /**
//  * Testing service Auth
//  */
// describe('Test POST /register with body', () => {
//     it('Should created a new user and return 201', (done)=>{
//         let user = {
//             username:"test",
//             email:"test",
//             password:"test"
//         }
//         chai.request(server)              
//         .post("/register")
//         .send(user)
//         .end((err,res) => {
//             res.should.have.status(201);
//             res.body('object');
//             done();
//         })
//     })
// })

