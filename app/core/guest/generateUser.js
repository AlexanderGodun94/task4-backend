const AppError = require('../../services/error');
const errorMessages = require('../../services/errorMessages');

function* pseudoRandom(seed) {
  let value = seed + 1;
  while(true) {
    value = value * 16807 % 2147483647;
    yield value;
  }
}
const seedrandom = require('seedrandom');


async function generateUser(countryCode, countUsers, startUser, seed) {
  try {
    const {faker} = require('@faker-js/faker/locale/' + countryCode);
    const users = [];

    for (let i = 0 ; i < 40; i++){

      var randomNum = Math.floor(seedrandom(i)() * 10);

      console.log('randomNum', randomNum)
    }

    let generator = pseudoRandom(+startUser + +seed);
    for (let i = 0; i < countUsers; i++) {
        faker.seed(generator.next().value);

      const user = {
        uuid: faker.string.uuid(),
        fullName: faker.person.fullName(),
        address: faker.location.state() + ', ' + faker.location.city() + ', ' + faker.location.streetAddress() + ', ' + faker.location.zipCode(),
        phone: faker.phone.number(),
      };
      users.push(user);
    }
    return users;

  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({err: err});
  }
}

module.exports = generateUser;

