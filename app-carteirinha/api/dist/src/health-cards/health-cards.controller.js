"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCardsController = void 0;
const common_1 = require("@nestjs/common");
const health_cards_service_1 = require("./health-cards.service");
const create_health_card_dto_1 = require("./dto/create-health-card.dto");
const update_health_card_dto_1 = require("./dto/update-health-card.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HealthCardsController = class HealthCardsController {
    healthCardsService;
    constructor(healthCardsService) {
        this.healthCardsService = healthCardsService;
    }
    create(createHealthCardDto) {
        return this.healthCardsService.create(createHealthCardDto);
    }
    findAll() {
        return this.healthCardsService.findAll();
    }
    findOne(id) {
        return this.healthCardsService.findOne(id);
    }
    findByPatientId(patientId) {
        return this.healthCardsService.findByPatientId(patientId);
    }
    update(id, updateHealthCardDto) {
        return this.healthCardsService.update(id, updateHealthCardDto);
    }
    remove(id) {
        return this.healthCardsService.remove(id);
    }
};
exports.HealthCardsController = HealthCardsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_health_card_dto_1.CreateHealthCardDto]),
    __metadata("design:returntype", void 0)
], HealthCardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthCardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HealthCardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HealthCardsController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_health_card_dto_1.UpdateHealthCardDto]),
    __metadata("design:returntype", void 0)
], HealthCardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HealthCardsController.prototype, "remove", null);
exports.HealthCardsController = HealthCardsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('health-cards'),
    __metadata("design:paramtypes", [health_cards_service_1.HealthCardsService])
], HealthCardsController);
//# sourceMappingURL=health-cards.controller.js.map