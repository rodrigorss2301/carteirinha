"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHealthCardDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_health_card_dto_1 = require("./create-health-card.dto");
class UpdateHealthCardDto extends (0, mapped_types_1.PartialType)(create_health_card_dto_1.CreateHealthCardDto) {
}
exports.UpdateHealthCardDto = UpdateHealthCardDto;
//# sourceMappingURL=update-health-card.dto.js.map