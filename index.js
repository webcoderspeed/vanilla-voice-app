const { createServer } = require('http');
const { Server } = require('socket.io');

const app = createServer();

const io = new Server(app, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	console.log('Connected to socket', socket.id);

	socket.on('join', ({ username, offer }) => {
		console.log('User joined:', username);
		socket.broadcast.emit('joined', { id: socket.id, username });
		socket.broadcast.emit('offer', { id: socket.id, offer });
	});

	socket.on('answer', ({ id, answer }) => {
		console.log('Received answer from:', id);
		socket.to(id).emit('answer', { answer });
	});

	socket.on('candidate', (candidate) => {
		console.log('Received candidate:', candidate);
		socket.broadcast.emit('candidate', candidate);
	});

	socket.on('leave', (id) => {
		console.log('User left:', id);
		socket.broadcast.emit('left', id);
	});

	socket.on('disconnect', () => {
		console.log('Socket disconnected', socket.id);
		socket.broadcast.emit('left', socket.id);
	});
});

const PORT = process.env.PORT ?? 1337

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
