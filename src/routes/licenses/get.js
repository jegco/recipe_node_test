const licenseController = require("../../controllers/licenseController");
const Joi = require("joi");

module.exports = {
    method: "GET",
    path: "/licenses",
    config: {
      description: "View desscription",
      validate: {
        query: {
          limit: Joi.number().default(10).min(1).max(100), //Set a sensible default and max page size
          page: Joi.number().positive() //Make sure they can't give a page number that would create a negative offset
        }
      },
      notes:
        "Returns a list of licenses, Important: the back object inside documentation is not obligatory" +
        "Important: if the fileType does not exists, it is valid to assume that it is an image, since PDF's" +
        " are only allowed for unmonitored credentials submissions and these are always going to have the fileType",
      tags: ["api"] // ADD THIS TAG
    },
    handler: function(request, response) {
      try {
        const params = Object.assign({}, request.query);
        params.offset = params.page * params.limit;

        return licenseController.getLicenses({
          username: request.auth.credentials.payload.username,
          password: request.auth.credentials.payload.password
        }, params.offset, params.page - 1);

      } catch (err) {
        console.log(err);
      }
    }
  };