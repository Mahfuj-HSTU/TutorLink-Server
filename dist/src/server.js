import app from "./app.js";
import prisma from "./lib/prisma.js";
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map