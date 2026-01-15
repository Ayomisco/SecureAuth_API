const express = require('express');
const helmet = require('helmet');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const { connection, default: mongoose } = require('mongoose');
const authRouter = require('./routers/authRouter');


const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRouter);


app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Database connection error:', error);
});


// const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});