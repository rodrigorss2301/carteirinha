"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserTable1684018800000 = void 0;
class AddUserTable1684018800000 {
    name = 'AddUserTable1684018800000';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'paciente')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'paciente',
                "patientId" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }
}
exports.AddUserTable1684018800000 = AddUserTable1684018800000;
//# sourceMappingURL=1684018800000-AddUserTable.js.map