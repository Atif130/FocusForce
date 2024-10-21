const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

// Serve the pre-meeting page as the default route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pre-meeting.html');
});

// Serve the actual meeting page (index.html)
app.get('/meeting.html', (req, res) => {
    res.sendFile(__dirname + '/public/meeting.html');
});

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('New user connected');

    // Join a specific meeting room
    socket.on('join-meeting', (meetingID, userName) => {
        socket.join(meetingID);
        socket.broadcast.to(meetingID).emit('user-connected', { userName, userID: socket.id });

        console.log(`${userName} joined meeting ${meetingID}`);

        // Handle user disconnect
        socket.on('disconnect', () => {
            io.to(meetingID).emit('user-disconnected', { userID: socket.id });
        });

        // Handle chat messages
        socket.on('send-chat', (data) => {
            io.to(meetingID).emit('receive-chat', data);
        });

        // Handle raise hand event
        socket.on('raise-hand', (data) => {
            io.to(meetingID).emit('user-raised-hand', data);
        });

        // Handle leave meeting
        socket.on('leave-meeting', (data) => {
            socket.leave(meetingID);
            io.to(meetingID).emit('user-disconnected', { userID: socket.id });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
