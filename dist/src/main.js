"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Hybrid ORM Blog API - TypeORM + Drizzle             ║
║                                                            ║
║   Backend API: http://localhost:${port}                       ║
║   Frontend UI: http://localhost:3002                       ║
║                                                            ║
║   TypeORM manages:  Users, Posts                          ║
║   Drizzle manages:  Comments, Tags                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map