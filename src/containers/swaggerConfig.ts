import {SwaggerOptions} from "swagger-ui-express";

const swaggerOptions: SwaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Authentication API',
            version: '1.0.0',
            description: 'API for mohimma.tech cms',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/modules/**/**/*.swagger.ts'],
};

export default swaggerOptions;
