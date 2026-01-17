const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SecureAuth API',
            version: '1.0.0',
            description: 'Enterprise-grade authentication and authorization API with email verification, JWT-based security, and role-based access control.',
            contact: {
                name: 'API Support',
                email: 'francisayomide878@gmail.com',
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC',
            },
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
            },
            {
                url: 'https://api.secureauth.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'Authorization',
                    description: 'JWT token stored in cookie',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User unique identifier',
                        },
                        username: {
                            type: 'string',
                            description: 'User username',
                            minLength: 3,
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        verified: {
                            type: 'boolean',
                            description: 'Email verification status',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Post: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Post unique identifier',
                        },
                        title: {
                            type: 'string',
                            minLength: 3,
                        },
                        description: {
                            type: 'string',
                            minLength: 10,
                        },
                        userId: {
                            type: 'string',
                            description: 'Author user ID',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routers/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
