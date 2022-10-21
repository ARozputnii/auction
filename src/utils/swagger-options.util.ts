import { HttpStatus } from '@nestjs/common';

export class SwaggerOptionsUtil {
  public static created(msg = 'Return successfully created entity'): object {
    return {
      status: HttpStatus.CREATED,
      description: msg,
    };
  }

  public static ok(msg = 'Return entity'): object {
    return { status: HttpStatus.OK, description: msg };
  }

  public static unauthorized(msg = 'Unauthorized'): object {
    return {
      status: HttpStatus.UNAUTHORIZED,
      description: msg,
    };
  }

  public static notFound(msg = 'Not found'): object {
    return {
      status: HttpStatus.NOT_FOUND,
      description: msg,
    };
  }
}
