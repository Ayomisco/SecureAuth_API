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
app.use(cors());

// Swagger Documentation (place before Helmet to avoid CSP issues)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SecureAuth API Documentation',
}));

// Apply Helmet to all routes except Swagger
app.use((req, res, next) => {
    if (req.path.startsWith('/api-docs')) {
        return next();
    }
    helmet()(req, res, next);
});

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