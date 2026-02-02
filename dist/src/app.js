import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}));
app.get('/', (req, res) => {
    res.send('Tutor Link Server is Running');
});
export default app;
//# sourceMappingURL=app.js.map