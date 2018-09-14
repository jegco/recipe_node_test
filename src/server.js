"use strict";

const Hapi = require("hapi");
const routes = require("./routes");
const AuthBearer = require("hapi-auth-bearer-token");
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const authController = require("./controllers/authController");
const JWT = require("jsonwebtoken");

const server = Hapi.server({
  host: "172.23.2.184",
  port: "3001"
});

async function start() {
  try {
    await server.register(AuthBearer);

    server.auth.strategy("simple", "bearer-access-token", {
      allowQueryToken: true,
      validate:  async (request, token, h) => {
        const payload = JWT.verify(token, "someSecret");
        const isValid = true;

        const credentials = { payload };
        const artifacts = { test: "info" };
        return { isValid, credentials, artifacts };
      }
    });

    server.auth.default("simple");

    const swaggerOptions = {
      info: {
        title: "Wallet mock"
      },
      securityDefinitions: {
        Bearer: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          "x-keyPrefix": "Bearer "
        }
      },
      security: [
        {
          Bearer: []
        }
      ],
      sortEndpoints: "path",
      sortTags: "name"
    };

    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ]);

    const yarOptions = {
      storeBlank: false,
      cookieOptions: {
        password: "the-password-must-be-at-least-32-characters-long",
        isSecure: false
      }
    };

    const paginationOptions = {
      query: {
        page: {
          name: 'the_page' // The page parameter will now be called the_page
        },
        limit: {
          name: 'per_page', // The limit will now be called per_page
          default: 10       // The default value will be 10
        }
      },
       meta: {
          location: 'body', // The metadata will be put in the response body
          name: 'metadata', // The meta object will be called metadata
          count: {
              active: true,
              name: 'count'
          },
          pageCount: {
              name: 'totalPages'
          },
          self: {
              active: false // Will not generate the self link
          },
          first: {
              active: false // Will not generate the first link
          },
          last: {
              active: false // Will not generate the last link
          },
          next: {
            active: false
          },
          last: {
            active: false
          },
          previous: {
            active: false
          },
          totalCount: {
            active: false
          }
       },
       routes: {
           include: ['/licenses', '/accounts', '/persons', '/'],
       }
  };

  try {
    await server.register(
      {plugin: require('hapi-pagination'),
       options: paginationOptions
      });
  }catch (err) {
    console.error(err);
  }

    try {
      await server.register({
        plugin: require("yar"),
        options: yarOptions
      });
    } catch (err) {
      console.error(err);
    }

    await server.register(
      (module.exports = {
        name: "wallet mock server api",
        register: async (server, options) => {
          server.route(routes);
        }
      })
    );

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("server running at:", server.info.uri);
}

start();
