import { Transform } from 'class-transformer';
import { isNumber, isNumberString, isString } from 'class-validator';

export class Transformer {
  static Trim(): PropertyDecorator {
    return Transform(({ value }) => (isString(value) ? value.trim() : value));
  }

  static ToLowerCase(): PropertyDecorator {
    return Transform(({ value }) =>
      isString(value) ? value.toLowerCase() : value,
    );
  }

  static ParsePrice(): PropertyDecorator {
    return Transform(({ value }) =>
      isNumber(value) ? +value.toFixed(2) : value,
    );
  }

  static ParseNumber(): PropertyDecorator {
    return Transform(({ value }) =>
      isNumberString(value) ? Number(value) : value,
    );
  }
}
