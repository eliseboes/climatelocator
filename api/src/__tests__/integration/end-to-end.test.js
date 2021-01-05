const supertest = require('supertest');
const app = require('../../server.js');
const request = supertest(app);
const Helpers = require('../../utils/helpers.js');

describe('DB connection test', () => {
            test('full connection test', async () => {
                    try {
                        let uuid = await request.post('/locations')
                            .send({
                                    uuid: Helpers.generateUUID(),
                                    name: 'Jamaica',
                                    geohash: 's7jjkf4x5tst',
                                    yearly_averages_low: {
                                        Jan: 2.0,
                                        Feb: 2.0,
                                        Mar: 5.0,
                                        Apr: 10.0,
                                        May: 14.0,
                                        Jun: 18.0,
                                        Jul: 21.8,
                                        Aug: 23.0,
                                        Sep: 20.0,
                                        Oct: 15.0,
                                        Nov: 9.0,
                                        Dec: 4.0
                                    },
                                    yearly_averages_high: {
                                        Jan: 8.0,
                                        Feb: 9.0,
                                        Mar: 12.0,
                                        Apr: 17.0,
                                        May: 21.0,
                                        Jun: 25.5,
                                        Jul: 28.0,
                                        Aug: 29.0,
                                        Sep: 26.0,
                                        Oct: 20.0,
                                        Nov: 15.0,
                                        Dec: 11.0
                                    }
                                })
                                .expect(201)
                                .then((response) => {
                                    const parsed = JSON.parse(response.text)
                                    return parsed.res[0].uuid
                                }).catch((error) => {
                                    console.log(error)
                                });
                                const getRequest = await request.get(`/locations/${uuid}`).expect(200)
                                const requestParse = JSON.parse(getRequest.text)
                                expect(requestParse.res).toHaveLength(1)
                            }
                        catch (error) {
                            throw error
                        }
                    })
            })