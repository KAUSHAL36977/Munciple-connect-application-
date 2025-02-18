const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/municipal-complaints', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    category: String,
    description: String,
    priority: String,
    status: {
        type: String,
        default: 'pending'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Routes
// Get all complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit new complaint
app.post('/api/complaints', async (req, res) => {
    const complaint = new Complaint(req.body);
    try {
        const newComplaint = await complaint.save();
        res.status(201).json(newComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update complaint status
app.patch('/api/complaints/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            complaint.status = req.body.status;
            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete complaint
app.delete('/api/complaints/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            await complaint.remove();
            res.json({ message: 'Complaint deleted' });
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve the static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
