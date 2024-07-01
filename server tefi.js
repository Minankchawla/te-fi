const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const User = require('./models/User tefi');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/data-selling', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.post('/api/signup', async(req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully' });
});

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, 'secret');
    res.json({ token });
});

app.get('/api/user', async(req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.userId);
    res.json({ name: user.name, dataBalance: user.dataBalance });
});

app.post('/api/deposit', async(req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.userId);
    user.dataBalance += req.body.amount;
    await user.save();
    res.json({ dataBalance: user.dataBalance });
});

app.post('/api/withdraw', async(req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.userId);
    if (user.dataBalance < req.body.amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }
    user.dataBalance -= req.body.amount;
    await user.save();
    res.json({ dataBalance: user.dataBalance });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});