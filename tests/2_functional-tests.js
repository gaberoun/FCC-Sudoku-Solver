const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('Solve puzzle POST tests to /api/solve', function() {
        test('puzzle with valid puzzle string', (done) => {
            const solvedString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: validString })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, solvedString);
                    done();
                })
        })
        test('puzzle with missing puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                })
        })
        test('puzzle with incorrect length', (done) => {
            const invalidString = '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidString })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                })
        })
        test('puzzle with invalid characters', (done) => {
            const invalidString = 'abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidString })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                })
        })
        test('puzzle that cannot be solved', (done) => {
            const invalidString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.1';
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidString })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                })
        })
    })

    suite('Check puzzle POST tests to /api/check', function() {
        test('puzzle with all fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: validString, coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, true);
                    done();
                })
        })
        test('puzzle placement with single placement conflict', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: validString, coordinate: 'A2', value: '4' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            })
        })
        test('puzzle placement with multiple placement conflicts', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: validString, coordinate: 'A2', value: '1' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            })
        })
        test('puzzle placement with all placement conflicts', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: validString, coordinate: 'A2', value: '2' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3);
                done();
            })
        })
        test('puzzle placement with missing required fields:', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: validString, coordinate: 'A2' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
        })
        test('puzzle placement with invalid characters:', (done) => {
            const invalidString = 'abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: invalidString, coordinate: 'A2', value: '2' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            })
        })
        test('puzzle placement with incorrect length:', (done) => {
            const invalidString = '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: invalidString, coordinate: 'A2', value: '2' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })
        })
        test('puzzle placement with invalid placement coordinate:', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: validString, coordinate: 'N2', value: '2' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            })
        })
        test('puzzle placement with invalid placement value:', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: validString, coordinate: 'A2', value: 'a' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value');
                done();
            })
        })
    })
});

