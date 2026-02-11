import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors()); // This allows your website to talk to your server
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/quran_app')
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    authMethod: String
}));

// This is the route that receives the "Action"
app.post('/api/users/sync', async (req, res) => {
    try {
        const { fullName, email, authMethod } = req.body;
        const user = await User.findOneAndUpdate(
            { email }, 
            { fullName, authMethod }, 
            { upsert: true, new: true }
        );
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));