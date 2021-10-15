const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongooose = require("mongoose");
require("dotenv").config();
const app = express(); 
const http = require('http'); 
const server = http.createServer(app); 
const { Server } = require("socket.io"); 
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
const logEntries = require("./models/entry")

mongooose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(morgan("common"));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/index.html'); 
});

io.on('connection', async (socket) => {
  const stats = await logEntries.find({}).sort({
    createdAt: -1
  })
  await io.emit("connection", stats);
  socket.on('chat message', async (msg) => {
    const createLog = await new logEntries(msg);
    await createLog.save();
    const getter = await logEntries.find({}).sort({
      createdAt: -1
    })
    await io.emit('chat message', getter);
  });
});

const port = 4000

server.listen(port, () => { 
    console.log(`server listening on http://localhost:${port}`); 
});