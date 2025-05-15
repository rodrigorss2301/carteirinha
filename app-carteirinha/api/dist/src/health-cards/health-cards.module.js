"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCardsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const health_card_entity_1 = require("./entities/health-card.entity");
const health_cards_service_1 = require("./health-cards.service");
const health_cards_controller_1 = require("./health-cards.controller");
let HealthCardsModule = class HealthCardsModule {
};
exports.HealthCardsModule = HealthCardsModule;
exports.HealthCardsModule = HealthCardsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([health_card_entity_1.HealthCard])],
        providers: [health_cards_service_1.HealthCardsService],
        controllers: [health_cards_controller_1.HealthCardsController],
        exports: [health_cards_service_1.HealthCardsService],
    })
], HealthCardsModule);
//# sourceMappingURL=health-cards.module.js.map