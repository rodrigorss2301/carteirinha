"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("./patients/entities/patient.entity");
const health_card_entity_1 = require("./health-cards/entities/health-card.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'policardmed',
    entities: [patient_entity_1.Patient, health_card_entity_1.HealthCard],
    migrations: ['src/migrations/*.ts'],
    synchronize: true
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map