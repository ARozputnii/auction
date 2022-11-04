import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class LessThanDateValidation implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    const startTime = this.getStartTime(args).getTime();

    return startTime < date.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return `Date ${args.property} can not before ${this.getStartTime(args)}.`;
  }

  private getStartTime(args) {
    return args.object[args.constraints[0]] || new Date();
  }
}

export function LessThanDate(
  dateField?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [dateField],
      validator: LessThanDateValidation,
    });
  };
}
