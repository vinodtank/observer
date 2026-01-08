const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

mongoose
.connect('mongodb://127.0.0.1:27017/real-time-db')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// mongoose.connect('mongodb://127.0.0.1:27017/shades').then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// const itemSchema = new mongoose.Schema({
//     "_id": {
//       "$oid": {
//         "type": "ObjectId"
//       }
//     },
//     "SubcatId": {
//       "type": "Number"
//     },
//     "Category": {
//       "type": "String"
//     },
//     "GroupId": {
//       "type": "String"
//     },
//     "prodname": {
//       "type": "String"
//     },
//     "Color": {
//       "type": "String"
//     },
//     "Qty1": {
//       "type": "Number"
//     },
//     "Qty2": {
//       "type": "Number"
//     },
//     "Qty3": {
//       "type": "Number"
//     },
//     "Qty4": {
//       "type": "Number"
//     },
//     "Qty5": {
//       "type": "Number"
//     },
//     "Qty6": {
//       "type": "Number"
//     },
//     "Qty7": {
//       "type": "Number"
//     },
//     "Qty8": {
//       "type": "Number"
//     },
//     "Qty9": {
//       "type": "Number"
//     },
//     "Qty10": {
//       "type": "Number"
//     },
//     "Qty11": {
//       "type": "Number"
//     },
//     "Qty12": {
//       "type": "Number"
//     },
//     "totQty": {
//       "type": "Number"
//     },
//     "Mrp": {
//       "type": "Number"
//     },
//     "ColorId": {
//       "type": "Number"
//     },
//     "TS": {
//       "type": "Date"
//     }
//   });

const itemSchema = new mongoose.Schema({
    name: "String"
});

const Item = mongoose.model('item', itemSchema);

// WebSocket connection
io.on('connection', socket => {
    console.log('New client connected');

    socket.on('addItem', (item) => {
        addItem(item);
    });

    socket.on('updateItem', (item) => {
        updateItem(item);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

addItem = async(item) => {
    const newItem = new Item(item);
    await newItem.save();
    io.emit('itemAdded', newItem); // Emit to all connected clients
}

updateItem = async(item) => {
    const updatedItem = await Item.findByIdAndUpdate(item._id, item, { new: true });
    io.emit('itemUpdated', updatedItem);
}

// REST API endpoints
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    io.emit('itemAdded', newItem); // Emit to all connected clients
    res.status(201).json(newItem);
});

app.put('/items/:id', async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit('itemUpdated', updatedItem);
    res.json(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    io.emit('itemDeleted', req.params.id);
    res.status(204).send();
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});