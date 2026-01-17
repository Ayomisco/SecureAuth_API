const express = require('express');
const helmet = require('helmet');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const { connection, default: mongoose } = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRouter = require('./routers/authRouter');
const postRouter = require('./routers/postRouter');


const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

// Disable Helmet for Swagger UI route
app.use((req, res, next) => {
    if (req.path.startsWith('/api-docs')) {
        return next();
    }
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    })(req, res, next);
});

app.use(cors());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SecureAuth API Documentation',
}));

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);


app.get('/', (req, res) => {
    res.json({ 
        message: 'SecureAuth API is running...', 
        documentation: '/api-docs',
        version: '1.0.0'
    });
});

// Database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Database connection error:', error);
});


// const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});