import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint()
export class IsMinYearConstraint implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const exeptedDate = new Date(year + args.constraints[0], month, day);

    return exeptedDate < new Date();
  }

  defaultMessage(args: ValidationArguments) {
    return `Date of ${args.property} must be greater than ${args.constraints[0]} year`;
  }
}

export function IsMinYear(year: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [year],
      validator: IsMinYearConstraint,
    });
  };
}
