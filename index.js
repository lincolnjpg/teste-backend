const express = require('express');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit')
const server = express();
const router = require('./src/routes');

const port = process.env.APP_PORT || 3000;
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30,
})

server.use(express.json());
server.use(cors());
server.use(limiter);
server.use(router);

server.listen(
    port,
    () => {
        console.log(`server is running on port ${port}`);
    }
)