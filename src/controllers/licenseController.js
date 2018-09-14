'user-strict';

const licenseRepository = require("../repository/licenseReposiroty");

module.exports = {
    getLicenses: (user, numberOfCards, indexToStart) => {
        return licenseRepository.getLicenses(user, numberOfCards, indexToStart);
    }
}