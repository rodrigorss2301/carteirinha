"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialSchema1683936000000 = void 0;
class CreateInitialSchema1683936000000 {
    name = 'CreateInitialSchema1683936000000';
    async up(queryRunner) {
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "health_card_status_enum" AS ENUM ('active', 'inactive', 'expired');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        await queryRunner.query(`
            CREATE TABLE "patient" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "cpf" character varying(11) NOT NULL,
                "birthDate" date NOT NULL,
                "mothersName" character varying NOT NULL,
                "fathersName" character varying,
                "address" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "email" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_patient_cpf" UNIQUE ("cpf"),
                CONSTRAINT "PK_patient" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "health_card" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cardNumber" character varying NOT NULL,
                "issueDate" TIMESTAMP NOT NULL,
                "expirationDate" TIMESTAMP NOT NULL,
                "status" "health_card_status_enum" NOT NULL DEFAULT 'active',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "patientId" uuid,
                CONSTRAINT "UQ_health_card_number" UNIQUE ("cardNumber"),
                CONSTRAINT "PK_health_card" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "health_card" ADD CONSTRAINT "FK_health_card_patient"
            FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "health_card" DROP CONSTRAINT "FK_health_card_patient"`);
        await queryRunner.query(`DROP TABLE "health_card"`);
        await queryRunner.query(`DROP TABLE "patient"`);
        await queryRunner.query(`DROP TYPE "health_card_status_enum"`);
    }
}
exports.CreateInitialSchema1683936000000 = CreateInitialSchema1683936000000;
//# sourceMappingURL=1683936000000-CreateInitialSchema.js.map