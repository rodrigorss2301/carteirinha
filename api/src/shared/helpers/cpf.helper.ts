import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: any, args: ValidationArguments) {
    if (typeof cpf !== 'string') {
      return false;
    }

    // Remove caracteres não numéricos
    const cleanedCpf = cpf.replace(/\D/g, '');

    if (
      cleanedCpf.length !== 11 ||
      !/^\d{11}$/.test(cleanedCpf) || // Garante que são todos dígitos
      /^(\d)\1+$/.test(cleanedCpf) // Verifica se todos os dígitos são iguais (ex: 111.111.111-11), que são CPFs inválidos
    ) {
      return false;
    }

    // Algoritmo de validação do CPF (dígitos verificadores)
    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanedCpf.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanedCpf.substring(10, 11))) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // Aqui você pode retornar uma mensagem de erro padrão mais específica
    return 'CPF fornecido ($value) é inválido.';
  }
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfConstraint,
    });
  };
}
