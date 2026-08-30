
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Borrower
 * 
 */
export type Borrower = $Result.DefaultSelection<Prisma.$BorrowerPayload>
/**
 * Model Item
 * 
 */
export type Item = $Result.DefaultSelection<Prisma.$ItemPayload>
/**
 * Model Room
 * 
 */
export type Room = $Result.DefaultSelection<Prisma.$RoomPayload>
/**
 * Model Borrow
 * 
 */
export type Borrow = $Result.DefaultSelection<Prisma.$BorrowPayload>
/**
 * Model Return
 * 
 */
export type Return = $Result.DefaultSelection<Prisma.$ReturnPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  admin: 'admin',
  faculty: 'faculty',
  staff: 'staff',
  student: 'student'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.borrower`: Exposes CRUD operations for the **Borrower** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Borrowers
    * const borrowers = await prisma.borrower.findMany()
    * ```
    */
  get borrower(): Prisma.BorrowerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.item`: Exposes CRUD operations for the **Item** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Items
    * const items = await prisma.item.findMany()
    * ```
    */
  get item(): Prisma.ItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.room`: Exposes CRUD operations for the **Room** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rooms
    * const rooms = await prisma.room.findMany()
    * ```
    */
  get room(): Prisma.RoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.borrow`: Exposes CRUD operations for the **Borrow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Borrows
    * const borrows = await prisma.borrow.findMany()
    * ```
    */
  get borrow(): Prisma.BorrowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.return`: Exposes CRUD operations for the **Return** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Returns
    * const returns = await prisma.return.findMany()
    * ```
    */
  get return(): Prisma.ReturnDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Borrower: 'Borrower',
    Item: 'Item',
    Room: 'Room',
    Borrow: 'Borrow',
    Return: 'Return'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "borrower" | "item" | "room" | "borrow" | "return"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Borrower: {
        payload: Prisma.$BorrowerPayload<ExtArgs>
        fields: Prisma.BorrowerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BorrowerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BorrowerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>
          }
          findFirst: {
            args: Prisma.BorrowerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BorrowerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>
          }
          findMany: {
            args: Prisma.BorrowerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>[]
          }
          create: {
            args: Prisma.BorrowerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>
          }
          createMany: {
            args: Prisma.BorrowerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BorrowerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>[]
          }
          delete: {
            args: Prisma.BorrowerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>
          }
          update: {
            args: Prisma.BorrowerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>
          }
          deleteMany: {
            args: Prisma.BorrowerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BorrowerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BorrowerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>[]
          }
          upsert: {
            args: Prisma.BorrowerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowerPayload>
          }
          aggregate: {
            args: Prisma.BorrowerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBorrower>
          }
          groupBy: {
            args: Prisma.BorrowerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BorrowerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BorrowerCountArgs<ExtArgs>
            result: $Utils.Optional<BorrowerCountAggregateOutputType> | number
          }
        }
      }
      Item: {
        payload: Prisma.$ItemPayload<ExtArgs>
        fields: Prisma.ItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findFirst: {
            args: Prisma.ItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findMany: {
            args: Prisma.ItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          create: {
            args: Prisma.ItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          createMany: {
            args: Prisma.ItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          delete: {
            args: Prisma.ItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          update: {
            args: Prisma.ItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          deleteMany: {
            args: Prisma.ItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          upsert: {
            args: Prisma.ItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          aggregate: {
            args: Prisma.ItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItem>
          }
          groupBy: {
            args: Prisma.ItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemCountArgs<ExtArgs>
            result: $Utils.Optional<ItemCountAggregateOutputType> | number
          }
        }
      }
      Room: {
        payload: Prisma.$RoomPayload<ExtArgs>
        fields: Prisma.RoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findFirst: {
            args: Prisma.RoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findMany: {
            args: Prisma.RoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          create: {
            args: Prisma.RoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          createMany: {
            args: Prisma.RoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          delete: {
            args: Prisma.RoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          update: {
            args: Prisma.RoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          deleteMany: {
            args: Prisma.RoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          upsert: {
            args: Prisma.RoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          aggregate: {
            args: Prisma.RoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoom>
          }
          groupBy: {
            args: Prisma.RoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomCountArgs<ExtArgs>
            result: $Utils.Optional<RoomCountAggregateOutputType> | number
          }
        }
      }
      Borrow: {
        payload: Prisma.$BorrowPayload<ExtArgs>
        fields: Prisma.BorrowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BorrowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BorrowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>
          }
          findFirst: {
            args: Prisma.BorrowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BorrowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>
          }
          findMany: {
            args: Prisma.BorrowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>[]
          }
          create: {
            args: Prisma.BorrowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>
          }
          createMany: {
            args: Prisma.BorrowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BorrowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>[]
          }
          delete: {
            args: Prisma.BorrowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>
          }
          update: {
            args: Prisma.BorrowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>
          }
          deleteMany: {
            args: Prisma.BorrowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BorrowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BorrowUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>[]
          }
          upsert: {
            args: Prisma.BorrowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BorrowPayload>
          }
          aggregate: {
            args: Prisma.BorrowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBorrow>
          }
          groupBy: {
            args: Prisma.BorrowGroupByArgs<ExtArgs>
            result: $Utils.Optional<BorrowGroupByOutputType>[]
          }
          count: {
            args: Prisma.BorrowCountArgs<ExtArgs>
            result: $Utils.Optional<BorrowCountAggregateOutputType> | number
          }
        }
      }
      Return: {
        payload: Prisma.$ReturnPayload<ExtArgs>
        fields: Prisma.ReturnFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReturnFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReturnFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>
          }
          findFirst: {
            args: Prisma.ReturnFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReturnFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>
          }
          findMany: {
            args: Prisma.ReturnFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>[]
          }
          create: {
            args: Prisma.ReturnCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>
          }
          createMany: {
            args: Prisma.ReturnCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReturnCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>[]
          }
          delete: {
            args: Prisma.ReturnDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>
          }
          update: {
            args: Prisma.ReturnUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>
          }
          deleteMany: {
            args: Prisma.ReturnDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReturnUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReturnUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>[]
          }
          upsert: {
            args: Prisma.ReturnUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPayload>
          }
          aggregate: {
            args: Prisma.ReturnAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReturn>
          }
          groupBy: {
            args: Prisma.ReturnGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReturnGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReturnCountArgs<ExtArgs>
            result: $Utils.Optional<ReturnCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    borrower?: BorrowerOmit
    item?: ItemOmit
    room?: RoomOmit
    borrow?: BorrowOmit
    return?: ReturnOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BorrowerCountOutputType
   */

  export type BorrowerCountOutputType = {
    borrows: number
    returns: number
  }

  export type BorrowerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    borrows?: boolean | BorrowerCountOutputTypeCountBorrowsArgs
    returns?: boolean | BorrowerCountOutputTypeCountReturnsArgs
  }

  // Custom InputTypes
  /**
   * BorrowerCountOutputType without action
   */
  export type BorrowerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BorrowerCountOutputType
     */
    select?: BorrowerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BorrowerCountOutputType without action
   */
  export type BorrowerCountOutputTypeCountBorrowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BorrowWhereInput
  }

  /**
   * BorrowerCountOutputType without action
   */
  export type BorrowerCountOutputTypeCountReturnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnWhereInput
  }


  /**
   * Count Type ItemCountOutputType
   */

  export type ItemCountOutputType = {
    borrows: number
    returns: number
  }

  export type ItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    borrows?: boolean | ItemCountOutputTypeCountBorrowsArgs
    returns?: boolean | ItemCountOutputTypeCountReturnsArgs
  }

  // Custom InputTypes
  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemCountOutputType
     */
    select?: ItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountBorrowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BorrowWhereInput
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountReturnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnWhereInput
  }


  /**
   * Count Type RoomCountOutputType
   */

  export type RoomCountOutputType = {
    borrows: number
    returns: number
  }

  export type RoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    borrows?: boolean | RoomCountOutputTypeCountBorrowsArgs
    returns?: boolean | RoomCountOutputTypeCountReturnsArgs
  }

  // Custom InputTypes
  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomCountOutputType
     */
    select?: RoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountBorrowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BorrowWhereInput
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountReturnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    username: string | null
    password: string | null
    email: string | null
    id_number: string | null
    role: $Enums.Role | null
    status: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    username: string | null
    password: string | null
    email: string | null
    id_number: string | null
    role: $Enums.Role | null
    status: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    username: number
    password: number
    email: number
    id_number: number
    role: number
    status: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    username?: true
    password?: true
    email?: true
    id_number?: true
    role?: true
    status?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    username?: true
    password?: true
    email?: true
    id_number?: true
    role?: true
    status?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    username?: true
    password?: true
    email?: true
    id_number?: true
    role?: true
    status?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string
    username: string
    password: string
    email: string | null
    id_number: string | null
    role: $Enums.Role
    status: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    id_number?: boolean
    role?: boolean
    status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    id_number?: boolean
    role?: boolean
    status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    id_number?: boolean
    role?: boolean
    status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    username?: boolean
    password?: boolean
    email?: boolean
    id_number?: boolean
    role?: boolean
    status?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "username" | "password" | "email" | "id_number" | "role" | "status", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      username: string
      password: string
      /**
       * School e-mail address. Nullable because accounts created before this column exists have none.
       */
      email: string | null
      /**
       * School ID number of the faculty / staff / admin the account belongs to.
       */
      id_number: string | null
      role: $Enums.Role
      /**
       * 1=active, 2=inactive
       */
      status: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly id_number: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly status: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Borrower
   */

  export type AggregateBorrower = {
    _count: BorrowerCountAggregateOutputType | null
    _avg: BorrowerAvgAggregateOutputType | null
    _sum: BorrowerSumAggregateOutputType | null
    _min: BorrowerMinAggregateOutputType | null
    _max: BorrowerMaxAggregateOutputType | null
  }

  export type BorrowerAvgAggregateOutputType = {
    id: number | null
    m_type: number | null
    m_status: number | null
  }

  export type BorrowerSumAggregateOutputType = {
    id: number | null
    m_type: number | null
    m_status: number | null
  }

  export type BorrowerMinAggregateOutputType = {
    id: number | null
    m_school_id: string | null
    m_fname: string | null
    m_lname: string | null
    m_gender: string | null
    m_contact: string | null
    m_department: string | null
    m_year_section: string | null
    m_type: number | null
    m_password: string | null
    m_status: number | null
  }

  export type BorrowerMaxAggregateOutputType = {
    id: number | null
    m_school_id: string | null
    m_fname: string | null
    m_lname: string | null
    m_gender: string | null
    m_contact: string | null
    m_department: string | null
    m_year_section: string | null
    m_type: number | null
    m_password: string | null
    m_status: number | null
  }

  export type BorrowerCountAggregateOutputType = {
    id: number
    m_school_id: number
    m_fname: number
    m_lname: number
    m_gender: number
    m_contact: number
    m_department: number
    m_year_section: number
    m_type: number
    m_password: number
    m_status: number
    _all: number
  }


  export type BorrowerAvgAggregateInputType = {
    id?: true
    m_type?: true
    m_status?: true
  }

  export type BorrowerSumAggregateInputType = {
    id?: true
    m_type?: true
    m_status?: true
  }

  export type BorrowerMinAggregateInputType = {
    id?: true
    m_school_id?: true
    m_fname?: true
    m_lname?: true
    m_gender?: true
    m_contact?: true
    m_department?: true
    m_year_section?: true
    m_type?: true
    m_password?: true
    m_status?: true
  }

  export type BorrowerMaxAggregateInputType = {
    id?: true
    m_school_id?: true
    m_fname?: true
    m_lname?: true
    m_gender?: true
    m_contact?: true
    m_department?: true
    m_year_section?: true
    m_type?: true
    m_password?: true
    m_status?: true
  }

  export type BorrowerCountAggregateInputType = {
    id?: true
    m_school_id?: true
    m_fname?: true
    m_lname?: true
    m_gender?: true
    m_contact?: true
    m_department?: true
    m_year_section?: true
    m_type?: true
    m_password?: true
    m_status?: true
    _all?: true
  }

  export type BorrowerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Borrower to aggregate.
     */
    where?: BorrowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrowers to fetch.
     */
    orderBy?: BorrowerOrderByWithRelationInput | BorrowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BorrowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrowers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrowers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Borrowers
    **/
    _count?: true | BorrowerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BorrowerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BorrowerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BorrowerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BorrowerMaxAggregateInputType
  }

  export type GetBorrowerAggregateType<T extends BorrowerAggregateArgs> = {
        [P in keyof T & keyof AggregateBorrower]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBorrower[P]>
      : GetScalarType<T[P], AggregateBorrower[P]>
  }




  export type BorrowerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BorrowerWhereInput
    orderBy?: BorrowerOrderByWithAggregationInput | BorrowerOrderByWithAggregationInput[]
    by: BorrowerScalarFieldEnum[] | BorrowerScalarFieldEnum
    having?: BorrowerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BorrowerCountAggregateInputType | true
    _avg?: BorrowerAvgAggregateInputType
    _sum?: BorrowerSumAggregateInputType
    _min?: BorrowerMinAggregateInputType
    _max?: BorrowerMaxAggregateInputType
  }

  export type BorrowerGroupByOutputType = {
    id: number
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status: number
    _count: BorrowerCountAggregateOutputType | null
    _avg: BorrowerAvgAggregateOutputType | null
    _sum: BorrowerSumAggregateOutputType | null
    _min: BorrowerMinAggregateOutputType | null
    _max: BorrowerMaxAggregateOutputType | null
  }

  type GetBorrowerGroupByPayload<T extends BorrowerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BorrowerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BorrowerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BorrowerGroupByOutputType[P]>
            : GetScalarType<T[P], BorrowerGroupByOutputType[P]>
        }
      >
    >


  export type BorrowerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    m_school_id?: boolean
    m_fname?: boolean
    m_lname?: boolean
    m_gender?: boolean
    m_contact?: boolean
    m_department?: boolean
    m_year_section?: boolean
    m_type?: boolean
    m_password?: boolean
    m_status?: boolean
    borrows?: boolean | Borrower$borrowsArgs<ExtArgs>
    returns?: boolean | Borrower$returnsArgs<ExtArgs>
    _count?: boolean | BorrowerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["borrower"]>

  export type BorrowerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    m_school_id?: boolean
    m_fname?: boolean
    m_lname?: boolean
    m_gender?: boolean
    m_contact?: boolean
    m_department?: boolean
    m_year_section?: boolean
    m_type?: boolean
    m_password?: boolean
    m_status?: boolean
  }, ExtArgs["result"]["borrower"]>

  export type BorrowerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    m_school_id?: boolean
    m_fname?: boolean
    m_lname?: boolean
    m_gender?: boolean
    m_contact?: boolean
    m_department?: boolean
    m_year_section?: boolean
    m_type?: boolean
    m_password?: boolean
    m_status?: boolean
  }, ExtArgs["result"]["borrower"]>

  export type BorrowerSelectScalar = {
    id?: boolean
    m_school_id?: boolean
    m_fname?: boolean
    m_lname?: boolean
    m_gender?: boolean
    m_contact?: boolean
    m_department?: boolean
    m_year_section?: boolean
    m_type?: boolean
    m_password?: boolean
    m_status?: boolean
  }

  export type BorrowerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "m_school_id" | "m_fname" | "m_lname" | "m_gender" | "m_contact" | "m_department" | "m_year_section" | "m_type" | "m_password" | "m_status", ExtArgs["result"]["borrower"]>
  export type BorrowerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    borrows?: boolean | Borrower$borrowsArgs<ExtArgs>
    returns?: boolean | Borrower$returnsArgs<ExtArgs>
    _count?: boolean | BorrowerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BorrowerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BorrowerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BorrowerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Borrower"
    objects: {
      borrows: Prisma.$BorrowPayload<ExtArgs>[]
      returns: Prisma.$ReturnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      m_school_id: string
      m_fname: string
      m_lname: string
      m_gender: string
      m_contact: string
      m_department: string
      m_year_section: string
      /**
       * 1=student, 2=faculty, 3=staff
       */
      m_type: number
      m_password: string
      /**
       * 1=active, 2=inactive
       */
      m_status: number
    }, ExtArgs["result"]["borrower"]>
    composites: {}
  }

  type BorrowerGetPayload<S extends boolean | null | undefined | BorrowerDefaultArgs> = $Result.GetResult<Prisma.$BorrowerPayload, S>

  type BorrowerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BorrowerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BorrowerCountAggregateInputType | true
    }

  export interface BorrowerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Borrower'], meta: { name: 'Borrower' } }
    /**
     * Find zero or one Borrower that matches the filter.
     * @param {BorrowerFindUniqueArgs} args - Arguments to find a Borrower
     * @example
     * // Get one Borrower
     * const borrower = await prisma.borrower.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BorrowerFindUniqueArgs>(args: SelectSubset<T, BorrowerFindUniqueArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Borrower that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BorrowerFindUniqueOrThrowArgs} args - Arguments to find a Borrower
     * @example
     * // Get one Borrower
     * const borrower = await prisma.borrower.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BorrowerFindUniqueOrThrowArgs>(args: SelectSubset<T, BorrowerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Borrower that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerFindFirstArgs} args - Arguments to find a Borrower
     * @example
     * // Get one Borrower
     * const borrower = await prisma.borrower.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BorrowerFindFirstArgs>(args?: SelectSubset<T, BorrowerFindFirstArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Borrower that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerFindFirstOrThrowArgs} args - Arguments to find a Borrower
     * @example
     * // Get one Borrower
     * const borrower = await prisma.borrower.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BorrowerFindFirstOrThrowArgs>(args?: SelectSubset<T, BorrowerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Borrowers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Borrowers
     * const borrowers = await prisma.borrower.findMany()
     * 
     * // Get first 10 Borrowers
     * const borrowers = await prisma.borrower.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const borrowerWithIdOnly = await prisma.borrower.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BorrowerFindManyArgs>(args?: SelectSubset<T, BorrowerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Borrower.
     * @param {BorrowerCreateArgs} args - Arguments to create a Borrower.
     * @example
     * // Create one Borrower
     * const Borrower = await prisma.borrower.create({
     *   data: {
     *     // ... data to create a Borrower
     *   }
     * })
     * 
     */
    create<T extends BorrowerCreateArgs>(args: SelectSubset<T, BorrowerCreateArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Borrowers.
     * @param {BorrowerCreateManyArgs} args - Arguments to create many Borrowers.
     * @example
     * // Create many Borrowers
     * const borrower = await prisma.borrower.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BorrowerCreateManyArgs>(args?: SelectSubset<T, BorrowerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Borrowers and returns the data saved in the database.
     * @param {BorrowerCreateManyAndReturnArgs} args - Arguments to create many Borrowers.
     * @example
     * // Create many Borrowers
     * const borrower = await prisma.borrower.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Borrowers and only return the `id`
     * const borrowerWithIdOnly = await prisma.borrower.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BorrowerCreateManyAndReturnArgs>(args?: SelectSubset<T, BorrowerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Borrower.
     * @param {BorrowerDeleteArgs} args - Arguments to delete one Borrower.
     * @example
     * // Delete one Borrower
     * const Borrower = await prisma.borrower.delete({
     *   where: {
     *     // ... filter to delete one Borrower
     *   }
     * })
     * 
     */
    delete<T extends BorrowerDeleteArgs>(args: SelectSubset<T, BorrowerDeleteArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Borrower.
     * @param {BorrowerUpdateArgs} args - Arguments to update one Borrower.
     * @example
     * // Update one Borrower
     * const borrower = await prisma.borrower.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BorrowerUpdateArgs>(args: SelectSubset<T, BorrowerUpdateArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Borrowers.
     * @param {BorrowerDeleteManyArgs} args - Arguments to filter Borrowers to delete.
     * @example
     * // Delete a few Borrowers
     * const { count } = await prisma.borrower.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BorrowerDeleteManyArgs>(args?: SelectSubset<T, BorrowerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Borrowers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Borrowers
     * const borrower = await prisma.borrower.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BorrowerUpdateManyArgs>(args: SelectSubset<T, BorrowerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Borrowers and returns the data updated in the database.
     * @param {BorrowerUpdateManyAndReturnArgs} args - Arguments to update many Borrowers.
     * @example
     * // Update many Borrowers
     * const borrower = await prisma.borrower.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Borrowers and only return the `id`
     * const borrowerWithIdOnly = await prisma.borrower.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BorrowerUpdateManyAndReturnArgs>(args: SelectSubset<T, BorrowerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Borrower.
     * @param {BorrowerUpsertArgs} args - Arguments to update or create a Borrower.
     * @example
     * // Update or create a Borrower
     * const borrower = await prisma.borrower.upsert({
     *   create: {
     *     // ... data to create a Borrower
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Borrower we want to update
     *   }
     * })
     */
    upsert<T extends BorrowerUpsertArgs>(args: SelectSubset<T, BorrowerUpsertArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Borrowers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerCountArgs} args - Arguments to filter Borrowers to count.
     * @example
     * // Count the number of Borrowers
     * const count = await prisma.borrower.count({
     *   where: {
     *     // ... the filter for the Borrowers we want to count
     *   }
     * })
    **/
    count<T extends BorrowerCountArgs>(
      args?: Subset<T, BorrowerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BorrowerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Borrower.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BorrowerAggregateArgs>(args: Subset<T, BorrowerAggregateArgs>): Prisma.PrismaPromise<GetBorrowerAggregateType<T>>

    /**
     * Group by Borrower.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BorrowerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BorrowerGroupByArgs['orderBy'] }
        : { orderBy?: BorrowerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BorrowerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBorrowerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Borrower model
   */
  readonly fields: BorrowerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Borrower.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BorrowerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    borrows<T extends Borrower$borrowsArgs<ExtArgs> = {}>(args?: Subset<T, Borrower$borrowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    returns<T extends Borrower$returnsArgs<ExtArgs> = {}>(args?: Subset<T, Borrower$returnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Borrower model
   */
  interface BorrowerFieldRefs {
    readonly id: FieldRef<"Borrower", 'Int'>
    readonly m_school_id: FieldRef<"Borrower", 'String'>
    readonly m_fname: FieldRef<"Borrower", 'String'>
    readonly m_lname: FieldRef<"Borrower", 'String'>
    readonly m_gender: FieldRef<"Borrower", 'String'>
    readonly m_contact: FieldRef<"Borrower", 'String'>
    readonly m_department: FieldRef<"Borrower", 'String'>
    readonly m_year_section: FieldRef<"Borrower", 'String'>
    readonly m_type: FieldRef<"Borrower", 'Int'>
    readonly m_password: FieldRef<"Borrower", 'String'>
    readonly m_status: FieldRef<"Borrower", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Borrower findUnique
   */
  export type BorrowerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * Filter, which Borrower to fetch.
     */
    where: BorrowerWhereUniqueInput
  }

  /**
   * Borrower findUniqueOrThrow
   */
  export type BorrowerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * Filter, which Borrower to fetch.
     */
    where: BorrowerWhereUniqueInput
  }

  /**
   * Borrower findFirst
   */
  export type BorrowerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * Filter, which Borrower to fetch.
     */
    where?: BorrowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrowers to fetch.
     */
    orderBy?: BorrowerOrderByWithRelationInput | BorrowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Borrowers.
     */
    cursor?: BorrowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrowers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrowers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Borrowers.
     */
    distinct?: BorrowerScalarFieldEnum | BorrowerScalarFieldEnum[]
  }

  /**
   * Borrower findFirstOrThrow
   */
  export type BorrowerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * Filter, which Borrower to fetch.
     */
    where?: BorrowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrowers to fetch.
     */
    orderBy?: BorrowerOrderByWithRelationInput | BorrowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Borrowers.
     */
    cursor?: BorrowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrowers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrowers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Borrowers.
     */
    distinct?: BorrowerScalarFieldEnum | BorrowerScalarFieldEnum[]
  }

  /**
   * Borrower findMany
   */
  export type BorrowerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * Filter, which Borrowers to fetch.
     */
    where?: BorrowerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrowers to fetch.
     */
    orderBy?: BorrowerOrderByWithRelationInput | BorrowerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Borrowers.
     */
    cursor?: BorrowerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrowers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrowers.
     */
    skip?: number
    distinct?: BorrowerScalarFieldEnum | BorrowerScalarFieldEnum[]
  }

  /**
   * Borrower create
   */
  export type BorrowerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * The data needed to create a Borrower.
     */
    data: XOR<BorrowerCreateInput, BorrowerUncheckedCreateInput>
  }

  /**
   * Borrower createMany
   */
  export type BorrowerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Borrowers.
     */
    data: BorrowerCreateManyInput | BorrowerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Borrower createManyAndReturn
   */
  export type BorrowerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * The data used to create many Borrowers.
     */
    data: BorrowerCreateManyInput | BorrowerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Borrower update
   */
  export type BorrowerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * The data needed to update a Borrower.
     */
    data: XOR<BorrowerUpdateInput, BorrowerUncheckedUpdateInput>
    /**
     * Choose, which Borrower to update.
     */
    where: BorrowerWhereUniqueInput
  }

  /**
   * Borrower updateMany
   */
  export type BorrowerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Borrowers.
     */
    data: XOR<BorrowerUpdateManyMutationInput, BorrowerUncheckedUpdateManyInput>
    /**
     * Filter which Borrowers to update
     */
    where?: BorrowerWhereInput
    /**
     * Limit how many Borrowers to update.
     */
    limit?: number
  }

  /**
   * Borrower updateManyAndReturn
   */
  export type BorrowerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * The data used to update Borrowers.
     */
    data: XOR<BorrowerUpdateManyMutationInput, BorrowerUncheckedUpdateManyInput>
    /**
     * Filter which Borrowers to update
     */
    where?: BorrowerWhereInput
    /**
     * Limit how many Borrowers to update.
     */
    limit?: number
  }

  /**
   * Borrower upsert
   */
  export type BorrowerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * The filter to search for the Borrower to update in case it exists.
     */
    where: BorrowerWhereUniqueInput
    /**
     * In case the Borrower found by the `where` argument doesn't exist, create a new Borrower with this data.
     */
    create: XOR<BorrowerCreateInput, BorrowerUncheckedCreateInput>
    /**
     * In case the Borrower was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BorrowerUpdateInput, BorrowerUncheckedUpdateInput>
  }

  /**
   * Borrower delete
   */
  export type BorrowerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
    /**
     * Filter which Borrower to delete.
     */
    where: BorrowerWhereUniqueInput
  }

  /**
   * Borrower deleteMany
   */
  export type BorrowerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Borrowers to delete
     */
    where?: BorrowerWhereInput
    /**
     * Limit how many Borrowers to delete.
     */
    limit?: number
  }

  /**
   * Borrower.borrows
   */
  export type Borrower$borrowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    where?: BorrowWhereInput
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    cursor?: BorrowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BorrowScalarFieldEnum | BorrowScalarFieldEnum[]
  }

  /**
   * Borrower.returns
   */
  export type Borrower$returnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    where?: ReturnWhereInput
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    cursor?: ReturnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReturnScalarFieldEnum | ReturnScalarFieldEnum[]
  }

  /**
   * Borrower without action
   */
  export type BorrowerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrower
     */
    select?: BorrowerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrower
     */
    omit?: BorrowerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowerInclude<ExtArgs> | null
  }


  /**
   * Model Item
   */

  export type AggregateItem = {
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  export type ItemAvgAggregateOutputType = {
    id: number | null
    item_rawstock: number | null
    i_status: number | null
    i_price: Decimal | null
    no_of_items: number | null
  }

  export type ItemSumAggregateOutputType = {
    id: number | null
    item_rawstock: number | null
    i_status: number | null
    i_price: Decimal | null
    no_of_items: number | null
  }

  export type ItemMinAggregateOutputType = {
    id: number | null
    i_deviceID: string | null
    i_model: string | null
    i_category: string | null
    i_brand: string | null
    i_description: string | null
    i_type: string | null
    item_rawstock: number | null
    i_status: number | null
    i_mr: string | null
    i_price: Decimal | null
    i_photo: string | null
    no_of_items: number | null
    remarks: string | null
  }

  export type ItemMaxAggregateOutputType = {
    id: number | null
    i_deviceID: string | null
    i_model: string | null
    i_category: string | null
    i_brand: string | null
    i_description: string | null
    i_type: string | null
    item_rawstock: number | null
    i_status: number | null
    i_mr: string | null
    i_price: Decimal | null
    i_photo: string | null
    no_of_items: number | null
    remarks: string | null
  }

  export type ItemCountAggregateOutputType = {
    id: number
    i_deviceID: number
    i_model: number
    i_category: number
    i_brand: number
    i_description: number
    i_type: number
    item_rawstock: number
    i_status: number
    i_mr: number
    i_price: number
    i_photo: number
    no_of_items: number
    remarks: number
    _all: number
  }


  export type ItemAvgAggregateInputType = {
    id?: true
    item_rawstock?: true
    i_status?: true
    i_price?: true
    no_of_items?: true
  }

  export type ItemSumAggregateInputType = {
    id?: true
    item_rawstock?: true
    i_status?: true
    i_price?: true
    no_of_items?: true
  }

  export type ItemMinAggregateInputType = {
    id?: true
    i_deviceID?: true
    i_model?: true
    i_category?: true
    i_brand?: true
    i_description?: true
    i_type?: true
    item_rawstock?: true
    i_status?: true
    i_mr?: true
    i_price?: true
    i_photo?: true
    no_of_items?: true
    remarks?: true
  }

  export type ItemMaxAggregateInputType = {
    id?: true
    i_deviceID?: true
    i_model?: true
    i_category?: true
    i_brand?: true
    i_description?: true
    i_type?: true
    item_rawstock?: true
    i_status?: true
    i_mr?: true
    i_price?: true
    i_photo?: true
    no_of_items?: true
    remarks?: true
  }

  export type ItemCountAggregateInputType = {
    id?: true
    i_deviceID?: true
    i_model?: true
    i_category?: true
    i_brand?: true
    i_description?: true
    i_type?: true
    item_rawstock?: true
    i_status?: true
    i_mr?: true
    i_price?: true
    i_photo?: true
    no_of_items?: true
    remarks?: true
    _all?: true
  }

  export type ItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Item to aggregate.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Items
    **/
    _count?: true | ItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemMaxAggregateInputType
  }

  export type GetItemAggregateType<T extends ItemAggregateArgs> = {
        [P in keyof T & keyof AggregateItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItem[P]>
      : GetScalarType<T[P], AggregateItem[P]>
  }




  export type ItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemWhereInput
    orderBy?: ItemOrderByWithAggregationInput | ItemOrderByWithAggregationInput[]
    by: ItemScalarFieldEnum[] | ItemScalarFieldEnum
    having?: ItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemCountAggregateInputType | true
    _avg?: ItemAvgAggregateInputType
    _sum?: ItemSumAggregateInputType
    _min?: ItemMinAggregateInputType
    _max?: ItemMaxAggregateInputType
  }

  export type ItemGroupByOutputType = {
    id: number
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock: number
    i_status: number
    i_mr: string
    i_price: Decimal
    i_photo: string
    no_of_items: number | null
    remarks: string | null
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  type GetItemGroupByPayload<T extends ItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemGroupByOutputType[P]>
            : GetScalarType<T[P], ItemGroupByOutputType[P]>
        }
      >
    >


  export type ItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    i_deviceID?: boolean
    i_model?: boolean
    i_category?: boolean
    i_brand?: boolean
    i_description?: boolean
    i_type?: boolean
    item_rawstock?: boolean
    i_status?: boolean
    i_mr?: boolean
    i_price?: boolean
    i_photo?: boolean
    no_of_items?: boolean
    remarks?: boolean
    borrows?: boolean | Item$borrowsArgs<ExtArgs>
    returns?: boolean | Item$returnsArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["item"]>

  export type ItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    i_deviceID?: boolean
    i_model?: boolean
    i_category?: boolean
    i_brand?: boolean
    i_description?: boolean
    i_type?: boolean
    item_rawstock?: boolean
    i_status?: boolean
    i_mr?: boolean
    i_price?: boolean
    i_photo?: boolean
    no_of_items?: boolean
    remarks?: boolean
  }, ExtArgs["result"]["item"]>

  export type ItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    i_deviceID?: boolean
    i_model?: boolean
    i_category?: boolean
    i_brand?: boolean
    i_description?: boolean
    i_type?: boolean
    item_rawstock?: boolean
    i_status?: boolean
    i_mr?: boolean
    i_price?: boolean
    i_photo?: boolean
    no_of_items?: boolean
    remarks?: boolean
  }, ExtArgs["result"]["item"]>

  export type ItemSelectScalar = {
    id?: boolean
    i_deviceID?: boolean
    i_model?: boolean
    i_category?: boolean
    i_brand?: boolean
    i_description?: boolean
    i_type?: boolean
    item_rawstock?: boolean
    i_status?: boolean
    i_mr?: boolean
    i_price?: boolean
    i_photo?: boolean
    no_of_items?: boolean
    remarks?: boolean
  }

  export type ItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "i_deviceID" | "i_model" | "i_category" | "i_brand" | "i_description" | "i_type" | "item_rawstock" | "i_status" | "i_mr" | "i_price" | "i_photo" | "no_of_items" | "remarks", ExtArgs["result"]["item"]>
  export type ItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    borrows?: boolean | Item$borrowsArgs<ExtArgs>
    returns?: boolean | Item$returnsArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Item"
    objects: {
      borrows: Prisma.$BorrowPayload<ExtArgs>[]
      returns: Prisma.$ReturnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      i_deviceID: string
      i_model: string
      i_category: string
      i_brand: string
      i_description: string
      i_type: string
      item_rawstock: number
      /**
       * 1=available, 2=borrowed, 3=maintenance, 4=damaged
       */
      i_status: number
      i_mr: string
      i_price: Prisma.Decimal
      i_photo: string
      no_of_items: number | null
      remarks: string | null
    }, ExtArgs["result"]["item"]>
    composites: {}
  }

  type ItemGetPayload<S extends boolean | null | undefined | ItemDefaultArgs> = $Result.GetResult<Prisma.$ItemPayload, S>

  type ItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItemCountAggregateInputType | true
    }

  export interface ItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Item'], meta: { name: 'Item' } }
    /**
     * Find zero or one Item that matches the filter.
     * @param {ItemFindUniqueArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemFindUniqueArgs>(args: SelectSubset<T, ItemFindUniqueArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Item that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemFindUniqueOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Item that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemFindFirstArgs>(args?: SelectSubset<T, ItemFindFirstArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Item that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Items
     * const items = await prisma.item.findMany()
     * 
     * // Get first 10 Items
     * const items = await prisma.item.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemWithIdOnly = await prisma.item.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemFindManyArgs>(args?: SelectSubset<T, ItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Item.
     * @param {ItemCreateArgs} args - Arguments to create a Item.
     * @example
     * // Create one Item
     * const Item = await prisma.item.create({
     *   data: {
     *     // ... data to create a Item
     *   }
     * })
     * 
     */
    create<T extends ItemCreateArgs>(args: SelectSubset<T, ItemCreateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Items.
     * @param {ItemCreateManyArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemCreateManyArgs>(args?: SelectSubset<T, ItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Items and returns the data saved in the database.
     * @param {ItemCreateManyAndReturnArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Items and only return the `id`
     * const itemWithIdOnly = await prisma.item.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Item.
     * @param {ItemDeleteArgs} args - Arguments to delete one Item.
     * @example
     * // Delete one Item
     * const Item = await prisma.item.delete({
     *   where: {
     *     // ... filter to delete one Item
     *   }
     * })
     * 
     */
    delete<T extends ItemDeleteArgs>(args: SelectSubset<T, ItemDeleteArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Item.
     * @param {ItemUpdateArgs} args - Arguments to update one Item.
     * @example
     * // Update one Item
     * const item = await prisma.item.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemUpdateArgs>(args: SelectSubset<T, ItemUpdateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Items.
     * @param {ItemDeleteManyArgs} args - Arguments to filter Items to delete.
     * @example
     * // Delete a few Items
     * const { count } = await prisma.item.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemDeleteManyArgs>(args?: SelectSubset<T, ItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Items
     * const item = await prisma.item.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemUpdateManyArgs>(args: SelectSubset<T, ItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Items and returns the data updated in the database.
     * @param {ItemUpdateManyAndReturnArgs} args - Arguments to update many Items.
     * @example
     * // Update many Items
     * const item = await prisma.item.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Items and only return the `id`
     * const itemWithIdOnly = await prisma.item.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ItemUpdateManyAndReturnArgs>(args: SelectSubset<T, ItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Item.
     * @param {ItemUpsertArgs} args - Arguments to update or create a Item.
     * @example
     * // Update or create a Item
     * const item = await prisma.item.upsert({
     *   create: {
     *     // ... data to create a Item
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Item we want to update
     *   }
     * })
     */
    upsert<T extends ItemUpsertArgs>(args: SelectSubset<T, ItemUpsertArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCountArgs} args - Arguments to filter Items to count.
     * @example
     * // Count the number of Items
     * const count = await prisma.item.count({
     *   where: {
     *     // ... the filter for the Items we want to count
     *   }
     * })
    **/
    count<T extends ItemCountArgs>(
      args?: Subset<T, ItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItemAggregateArgs>(args: Subset<T, ItemAggregateArgs>): Prisma.PrismaPromise<GetItemAggregateType<T>>

    /**
     * Group by Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemGroupByArgs['orderBy'] }
        : { orderBy?: ItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Item model
   */
  readonly fields: ItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Item.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    borrows<T extends Item$borrowsArgs<ExtArgs> = {}>(args?: Subset<T, Item$borrowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    returns<T extends Item$returnsArgs<ExtArgs> = {}>(args?: Subset<T, Item$returnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Item model
   */
  interface ItemFieldRefs {
    readonly id: FieldRef<"Item", 'Int'>
    readonly i_deviceID: FieldRef<"Item", 'String'>
    readonly i_model: FieldRef<"Item", 'String'>
    readonly i_category: FieldRef<"Item", 'String'>
    readonly i_brand: FieldRef<"Item", 'String'>
    readonly i_description: FieldRef<"Item", 'String'>
    readonly i_type: FieldRef<"Item", 'String'>
    readonly item_rawstock: FieldRef<"Item", 'Int'>
    readonly i_status: FieldRef<"Item", 'Int'>
    readonly i_mr: FieldRef<"Item", 'String'>
    readonly i_price: FieldRef<"Item", 'Decimal'>
    readonly i_photo: FieldRef<"Item", 'String'>
    readonly no_of_items: FieldRef<"Item", 'Int'>
    readonly remarks: FieldRef<"Item", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Item findUnique
   */
  export type ItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findUniqueOrThrow
   */
  export type ItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findFirst
   */
  export type ItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findFirstOrThrow
   */
  export type ItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findMany
   */
  export type ItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Items to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item create
   */
  export type ItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to create a Item.
     */
    data: XOR<ItemCreateInput, ItemUncheckedCreateInput>
  }

  /**
   * Item createMany
   */
  export type ItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Item createManyAndReturn
   */
  export type ItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Item update
   */
  export type ItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to update a Item.
     */
    data: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
    /**
     * Choose, which Item to update.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item updateMany
   */
  export type ItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Items.
     */
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyInput>
    /**
     * Filter which Items to update
     */
    where?: ItemWhereInput
    /**
     * Limit how many Items to update.
     */
    limit?: number
  }

  /**
   * Item updateManyAndReturn
   */
  export type ItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * The data used to update Items.
     */
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyInput>
    /**
     * Filter which Items to update
     */
    where?: ItemWhereInput
    /**
     * Limit how many Items to update.
     */
    limit?: number
  }

  /**
   * Item upsert
   */
  export type ItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The filter to search for the Item to update in case it exists.
     */
    where: ItemWhereUniqueInput
    /**
     * In case the Item found by the `where` argument doesn't exist, create a new Item with this data.
     */
    create: XOR<ItemCreateInput, ItemUncheckedCreateInput>
    /**
     * In case the Item was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
  }

  /**
   * Item delete
   */
  export type ItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter which Item to delete.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item deleteMany
   */
  export type ItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Items to delete
     */
    where?: ItemWhereInput
    /**
     * Limit how many Items to delete.
     */
    limit?: number
  }

  /**
   * Item.borrows
   */
  export type Item$borrowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    where?: BorrowWhereInput
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    cursor?: BorrowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BorrowScalarFieldEnum | BorrowScalarFieldEnum[]
  }

  /**
   * Item.returns
   */
  export type Item$returnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    where?: ReturnWhereInput
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    cursor?: ReturnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReturnScalarFieldEnum | ReturnScalarFieldEnum[]
  }

  /**
   * Item without action
   */
  export type ItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
  }


  /**
   * Model Room
   */

  export type AggregateRoom = {
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  export type RoomAvgAggregateOutputType = {
    id: number | null
    r_status: number | null
  }

  export type RoomSumAggregateOutputType = {
    id: number | null
    r_status: number | null
  }

  export type RoomMinAggregateOutputType = {
    id: number | null
    r_name: string | null
    r_description: string | null
    r_status: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoomMaxAggregateOutputType = {
    id: number | null
    r_name: string | null
    r_description: string | null
    r_status: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoomCountAggregateOutputType = {
    id: number
    r_name: number
    r_description: number
    r_status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoomAvgAggregateInputType = {
    id?: true
    r_status?: true
  }

  export type RoomSumAggregateInputType = {
    id?: true
    r_status?: true
  }

  export type RoomMinAggregateInputType = {
    id?: true
    r_name?: true
    r_description?: true
    r_status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoomMaxAggregateInputType = {
    id?: true
    r_name?: true
    r_description?: true
    r_status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoomCountAggregateInputType = {
    id?: true
    r_name?: true
    r_description?: true
    r_status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Room to aggregate.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rooms
    **/
    _count?: true | RoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomMaxAggregateInputType
  }

  export type GetRoomAggregateType<T extends RoomAggregateArgs> = {
        [P in keyof T & keyof AggregateRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom[P]>
      : GetScalarType<T[P], AggregateRoom[P]>
  }




  export type RoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithAggregationInput | RoomOrderByWithAggregationInput[]
    by: RoomScalarFieldEnum[] | RoomScalarFieldEnum
    having?: RoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomCountAggregateInputType | true
    _avg?: RoomAvgAggregateInputType
    _sum?: RoomSumAggregateInputType
    _min?: RoomMinAggregateInputType
    _max?: RoomMaxAggregateInputType
  }

  export type RoomGroupByOutputType = {
    id: number
    r_name: string
    r_description: string | null
    r_status: number
    createdAt: Date
    updatedAt: Date
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  type GetRoomGroupByPayload<T extends RoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomGroupByOutputType[P]>
            : GetScalarType<T[P], RoomGroupByOutputType[P]>
        }
      >
    >


  export type RoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    r_name?: boolean
    r_description?: boolean
    r_status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    borrows?: boolean | Room$borrowsArgs<ExtArgs>
    returns?: boolean | Room$returnsArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    r_name?: boolean
    r_description?: boolean
    r_status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["room"]>

  export type RoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    r_name?: boolean
    r_description?: boolean
    r_status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["room"]>

  export type RoomSelectScalar = {
    id?: boolean
    r_name?: boolean
    r_description?: boolean
    r_status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "r_name" | "r_description" | "r_status" | "createdAt" | "updatedAt", ExtArgs["result"]["room"]>
  export type RoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    borrows?: boolean | Room$borrowsArgs<ExtArgs>
    returns?: boolean | Room$returnsArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Room"
    objects: {
      borrows: Prisma.$BorrowPayload<ExtArgs>[]
      returns: Prisma.$ReturnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      r_name: string
      r_description: string | null
      /**
       * 1=active, 2=inactive
       */
      r_status: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["room"]>
    composites: {}
  }

  type RoomGetPayload<S extends boolean | null | undefined | RoomDefaultArgs> = $Result.GetResult<Prisma.$RoomPayload, S>

  type RoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoomCountAggregateInputType | true
    }

  export interface RoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Room'], meta: { name: 'Room' } }
    /**
     * Find zero or one Room that matches the filter.
     * @param {RoomFindUniqueArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomFindUniqueArgs>(args: SelectSubset<T, RoomFindUniqueArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Room that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoomFindUniqueOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Room that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomFindFirstArgs>(args?: SelectSubset<T, RoomFindFirstArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Room that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rooms
     * const rooms = await prisma.room.findMany()
     * 
     * // Get first 10 Rooms
     * const rooms = await prisma.room.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomWithIdOnly = await prisma.room.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomFindManyArgs>(args?: SelectSubset<T, RoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Room.
     * @param {RoomCreateArgs} args - Arguments to create a Room.
     * @example
     * // Create one Room
     * const Room = await prisma.room.create({
     *   data: {
     *     // ... data to create a Room
     *   }
     * })
     * 
     */
    create<T extends RoomCreateArgs>(args: SelectSubset<T, RoomCreateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rooms.
     * @param {RoomCreateManyArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomCreateManyArgs>(args?: SelectSubset<T, RoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rooms and returns the data saved in the database.
     * @param {RoomCreateManyAndReturnArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Room.
     * @param {RoomDeleteArgs} args - Arguments to delete one Room.
     * @example
     * // Delete one Room
     * const Room = await prisma.room.delete({
     *   where: {
     *     // ... filter to delete one Room
     *   }
     * })
     * 
     */
    delete<T extends RoomDeleteArgs>(args: SelectSubset<T, RoomDeleteArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Room.
     * @param {RoomUpdateArgs} args - Arguments to update one Room.
     * @example
     * // Update one Room
     * const room = await prisma.room.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomUpdateArgs>(args: SelectSubset<T, RoomUpdateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rooms.
     * @param {RoomDeleteManyArgs} args - Arguments to filter Rooms to delete.
     * @example
     * // Delete a few Rooms
     * const { count } = await prisma.room.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomDeleteManyArgs>(args?: SelectSubset<T, RoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomUpdateManyArgs>(args: SelectSubset<T, RoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms and returns the data updated in the database.
     * @param {RoomUpdateManyAndReturnArgs} args - Arguments to update many Rooms.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoomUpdateManyAndReturnArgs>(args: SelectSubset<T, RoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Room.
     * @param {RoomUpsertArgs} args - Arguments to update or create a Room.
     * @example
     * // Update or create a Room
     * const room = await prisma.room.upsert({
     *   create: {
     *     // ... data to create a Room
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room we want to update
     *   }
     * })
     */
    upsert<T extends RoomUpsertArgs>(args: SelectSubset<T, RoomUpsertArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomCountArgs} args - Arguments to filter Rooms to count.
     * @example
     * // Count the number of Rooms
     * const count = await prisma.room.count({
     *   where: {
     *     // ... the filter for the Rooms we want to count
     *   }
     * })
    **/
    count<T extends RoomCountArgs>(
      args?: Subset<T, RoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomAggregateArgs>(args: Subset<T, RoomAggregateArgs>): Prisma.PrismaPromise<GetRoomAggregateType<T>>

    /**
     * Group by Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomGroupByArgs['orderBy'] }
        : { orderBy?: RoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Room model
   */
  readonly fields: RoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Room.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    borrows<T extends Room$borrowsArgs<ExtArgs> = {}>(args?: Subset<T, Room$borrowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    returns<T extends Room$returnsArgs<ExtArgs> = {}>(args?: Subset<T, Room$returnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Room model
   */
  interface RoomFieldRefs {
    readonly id: FieldRef<"Room", 'Int'>
    readonly r_name: FieldRef<"Room", 'String'>
    readonly r_description: FieldRef<"Room", 'String'>
    readonly r_status: FieldRef<"Room", 'Int'>
    readonly createdAt: FieldRef<"Room", 'DateTime'>
    readonly updatedAt: FieldRef<"Room", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Room findUnique
   */
  export type RoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findUniqueOrThrow
   */
  export type RoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findFirst
   */
  export type RoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findFirstOrThrow
   */
  export type RoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findMany
   */
  export type RoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Rooms to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room create
   */
  export type RoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to create a Room.
     */
    data: XOR<RoomCreateInput, RoomUncheckedCreateInput>
  }

  /**
   * Room createMany
   */
  export type RoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Room createManyAndReturn
   */
  export type RoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Room update
   */
  export type RoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to update a Room.
     */
    data: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
    /**
     * Choose, which Room to update.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room updateMany
   */
  export type RoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to update.
     */
    limit?: number
  }

  /**
   * Room updateManyAndReturn
   */
  export type RoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to update.
     */
    limit?: number
  }

  /**
   * Room upsert
   */
  export type RoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The filter to search for the Room to update in case it exists.
     */
    where: RoomWhereUniqueInput
    /**
     * In case the Room found by the `where` argument doesn't exist, create a new Room with this data.
     */
    create: XOR<RoomCreateInput, RoomUncheckedCreateInput>
    /**
     * In case the Room was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
  }

  /**
   * Room delete
   */
  export type RoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter which Room to delete.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room deleteMany
   */
  export type RoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rooms to delete
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to delete.
     */
    limit?: number
  }

  /**
   * Room.borrows
   */
  export type Room$borrowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    where?: BorrowWhereInput
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    cursor?: BorrowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BorrowScalarFieldEnum | BorrowScalarFieldEnum[]
  }

  /**
   * Room.returns
   */
  export type Room$returnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    where?: ReturnWhereInput
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    cursor?: ReturnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReturnScalarFieldEnum | ReturnScalarFieldEnum[]
  }

  /**
   * Room without action
   */
  export type RoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
  }


  /**
   * Model Borrow
   */

  export type AggregateBorrow = {
    _count: BorrowCountAggregateOutputType | null
    _avg: BorrowAvgAggregateOutputType | null
    _sum: BorrowSumAggregateOutputType | null
    _min: BorrowMinAggregateOutputType | null
    _max: BorrowMaxAggregateOutputType | null
  }

  export type BorrowAvgAggregateOutputType = {
    id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    b_quantity: number | null
    b_status: number | null
  }

  export type BorrowSumAggregateOutputType = {
    id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    b_quantity: number | null
    b_status: number | null
  }

  export type BorrowMinAggregateOutputType = {
    id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    b_date_borrowed: Date | null
    b_date_returned: Date | null
    b_due_date: Date | null
    b_quantity: number | null
    b_status: number | null
    b_purpose: string | null
    b_notes: string | null
  }

  export type BorrowMaxAggregateOutputType = {
    id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    b_date_borrowed: Date | null
    b_date_returned: Date | null
    b_due_date: Date | null
    b_quantity: number | null
    b_status: number | null
    b_purpose: string | null
    b_notes: string | null
  }

  export type BorrowCountAggregateOutputType = {
    id: number
    member_id: number
    item_id: number
    room_id: number
    b_date_borrowed: number
    b_date_returned: number
    b_due_date: number
    b_quantity: number
    b_status: number
    b_purpose: number
    b_notes: number
    _all: number
  }


  export type BorrowAvgAggregateInputType = {
    id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    b_quantity?: true
    b_status?: true
  }

  export type BorrowSumAggregateInputType = {
    id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    b_quantity?: true
    b_status?: true
  }

  export type BorrowMinAggregateInputType = {
    id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    b_date_borrowed?: true
    b_date_returned?: true
    b_due_date?: true
    b_quantity?: true
    b_status?: true
    b_purpose?: true
    b_notes?: true
  }

  export type BorrowMaxAggregateInputType = {
    id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    b_date_borrowed?: true
    b_date_returned?: true
    b_due_date?: true
    b_quantity?: true
    b_status?: true
    b_purpose?: true
    b_notes?: true
  }

  export type BorrowCountAggregateInputType = {
    id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    b_date_borrowed?: true
    b_date_returned?: true
    b_due_date?: true
    b_quantity?: true
    b_status?: true
    b_purpose?: true
    b_notes?: true
    _all?: true
  }

  export type BorrowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Borrow to aggregate.
     */
    where?: BorrowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrows to fetch.
     */
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BorrowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Borrows
    **/
    _count?: true | BorrowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BorrowAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BorrowSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BorrowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BorrowMaxAggregateInputType
  }

  export type GetBorrowAggregateType<T extends BorrowAggregateArgs> = {
        [P in keyof T & keyof AggregateBorrow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBorrow[P]>
      : GetScalarType<T[P], AggregateBorrow[P]>
  }




  export type BorrowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BorrowWhereInput
    orderBy?: BorrowOrderByWithAggregationInput | BorrowOrderByWithAggregationInput[]
    by: BorrowScalarFieldEnum[] | BorrowScalarFieldEnum
    having?: BorrowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BorrowCountAggregateInputType | true
    _avg?: BorrowAvgAggregateInputType
    _sum?: BorrowSumAggregateInputType
    _min?: BorrowMinAggregateInputType
    _max?: BorrowMaxAggregateInputType
  }

  export type BorrowGroupByOutputType = {
    id: number
    member_id: number
    item_id: number
    room_id: number | null
    b_date_borrowed: Date
    b_date_returned: Date | null
    b_due_date: Date
    b_quantity: number
    b_status: number
    b_purpose: string | null
    b_notes: string | null
    _count: BorrowCountAggregateOutputType | null
    _avg: BorrowAvgAggregateOutputType | null
    _sum: BorrowSumAggregateOutputType | null
    _min: BorrowMinAggregateOutputType | null
    _max: BorrowMaxAggregateOutputType | null
  }

  type GetBorrowGroupByPayload<T extends BorrowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BorrowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BorrowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BorrowGroupByOutputType[P]>
            : GetScalarType<T[P], BorrowGroupByOutputType[P]>
        }
      >
    >


  export type BorrowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    b_date_borrowed?: boolean
    b_date_returned?: boolean
    b_due_date?: boolean
    b_quantity?: boolean
    b_status?: boolean
    b_purpose?: boolean
    b_notes?: boolean
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Borrow$RoomArgs<ExtArgs>
    return?: boolean | Borrow$returnArgs<ExtArgs>
  }, ExtArgs["result"]["borrow"]>

  export type BorrowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    b_date_borrowed?: boolean
    b_date_returned?: boolean
    b_due_date?: boolean
    b_quantity?: boolean
    b_status?: boolean
    b_purpose?: boolean
    b_notes?: boolean
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Borrow$RoomArgs<ExtArgs>
  }, ExtArgs["result"]["borrow"]>

  export type BorrowSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    b_date_borrowed?: boolean
    b_date_returned?: boolean
    b_due_date?: boolean
    b_quantity?: boolean
    b_status?: boolean
    b_purpose?: boolean
    b_notes?: boolean
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Borrow$RoomArgs<ExtArgs>
  }, ExtArgs["result"]["borrow"]>

  export type BorrowSelectScalar = {
    id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    b_date_borrowed?: boolean
    b_date_returned?: boolean
    b_due_date?: boolean
    b_quantity?: boolean
    b_status?: boolean
    b_purpose?: boolean
    b_notes?: boolean
  }

  export type BorrowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "member_id" | "item_id" | "room_id" | "b_date_borrowed" | "b_date_returned" | "b_due_date" | "b_quantity" | "b_status" | "b_purpose" | "b_notes", ExtArgs["result"]["borrow"]>
  export type BorrowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Borrow$RoomArgs<ExtArgs>
    return?: boolean | Borrow$returnArgs<ExtArgs>
  }
  export type BorrowIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Borrow$RoomArgs<ExtArgs>
  }
  export type BorrowIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Borrow$RoomArgs<ExtArgs>
  }

  export type $BorrowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Borrow"
    objects: {
      Member: Prisma.$BorrowerPayload<ExtArgs>
      Item: Prisma.$ItemPayload<ExtArgs>
      Room: Prisma.$RoomPayload<ExtArgs> | null
      return: Prisma.$ReturnPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      member_id: number
      item_id: number
      room_id: number | null
      b_date_borrowed: Date
      b_date_returned: Date | null
      b_due_date: Date
      b_quantity: number
      /**
       * 1=borrowed, 2=returned, 3=overdue
       */
      b_status: number
      b_purpose: string | null
      b_notes: string | null
    }, ExtArgs["result"]["borrow"]>
    composites: {}
  }

  type BorrowGetPayload<S extends boolean | null | undefined | BorrowDefaultArgs> = $Result.GetResult<Prisma.$BorrowPayload, S>

  type BorrowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BorrowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BorrowCountAggregateInputType | true
    }

  export interface BorrowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Borrow'], meta: { name: 'Borrow' } }
    /**
     * Find zero or one Borrow that matches the filter.
     * @param {BorrowFindUniqueArgs} args - Arguments to find a Borrow
     * @example
     * // Get one Borrow
     * const borrow = await prisma.borrow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BorrowFindUniqueArgs>(args: SelectSubset<T, BorrowFindUniqueArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Borrow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BorrowFindUniqueOrThrowArgs} args - Arguments to find a Borrow
     * @example
     * // Get one Borrow
     * const borrow = await prisma.borrow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BorrowFindUniqueOrThrowArgs>(args: SelectSubset<T, BorrowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Borrow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowFindFirstArgs} args - Arguments to find a Borrow
     * @example
     * // Get one Borrow
     * const borrow = await prisma.borrow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BorrowFindFirstArgs>(args?: SelectSubset<T, BorrowFindFirstArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Borrow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowFindFirstOrThrowArgs} args - Arguments to find a Borrow
     * @example
     * // Get one Borrow
     * const borrow = await prisma.borrow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BorrowFindFirstOrThrowArgs>(args?: SelectSubset<T, BorrowFindFirstOrThrowArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Borrows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Borrows
     * const borrows = await prisma.borrow.findMany()
     * 
     * // Get first 10 Borrows
     * const borrows = await prisma.borrow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const borrowWithIdOnly = await prisma.borrow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BorrowFindManyArgs>(args?: SelectSubset<T, BorrowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Borrow.
     * @param {BorrowCreateArgs} args - Arguments to create a Borrow.
     * @example
     * // Create one Borrow
     * const Borrow = await prisma.borrow.create({
     *   data: {
     *     // ... data to create a Borrow
     *   }
     * })
     * 
     */
    create<T extends BorrowCreateArgs>(args: SelectSubset<T, BorrowCreateArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Borrows.
     * @param {BorrowCreateManyArgs} args - Arguments to create many Borrows.
     * @example
     * // Create many Borrows
     * const borrow = await prisma.borrow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BorrowCreateManyArgs>(args?: SelectSubset<T, BorrowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Borrows and returns the data saved in the database.
     * @param {BorrowCreateManyAndReturnArgs} args - Arguments to create many Borrows.
     * @example
     * // Create many Borrows
     * const borrow = await prisma.borrow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Borrows and only return the `id`
     * const borrowWithIdOnly = await prisma.borrow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BorrowCreateManyAndReturnArgs>(args?: SelectSubset<T, BorrowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Borrow.
     * @param {BorrowDeleteArgs} args - Arguments to delete one Borrow.
     * @example
     * // Delete one Borrow
     * const Borrow = await prisma.borrow.delete({
     *   where: {
     *     // ... filter to delete one Borrow
     *   }
     * })
     * 
     */
    delete<T extends BorrowDeleteArgs>(args: SelectSubset<T, BorrowDeleteArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Borrow.
     * @param {BorrowUpdateArgs} args - Arguments to update one Borrow.
     * @example
     * // Update one Borrow
     * const borrow = await prisma.borrow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BorrowUpdateArgs>(args: SelectSubset<T, BorrowUpdateArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Borrows.
     * @param {BorrowDeleteManyArgs} args - Arguments to filter Borrows to delete.
     * @example
     * // Delete a few Borrows
     * const { count } = await prisma.borrow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BorrowDeleteManyArgs>(args?: SelectSubset<T, BorrowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Borrows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Borrows
     * const borrow = await prisma.borrow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BorrowUpdateManyArgs>(args: SelectSubset<T, BorrowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Borrows and returns the data updated in the database.
     * @param {BorrowUpdateManyAndReturnArgs} args - Arguments to update many Borrows.
     * @example
     * // Update many Borrows
     * const borrow = await prisma.borrow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Borrows and only return the `id`
     * const borrowWithIdOnly = await prisma.borrow.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BorrowUpdateManyAndReturnArgs>(args: SelectSubset<T, BorrowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Borrow.
     * @param {BorrowUpsertArgs} args - Arguments to update or create a Borrow.
     * @example
     * // Update or create a Borrow
     * const borrow = await prisma.borrow.upsert({
     *   create: {
     *     // ... data to create a Borrow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Borrow we want to update
     *   }
     * })
     */
    upsert<T extends BorrowUpsertArgs>(args: SelectSubset<T, BorrowUpsertArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Borrows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowCountArgs} args - Arguments to filter Borrows to count.
     * @example
     * // Count the number of Borrows
     * const count = await prisma.borrow.count({
     *   where: {
     *     // ... the filter for the Borrows we want to count
     *   }
     * })
    **/
    count<T extends BorrowCountArgs>(
      args?: Subset<T, BorrowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BorrowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Borrow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BorrowAggregateArgs>(args: Subset<T, BorrowAggregateArgs>): Prisma.PrismaPromise<GetBorrowAggregateType<T>>

    /**
     * Group by Borrow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BorrowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BorrowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BorrowGroupByArgs['orderBy'] }
        : { orderBy?: BorrowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BorrowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBorrowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Borrow model
   */
  readonly fields: BorrowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Borrow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BorrowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Member<T extends BorrowerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BorrowerDefaultArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Item<T extends ItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemDefaultArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Room<T extends Borrow$RoomArgs<ExtArgs> = {}>(args?: Subset<T, Borrow$RoomArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    return<T extends Borrow$returnArgs<ExtArgs> = {}>(args?: Subset<T, Borrow$returnArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Borrow model
   */
  interface BorrowFieldRefs {
    readonly id: FieldRef<"Borrow", 'Int'>
    readonly member_id: FieldRef<"Borrow", 'Int'>
    readonly item_id: FieldRef<"Borrow", 'Int'>
    readonly room_id: FieldRef<"Borrow", 'Int'>
    readonly b_date_borrowed: FieldRef<"Borrow", 'DateTime'>
    readonly b_date_returned: FieldRef<"Borrow", 'DateTime'>
    readonly b_due_date: FieldRef<"Borrow", 'DateTime'>
    readonly b_quantity: FieldRef<"Borrow", 'Int'>
    readonly b_status: FieldRef<"Borrow", 'Int'>
    readonly b_purpose: FieldRef<"Borrow", 'String'>
    readonly b_notes: FieldRef<"Borrow", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Borrow findUnique
   */
  export type BorrowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * Filter, which Borrow to fetch.
     */
    where: BorrowWhereUniqueInput
  }

  /**
   * Borrow findUniqueOrThrow
   */
  export type BorrowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * Filter, which Borrow to fetch.
     */
    where: BorrowWhereUniqueInput
  }

  /**
   * Borrow findFirst
   */
  export type BorrowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * Filter, which Borrow to fetch.
     */
    where?: BorrowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrows to fetch.
     */
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Borrows.
     */
    cursor?: BorrowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Borrows.
     */
    distinct?: BorrowScalarFieldEnum | BorrowScalarFieldEnum[]
  }

  /**
   * Borrow findFirstOrThrow
   */
  export type BorrowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * Filter, which Borrow to fetch.
     */
    where?: BorrowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrows to fetch.
     */
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Borrows.
     */
    cursor?: BorrowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Borrows.
     */
    distinct?: BorrowScalarFieldEnum | BorrowScalarFieldEnum[]
  }

  /**
   * Borrow findMany
   */
  export type BorrowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * Filter, which Borrows to fetch.
     */
    where?: BorrowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Borrows to fetch.
     */
    orderBy?: BorrowOrderByWithRelationInput | BorrowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Borrows.
     */
    cursor?: BorrowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Borrows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Borrows.
     */
    skip?: number
    distinct?: BorrowScalarFieldEnum | BorrowScalarFieldEnum[]
  }

  /**
   * Borrow create
   */
  export type BorrowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * The data needed to create a Borrow.
     */
    data: XOR<BorrowCreateInput, BorrowUncheckedCreateInput>
  }

  /**
   * Borrow createMany
   */
  export type BorrowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Borrows.
     */
    data: BorrowCreateManyInput | BorrowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Borrow createManyAndReturn
   */
  export type BorrowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * The data used to create many Borrows.
     */
    data: BorrowCreateManyInput | BorrowCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Borrow update
   */
  export type BorrowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * The data needed to update a Borrow.
     */
    data: XOR<BorrowUpdateInput, BorrowUncheckedUpdateInput>
    /**
     * Choose, which Borrow to update.
     */
    where: BorrowWhereUniqueInput
  }

  /**
   * Borrow updateMany
   */
  export type BorrowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Borrows.
     */
    data: XOR<BorrowUpdateManyMutationInput, BorrowUncheckedUpdateManyInput>
    /**
     * Filter which Borrows to update
     */
    where?: BorrowWhereInput
    /**
     * Limit how many Borrows to update.
     */
    limit?: number
  }

  /**
   * Borrow updateManyAndReturn
   */
  export type BorrowUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * The data used to update Borrows.
     */
    data: XOR<BorrowUpdateManyMutationInput, BorrowUncheckedUpdateManyInput>
    /**
     * Filter which Borrows to update
     */
    where?: BorrowWhereInput
    /**
     * Limit how many Borrows to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Borrow upsert
   */
  export type BorrowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * The filter to search for the Borrow to update in case it exists.
     */
    where: BorrowWhereUniqueInput
    /**
     * In case the Borrow found by the `where` argument doesn't exist, create a new Borrow with this data.
     */
    create: XOR<BorrowCreateInput, BorrowUncheckedCreateInput>
    /**
     * In case the Borrow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BorrowUpdateInput, BorrowUncheckedUpdateInput>
  }

  /**
   * Borrow delete
   */
  export type BorrowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
    /**
     * Filter which Borrow to delete.
     */
    where: BorrowWhereUniqueInput
  }

  /**
   * Borrow deleteMany
   */
  export type BorrowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Borrows to delete
     */
    where?: BorrowWhereInput
    /**
     * Limit how many Borrows to delete.
     */
    limit?: number
  }

  /**
   * Borrow.Room
   */
  export type Borrow$RoomArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    where?: RoomWhereInput
  }

  /**
   * Borrow.return
   */
  export type Borrow$returnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    where?: ReturnWhereInput
  }

  /**
   * Borrow without action
   */
  export type BorrowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Borrow
     */
    select?: BorrowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Borrow
     */
    omit?: BorrowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BorrowInclude<ExtArgs> | null
  }


  /**
   * Model Return
   */

  export type AggregateReturn = {
    _count: ReturnCountAggregateOutputType | null
    _avg: ReturnAvgAggregateOutputType | null
    _sum: ReturnSumAggregateOutputType | null
    _min: ReturnMinAggregateOutputType | null
    _max: ReturnMaxAggregateOutputType | null
  }

  export type ReturnAvgAggregateOutputType = {
    id: number | null
    borrow_id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    r_quantity: number | null
    r_late_fee: Decimal | null
    r_damage_fee: Decimal | null
  }

  export type ReturnSumAggregateOutputType = {
    id: number | null
    borrow_id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    r_quantity: number | null
    r_late_fee: Decimal | null
    r_damage_fee: Decimal | null
  }

  export type ReturnMinAggregateOutputType = {
    id: number | null
    borrow_id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    r_date_returned: Date | null
    r_quantity: number | null
    r_condition: string | null
    r_notes: string | null
    r_late_fee: Decimal | null
    r_damage_fee: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReturnMaxAggregateOutputType = {
    id: number | null
    borrow_id: number | null
    member_id: number | null
    item_id: number | null
    room_id: number | null
    r_date_returned: Date | null
    r_quantity: number | null
    r_condition: string | null
    r_notes: string | null
    r_late_fee: Decimal | null
    r_damage_fee: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReturnCountAggregateOutputType = {
    id: number
    borrow_id: number
    member_id: number
    item_id: number
    room_id: number
    r_date_returned: number
    r_quantity: number
    r_condition: number
    r_notes: number
    r_late_fee: number
    r_damage_fee: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReturnAvgAggregateInputType = {
    id?: true
    borrow_id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    r_quantity?: true
    r_late_fee?: true
    r_damage_fee?: true
  }

  export type ReturnSumAggregateInputType = {
    id?: true
    borrow_id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    r_quantity?: true
    r_late_fee?: true
    r_damage_fee?: true
  }

  export type ReturnMinAggregateInputType = {
    id?: true
    borrow_id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    r_date_returned?: true
    r_quantity?: true
    r_condition?: true
    r_notes?: true
    r_late_fee?: true
    r_damage_fee?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReturnMaxAggregateInputType = {
    id?: true
    borrow_id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    r_date_returned?: true
    r_quantity?: true
    r_condition?: true
    r_notes?: true
    r_late_fee?: true
    r_damage_fee?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReturnCountAggregateInputType = {
    id?: true
    borrow_id?: true
    member_id?: true
    item_id?: true
    room_id?: true
    r_date_returned?: true
    r_quantity?: true
    r_condition?: true
    r_notes?: true
    r_late_fee?: true
    r_damage_fee?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReturnAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Return to aggregate.
     */
    where?: ReturnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Returns to fetch.
     */
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReturnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Returns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Returns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Returns
    **/
    _count?: true | ReturnCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReturnAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReturnSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReturnMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReturnMaxAggregateInputType
  }

  export type GetReturnAggregateType<T extends ReturnAggregateArgs> = {
        [P in keyof T & keyof AggregateReturn]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReturn[P]>
      : GetScalarType<T[P], AggregateReturn[P]>
  }




  export type ReturnGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnWhereInput
    orderBy?: ReturnOrderByWithAggregationInput | ReturnOrderByWithAggregationInput[]
    by: ReturnScalarFieldEnum[] | ReturnScalarFieldEnum
    having?: ReturnScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReturnCountAggregateInputType | true
    _avg?: ReturnAvgAggregateInputType
    _sum?: ReturnSumAggregateInputType
    _min?: ReturnMinAggregateInputType
    _max?: ReturnMaxAggregateInputType
  }

  export type ReturnGroupByOutputType = {
    id: number
    borrow_id: number
    member_id: number
    item_id: number
    room_id: number | null
    r_date_returned: Date
    r_quantity: number
    r_condition: string | null
    r_notes: string | null
    r_late_fee: Decimal
    r_damage_fee: Decimal
    createdAt: Date
    updatedAt: Date
    _count: ReturnCountAggregateOutputType | null
    _avg: ReturnAvgAggregateOutputType | null
    _sum: ReturnSumAggregateOutputType | null
    _min: ReturnMinAggregateOutputType | null
    _max: ReturnMaxAggregateOutputType | null
  }

  type GetReturnGroupByPayload<T extends ReturnGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReturnGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReturnGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReturnGroupByOutputType[P]>
            : GetScalarType<T[P], ReturnGroupByOutputType[P]>
        }
      >
    >


  export type ReturnSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    borrow_id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    r_date_returned?: boolean
    r_quantity?: boolean
    r_condition?: boolean
    r_notes?: boolean
    r_late_fee?: boolean
    r_damage_fee?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Borrow?: boolean | BorrowDefaultArgs<ExtArgs>
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Return$RoomArgs<ExtArgs>
  }, ExtArgs["result"]["return"]>

  export type ReturnSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    borrow_id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    r_date_returned?: boolean
    r_quantity?: boolean
    r_condition?: boolean
    r_notes?: boolean
    r_late_fee?: boolean
    r_damage_fee?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Borrow?: boolean | BorrowDefaultArgs<ExtArgs>
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Return$RoomArgs<ExtArgs>
  }, ExtArgs["result"]["return"]>

  export type ReturnSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    borrow_id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    r_date_returned?: boolean
    r_quantity?: boolean
    r_condition?: boolean
    r_notes?: boolean
    r_late_fee?: boolean
    r_damage_fee?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Borrow?: boolean | BorrowDefaultArgs<ExtArgs>
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Return$RoomArgs<ExtArgs>
  }, ExtArgs["result"]["return"]>

  export type ReturnSelectScalar = {
    id?: boolean
    borrow_id?: boolean
    member_id?: boolean
    item_id?: boolean
    room_id?: boolean
    r_date_returned?: boolean
    r_quantity?: boolean
    r_condition?: boolean
    r_notes?: boolean
    r_late_fee?: boolean
    r_damage_fee?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReturnOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "borrow_id" | "member_id" | "item_id" | "room_id" | "r_date_returned" | "r_quantity" | "r_condition" | "r_notes" | "r_late_fee" | "r_damage_fee" | "createdAt" | "updatedAt", ExtArgs["result"]["return"]>
  export type ReturnInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Borrow?: boolean | BorrowDefaultArgs<ExtArgs>
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Return$RoomArgs<ExtArgs>
  }
  export type ReturnIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Borrow?: boolean | BorrowDefaultArgs<ExtArgs>
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Return$RoomArgs<ExtArgs>
  }
  export type ReturnIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Borrow?: boolean | BorrowDefaultArgs<ExtArgs>
    Member?: boolean | BorrowerDefaultArgs<ExtArgs>
    Item?: boolean | ItemDefaultArgs<ExtArgs>
    Room?: boolean | Return$RoomArgs<ExtArgs>
  }

  export type $ReturnPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Return"
    objects: {
      Borrow: Prisma.$BorrowPayload<ExtArgs>
      Member: Prisma.$BorrowerPayload<ExtArgs>
      Item: Prisma.$ItemPayload<ExtArgs>
      Room: Prisma.$RoomPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      borrow_id: number
      member_id: number
      item_id: number
      room_id: number | null
      r_date_returned: Date
      r_quantity: number
      /**
       * Condition of item when returned (Good, Damaged, Lost, etc.)
       */
      r_condition: string | null
      /**
       * Additional notes about the return
       */
      r_notes: string | null
      /**
       * Late fee if applicable
       */
      r_late_fee: Prisma.Decimal
      /**
       * Damage fee if applicable
       */
      r_damage_fee: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["return"]>
    composites: {}
  }

  type ReturnGetPayload<S extends boolean | null | undefined | ReturnDefaultArgs> = $Result.GetResult<Prisma.$ReturnPayload, S>

  type ReturnCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReturnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReturnCountAggregateInputType | true
    }

  export interface ReturnDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Return'], meta: { name: 'Return' } }
    /**
     * Find zero or one Return that matches the filter.
     * @param {ReturnFindUniqueArgs} args - Arguments to find a Return
     * @example
     * // Get one Return
     * const return = await prisma.return.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReturnFindUniqueArgs>(args: SelectSubset<T, ReturnFindUniqueArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Return that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReturnFindUniqueOrThrowArgs} args - Arguments to find a Return
     * @example
     * // Get one Return
     * const return = await prisma.return.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReturnFindUniqueOrThrowArgs>(args: SelectSubset<T, ReturnFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Return that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnFindFirstArgs} args - Arguments to find a Return
     * @example
     * // Get one Return
     * const return = await prisma.return.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReturnFindFirstArgs>(args?: SelectSubset<T, ReturnFindFirstArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Return that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnFindFirstOrThrowArgs} args - Arguments to find a Return
     * @example
     * // Get one Return
     * const return = await prisma.return.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReturnFindFirstOrThrowArgs>(args?: SelectSubset<T, ReturnFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Returns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Returns
     * const returns = await prisma.return.findMany()
     * 
     * // Get first 10 Returns
     * const returns = await prisma.return.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const returnWithIdOnly = await prisma.return.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReturnFindManyArgs>(args?: SelectSubset<T, ReturnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Return.
     * @param {ReturnCreateArgs} args - Arguments to create a Return.
     * @example
     * // Create one Return
     * const Return = await prisma.return.create({
     *   data: {
     *     // ... data to create a Return
     *   }
     * })
     * 
     */
    create<T extends ReturnCreateArgs>(args: SelectSubset<T, ReturnCreateArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Returns.
     * @param {ReturnCreateManyArgs} args - Arguments to create many Returns.
     * @example
     * // Create many Returns
     * const return = await prisma.return.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReturnCreateManyArgs>(args?: SelectSubset<T, ReturnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Returns and returns the data saved in the database.
     * @param {ReturnCreateManyAndReturnArgs} args - Arguments to create many Returns.
     * @example
     * // Create many Returns
     * const return = await prisma.return.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Returns and only return the `id`
     * const returnWithIdOnly = await prisma.return.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReturnCreateManyAndReturnArgs>(args?: SelectSubset<T, ReturnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Return.
     * @param {ReturnDeleteArgs} args - Arguments to delete one Return.
     * @example
     * // Delete one Return
     * const Return = await prisma.return.delete({
     *   where: {
     *     // ... filter to delete one Return
     *   }
     * })
     * 
     */
    delete<T extends ReturnDeleteArgs>(args: SelectSubset<T, ReturnDeleteArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Return.
     * @param {ReturnUpdateArgs} args - Arguments to update one Return.
     * @example
     * // Update one Return
     * const return = await prisma.return.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReturnUpdateArgs>(args: SelectSubset<T, ReturnUpdateArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Returns.
     * @param {ReturnDeleteManyArgs} args - Arguments to filter Returns to delete.
     * @example
     * // Delete a few Returns
     * const { count } = await prisma.return.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReturnDeleteManyArgs>(args?: SelectSubset<T, ReturnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Returns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Returns
     * const return = await prisma.return.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReturnUpdateManyArgs>(args: SelectSubset<T, ReturnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Returns and returns the data updated in the database.
     * @param {ReturnUpdateManyAndReturnArgs} args - Arguments to update many Returns.
     * @example
     * // Update many Returns
     * const return = await prisma.return.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Returns and only return the `id`
     * const returnWithIdOnly = await prisma.return.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReturnUpdateManyAndReturnArgs>(args: SelectSubset<T, ReturnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Return.
     * @param {ReturnUpsertArgs} args - Arguments to update or create a Return.
     * @example
     * // Update or create a Return
     * const return = await prisma.return.upsert({
     *   create: {
     *     // ... data to create a Return
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Return we want to update
     *   }
     * })
     */
    upsert<T extends ReturnUpsertArgs>(args: SelectSubset<T, ReturnUpsertArgs<ExtArgs>>): Prisma__ReturnClient<$Result.GetResult<Prisma.$ReturnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Returns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnCountArgs} args - Arguments to filter Returns to count.
     * @example
     * // Count the number of Returns
     * const count = await prisma.return.count({
     *   where: {
     *     // ... the filter for the Returns we want to count
     *   }
     * })
    **/
    count<T extends ReturnCountArgs>(
      args?: Subset<T, ReturnCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReturnCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Return.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReturnAggregateArgs>(args: Subset<T, ReturnAggregateArgs>): Prisma.PrismaPromise<GetReturnAggregateType<T>>

    /**
     * Group by Return.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReturnGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReturnGroupByArgs['orderBy'] }
        : { orderBy?: ReturnGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReturnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReturnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Return model
   */
  readonly fields: ReturnFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Return.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReturnClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Borrow<T extends BorrowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BorrowDefaultArgs<ExtArgs>>): Prisma__BorrowClient<$Result.GetResult<Prisma.$BorrowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Member<T extends BorrowerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BorrowerDefaultArgs<ExtArgs>>): Prisma__BorrowerClient<$Result.GetResult<Prisma.$BorrowerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Item<T extends ItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemDefaultArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Room<T extends Return$RoomArgs<ExtArgs> = {}>(args?: Subset<T, Return$RoomArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Return model
   */
  interface ReturnFieldRefs {
    readonly id: FieldRef<"Return", 'Int'>
    readonly borrow_id: FieldRef<"Return", 'Int'>
    readonly member_id: FieldRef<"Return", 'Int'>
    readonly item_id: FieldRef<"Return", 'Int'>
    readonly room_id: FieldRef<"Return", 'Int'>
    readonly r_date_returned: FieldRef<"Return", 'DateTime'>
    readonly r_quantity: FieldRef<"Return", 'Int'>
    readonly r_condition: FieldRef<"Return", 'String'>
    readonly r_notes: FieldRef<"Return", 'String'>
    readonly r_late_fee: FieldRef<"Return", 'Decimal'>
    readonly r_damage_fee: FieldRef<"Return", 'Decimal'>
    readonly createdAt: FieldRef<"Return", 'DateTime'>
    readonly updatedAt: FieldRef<"Return", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Return findUnique
   */
  export type ReturnFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * Filter, which Return to fetch.
     */
    where: ReturnWhereUniqueInput
  }

  /**
   * Return findUniqueOrThrow
   */
  export type ReturnFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * Filter, which Return to fetch.
     */
    where: ReturnWhereUniqueInput
  }

  /**
   * Return findFirst
   */
  export type ReturnFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * Filter, which Return to fetch.
     */
    where?: ReturnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Returns to fetch.
     */
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Returns.
     */
    cursor?: ReturnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Returns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Returns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Returns.
     */
    distinct?: ReturnScalarFieldEnum | ReturnScalarFieldEnum[]
  }

  /**
   * Return findFirstOrThrow
   */
  export type ReturnFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * Filter, which Return to fetch.
     */
    where?: ReturnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Returns to fetch.
     */
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Returns.
     */
    cursor?: ReturnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Returns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Returns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Returns.
     */
    distinct?: ReturnScalarFieldEnum | ReturnScalarFieldEnum[]
  }

  /**
   * Return findMany
   */
  export type ReturnFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * Filter, which Returns to fetch.
     */
    where?: ReturnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Returns to fetch.
     */
    orderBy?: ReturnOrderByWithRelationInput | ReturnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Returns.
     */
    cursor?: ReturnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Returns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Returns.
     */
    skip?: number
    distinct?: ReturnScalarFieldEnum | ReturnScalarFieldEnum[]
  }

  /**
   * Return create
   */
  export type ReturnCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * The data needed to create a Return.
     */
    data: XOR<ReturnCreateInput, ReturnUncheckedCreateInput>
  }

  /**
   * Return createMany
   */
  export type ReturnCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Returns.
     */
    data: ReturnCreateManyInput | ReturnCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Return createManyAndReturn
   */
  export type ReturnCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * The data used to create many Returns.
     */
    data: ReturnCreateManyInput | ReturnCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Return update
   */
  export type ReturnUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * The data needed to update a Return.
     */
    data: XOR<ReturnUpdateInput, ReturnUncheckedUpdateInput>
    /**
     * Choose, which Return to update.
     */
    where: ReturnWhereUniqueInput
  }

  /**
   * Return updateMany
   */
  export type ReturnUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Returns.
     */
    data: XOR<ReturnUpdateManyMutationInput, ReturnUncheckedUpdateManyInput>
    /**
     * Filter which Returns to update
     */
    where?: ReturnWhereInput
    /**
     * Limit how many Returns to update.
     */
    limit?: number
  }

  /**
   * Return updateManyAndReturn
   */
  export type ReturnUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * The data used to update Returns.
     */
    data: XOR<ReturnUpdateManyMutationInput, ReturnUncheckedUpdateManyInput>
    /**
     * Filter which Returns to update
     */
    where?: ReturnWhereInput
    /**
     * Limit how many Returns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Return upsert
   */
  export type ReturnUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * The filter to search for the Return to update in case it exists.
     */
    where: ReturnWhereUniqueInput
    /**
     * In case the Return found by the `where` argument doesn't exist, create a new Return with this data.
     */
    create: XOR<ReturnCreateInput, ReturnUncheckedCreateInput>
    /**
     * In case the Return was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReturnUpdateInput, ReturnUncheckedUpdateInput>
  }

  /**
   * Return delete
   */
  export type ReturnDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
    /**
     * Filter which Return to delete.
     */
    where: ReturnWhereUniqueInput
  }

  /**
   * Return deleteMany
   */
  export type ReturnDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Returns to delete
     */
    where?: ReturnWhereInput
    /**
     * Limit how many Returns to delete.
     */
    limit?: number
  }

  /**
   * Return.Room
   */
  export type Return$RoomArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    where?: RoomWhereInput
  }

  /**
   * Return without action
   */
  export type ReturnDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Return
     */
    select?: ReturnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Return
     */
    omit?: ReturnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    username: 'username',
    password: 'password',
    email: 'email',
    id_number: 'id_number',
    role: 'role',
    status: 'status'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BorrowerScalarFieldEnum: {
    id: 'id',
    m_school_id: 'm_school_id',
    m_fname: 'm_fname',
    m_lname: 'm_lname',
    m_gender: 'm_gender',
    m_contact: 'm_contact',
    m_department: 'm_department',
    m_year_section: 'm_year_section',
    m_type: 'm_type',
    m_password: 'm_password',
    m_status: 'm_status'
  };

  export type BorrowerScalarFieldEnum = (typeof BorrowerScalarFieldEnum)[keyof typeof BorrowerScalarFieldEnum]


  export const ItemScalarFieldEnum: {
    id: 'id',
    i_deviceID: 'i_deviceID',
    i_model: 'i_model',
    i_category: 'i_category',
    i_brand: 'i_brand',
    i_description: 'i_description',
    i_type: 'i_type',
    item_rawstock: 'item_rawstock',
    i_status: 'i_status',
    i_mr: 'i_mr',
    i_price: 'i_price',
    i_photo: 'i_photo',
    no_of_items: 'no_of_items',
    remarks: 'remarks'
  };

  export type ItemScalarFieldEnum = (typeof ItemScalarFieldEnum)[keyof typeof ItemScalarFieldEnum]


  export const RoomScalarFieldEnum: {
    id: 'id',
    r_name: 'r_name',
    r_description: 'r_description',
    r_status: 'r_status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoomScalarFieldEnum = (typeof RoomScalarFieldEnum)[keyof typeof RoomScalarFieldEnum]


  export const BorrowScalarFieldEnum: {
    id: 'id',
    member_id: 'member_id',
    item_id: 'item_id',
    room_id: 'room_id',
    b_date_borrowed: 'b_date_borrowed',
    b_date_returned: 'b_date_returned',
    b_due_date: 'b_due_date',
    b_quantity: 'b_quantity',
    b_status: 'b_status',
    b_purpose: 'b_purpose',
    b_notes: 'b_notes'
  };

  export type BorrowScalarFieldEnum = (typeof BorrowScalarFieldEnum)[keyof typeof BorrowScalarFieldEnum]


  export const ReturnScalarFieldEnum: {
    id: 'id',
    borrow_id: 'borrow_id',
    member_id: 'member_id',
    item_id: 'item_id',
    room_id: 'room_id',
    r_date_returned: 'r_date_returned',
    r_quantity: 'r_quantity',
    r_condition: 'r_condition',
    r_notes: 'r_notes',
    r_late_fee: 'r_late_fee',
    r_damage_fee: 'r_damage_fee',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReturnScalarFieldEnum = (typeof ReturnScalarFieldEnum)[keyof typeof ReturnScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    id_number?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: IntFilter<"User"> | number
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrderInput | SortOrder
    id_number?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    email?: string
    id_number?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: IntFilter<"User"> | number
  }, "id" | "username" | "email" | "id_number">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrderInput | SortOrder
    id_number?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    id_number?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    status?: IntWithAggregatesFilter<"User"> | number
  }

  export type BorrowerWhereInput = {
    AND?: BorrowerWhereInput | BorrowerWhereInput[]
    OR?: BorrowerWhereInput[]
    NOT?: BorrowerWhereInput | BorrowerWhereInput[]
    id?: IntFilter<"Borrower"> | number
    m_school_id?: StringFilter<"Borrower"> | string
    m_fname?: StringFilter<"Borrower"> | string
    m_lname?: StringFilter<"Borrower"> | string
    m_gender?: StringFilter<"Borrower"> | string
    m_contact?: StringFilter<"Borrower"> | string
    m_department?: StringFilter<"Borrower"> | string
    m_year_section?: StringFilter<"Borrower"> | string
    m_type?: IntFilter<"Borrower"> | number
    m_password?: StringFilter<"Borrower"> | string
    m_status?: IntFilter<"Borrower"> | number
    borrows?: BorrowListRelationFilter
    returns?: ReturnListRelationFilter
  }

  export type BorrowerOrderByWithRelationInput = {
    id?: SortOrder
    m_school_id?: SortOrder
    m_fname?: SortOrder
    m_lname?: SortOrder
    m_gender?: SortOrder
    m_contact?: SortOrder
    m_department?: SortOrder
    m_year_section?: SortOrder
    m_type?: SortOrder
    m_password?: SortOrder
    m_status?: SortOrder
    borrows?: BorrowOrderByRelationAggregateInput
    returns?: ReturnOrderByRelationAggregateInput
  }

  export type BorrowerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    m_school_id?: string
    AND?: BorrowerWhereInput | BorrowerWhereInput[]
    OR?: BorrowerWhereInput[]
    NOT?: BorrowerWhereInput | BorrowerWhereInput[]
    m_fname?: StringFilter<"Borrower"> | string
    m_lname?: StringFilter<"Borrower"> | string
    m_gender?: StringFilter<"Borrower"> | string
    m_contact?: StringFilter<"Borrower"> | string
    m_department?: StringFilter<"Borrower"> | string
    m_year_section?: StringFilter<"Borrower"> | string
    m_type?: IntFilter<"Borrower"> | number
    m_password?: StringFilter<"Borrower"> | string
    m_status?: IntFilter<"Borrower"> | number
    borrows?: BorrowListRelationFilter
    returns?: ReturnListRelationFilter
  }, "id" | "m_school_id">

  export type BorrowerOrderByWithAggregationInput = {
    id?: SortOrder
    m_school_id?: SortOrder
    m_fname?: SortOrder
    m_lname?: SortOrder
    m_gender?: SortOrder
    m_contact?: SortOrder
    m_department?: SortOrder
    m_year_section?: SortOrder
    m_type?: SortOrder
    m_password?: SortOrder
    m_status?: SortOrder
    _count?: BorrowerCountOrderByAggregateInput
    _avg?: BorrowerAvgOrderByAggregateInput
    _max?: BorrowerMaxOrderByAggregateInput
    _min?: BorrowerMinOrderByAggregateInput
    _sum?: BorrowerSumOrderByAggregateInput
  }

  export type BorrowerScalarWhereWithAggregatesInput = {
    AND?: BorrowerScalarWhereWithAggregatesInput | BorrowerScalarWhereWithAggregatesInput[]
    OR?: BorrowerScalarWhereWithAggregatesInput[]
    NOT?: BorrowerScalarWhereWithAggregatesInput | BorrowerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Borrower"> | number
    m_school_id?: StringWithAggregatesFilter<"Borrower"> | string
    m_fname?: StringWithAggregatesFilter<"Borrower"> | string
    m_lname?: StringWithAggregatesFilter<"Borrower"> | string
    m_gender?: StringWithAggregatesFilter<"Borrower"> | string
    m_contact?: StringWithAggregatesFilter<"Borrower"> | string
    m_department?: StringWithAggregatesFilter<"Borrower"> | string
    m_year_section?: StringWithAggregatesFilter<"Borrower"> | string
    m_type?: IntWithAggregatesFilter<"Borrower"> | number
    m_password?: StringWithAggregatesFilter<"Borrower"> | string
    m_status?: IntWithAggregatesFilter<"Borrower"> | number
  }

  export type ItemWhereInput = {
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    id?: IntFilter<"Item"> | number
    i_deviceID?: StringFilter<"Item"> | string
    i_model?: StringFilter<"Item"> | string
    i_category?: StringFilter<"Item"> | string
    i_brand?: StringFilter<"Item"> | string
    i_description?: StringFilter<"Item"> | string
    i_type?: StringFilter<"Item"> | string
    item_rawstock?: IntFilter<"Item"> | number
    i_status?: IntFilter<"Item"> | number
    i_mr?: StringFilter<"Item"> | string
    i_price?: DecimalFilter<"Item"> | Decimal | DecimalJsLike | number | string
    i_photo?: StringFilter<"Item"> | string
    no_of_items?: IntNullableFilter<"Item"> | number | null
    remarks?: StringNullableFilter<"Item"> | string | null
    borrows?: BorrowListRelationFilter
    returns?: ReturnListRelationFilter
  }

  export type ItemOrderByWithRelationInput = {
    id?: SortOrder
    i_deviceID?: SortOrder
    i_model?: SortOrder
    i_category?: SortOrder
    i_brand?: SortOrder
    i_description?: SortOrder
    i_type?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_mr?: SortOrder
    i_price?: SortOrder
    i_photo?: SortOrder
    no_of_items?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    borrows?: BorrowOrderByRelationAggregateInput
    returns?: ReturnOrderByRelationAggregateInput
  }

  export type ItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    i_deviceID?: string
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    i_model?: StringFilter<"Item"> | string
    i_category?: StringFilter<"Item"> | string
    i_brand?: StringFilter<"Item"> | string
    i_description?: StringFilter<"Item"> | string
    i_type?: StringFilter<"Item"> | string
    item_rawstock?: IntFilter<"Item"> | number
    i_status?: IntFilter<"Item"> | number
    i_mr?: StringFilter<"Item"> | string
    i_price?: DecimalFilter<"Item"> | Decimal | DecimalJsLike | number | string
    i_photo?: StringFilter<"Item"> | string
    no_of_items?: IntNullableFilter<"Item"> | number | null
    remarks?: StringNullableFilter<"Item"> | string | null
    borrows?: BorrowListRelationFilter
    returns?: ReturnListRelationFilter
  }, "id" | "i_deviceID">

  export type ItemOrderByWithAggregationInput = {
    id?: SortOrder
    i_deviceID?: SortOrder
    i_model?: SortOrder
    i_category?: SortOrder
    i_brand?: SortOrder
    i_description?: SortOrder
    i_type?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_mr?: SortOrder
    i_price?: SortOrder
    i_photo?: SortOrder
    no_of_items?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    _count?: ItemCountOrderByAggregateInput
    _avg?: ItemAvgOrderByAggregateInput
    _max?: ItemMaxOrderByAggregateInput
    _min?: ItemMinOrderByAggregateInput
    _sum?: ItemSumOrderByAggregateInput
  }

  export type ItemScalarWhereWithAggregatesInput = {
    AND?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    OR?: ItemScalarWhereWithAggregatesInput[]
    NOT?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Item"> | number
    i_deviceID?: StringWithAggregatesFilter<"Item"> | string
    i_model?: StringWithAggregatesFilter<"Item"> | string
    i_category?: StringWithAggregatesFilter<"Item"> | string
    i_brand?: StringWithAggregatesFilter<"Item"> | string
    i_description?: StringWithAggregatesFilter<"Item"> | string
    i_type?: StringWithAggregatesFilter<"Item"> | string
    item_rawstock?: IntWithAggregatesFilter<"Item"> | number
    i_status?: IntWithAggregatesFilter<"Item"> | number
    i_mr?: StringWithAggregatesFilter<"Item"> | string
    i_price?: DecimalWithAggregatesFilter<"Item"> | Decimal | DecimalJsLike | number | string
    i_photo?: StringWithAggregatesFilter<"Item"> | string
    no_of_items?: IntNullableWithAggregatesFilter<"Item"> | number | null
    remarks?: StringNullableWithAggregatesFilter<"Item"> | string | null
  }

  export type RoomWhereInput = {
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    id?: IntFilter<"Room"> | number
    r_name?: StringFilter<"Room"> | string
    r_description?: StringNullableFilter<"Room"> | string | null
    r_status?: IntFilter<"Room"> | number
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    borrows?: BorrowListRelationFilter
    returns?: ReturnListRelationFilter
  }

  export type RoomOrderByWithRelationInput = {
    id?: SortOrder
    r_name?: SortOrder
    r_description?: SortOrderInput | SortOrder
    r_status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    borrows?: BorrowOrderByRelationAggregateInput
    returns?: ReturnOrderByRelationAggregateInput
  }

  export type RoomWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    r_name?: StringFilter<"Room"> | string
    r_description?: StringNullableFilter<"Room"> | string | null
    r_status?: IntFilter<"Room"> | number
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    borrows?: BorrowListRelationFilter
    returns?: ReturnListRelationFilter
  }, "id">

  export type RoomOrderByWithAggregationInput = {
    id?: SortOrder
    r_name?: SortOrder
    r_description?: SortOrderInput | SortOrder
    r_status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoomCountOrderByAggregateInput
    _avg?: RoomAvgOrderByAggregateInput
    _max?: RoomMaxOrderByAggregateInput
    _min?: RoomMinOrderByAggregateInput
    _sum?: RoomSumOrderByAggregateInput
  }

  export type RoomScalarWhereWithAggregatesInput = {
    AND?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    OR?: RoomScalarWhereWithAggregatesInput[]
    NOT?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Room"> | number
    r_name?: StringWithAggregatesFilter<"Room"> | string
    r_description?: StringNullableWithAggregatesFilter<"Room"> | string | null
    r_status?: IntWithAggregatesFilter<"Room"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Room"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Room"> | Date | string
  }

  export type BorrowWhereInput = {
    AND?: BorrowWhereInput | BorrowWhereInput[]
    OR?: BorrowWhereInput[]
    NOT?: BorrowWhereInput | BorrowWhereInput[]
    id?: IntFilter<"Borrow"> | number
    member_id?: IntFilter<"Borrow"> | number
    item_id?: IntFilter<"Borrow"> | number
    room_id?: IntNullableFilter<"Borrow"> | number | null
    b_date_borrowed?: DateTimeFilter<"Borrow"> | Date | string
    b_date_returned?: DateTimeNullableFilter<"Borrow"> | Date | string | null
    b_due_date?: DateTimeFilter<"Borrow"> | Date | string
    b_quantity?: IntFilter<"Borrow"> | number
    b_status?: IntFilter<"Borrow"> | number
    b_purpose?: StringNullableFilter<"Borrow"> | string | null
    b_notes?: StringNullableFilter<"Borrow"> | string | null
    Member?: XOR<BorrowerScalarRelationFilter, BorrowerWhereInput>
    Item?: XOR<ItemScalarRelationFilter, ItemWhereInput>
    Room?: XOR<RoomNullableScalarRelationFilter, RoomWhereInput> | null
    return?: XOR<ReturnNullableScalarRelationFilter, ReturnWhereInput> | null
  }

  export type BorrowOrderByWithRelationInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrderInput | SortOrder
    b_date_borrowed?: SortOrder
    b_date_returned?: SortOrderInput | SortOrder
    b_due_date?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
    b_purpose?: SortOrderInput | SortOrder
    b_notes?: SortOrderInput | SortOrder
    Member?: BorrowerOrderByWithRelationInput
    Item?: ItemOrderByWithRelationInput
    Room?: RoomOrderByWithRelationInput
    return?: ReturnOrderByWithRelationInput
  }

  export type BorrowWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BorrowWhereInput | BorrowWhereInput[]
    OR?: BorrowWhereInput[]
    NOT?: BorrowWhereInput | BorrowWhereInput[]
    member_id?: IntFilter<"Borrow"> | number
    item_id?: IntFilter<"Borrow"> | number
    room_id?: IntNullableFilter<"Borrow"> | number | null
    b_date_borrowed?: DateTimeFilter<"Borrow"> | Date | string
    b_date_returned?: DateTimeNullableFilter<"Borrow"> | Date | string | null
    b_due_date?: DateTimeFilter<"Borrow"> | Date | string
    b_quantity?: IntFilter<"Borrow"> | number
    b_status?: IntFilter<"Borrow"> | number
    b_purpose?: StringNullableFilter<"Borrow"> | string | null
    b_notes?: StringNullableFilter<"Borrow"> | string | null
    Member?: XOR<BorrowerScalarRelationFilter, BorrowerWhereInput>
    Item?: XOR<ItemScalarRelationFilter, ItemWhereInput>
    Room?: XOR<RoomNullableScalarRelationFilter, RoomWhereInput> | null
    return?: XOR<ReturnNullableScalarRelationFilter, ReturnWhereInput> | null
  }, "id">

  export type BorrowOrderByWithAggregationInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrderInput | SortOrder
    b_date_borrowed?: SortOrder
    b_date_returned?: SortOrderInput | SortOrder
    b_due_date?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
    b_purpose?: SortOrderInput | SortOrder
    b_notes?: SortOrderInput | SortOrder
    _count?: BorrowCountOrderByAggregateInput
    _avg?: BorrowAvgOrderByAggregateInput
    _max?: BorrowMaxOrderByAggregateInput
    _min?: BorrowMinOrderByAggregateInput
    _sum?: BorrowSumOrderByAggregateInput
  }

  export type BorrowScalarWhereWithAggregatesInput = {
    AND?: BorrowScalarWhereWithAggregatesInput | BorrowScalarWhereWithAggregatesInput[]
    OR?: BorrowScalarWhereWithAggregatesInput[]
    NOT?: BorrowScalarWhereWithAggregatesInput | BorrowScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Borrow"> | number
    member_id?: IntWithAggregatesFilter<"Borrow"> | number
    item_id?: IntWithAggregatesFilter<"Borrow"> | number
    room_id?: IntNullableWithAggregatesFilter<"Borrow"> | number | null
    b_date_borrowed?: DateTimeWithAggregatesFilter<"Borrow"> | Date | string
    b_date_returned?: DateTimeNullableWithAggregatesFilter<"Borrow"> | Date | string | null
    b_due_date?: DateTimeWithAggregatesFilter<"Borrow"> | Date | string
    b_quantity?: IntWithAggregatesFilter<"Borrow"> | number
    b_status?: IntWithAggregatesFilter<"Borrow"> | number
    b_purpose?: StringNullableWithAggregatesFilter<"Borrow"> | string | null
    b_notes?: StringNullableWithAggregatesFilter<"Borrow"> | string | null
  }

  export type ReturnWhereInput = {
    AND?: ReturnWhereInput | ReturnWhereInput[]
    OR?: ReturnWhereInput[]
    NOT?: ReturnWhereInput | ReturnWhereInput[]
    id?: IntFilter<"Return"> | number
    borrow_id?: IntFilter<"Return"> | number
    member_id?: IntFilter<"Return"> | number
    item_id?: IntFilter<"Return"> | number
    room_id?: IntNullableFilter<"Return"> | number | null
    r_date_returned?: DateTimeFilter<"Return"> | Date | string
    r_quantity?: IntFilter<"Return"> | number
    r_condition?: StringNullableFilter<"Return"> | string | null
    r_notes?: StringNullableFilter<"Return"> | string | null
    r_late_fee?: DecimalFilter<"Return"> | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFilter<"Return"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Return"> | Date | string
    updatedAt?: DateTimeFilter<"Return"> | Date | string
    Borrow?: XOR<BorrowScalarRelationFilter, BorrowWhereInput>
    Member?: XOR<BorrowerScalarRelationFilter, BorrowerWhereInput>
    Item?: XOR<ItemScalarRelationFilter, ItemWhereInput>
    Room?: XOR<RoomNullableScalarRelationFilter, RoomWhereInput> | null
  }

  export type ReturnOrderByWithRelationInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrderInput | SortOrder
    r_date_returned?: SortOrder
    r_quantity?: SortOrder
    r_condition?: SortOrderInput | SortOrder
    r_notes?: SortOrderInput | SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Borrow?: BorrowOrderByWithRelationInput
    Member?: BorrowerOrderByWithRelationInput
    Item?: ItemOrderByWithRelationInput
    Room?: RoomOrderByWithRelationInput
  }

  export type ReturnWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    borrow_id?: number
    AND?: ReturnWhereInput | ReturnWhereInput[]
    OR?: ReturnWhereInput[]
    NOT?: ReturnWhereInput | ReturnWhereInput[]
    member_id?: IntFilter<"Return"> | number
    item_id?: IntFilter<"Return"> | number
    room_id?: IntNullableFilter<"Return"> | number | null
    r_date_returned?: DateTimeFilter<"Return"> | Date | string
    r_quantity?: IntFilter<"Return"> | number
    r_condition?: StringNullableFilter<"Return"> | string | null
    r_notes?: StringNullableFilter<"Return"> | string | null
    r_late_fee?: DecimalFilter<"Return"> | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFilter<"Return"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Return"> | Date | string
    updatedAt?: DateTimeFilter<"Return"> | Date | string
    Borrow?: XOR<BorrowScalarRelationFilter, BorrowWhereInput>
    Member?: XOR<BorrowerScalarRelationFilter, BorrowerWhereInput>
    Item?: XOR<ItemScalarRelationFilter, ItemWhereInput>
    Room?: XOR<RoomNullableScalarRelationFilter, RoomWhereInput> | null
  }, "id" | "borrow_id">

  export type ReturnOrderByWithAggregationInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrderInput | SortOrder
    r_date_returned?: SortOrder
    r_quantity?: SortOrder
    r_condition?: SortOrderInput | SortOrder
    r_notes?: SortOrderInput | SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReturnCountOrderByAggregateInput
    _avg?: ReturnAvgOrderByAggregateInput
    _max?: ReturnMaxOrderByAggregateInput
    _min?: ReturnMinOrderByAggregateInput
    _sum?: ReturnSumOrderByAggregateInput
  }

  export type ReturnScalarWhereWithAggregatesInput = {
    AND?: ReturnScalarWhereWithAggregatesInput | ReturnScalarWhereWithAggregatesInput[]
    OR?: ReturnScalarWhereWithAggregatesInput[]
    NOT?: ReturnScalarWhereWithAggregatesInput | ReturnScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Return"> | number
    borrow_id?: IntWithAggregatesFilter<"Return"> | number
    member_id?: IntWithAggregatesFilter<"Return"> | number
    item_id?: IntWithAggregatesFilter<"Return"> | number
    room_id?: IntNullableWithAggregatesFilter<"Return"> | number | null
    r_date_returned?: DateTimeWithAggregatesFilter<"Return"> | Date | string
    r_quantity?: IntWithAggregatesFilter<"Return"> | number
    r_condition?: StringNullableWithAggregatesFilter<"Return"> | string | null
    r_notes?: StringNullableWithAggregatesFilter<"Return"> | string | null
    r_late_fee?: DecimalWithAggregatesFilter<"Return"> | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalWithAggregatesFilter<"Return"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Return"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Return"> | Date | string
  }

  export type UserCreateInput = {
    name: string
    username: string
    password: string
    email?: string | null
    id_number?: string | null
    role?: $Enums.Role
    status?: number
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name: string
    username: string
    password: string
    email?: string | null
    id_number?: string | null
    role?: $Enums.Role
    status?: number
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    id_number?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    id_number?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateManyInput = {
    id?: number
    name: string
    username: string
    password: string
    email?: string | null
    id_number?: string | null
    role?: $Enums.Role
    status?: number
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    id_number?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    id_number?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: IntFieldUpdateOperationsInput | number
  }

  export type BorrowerCreateInput = {
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
    borrows?: BorrowCreateNestedManyWithoutMemberInput
    returns?: ReturnCreateNestedManyWithoutMemberInput
  }

  export type BorrowerUncheckedCreateInput = {
    id?: number
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
    borrows?: BorrowUncheckedCreateNestedManyWithoutMemberInput
    returns?: ReturnUncheckedCreateNestedManyWithoutMemberInput
  }

  export type BorrowerUpdateInput = {
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
    borrows?: BorrowUpdateManyWithoutMemberNestedInput
    returns?: ReturnUpdateManyWithoutMemberNestedInput
  }

  export type BorrowerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
    borrows?: BorrowUncheckedUpdateManyWithoutMemberNestedInput
    returns?: ReturnUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type BorrowerCreateManyInput = {
    id?: number
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
  }

  export type BorrowerUpdateManyMutationInput = {
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
  }

  export type BorrowerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
  }

  export type ItemCreateInput = {
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
    borrows?: BorrowCreateNestedManyWithoutItemInput
    returns?: ReturnCreateNestedManyWithoutItemInput
  }

  export type ItemUncheckedCreateInput = {
    id?: number
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
    borrows?: BorrowUncheckedCreateNestedManyWithoutItemInput
    returns?: ReturnUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemUpdateInput = {
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    borrows?: BorrowUpdateManyWithoutItemNestedInput
    returns?: ReturnUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    borrows?: BorrowUncheckedUpdateManyWithoutItemNestedInput
    returns?: ReturnUncheckedUpdateManyWithoutItemNestedInput
  }

  export type ItemCreateManyInput = {
    id?: number
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
  }

  export type ItemUpdateManyMutationInput = {
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoomCreateInput = {
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    borrows?: BorrowCreateNestedManyWithoutRoomInput
    returns?: ReturnCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateInput = {
    id?: number
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    borrows?: BorrowUncheckedCreateNestedManyWithoutRoomInput
    returns?: ReturnUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomUpdateInput = {
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    borrows?: BorrowUpdateManyWithoutRoomNestedInput
    returns?: ReturnUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    borrows?: BorrowUncheckedUpdateManyWithoutRoomNestedInput
    returns?: ReturnUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomCreateManyInput = {
    id?: number
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomUpdateManyMutationInput = {
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BorrowCreateInput = {
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    Member: BorrowerCreateNestedOneWithoutBorrowsInput
    Item: ItemCreateNestedOneWithoutBorrowsInput
    Room?: RoomCreateNestedOneWithoutBorrowsInput
    return?: ReturnCreateNestedOneWithoutBorrowInput
  }

  export type BorrowUncheckedCreateInput = {
    id?: number
    member_id: number
    item_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    return?: ReturnUncheckedCreateNestedOneWithoutBorrowInput
  }

  export type BorrowUpdateInput = {
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    Member?: BorrowerUpdateOneRequiredWithoutBorrowsNestedInput
    Item?: ItemUpdateOneRequiredWithoutBorrowsNestedInput
    Room?: RoomUpdateOneWithoutBorrowsNestedInput
    return?: ReturnUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    return?: ReturnUncheckedUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowCreateManyInput = {
    id?: number
    member_id: number
    item_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
  }

  export type BorrowUpdateManyMutationInput = {
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BorrowUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReturnCreateInput = {
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    Borrow: BorrowCreateNestedOneWithoutReturnInput
    Member: BorrowerCreateNestedOneWithoutReturnsInput
    Item: ItemCreateNestedOneWithoutReturnsInput
    Room?: RoomCreateNestedOneWithoutReturnsInput
  }

  export type ReturnUncheckedCreateInput = {
    id?: number
    borrow_id: number
    member_id: number
    item_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnUpdateInput = {
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Borrow?: BorrowUpdateOneRequiredWithoutReturnNestedInput
    Member?: BorrowerUpdateOneRequiredWithoutReturnsNestedInput
    Item?: ItemUpdateOneRequiredWithoutReturnsNestedInput
    Room?: RoomUpdateOneWithoutReturnsNestedInput
  }

  export type ReturnUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnCreateManyInput = {
    id?: number
    borrow_id: number
    member_id: number
    item_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnUpdateManyMutationInput = {
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    id_number?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    id_number?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    password?: SortOrder
    email?: SortOrder
    id_number?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BorrowListRelationFilter = {
    every?: BorrowWhereInput
    some?: BorrowWhereInput
    none?: BorrowWhereInput
  }

  export type ReturnListRelationFilter = {
    every?: ReturnWhereInput
    some?: ReturnWhereInput
    none?: ReturnWhereInput
  }

  export type BorrowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReturnOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BorrowerCountOrderByAggregateInput = {
    id?: SortOrder
    m_school_id?: SortOrder
    m_fname?: SortOrder
    m_lname?: SortOrder
    m_gender?: SortOrder
    m_contact?: SortOrder
    m_department?: SortOrder
    m_year_section?: SortOrder
    m_type?: SortOrder
    m_password?: SortOrder
    m_status?: SortOrder
  }

  export type BorrowerAvgOrderByAggregateInput = {
    id?: SortOrder
    m_type?: SortOrder
    m_status?: SortOrder
  }

  export type BorrowerMaxOrderByAggregateInput = {
    id?: SortOrder
    m_school_id?: SortOrder
    m_fname?: SortOrder
    m_lname?: SortOrder
    m_gender?: SortOrder
    m_contact?: SortOrder
    m_department?: SortOrder
    m_year_section?: SortOrder
    m_type?: SortOrder
    m_password?: SortOrder
    m_status?: SortOrder
  }

  export type BorrowerMinOrderByAggregateInput = {
    id?: SortOrder
    m_school_id?: SortOrder
    m_fname?: SortOrder
    m_lname?: SortOrder
    m_gender?: SortOrder
    m_contact?: SortOrder
    m_department?: SortOrder
    m_year_section?: SortOrder
    m_type?: SortOrder
    m_password?: SortOrder
    m_status?: SortOrder
  }

  export type BorrowerSumOrderByAggregateInput = {
    id?: SortOrder
    m_type?: SortOrder
    m_status?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ItemCountOrderByAggregateInput = {
    id?: SortOrder
    i_deviceID?: SortOrder
    i_model?: SortOrder
    i_category?: SortOrder
    i_brand?: SortOrder
    i_description?: SortOrder
    i_type?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_mr?: SortOrder
    i_price?: SortOrder
    i_photo?: SortOrder
    no_of_items?: SortOrder
    remarks?: SortOrder
  }

  export type ItemAvgOrderByAggregateInput = {
    id?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_price?: SortOrder
    no_of_items?: SortOrder
  }

  export type ItemMaxOrderByAggregateInput = {
    id?: SortOrder
    i_deviceID?: SortOrder
    i_model?: SortOrder
    i_category?: SortOrder
    i_brand?: SortOrder
    i_description?: SortOrder
    i_type?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_mr?: SortOrder
    i_price?: SortOrder
    i_photo?: SortOrder
    no_of_items?: SortOrder
    remarks?: SortOrder
  }

  export type ItemMinOrderByAggregateInput = {
    id?: SortOrder
    i_deviceID?: SortOrder
    i_model?: SortOrder
    i_category?: SortOrder
    i_brand?: SortOrder
    i_description?: SortOrder
    i_type?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_mr?: SortOrder
    i_price?: SortOrder
    i_photo?: SortOrder
    no_of_items?: SortOrder
    remarks?: SortOrder
  }

  export type ItemSumOrderByAggregateInput = {
    id?: SortOrder
    item_rawstock?: SortOrder
    i_status?: SortOrder
    i_price?: SortOrder
    no_of_items?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RoomCountOrderByAggregateInput = {
    id?: SortOrder
    r_name?: SortOrder
    r_description?: SortOrder
    r_status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomAvgOrderByAggregateInput = {
    id?: SortOrder
    r_status?: SortOrder
  }

  export type RoomMaxOrderByAggregateInput = {
    id?: SortOrder
    r_name?: SortOrder
    r_description?: SortOrder
    r_status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomMinOrderByAggregateInput = {
    id?: SortOrder
    r_name?: SortOrder
    r_description?: SortOrder
    r_status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomSumOrderByAggregateInput = {
    id?: SortOrder
    r_status?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BorrowerScalarRelationFilter = {
    is?: BorrowerWhereInput
    isNot?: BorrowerWhereInput
  }

  export type ItemScalarRelationFilter = {
    is?: ItemWhereInput
    isNot?: ItemWhereInput
  }

  export type RoomNullableScalarRelationFilter = {
    is?: RoomWhereInput | null
    isNot?: RoomWhereInput | null
  }

  export type ReturnNullableScalarRelationFilter = {
    is?: ReturnWhereInput | null
    isNot?: ReturnWhereInput | null
  }

  export type BorrowCountOrderByAggregateInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    b_date_borrowed?: SortOrder
    b_date_returned?: SortOrder
    b_due_date?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
    b_purpose?: SortOrder
    b_notes?: SortOrder
  }

  export type BorrowAvgOrderByAggregateInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
  }

  export type BorrowMaxOrderByAggregateInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    b_date_borrowed?: SortOrder
    b_date_returned?: SortOrder
    b_due_date?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
    b_purpose?: SortOrder
    b_notes?: SortOrder
  }

  export type BorrowMinOrderByAggregateInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    b_date_borrowed?: SortOrder
    b_date_returned?: SortOrder
    b_due_date?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
    b_purpose?: SortOrder
    b_notes?: SortOrder
  }

  export type BorrowSumOrderByAggregateInput = {
    id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    b_quantity?: SortOrder
    b_status?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BorrowScalarRelationFilter = {
    is?: BorrowWhereInput
    isNot?: BorrowWhereInput
  }

  export type ReturnCountOrderByAggregateInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    r_date_returned?: SortOrder
    r_quantity?: SortOrder
    r_condition?: SortOrder
    r_notes?: SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReturnAvgOrderByAggregateInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    r_quantity?: SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
  }

  export type ReturnMaxOrderByAggregateInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    r_date_returned?: SortOrder
    r_quantity?: SortOrder
    r_condition?: SortOrder
    r_notes?: SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReturnMinOrderByAggregateInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    r_date_returned?: SortOrder
    r_quantity?: SortOrder
    r_condition?: SortOrder
    r_notes?: SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReturnSumOrderByAggregateInput = {
    id?: SortOrder
    borrow_id?: SortOrder
    member_id?: SortOrder
    item_id?: SortOrder
    room_id?: SortOrder
    r_quantity?: SortOrder
    r_late_fee?: SortOrder
    r_damage_fee?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BorrowCreateNestedManyWithoutMemberInput = {
    create?: XOR<BorrowCreateWithoutMemberInput, BorrowUncheckedCreateWithoutMemberInput> | BorrowCreateWithoutMemberInput[] | BorrowUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutMemberInput | BorrowCreateOrConnectWithoutMemberInput[]
    createMany?: BorrowCreateManyMemberInputEnvelope
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
  }

  export type ReturnCreateNestedManyWithoutMemberInput = {
    create?: XOR<ReturnCreateWithoutMemberInput, ReturnUncheckedCreateWithoutMemberInput> | ReturnCreateWithoutMemberInput[] | ReturnUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutMemberInput | ReturnCreateOrConnectWithoutMemberInput[]
    createMany?: ReturnCreateManyMemberInputEnvelope
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
  }

  export type BorrowUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<BorrowCreateWithoutMemberInput, BorrowUncheckedCreateWithoutMemberInput> | BorrowCreateWithoutMemberInput[] | BorrowUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutMemberInput | BorrowCreateOrConnectWithoutMemberInput[]
    createMany?: BorrowCreateManyMemberInputEnvelope
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
  }

  export type ReturnUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<ReturnCreateWithoutMemberInput, ReturnUncheckedCreateWithoutMemberInput> | ReturnCreateWithoutMemberInput[] | ReturnUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutMemberInput | ReturnCreateOrConnectWithoutMemberInput[]
    createMany?: ReturnCreateManyMemberInputEnvelope
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
  }

  export type BorrowUpdateManyWithoutMemberNestedInput = {
    create?: XOR<BorrowCreateWithoutMemberInput, BorrowUncheckedCreateWithoutMemberInput> | BorrowCreateWithoutMemberInput[] | BorrowUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutMemberInput | BorrowCreateOrConnectWithoutMemberInput[]
    upsert?: BorrowUpsertWithWhereUniqueWithoutMemberInput | BorrowUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: BorrowCreateManyMemberInputEnvelope
    set?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    disconnect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    delete?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    update?: BorrowUpdateWithWhereUniqueWithoutMemberInput | BorrowUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: BorrowUpdateManyWithWhereWithoutMemberInput | BorrowUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
  }

  export type ReturnUpdateManyWithoutMemberNestedInput = {
    create?: XOR<ReturnCreateWithoutMemberInput, ReturnUncheckedCreateWithoutMemberInput> | ReturnCreateWithoutMemberInput[] | ReturnUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutMemberInput | ReturnCreateOrConnectWithoutMemberInput[]
    upsert?: ReturnUpsertWithWhereUniqueWithoutMemberInput | ReturnUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: ReturnCreateManyMemberInputEnvelope
    set?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    disconnect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    delete?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    update?: ReturnUpdateWithWhereUniqueWithoutMemberInput | ReturnUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: ReturnUpdateManyWithWhereWithoutMemberInput | ReturnUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
  }

  export type BorrowUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<BorrowCreateWithoutMemberInput, BorrowUncheckedCreateWithoutMemberInput> | BorrowCreateWithoutMemberInput[] | BorrowUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutMemberInput | BorrowCreateOrConnectWithoutMemberInput[]
    upsert?: BorrowUpsertWithWhereUniqueWithoutMemberInput | BorrowUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: BorrowCreateManyMemberInputEnvelope
    set?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    disconnect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    delete?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    update?: BorrowUpdateWithWhereUniqueWithoutMemberInput | BorrowUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: BorrowUpdateManyWithWhereWithoutMemberInput | BorrowUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
  }

  export type ReturnUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<ReturnCreateWithoutMemberInput, ReturnUncheckedCreateWithoutMemberInput> | ReturnCreateWithoutMemberInput[] | ReturnUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutMemberInput | ReturnCreateOrConnectWithoutMemberInput[]
    upsert?: ReturnUpsertWithWhereUniqueWithoutMemberInput | ReturnUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: ReturnCreateManyMemberInputEnvelope
    set?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    disconnect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    delete?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    update?: ReturnUpdateWithWhereUniqueWithoutMemberInput | ReturnUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: ReturnUpdateManyWithWhereWithoutMemberInput | ReturnUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
  }

  export type BorrowCreateNestedManyWithoutItemInput = {
    create?: XOR<BorrowCreateWithoutItemInput, BorrowUncheckedCreateWithoutItemInput> | BorrowCreateWithoutItemInput[] | BorrowUncheckedCreateWithoutItemInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutItemInput | BorrowCreateOrConnectWithoutItemInput[]
    createMany?: BorrowCreateManyItemInputEnvelope
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
  }

  export type ReturnCreateNestedManyWithoutItemInput = {
    create?: XOR<ReturnCreateWithoutItemInput, ReturnUncheckedCreateWithoutItemInput> | ReturnCreateWithoutItemInput[] | ReturnUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutItemInput | ReturnCreateOrConnectWithoutItemInput[]
    createMany?: ReturnCreateManyItemInputEnvelope
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
  }

  export type BorrowUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<BorrowCreateWithoutItemInput, BorrowUncheckedCreateWithoutItemInput> | BorrowCreateWithoutItemInput[] | BorrowUncheckedCreateWithoutItemInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutItemInput | BorrowCreateOrConnectWithoutItemInput[]
    createMany?: BorrowCreateManyItemInputEnvelope
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
  }

  export type ReturnUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<ReturnCreateWithoutItemInput, ReturnUncheckedCreateWithoutItemInput> | ReturnCreateWithoutItemInput[] | ReturnUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutItemInput | ReturnCreateOrConnectWithoutItemInput[]
    createMany?: ReturnCreateManyItemInputEnvelope
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BorrowUpdateManyWithoutItemNestedInput = {
    create?: XOR<BorrowCreateWithoutItemInput, BorrowUncheckedCreateWithoutItemInput> | BorrowCreateWithoutItemInput[] | BorrowUncheckedCreateWithoutItemInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutItemInput | BorrowCreateOrConnectWithoutItemInput[]
    upsert?: BorrowUpsertWithWhereUniqueWithoutItemInput | BorrowUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: BorrowCreateManyItemInputEnvelope
    set?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    disconnect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    delete?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    update?: BorrowUpdateWithWhereUniqueWithoutItemInput | BorrowUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: BorrowUpdateManyWithWhereWithoutItemInput | BorrowUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
  }

  export type ReturnUpdateManyWithoutItemNestedInput = {
    create?: XOR<ReturnCreateWithoutItemInput, ReturnUncheckedCreateWithoutItemInput> | ReturnCreateWithoutItemInput[] | ReturnUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutItemInput | ReturnCreateOrConnectWithoutItemInput[]
    upsert?: ReturnUpsertWithWhereUniqueWithoutItemInput | ReturnUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: ReturnCreateManyItemInputEnvelope
    set?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    disconnect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    delete?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    update?: ReturnUpdateWithWhereUniqueWithoutItemInput | ReturnUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: ReturnUpdateManyWithWhereWithoutItemInput | ReturnUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
  }

  export type BorrowUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<BorrowCreateWithoutItemInput, BorrowUncheckedCreateWithoutItemInput> | BorrowCreateWithoutItemInput[] | BorrowUncheckedCreateWithoutItemInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutItemInput | BorrowCreateOrConnectWithoutItemInput[]
    upsert?: BorrowUpsertWithWhereUniqueWithoutItemInput | BorrowUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: BorrowCreateManyItemInputEnvelope
    set?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    disconnect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    delete?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    update?: BorrowUpdateWithWhereUniqueWithoutItemInput | BorrowUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: BorrowUpdateManyWithWhereWithoutItemInput | BorrowUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
  }

  export type ReturnUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<ReturnCreateWithoutItemInput, ReturnUncheckedCreateWithoutItemInput> | ReturnCreateWithoutItemInput[] | ReturnUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutItemInput | ReturnCreateOrConnectWithoutItemInput[]
    upsert?: ReturnUpsertWithWhereUniqueWithoutItemInput | ReturnUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: ReturnCreateManyItemInputEnvelope
    set?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    disconnect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    delete?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    update?: ReturnUpdateWithWhereUniqueWithoutItemInput | ReturnUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: ReturnUpdateManyWithWhereWithoutItemInput | ReturnUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
  }

  export type BorrowCreateNestedManyWithoutRoomInput = {
    create?: XOR<BorrowCreateWithoutRoomInput, BorrowUncheckedCreateWithoutRoomInput> | BorrowCreateWithoutRoomInput[] | BorrowUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutRoomInput | BorrowCreateOrConnectWithoutRoomInput[]
    createMany?: BorrowCreateManyRoomInputEnvelope
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
  }

  export type ReturnCreateNestedManyWithoutRoomInput = {
    create?: XOR<ReturnCreateWithoutRoomInput, ReturnUncheckedCreateWithoutRoomInput> | ReturnCreateWithoutRoomInput[] | ReturnUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutRoomInput | ReturnCreateOrConnectWithoutRoomInput[]
    createMany?: ReturnCreateManyRoomInputEnvelope
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
  }

  export type BorrowUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<BorrowCreateWithoutRoomInput, BorrowUncheckedCreateWithoutRoomInput> | BorrowCreateWithoutRoomInput[] | BorrowUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutRoomInput | BorrowCreateOrConnectWithoutRoomInput[]
    createMany?: BorrowCreateManyRoomInputEnvelope
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
  }

  export type ReturnUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<ReturnCreateWithoutRoomInput, ReturnUncheckedCreateWithoutRoomInput> | ReturnCreateWithoutRoomInput[] | ReturnUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutRoomInput | ReturnCreateOrConnectWithoutRoomInput[]
    createMany?: ReturnCreateManyRoomInputEnvelope
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BorrowUpdateManyWithoutRoomNestedInput = {
    create?: XOR<BorrowCreateWithoutRoomInput, BorrowUncheckedCreateWithoutRoomInput> | BorrowCreateWithoutRoomInput[] | BorrowUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutRoomInput | BorrowCreateOrConnectWithoutRoomInput[]
    upsert?: BorrowUpsertWithWhereUniqueWithoutRoomInput | BorrowUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: BorrowCreateManyRoomInputEnvelope
    set?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    disconnect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    delete?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    update?: BorrowUpdateWithWhereUniqueWithoutRoomInput | BorrowUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: BorrowUpdateManyWithWhereWithoutRoomInput | BorrowUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
  }

  export type ReturnUpdateManyWithoutRoomNestedInput = {
    create?: XOR<ReturnCreateWithoutRoomInput, ReturnUncheckedCreateWithoutRoomInput> | ReturnCreateWithoutRoomInput[] | ReturnUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutRoomInput | ReturnCreateOrConnectWithoutRoomInput[]
    upsert?: ReturnUpsertWithWhereUniqueWithoutRoomInput | ReturnUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: ReturnCreateManyRoomInputEnvelope
    set?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    disconnect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    delete?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    update?: ReturnUpdateWithWhereUniqueWithoutRoomInput | ReturnUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: ReturnUpdateManyWithWhereWithoutRoomInput | ReturnUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
  }

  export type BorrowUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<BorrowCreateWithoutRoomInput, BorrowUncheckedCreateWithoutRoomInput> | BorrowCreateWithoutRoomInput[] | BorrowUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BorrowCreateOrConnectWithoutRoomInput | BorrowCreateOrConnectWithoutRoomInput[]
    upsert?: BorrowUpsertWithWhereUniqueWithoutRoomInput | BorrowUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: BorrowCreateManyRoomInputEnvelope
    set?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    disconnect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    delete?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    connect?: BorrowWhereUniqueInput | BorrowWhereUniqueInput[]
    update?: BorrowUpdateWithWhereUniqueWithoutRoomInput | BorrowUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: BorrowUpdateManyWithWhereWithoutRoomInput | BorrowUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
  }

  export type ReturnUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<ReturnCreateWithoutRoomInput, ReturnUncheckedCreateWithoutRoomInput> | ReturnCreateWithoutRoomInput[] | ReturnUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ReturnCreateOrConnectWithoutRoomInput | ReturnCreateOrConnectWithoutRoomInput[]
    upsert?: ReturnUpsertWithWhereUniqueWithoutRoomInput | ReturnUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: ReturnCreateManyRoomInputEnvelope
    set?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    disconnect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    delete?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    connect?: ReturnWhereUniqueInput | ReturnWhereUniqueInput[]
    update?: ReturnUpdateWithWhereUniqueWithoutRoomInput | ReturnUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: ReturnUpdateManyWithWhereWithoutRoomInput | ReturnUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
  }

  export type BorrowerCreateNestedOneWithoutBorrowsInput = {
    create?: XOR<BorrowerCreateWithoutBorrowsInput, BorrowerUncheckedCreateWithoutBorrowsInput>
    connectOrCreate?: BorrowerCreateOrConnectWithoutBorrowsInput
    connect?: BorrowerWhereUniqueInput
  }

  export type ItemCreateNestedOneWithoutBorrowsInput = {
    create?: XOR<ItemCreateWithoutBorrowsInput, ItemUncheckedCreateWithoutBorrowsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutBorrowsInput
    connect?: ItemWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutBorrowsInput = {
    create?: XOR<RoomCreateWithoutBorrowsInput, RoomUncheckedCreateWithoutBorrowsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutBorrowsInput
    connect?: RoomWhereUniqueInput
  }

  export type ReturnCreateNestedOneWithoutBorrowInput = {
    create?: XOR<ReturnCreateWithoutBorrowInput, ReturnUncheckedCreateWithoutBorrowInput>
    connectOrCreate?: ReturnCreateOrConnectWithoutBorrowInput
    connect?: ReturnWhereUniqueInput
  }

  export type ReturnUncheckedCreateNestedOneWithoutBorrowInput = {
    create?: XOR<ReturnCreateWithoutBorrowInput, ReturnUncheckedCreateWithoutBorrowInput>
    connectOrCreate?: ReturnCreateOrConnectWithoutBorrowInput
    connect?: ReturnWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BorrowerUpdateOneRequiredWithoutBorrowsNestedInput = {
    create?: XOR<BorrowerCreateWithoutBorrowsInput, BorrowerUncheckedCreateWithoutBorrowsInput>
    connectOrCreate?: BorrowerCreateOrConnectWithoutBorrowsInput
    upsert?: BorrowerUpsertWithoutBorrowsInput
    connect?: BorrowerWhereUniqueInput
    update?: XOR<XOR<BorrowerUpdateToOneWithWhereWithoutBorrowsInput, BorrowerUpdateWithoutBorrowsInput>, BorrowerUncheckedUpdateWithoutBorrowsInput>
  }

  export type ItemUpdateOneRequiredWithoutBorrowsNestedInput = {
    create?: XOR<ItemCreateWithoutBorrowsInput, ItemUncheckedCreateWithoutBorrowsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutBorrowsInput
    upsert?: ItemUpsertWithoutBorrowsInput
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutBorrowsInput, ItemUpdateWithoutBorrowsInput>, ItemUncheckedUpdateWithoutBorrowsInput>
  }

  export type RoomUpdateOneWithoutBorrowsNestedInput = {
    create?: XOR<RoomCreateWithoutBorrowsInput, RoomUncheckedCreateWithoutBorrowsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutBorrowsInput
    upsert?: RoomUpsertWithoutBorrowsInput
    disconnect?: RoomWhereInput | boolean
    delete?: RoomWhereInput | boolean
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutBorrowsInput, RoomUpdateWithoutBorrowsInput>, RoomUncheckedUpdateWithoutBorrowsInput>
  }

  export type ReturnUpdateOneWithoutBorrowNestedInput = {
    create?: XOR<ReturnCreateWithoutBorrowInput, ReturnUncheckedCreateWithoutBorrowInput>
    connectOrCreate?: ReturnCreateOrConnectWithoutBorrowInput
    upsert?: ReturnUpsertWithoutBorrowInput
    disconnect?: ReturnWhereInput | boolean
    delete?: ReturnWhereInput | boolean
    connect?: ReturnWhereUniqueInput
    update?: XOR<XOR<ReturnUpdateToOneWithWhereWithoutBorrowInput, ReturnUpdateWithoutBorrowInput>, ReturnUncheckedUpdateWithoutBorrowInput>
  }

  export type ReturnUncheckedUpdateOneWithoutBorrowNestedInput = {
    create?: XOR<ReturnCreateWithoutBorrowInput, ReturnUncheckedCreateWithoutBorrowInput>
    connectOrCreate?: ReturnCreateOrConnectWithoutBorrowInput
    upsert?: ReturnUpsertWithoutBorrowInput
    disconnect?: ReturnWhereInput | boolean
    delete?: ReturnWhereInput | boolean
    connect?: ReturnWhereUniqueInput
    update?: XOR<XOR<ReturnUpdateToOneWithWhereWithoutBorrowInput, ReturnUpdateWithoutBorrowInput>, ReturnUncheckedUpdateWithoutBorrowInput>
  }

  export type BorrowCreateNestedOneWithoutReturnInput = {
    create?: XOR<BorrowCreateWithoutReturnInput, BorrowUncheckedCreateWithoutReturnInput>
    connectOrCreate?: BorrowCreateOrConnectWithoutReturnInput
    connect?: BorrowWhereUniqueInput
  }

  export type BorrowerCreateNestedOneWithoutReturnsInput = {
    create?: XOR<BorrowerCreateWithoutReturnsInput, BorrowerUncheckedCreateWithoutReturnsInput>
    connectOrCreate?: BorrowerCreateOrConnectWithoutReturnsInput
    connect?: BorrowerWhereUniqueInput
  }

  export type ItemCreateNestedOneWithoutReturnsInput = {
    create?: XOR<ItemCreateWithoutReturnsInput, ItemUncheckedCreateWithoutReturnsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutReturnsInput
    connect?: ItemWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutReturnsInput = {
    create?: XOR<RoomCreateWithoutReturnsInput, RoomUncheckedCreateWithoutReturnsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutReturnsInput
    connect?: RoomWhereUniqueInput
  }

  export type BorrowUpdateOneRequiredWithoutReturnNestedInput = {
    create?: XOR<BorrowCreateWithoutReturnInput, BorrowUncheckedCreateWithoutReturnInput>
    connectOrCreate?: BorrowCreateOrConnectWithoutReturnInput
    upsert?: BorrowUpsertWithoutReturnInput
    connect?: BorrowWhereUniqueInput
    update?: XOR<XOR<BorrowUpdateToOneWithWhereWithoutReturnInput, BorrowUpdateWithoutReturnInput>, BorrowUncheckedUpdateWithoutReturnInput>
  }

  export type BorrowerUpdateOneRequiredWithoutReturnsNestedInput = {
    create?: XOR<BorrowerCreateWithoutReturnsInput, BorrowerUncheckedCreateWithoutReturnsInput>
    connectOrCreate?: BorrowerCreateOrConnectWithoutReturnsInput
    upsert?: BorrowerUpsertWithoutReturnsInput
    connect?: BorrowerWhereUniqueInput
    update?: XOR<XOR<BorrowerUpdateToOneWithWhereWithoutReturnsInput, BorrowerUpdateWithoutReturnsInput>, BorrowerUncheckedUpdateWithoutReturnsInput>
  }

  export type ItemUpdateOneRequiredWithoutReturnsNestedInput = {
    create?: XOR<ItemCreateWithoutReturnsInput, ItemUncheckedCreateWithoutReturnsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutReturnsInput
    upsert?: ItemUpsertWithoutReturnsInput
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutReturnsInput, ItemUpdateWithoutReturnsInput>, ItemUncheckedUpdateWithoutReturnsInput>
  }

  export type RoomUpdateOneWithoutReturnsNestedInput = {
    create?: XOR<RoomCreateWithoutReturnsInput, RoomUncheckedCreateWithoutReturnsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutReturnsInput
    upsert?: RoomUpsertWithoutReturnsInput
    disconnect?: RoomWhereInput | boolean
    delete?: RoomWhereInput | boolean
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutReturnsInput, RoomUpdateWithoutReturnsInput>, RoomUncheckedUpdateWithoutReturnsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BorrowCreateWithoutMemberInput = {
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    Item: ItemCreateNestedOneWithoutBorrowsInput
    Room?: RoomCreateNestedOneWithoutBorrowsInput
    return?: ReturnCreateNestedOneWithoutBorrowInput
  }

  export type BorrowUncheckedCreateWithoutMemberInput = {
    id?: number
    item_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    return?: ReturnUncheckedCreateNestedOneWithoutBorrowInput
  }

  export type BorrowCreateOrConnectWithoutMemberInput = {
    where: BorrowWhereUniqueInput
    create: XOR<BorrowCreateWithoutMemberInput, BorrowUncheckedCreateWithoutMemberInput>
  }

  export type BorrowCreateManyMemberInputEnvelope = {
    data: BorrowCreateManyMemberInput | BorrowCreateManyMemberInput[]
    skipDuplicates?: boolean
  }

  export type ReturnCreateWithoutMemberInput = {
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    Borrow: BorrowCreateNestedOneWithoutReturnInput
    Item: ItemCreateNestedOneWithoutReturnsInput
    Room?: RoomCreateNestedOneWithoutReturnsInput
  }

  export type ReturnUncheckedCreateWithoutMemberInput = {
    id?: number
    borrow_id: number
    item_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnCreateOrConnectWithoutMemberInput = {
    where: ReturnWhereUniqueInput
    create: XOR<ReturnCreateWithoutMemberInput, ReturnUncheckedCreateWithoutMemberInput>
  }

  export type ReturnCreateManyMemberInputEnvelope = {
    data: ReturnCreateManyMemberInput | ReturnCreateManyMemberInput[]
    skipDuplicates?: boolean
  }

  export type BorrowUpsertWithWhereUniqueWithoutMemberInput = {
    where: BorrowWhereUniqueInput
    update: XOR<BorrowUpdateWithoutMemberInput, BorrowUncheckedUpdateWithoutMemberInput>
    create: XOR<BorrowCreateWithoutMemberInput, BorrowUncheckedCreateWithoutMemberInput>
  }

  export type BorrowUpdateWithWhereUniqueWithoutMemberInput = {
    where: BorrowWhereUniqueInput
    data: XOR<BorrowUpdateWithoutMemberInput, BorrowUncheckedUpdateWithoutMemberInput>
  }

  export type BorrowUpdateManyWithWhereWithoutMemberInput = {
    where: BorrowScalarWhereInput
    data: XOR<BorrowUpdateManyMutationInput, BorrowUncheckedUpdateManyWithoutMemberInput>
  }

  export type BorrowScalarWhereInput = {
    AND?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
    OR?: BorrowScalarWhereInput[]
    NOT?: BorrowScalarWhereInput | BorrowScalarWhereInput[]
    id?: IntFilter<"Borrow"> | number
    member_id?: IntFilter<"Borrow"> | number
    item_id?: IntFilter<"Borrow"> | number
    room_id?: IntNullableFilter<"Borrow"> | number | null
    b_date_borrowed?: DateTimeFilter<"Borrow"> | Date | string
    b_date_returned?: DateTimeNullableFilter<"Borrow"> | Date | string | null
    b_due_date?: DateTimeFilter<"Borrow"> | Date | string
    b_quantity?: IntFilter<"Borrow"> | number
    b_status?: IntFilter<"Borrow"> | number
    b_purpose?: StringNullableFilter<"Borrow"> | string | null
    b_notes?: StringNullableFilter<"Borrow"> | string | null
  }

  export type ReturnUpsertWithWhereUniqueWithoutMemberInput = {
    where: ReturnWhereUniqueInput
    update: XOR<ReturnUpdateWithoutMemberInput, ReturnUncheckedUpdateWithoutMemberInput>
    create: XOR<ReturnCreateWithoutMemberInput, ReturnUncheckedCreateWithoutMemberInput>
  }

  export type ReturnUpdateWithWhereUniqueWithoutMemberInput = {
    where: ReturnWhereUniqueInput
    data: XOR<ReturnUpdateWithoutMemberInput, ReturnUncheckedUpdateWithoutMemberInput>
  }

  export type ReturnUpdateManyWithWhereWithoutMemberInput = {
    where: ReturnScalarWhereInput
    data: XOR<ReturnUpdateManyMutationInput, ReturnUncheckedUpdateManyWithoutMemberInput>
  }

  export type ReturnScalarWhereInput = {
    AND?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
    OR?: ReturnScalarWhereInput[]
    NOT?: ReturnScalarWhereInput | ReturnScalarWhereInput[]
    id?: IntFilter<"Return"> | number
    borrow_id?: IntFilter<"Return"> | number
    member_id?: IntFilter<"Return"> | number
    item_id?: IntFilter<"Return"> | number
    room_id?: IntNullableFilter<"Return"> | number | null
    r_date_returned?: DateTimeFilter<"Return"> | Date | string
    r_quantity?: IntFilter<"Return"> | number
    r_condition?: StringNullableFilter<"Return"> | string | null
    r_notes?: StringNullableFilter<"Return"> | string | null
    r_late_fee?: DecimalFilter<"Return"> | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFilter<"Return"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Return"> | Date | string
    updatedAt?: DateTimeFilter<"Return"> | Date | string
  }

  export type BorrowCreateWithoutItemInput = {
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    Member: BorrowerCreateNestedOneWithoutBorrowsInput
    Room?: RoomCreateNestedOneWithoutBorrowsInput
    return?: ReturnCreateNestedOneWithoutBorrowInput
  }

  export type BorrowUncheckedCreateWithoutItemInput = {
    id?: number
    member_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    return?: ReturnUncheckedCreateNestedOneWithoutBorrowInput
  }

  export type BorrowCreateOrConnectWithoutItemInput = {
    where: BorrowWhereUniqueInput
    create: XOR<BorrowCreateWithoutItemInput, BorrowUncheckedCreateWithoutItemInput>
  }

  export type BorrowCreateManyItemInputEnvelope = {
    data: BorrowCreateManyItemInput | BorrowCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type ReturnCreateWithoutItemInput = {
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    Borrow: BorrowCreateNestedOneWithoutReturnInput
    Member: BorrowerCreateNestedOneWithoutReturnsInput
    Room?: RoomCreateNestedOneWithoutReturnsInput
  }

  export type ReturnUncheckedCreateWithoutItemInput = {
    id?: number
    borrow_id: number
    member_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnCreateOrConnectWithoutItemInput = {
    where: ReturnWhereUniqueInput
    create: XOR<ReturnCreateWithoutItemInput, ReturnUncheckedCreateWithoutItemInput>
  }

  export type ReturnCreateManyItemInputEnvelope = {
    data: ReturnCreateManyItemInput | ReturnCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type BorrowUpsertWithWhereUniqueWithoutItemInput = {
    where: BorrowWhereUniqueInput
    update: XOR<BorrowUpdateWithoutItemInput, BorrowUncheckedUpdateWithoutItemInput>
    create: XOR<BorrowCreateWithoutItemInput, BorrowUncheckedCreateWithoutItemInput>
  }

  export type BorrowUpdateWithWhereUniqueWithoutItemInput = {
    where: BorrowWhereUniqueInput
    data: XOR<BorrowUpdateWithoutItemInput, BorrowUncheckedUpdateWithoutItemInput>
  }

  export type BorrowUpdateManyWithWhereWithoutItemInput = {
    where: BorrowScalarWhereInput
    data: XOR<BorrowUpdateManyMutationInput, BorrowUncheckedUpdateManyWithoutItemInput>
  }

  export type ReturnUpsertWithWhereUniqueWithoutItemInput = {
    where: ReturnWhereUniqueInput
    update: XOR<ReturnUpdateWithoutItemInput, ReturnUncheckedUpdateWithoutItemInput>
    create: XOR<ReturnCreateWithoutItemInput, ReturnUncheckedCreateWithoutItemInput>
  }

  export type ReturnUpdateWithWhereUniqueWithoutItemInput = {
    where: ReturnWhereUniqueInput
    data: XOR<ReturnUpdateWithoutItemInput, ReturnUncheckedUpdateWithoutItemInput>
  }

  export type ReturnUpdateManyWithWhereWithoutItemInput = {
    where: ReturnScalarWhereInput
    data: XOR<ReturnUpdateManyMutationInput, ReturnUncheckedUpdateManyWithoutItemInput>
  }

  export type BorrowCreateWithoutRoomInput = {
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    Member: BorrowerCreateNestedOneWithoutBorrowsInput
    Item: ItemCreateNestedOneWithoutBorrowsInput
    return?: ReturnCreateNestedOneWithoutBorrowInput
  }

  export type BorrowUncheckedCreateWithoutRoomInput = {
    id?: number
    member_id: number
    item_id: number
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    return?: ReturnUncheckedCreateNestedOneWithoutBorrowInput
  }

  export type BorrowCreateOrConnectWithoutRoomInput = {
    where: BorrowWhereUniqueInput
    create: XOR<BorrowCreateWithoutRoomInput, BorrowUncheckedCreateWithoutRoomInput>
  }

  export type BorrowCreateManyRoomInputEnvelope = {
    data: BorrowCreateManyRoomInput | BorrowCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type ReturnCreateWithoutRoomInput = {
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    Borrow: BorrowCreateNestedOneWithoutReturnInput
    Member: BorrowerCreateNestedOneWithoutReturnsInput
    Item: ItemCreateNestedOneWithoutReturnsInput
  }

  export type ReturnUncheckedCreateWithoutRoomInput = {
    id?: number
    borrow_id: number
    member_id: number
    item_id: number
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnCreateOrConnectWithoutRoomInput = {
    where: ReturnWhereUniqueInput
    create: XOR<ReturnCreateWithoutRoomInput, ReturnUncheckedCreateWithoutRoomInput>
  }

  export type ReturnCreateManyRoomInputEnvelope = {
    data: ReturnCreateManyRoomInput | ReturnCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type BorrowUpsertWithWhereUniqueWithoutRoomInput = {
    where: BorrowWhereUniqueInput
    update: XOR<BorrowUpdateWithoutRoomInput, BorrowUncheckedUpdateWithoutRoomInput>
    create: XOR<BorrowCreateWithoutRoomInput, BorrowUncheckedCreateWithoutRoomInput>
  }

  export type BorrowUpdateWithWhereUniqueWithoutRoomInput = {
    where: BorrowWhereUniqueInput
    data: XOR<BorrowUpdateWithoutRoomInput, BorrowUncheckedUpdateWithoutRoomInput>
  }

  export type BorrowUpdateManyWithWhereWithoutRoomInput = {
    where: BorrowScalarWhereInput
    data: XOR<BorrowUpdateManyMutationInput, BorrowUncheckedUpdateManyWithoutRoomInput>
  }

  export type ReturnUpsertWithWhereUniqueWithoutRoomInput = {
    where: ReturnWhereUniqueInput
    update: XOR<ReturnUpdateWithoutRoomInput, ReturnUncheckedUpdateWithoutRoomInput>
    create: XOR<ReturnCreateWithoutRoomInput, ReturnUncheckedCreateWithoutRoomInput>
  }

  export type ReturnUpdateWithWhereUniqueWithoutRoomInput = {
    where: ReturnWhereUniqueInput
    data: XOR<ReturnUpdateWithoutRoomInput, ReturnUncheckedUpdateWithoutRoomInput>
  }

  export type ReturnUpdateManyWithWhereWithoutRoomInput = {
    where: ReturnScalarWhereInput
    data: XOR<ReturnUpdateManyMutationInput, ReturnUncheckedUpdateManyWithoutRoomInput>
  }

  export type BorrowerCreateWithoutBorrowsInput = {
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
    returns?: ReturnCreateNestedManyWithoutMemberInput
  }

  export type BorrowerUncheckedCreateWithoutBorrowsInput = {
    id?: number
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
    returns?: ReturnUncheckedCreateNestedManyWithoutMemberInput
  }

  export type BorrowerCreateOrConnectWithoutBorrowsInput = {
    where: BorrowerWhereUniqueInput
    create: XOR<BorrowerCreateWithoutBorrowsInput, BorrowerUncheckedCreateWithoutBorrowsInput>
  }

  export type ItemCreateWithoutBorrowsInput = {
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
    returns?: ReturnCreateNestedManyWithoutItemInput
  }

  export type ItemUncheckedCreateWithoutBorrowsInput = {
    id?: number
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
    returns?: ReturnUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemCreateOrConnectWithoutBorrowsInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutBorrowsInput, ItemUncheckedCreateWithoutBorrowsInput>
  }

  export type RoomCreateWithoutBorrowsInput = {
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    returns?: ReturnCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutBorrowsInput = {
    id?: number
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    returns?: ReturnUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutBorrowsInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutBorrowsInput, RoomUncheckedCreateWithoutBorrowsInput>
  }

  export type ReturnCreateWithoutBorrowInput = {
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    Member: BorrowerCreateNestedOneWithoutReturnsInput
    Item: ItemCreateNestedOneWithoutReturnsInput
    Room?: RoomCreateNestedOneWithoutReturnsInput
  }

  export type ReturnUncheckedCreateWithoutBorrowInput = {
    id?: number
    member_id: number
    item_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReturnCreateOrConnectWithoutBorrowInput = {
    where: ReturnWhereUniqueInput
    create: XOR<ReturnCreateWithoutBorrowInput, ReturnUncheckedCreateWithoutBorrowInput>
  }

  export type BorrowerUpsertWithoutBorrowsInput = {
    update: XOR<BorrowerUpdateWithoutBorrowsInput, BorrowerUncheckedUpdateWithoutBorrowsInput>
    create: XOR<BorrowerCreateWithoutBorrowsInput, BorrowerUncheckedCreateWithoutBorrowsInput>
    where?: BorrowerWhereInput
  }

  export type BorrowerUpdateToOneWithWhereWithoutBorrowsInput = {
    where?: BorrowerWhereInput
    data: XOR<BorrowerUpdateWithoutBorrowsInput, BorrowerUncheckedUpdateWithoutBorrowsInput>
  }

  export type BorrowerUpdateWithoutBorrowsInput = {
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
    returns?: ReturnUpdateManyWithoutMemberNestedInput
  }

  export type BorrowerUncheckedUpdateWithoutBorrowsInput = {
    id?: IntFieldUpdateOperationsInput | number
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
    returns?: ReturnUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type ItemUpsertWithoutBorrowsInput = {
    update: XOR<ItemUpdateWithoutBorrowsInput, ItemUncheckedUpdateWithoutBorrowsInput>
    create: XOR<ItemCreateWithoutBorrowsInput, ItemUncheckedCreateWithoutBorrowsInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutBorrowsInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutBorrowsInput, ItemUncheckedUpdateWithoutBorrowsInput>
  }

  export type ItemUpdateWithoutBorrowsInput = {
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    returns?: ReturnUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutBorrowsInput = {
    id?: IntFieldUpdateOperationsInput | number
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    returns?: ReturnUncheckedUpdateManyWithoutItemNestedInput
  }

  export type RoomUpsertWithoutBorrowsInput = {
    update: XOR<RoomUpdateWithoutBorrowsInput, RoomUncheckedUpdateWithoutBorrowsInput>
    create: XOR<RoomCreateWithoutBorrowsInput, RoomUncheckedCreateWithoutBorrowsInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutBorrowsInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutBorrowsInput, RoomUncheckedUpdateWithoutBorrowsInput>
  }

  export type RoomUpdateWithoutBorrowsInput = {
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    returns?: ReturnUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutBorrowsInput = {
    id?: IntFieldUpdateOperationsInput | number
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    returns?: ReturnUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type ReturnUpsertWithoutBorrowInput = {
    update: XOR<ReturnUpdateWithoutBorrowInput, ReturnUncheckedUpdateWithoutBorrowInput>
    create: XOR<ReturnCreateWithoutBorrowInput, ReturnUncheckedCreateWithoutBorrowInput>
    where?: ReturnWhereInput
  }

  export type ReturnUpdateToOneWithWhereWithoutBorrowInput = {
    where?: ReturnWhereInput
    data: XOR<ReturnUpdateWithoutBorrowInput, ReturnUncheckedUpdateWithoutBorrowInput>
  }

  export type ReturnUpdateWithoutBorrowInput = {
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Member?: BorrowerUpdateOneRequiredWithoutReturnsNestedInput
    Item?: ItemUpdateOneRequiredWithoutReturnsNestedInput
    Room?: RoomUpdateOneWithoutReturnsNestedInput
  }

  export type ReturnUncheckedUpdateWithoutBorrowInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BorrowCreateWithoutReturnInput = {
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
    Member: BorrowerCreateNestedOneWithoutBorrowsInput
    Item: ItemCreateNestedOneWithoutBorrowsInput
    Room?: RoomCreateNestedOneWithoutBorrowsInput
  }

  export type BorrowUncheckedCreateWithoutReturnInput = {
    id?: number
    member_id: number
    item_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
  }

  export type BorrowCreateOrConnectWithoutReturnInput = {
    where: BorrowWhereUniqueInput
    create: XOR<BorrowCreateWithoutReturnInput, BorrowUncheckedCreateWithoutReturnInput>
  }

  export type BorrowerCreateWithoutReturnsInput = {
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
    borrows?: BorrowCreateNestedManyWithoutMemberInput
  }

  export type BorrowerUncheckedCreateWithoutReturnsInput = {
    id?: number
    m_school_id: string
    m_fname: string
    m_lname: string
    m_gender: string
    m_contact: string
    m_department: string
    m_year_section: string
    m_type: number
    m_password: string
    m_status?: number
    borrows?: BorrowUncheckedCreateNestedManyWithoutMemberInput
  }

  export type BorrowerCreateOrConnectWithoutReturnsInput = {
    where: BorrowerWhereUniqueInput
    create: XOR<BorrowerCreateWithoutReturnsInput, BorrowerUncheckedCreateWithoutReturnsInput>
  }

  export type ItemCreateWithoutReturnsInput = {
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
    borrows?: BorrowCreateNestedManyWithoutItemInput
  }

  export type ItemUncheckedCreateWithoutReturnsInput = {
    id?: number
    i_deviceID: string
    i_model: string
    i_category: string
    i_brand: string
    i_description: string
    i_type: string
    item_rawstock?: number
    i_status?: number
    i_mr: string
    i_price: Decimal | DecimalJsLike | number | string
    i_photo?: string
    no_of_items?: number | null
    remarks?: string | null
    borrows?: BorrowUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemCreateOrConnectWithoutReturnsInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutReturnsInput, ItemUncheckedCreateWithoutReturnsInput>
  }

  export type RoomCreateWithoutReturnsInput = {
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    borrows?: BorrowCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutReturnsInput = {
    id?: number
    r_name: string
    r_description?: string | null
    r_status?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    borrows?: BorrowUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutReturnsInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutReturnsInput, RoomUncheckedCreateWithoutReturnsInput>
  }

  export type BorrowUpsertWithoutReturnInput = {
    update: XOR<BorrowUpdateWithoutReturnInput, BorrowUncheckedUpdateWithoutReturnInput>
    create: XOR<BorrowCreateWithoutReturnInput, BorrowUncheckedCreateWithoutReturnInput>
    where?: BorrowWhereInput
  }

  export type BorrowUpdateToOneWithWhereWithoutReturnInput = {
    where?: BorrowWhereInput
    data: XOR<BorrowUpdateWithoutReturnInput, BorrowUncheckedUpdateWithoutReturnInput>
  }

  export type BorrowUpdateWithoutReturnInput = {
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    Member?: BorrowerUpdateOneRequiredWithoutBorrowsNestedInput
    Item?: ItemUpdateOneRequiredWithoutBorrowsNestedInput
    Room?: RoomUpdateOneWithoutBorrowsNestedInput
  }

  export type BorrowUncheckedUpdateWithoutReturnInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BorrowerUpsertWithoutReturnsInput = {
    update: XOR<BorrowerUpdateWithoutReturnsInput, BorrowerUncheckedUpdateWithoutReturnsInput>
    create: XOR<BorrowerCreateWithoutReturnsInput, BorrowerUncheckedCreateWithoutReturnsInput>
    where?: BorrowerWhereInput
  }

  export type BorrowerUpdateToOneWithWhereWithoutReturnsInput = {
    where?: BorrowerWhereInput
    data: XOR<BorrowerUpdateWithoutReturnsInput, BorrowerUncheckedUpdateWithoutReturnsInput>
  }

  export type BorrowerUpdateWithoutReturnsInput = {
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
    borrows?: BorrowUpdateManyWithoutMemberNestedInput
  }

  export type BorrowerUncheckedUpdateWithoutReturnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    m_school_id?: StringFieldUpdateOperationsInput | string
    m_fname?: StringFieldUpdateOperationsInput | string
    m_lname?: StringFieldUpdateOperationsInput | string
    m_gender?: StringFieldUpdateOperationsInput | string
    m_contact?: StringFieldUpdateOperationsInput | string
    m_department?: StringFieldUpdateOperationsInput | string
    m_year_section?: StringFieldUpdateOperationsInput | string
    m_type?: IntFieldUpdateOperationsInput | number
    m_password?: StringFieldUpdateOperationsInput | string
    m_status?: IntFieldUpdateOperationsInput | number
    borrows?: BorrowUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type ItemUpsertWithoutReturnsInput = {
    update: XOR<ItemUpdateWithoutReturnsInput, ItemUncheckedUpdateWithoutReturnsInput>
    create: XOR<ItemCreateWithoutReturnsInput, ItemUncheckedCreateWithoutReturnsInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutReturnsInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutReturnsInput, ItemUncheckedUpdateWithoutReturnsInput>
  }

  export type ItemUpdateWithoutReturnsInput = {
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    borrows?: BorrowUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutReturnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    i_deviceID?: StringFieldUpdateOperationsInput | string
    i_model?: StringFieldUpdateOperationsInput | string
    i_category?: StringFieldUpdateOperationsInput | string
    i_brand?: StringFieldUpdateOperationsInput | string
    i_description?: StringFieldUpdateOperationsInput | string
    i_type?: StringFieldUpdateOperationsInput | string
    item_rawstock?: IntFieldUpdateOperationsInput | number
    i_status?: IntFieldUpdateOperationsInput | number
    i_mr?: StringFieldUpdateOperationsInput | string
    i_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    i_photo?: StringFieldUpdateOperationsInput | string
    no_of_items?: NullableIntFieldUpdateOperationsInput | number | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    borrows?: BorrowUncheckedUpdateManyWithoutItemNestedInput
  }

  export type RoomUpsertWithoutReturnsInput = {
    update: XOR<RoomUpdateWithoutReturnsInput, RoomUncheckedUpdateWithoutReturnsInput>
    create: XOR<RoomCreateWithoutReturnsInput, RoomUncheckedCreateWithoutReturnsInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutReturnsInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutReturnsInput, RoomUncheckedUpdateWithoutReturnsInput>
  }

  export type RoomUpdateWithoutReturnsInput = {
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    borrows?: BorrowUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutReturnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    r_name?: StringFieldUpdateOperationsInput | string
    r_description?: NullableStringFieldUpdateOperationsInput | string | null
    r_status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    borrows?: BorrowUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type BorrowCreateManyMemberInput = {
    id?: number
    item_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
  }

  export type ReturnCreateManyMemberInput = {
    id?: number
    borrow_id: number
    item_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BorrowUpdateWithoutMemberInput = {
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    Item?: ItemUpdateOneRequiredWithoutBorrowsNestedInput
    Room?: RoomUpdateOneWithoutBorrowsNestedInput
    return?: ReturnUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    return?: ReturnUncheckedUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateManyWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReturnUpdateWithoutMemberInput = {
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Borrow?: BorrowUpdateOneRequiredWithoutReturnNestedInput
    Item?: ItemUpdateOneRequiredWithoutReturnsNestedInput
    Room?: RoomUpdateOneWithoutReturnsNestedInput
  }

  export type ReturnUncheckedUpdateWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnUncheckedUpdateManyWithoutMemberInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BorrowCreateManyItemInput = {
    id?: number
    member_id: number
    room_id?: number | null
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
  }

  export type ReturnCreateManyItemInput = {
    id?: number
    borrow_id: number
    member_id: number
    room_id?: number | null
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BorrowUpdateWithoutItemInput = {
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    Member?: BorrowerUpdateOneRequiredWithoutBorrowsNestedInput
    Room?: RoomUpdateOneWithoutBorrowsNestedInput
    return?: ReturnUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    return?: ReturnUncheckedUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateManyWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReturnUpdateWithoutItemInput = {
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Borrow?: BorrowUpdateOneRequiredWithoutReturnNestedInput
    Member?: BorrowerUpdateOneRequiredWithoutReturnsNestedInput
    Room?: RoomUpdateOneWithoutReturnsNestedInput
  }

  export type ReturnUncheckedUpdateWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnUncheckedUpdateManyWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    room_id?: NullableIntFieldUpdateOperationsInput | number | null
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BorrowCreateManyRoomInput = {
    id?: number
    member_id: number
    item_id: number
    b_date_borrowed?: Date | string
    b_date_returned?: Date | string | null
    b_due_date: Date | string
    b_quantity?: number
    b_status?: number
    b_purpose?: string | null
    b_notes?: string | null
  }

  export type ReturnCreateManyRoomInput = {
    id?: number
    borrow_id: number
    member_id: number
    item_id: number
    r_date_returned?: Date | string
    r_quantity?: number
    r_condition?: string | null
    r_notes?: string | null
    r_late_fee?: Decimal | DecimalJsLike | number | string
    r_damage_fee?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BorrowUpdateWithoutRoomInput = {
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    Member?: BorrowerUpdateOneRequiredWithoutBorrowsNestedInput
    Item?: ItemUpdateOneRequiredWithoutBorrowsNestedInput
    return?: ReturnUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateWithoutRoomInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
    return?: ReturnUncheckedUpdateOneWithoutBorrowNestedInput
  }

  export type BorrowUncheckedUpdateManyWithoutRoomInput = {
    id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    b_date_borrowed?: DateTimeFieldUpdateOperationsInput | Date | string
    b_date_returned?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    b_due_date?: DateTimeFieldUpdateOperationsInput | Date | string
    b_quantity?: IntFieldUpdateOperationsInput | number
    b_status?: IntFieldUpdateOperationsInput | number
    b_purpose?: NullableStringFieldUpdateOperationsInput | string | null
    b_notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReturnUpdateWithoutRoomInput = {
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Borrow?: BorrowUpdateOneRequiredWithoutReturnNestedInput
    Member?: BorrowerUpdateOneRequiredWithoutReturnsNestedInput
    Item?: ItemUpdateOneRequiredWithoutReturnsNestedInput
  }

  export type ReturnUncheckedUpdateWithoutRoomInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnUncheckedUpdateManyWithoutRoomInput = {
    id?: IntFieldUpdateOperationsInput | number
    borrow_id?: IntFieldUpdateOperationsInput | number
    member_id?: IntFieldUpdateOperationsInput | number
    item_id?: IntFieldUpdateOperationsInput | number
    r_date_returned?: DateTimeFieldUpdateOperationsInput | Date | string
    r_quantity?: IntFieldUpdateOperationsInput | number
    r_condition?: NullableStringFieldUpdateOperationsInput | string | null
    r_notes?: NullableStringFieldUpdateOperationsInput | string | null
    r_late_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    r_damage_fee?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}