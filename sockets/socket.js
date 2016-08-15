var io = require("../app").io;

io.on("connection", socket => {
    socket.emit("will", "Dearest Will,  This will get better I swear!");
})
