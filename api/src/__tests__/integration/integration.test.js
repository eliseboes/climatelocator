const supertest = require('supertest');
const Helpers = require('../../utils/helpers.js')
const app = require('.././../server.js')
const request = supertest(app);

// describe('POST /addlocation endpoint', () => {
//     test('check if /addlocation responds to 200 and inserts a location in db', async (done) => {
//         try {
//             await request.post('/addlocation')
//                 .expect(200)
//                 .then((res) => {
//                     done()
//                 });
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
// });

describe('GET / endpoint', () => {
    test('check if / responds to 200', async (done) => {
        try {
            await request.get('/')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});