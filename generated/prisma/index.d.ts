
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
 * Model QuizAttempt
 * 
 */
export type QuizAttempt = $Result.DefaultSelection<Prisma.$QuizAttemptPayload>
/**
 * Model AiContent
 * 
 */
export type AiContent = $Result.DefaultSelection<Prisma.$AiContentPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Refund
 * 
 */
export type Refund = $Result.DefaultSelection<Prisma.$RefundPayload>
/**
 * Model UnpaidUserEmail
 * 
 */
export type UnpaidUserEmail = $Result.DefaultSelection<Prisma.$UnpaidUserEmailPayload>
/**
 * Model ReportView
 * 
 */
export type ReportView = $Result.DefaultSelection<Prisma.$ReportViewPayload>
/**
 * Model PasswordResetToken
 * 
 */
export type PasswordResetToken = $Result.DefaultSelection<Prisma.$PasswordResetTokenPayload>

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
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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
   * `prisma.quizAttempt`: Exposes CRUD operations for the **QuizAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizAttempts
    * const quizAttempts = await prisma.quizAttempt.findMany()
    * ```
    */
  get quizAttempt(): Prisma.QuizAttemptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiContent`: Exposes CRUD operations for the **AiContent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiContents
    * const aiContents = await prisma.aiContent.findMany()
    * ```
    */
  get aiContent(): Prisma.AiContentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refund`: Exposes CRUD operations for the **Refund** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Refunds
    * const refunds = await prisma.refund.findMany()
    * ```
    */
  get refund(): Prisma.RefundDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unpaidUserEmail`: Exposes CRUD operations for the **UnpaidUserEmail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnpaidUserEmails
    * const unpaidUserEmails = await prisma.unpaidUserEmail.findMany()
    * ```
    */
  get unpaidUserEmail(): Prisma.UnpaidUserEmailDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reportView`: Exposes CRUD operations for the **ReportView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReportViews
    * const reportViews = await prisma.reportView.findMany()
    * ```
    */
  get reportView(): Prisma.ReportViewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetTokens
    * const passwordResetTokens = await prisma.passwordResetToken.findMany()
    * ```
    */
  get passwordResetToken(): Prisma.PasswordResetTokenDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
    QuizAttempt: 'QuizAttempt',
    AiContent: 'AiContent',
    Payment: 'Payment',
    Refund: 'Refund',
    UnpaidUserEmail: 'UnpaidUserEmail',
    ReportView: 'ReportView',
    PasswordResetToken: 'PasswordResetToken'
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
      modelProps: "user" | "quizAttempt" | "aiContent" | "payment" | "refund" | "unpaidUserEmail" | "reportView" | "passwordResetToken"
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
      QuizAttempt: {
        payload: Prisma.$QuizAttemptPayload<ExtArgs>
        fields: Prisma.QuizAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          findFirst: {
            args: Prisma.QuizAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          findMany: {
            args: Prisma.QuizAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[]
          }
          create: {
            args: Prisma.QuizAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          createMany: {
            args: Prisma.QuizAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[]
          }
          delete: {
            args: Prisma.QuizAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          update: {
            args: Prisma.QuizAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          deleteMany: {
            args: Prisma.QuizAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizAttemptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[]
          }
          upsert: {
            args: Prisma.QuizAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          aggregate: {
            args: Prisma.QuizAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizAttempt>
          }
          groupBy: {
            args: Prisma.QuizAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<QuizAttemptCountAggregateOutputType> | number
          }
        }
      }
      AiContent: {
        payload: Prisma.$AiContentPayload<ExtArgs>
        fields: Prisma.AiContentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiContentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiContentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>
          }
          findFirst: {
            args: Prisma.AiContentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiContentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>
          }
          findMany: {
            args: Prisma.AiContentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>[]
          }
          create: {
            args: Prisma.AiContentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>
          }
          createMany: {
            args: Prisma.AiContentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiContentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>[]
          }
          delete: {
            args: Prisma.AiContentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>
          }
          update: {
            args: Prisma.AiContentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>
          }
          deleteMany: {
            args: Prisma.AiContentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiContentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiContentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>[]
          }
          upsert: {
            args: Prisma.AiContentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiContentPayload>
          }
          aggregate: {
            args: Prisma.AiContentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiContent>
          }
          groupBy: {
            args: Prisma.AiContentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiContentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiContentCountArgs<ExtArgs>
            result: $Utils.Optional<AiContentCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Refund: {
        payload: Prisma.$RefundPayload<ExtArgs>
        fields: Prisma.RefundFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefundFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefundFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>
          }
          findFirst: {
            args: Prisma.RefundFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefundFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>
          }
          findMany: {
            args: Prisma.RefundFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>[]
          }
          create: {
            args: Prisma.RefundCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>
          }
          createMany: {
            args: Prisma.RefundCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefundCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>[]
          }
          delete: {
            args: Prisma.RefundDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>
          }
          update: {
            args: Prisma.RefundUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>
          }
          deleteMany: {
            args: Prisma.RefundDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefundUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefundUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>[]
          }
          upsert: {
            args: Prisma.RefundUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefundPayload>
          }
          aggregate: {
            args: Prisma.RefundAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefund>
          }
          groupBy: {
            args: Prisma.RefundGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefundGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefundCountArgs<ExtArgs>
            result: $Utils.Optional<RefundCountAggregateOutputType> | number
          }
        }
      }
      UnpaidUserEmail: {
        payload: Prisma.$UnpaidUserEmailPayload<ExtArgs>
        fields: Prisma.UnpaidUserEmailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnpaidUserEmailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnpaidUserEmailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>
          }
          findFirst: {
            args: Prisma.UnpaidUserEmailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnpaidUserEmailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>
          }
          findMany: {
            args: Prisma.UnpaidUserEmailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>[]
          }
          create: {
            args: Prisma.UnpaidUserEmailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>
          }
          createMany: {
            args: Prisma.UnpaidUserEmailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UnpaidUserEmailCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>[]
          }
          delete: {
            args: Prisma.UnpaidUserEmailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>
          }
          update: {
            args: Prisma.UnpaidUserEmailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>
          }
          deleteMany: {
            args: Prisma.UnpaidUserEmailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnpaidUserEmailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UnpaidUserEmailUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>[]
          }
          upsert: {
            args: Prisma.UnpaidUserEmailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnpaidUserEmailPayload>
          }
          aggregate: {
            args: Prisma.UnpaidUserEmailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnpaidUserEmail>
          }
          groupBy: {
            args: Prisma.UnpaidUserEmailGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnpaidUserEmailGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnpaidUserEmailCountArgs<ExtArgs>
            result: $Utils.Optional<UnpaidUserEmailCountAggregateOutputType> | number
          }
        }
      }
      ReportView: {
        payload: Prisma.$ReportViewPayload<ExtArgs>
        fields: Prisma.ReportViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>
          }
          findFirst: {
            args: Prisma.ReportViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>
          }
          findMany: {
            args: Prisma.ReportViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>[]
          }
          create: {
            args: Prisma.ReportViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>
          }
          createMany: {
            args: Prisma.ReportViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReportViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>[]
          }
          delete: {
            args: Prisma.ReportViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>
          }
          update: {
            args: Prisma.ReportViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>
          }
          deleteMany: {
            args: Prisma.ReportViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReportViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>[]
          }
          upsert: {
            args: Prisma.ReportViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportViewPayload>
          }
          aggregate: {
            args: Prisma.ReportViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReportView>
          }
          groupBy: {
            args: Prisma.ReportViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportViewCountArgs<ExtArgs>
            result: $Utils.Optional<ReportViewCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetToken: {
        payload: Prisma.$PasswordResetTokenPayload<ExtArgs>
        fields: Prisma.PasswordResetTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findMany: {
            args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          create: {
            args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          createMany: {
            args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          update: {
            args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetToken>
          }
          groupBy: {
            args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetTokenCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
    quizAttempt?: QuizAttemptOmit
    aiContent?: AiContentOmit
    payment?: PaymentOmit
    refund?: RefundOmit
    unpaidUserEmail?: UnpaidUserEmailOmit
    reportView?: ReportViewOmit
    passwordResetToken?: PasswordResetTokenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    passwordResetTokens: number
    payments: number
    quizAttempts: number
    refundsProcessed: number
    reportViews: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passwordResetTokens?: boolean | UserCountOutputTypeCountPasswordResetTokensArgs
    payments?: boolean | UserCountOutputTypeCountPaymentsArgs
    quizAttempts?: boolean | UserCountOutputTypeCountQuizAttemptsArgs
    refundsProcessed?: boolean | UserCountOutputTypeCountRefundsProcessedArgs
    reportViews?: boolean | UserCountOutputTypeCountReportViewsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPasswordResetTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountQuizAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizAttemptWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefundsProcessedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefundWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReportViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportViewWhereInput
  }


  /**
   * Count Type QuizAttemptCountOutputType
   */

  export type QuizAttemptCountOutputType = {
    aiContents: number
    payments: number
    reportViews: number
  }

  export type QuizAttemptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    aiContents?: boolean | QuizAttemptCountOutputTypeCountAiContentsArgs
    payments?: boolean | QuizAttemptCountOutputTypeCountPaymentsArgs
    reportViews?: boolean | QuizAttemptCountOutputTypeCountReportViewsArgs
  }

  // Custom InputTypes
  /**
   * QuizAttemptCountOutputType without action
   */
  export type QuizAttemptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttemptCountOutputType
     */
    select?: QuizAttemptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuizAttemptCountOutputType without action
   */
  export type QuizAttemptCountOutputTypeCountAiContentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiContentWhereInput
  }

  /**
   * QuizAttemptCountOutputType without action
   */
  export type QuizAttemptCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * QuizAttemptCountOutputType without action
   */
  export type QuizAttemptCountOutputTypeCountReportViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportViewWhereInput
  }


  /**
   * Count Type PaymentCountOutputType
   */

  export type PaymentCountOutputType = {
    refunds: number
  }

  export type PaymentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refunds?: boolean | PaymentCountOutputTypeCountRefundsArgs
  }

  // Custom InputTypes
  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCountOutputType
     */
    select?: PaymentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeCountRefundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefundWhereInput
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
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    isUnsubscribed: boolean | null
    sessionId: string | null
    isPaid: boolean | null
    isTemporary: boolean | null
    hasUnlockedFirstReport: boolean | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    isUnsubscribed: boolean | null
    sessionId: string | null
    isPaid: boolean | null
    isTemporary: boolean | null
    hasUnlockedFirstReport: boolean | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    firstName: number
    lastName: number
    isUnsubscribed: number
    sessionId: number
    isPaid: number
    isTemporary: number
    hasUnlockedFirstReport: number
    tempQuizData: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    isUnsubscribed?: true
    sessionId?: true
    isPaid?: true
    isTemporary?: true
    hasUnlockedFirstReport?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    isUnsubscribed?: true
    sessionId?: true
    isPaid?: true
    isTemporary?: true
    hasUnlockedFirstReport?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    isUnsubscribed?: true
    sessionId?: true
    isPaid?: true
    isTemporary?: true
    hasUnlockedFirstReport?: true
    tempQuizData?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
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
    email: string
    password: string
    firstName: string | null
    lastName: string | null
    isUnsubscribed: boolean
    sessionId: string | null
    isPaid: boolean
    isTemporary: boolean
    hasUnlockedFirstReport: boolean
    tempQuizData: JsonValue | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
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
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    isUnsubscribed?: boolean
    sessionId?: boolean
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    passwordResetTokens?: boolean | User$passwordResetTokensArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    quizAttempts?: boolean | User$quizAttemptsArgs<ExtArgs>
    refundsProcessed?: boolean | User$refundsProcessedArgs<ExtArgs>
    reportViews?: boolean | User$reportViewsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    isUnsubscribed?: boolean
    sessionId?: boolean
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    isUnsubscribed?: boolean
    sessionId?: boolean
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    isUnsubscribed?: boolean
    sessionId?: boolean
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "firstName" | "lastName" | "isUnsubscribed" | "sessionId" | "isPaid" | "isTemporary" | "hasUnlockedFirstReport" | "tempQuizData" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passwordResetTokens?: boolean | User$passwordResetTokensArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    quizAttempts?: boolean | User$quizAttemptsArgs<ExtArgs>
    refundsProcessed?: boolean | User$refundsProcessedArgs<ExtArgs>
    reportViews?: boolean | User$reportViewsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      passwordResetTokens: Prisma.$PasswordResetTokenPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      quizAttempts: Prisma.$QuizAttemptPayload<ExtArgs>[]
      refundsProcessed: Prisma.$RefundPayload<ExtArgs>[]
      reportViews: Prisma.$ReportViewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string
      firstName: string | null
      lastName: string | null
      isUnsubscribed: boolean
      sessionId: string | null
      isPaid: boolean
      isTemporary: boolean
      hasUnlockedFirstReport: boolean
      tempQuizData: Prisma.JsonValue | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
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
    passwordResetTokens<T extends User$passwordResetTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$passwordResetTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends User$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quizAttempts<T extends User$quizAttemptsArgs<ExtArgs> = {}>(args?: Subset<T, User$quizAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    refundsProcessed<T extends User$refundsProcessedArgs<ExtArgs> = {}>(args?: Subset<T, User$refundsProcessedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reportViews<T extends User$reportViewsArgs<ExtArgs> = {}>(args?: Subset<T, User$reportViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly isUnsubscribed: FieldRef<"User", 'Boolean'>
    readonly sessionId: FieldRef<"User", 'String'>
    readonly isPaid: FieldRef<"User", 'Boolean'>
    readonly isTemporary: FieldRef<"User", 'Boolean'>
    readonly hasUnlockedFirstReport: FieldRef<"User", 'Boolean'>
    readonly tempQuizData: FieldRef<"User", 'Json'>
    readonly expiresAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User.passwordResetTokens
   */
  export type User$passwordResetTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    cursor?: PasswordResetTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * User.payments
   */
  export type User$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.quizAttempts
   */
  export type User$quizAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    where?: QuizAttemptWhereInput
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    cursor?: QuizAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * User.refundsProcessed
   */
  export type User$refundsProcessedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    where?: RefundWhereInput
    orderBy?: RefundOrderByWithRelationInput | RefundOrderByWithRelationInput[]
    cursor?: RefundWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefundScalarFieldEnum | RefundScalarFieldEnum[]
  }

  /**
   * User.reportViews
   */
  export type User$reportViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    where?: ReportViewWhereInput
    orderBy?: ReportViewOrderByWithRelationInput | ReportViewOrderByWithRelationInput[]
    cursor?: ReportViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportViewScalarFieldEnum | ReportViewScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model QuizAttempt
   */

  export type AggregateQuizAttempt = {
    _count: QuizAttemptCountAggregateOutputType | null
    _avg: QuizAttemptAvgAggregateOutputType | null
    _sum: QuizAttemptSumAggregateOutputType | null
    _min: QuizAttemptMinAggregateOutputType | null
    _max: QuizAttemptMaxAggregateOutputType | null
  }

  export type QuizAttemptAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type QuizAttemptSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type QuizAttemptMinAggregateOutputType = {
    id: number | null
    userId: number | null
    sessionId: string | null
    isPaid: boolean | null
    completedAt: Date | null
  }

  export type QuizAttemptMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    sessionId: string | null
    isPaid: boolean | null
    completedAt: Date | null
  }

  export type QuizAttemptCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    quizData: number
    aiContent: number
    isPaid: number
    completedAt: number
    _all: number
  }


  export type QuizAttemptAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type QuizAttemptSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type QuizAttemptMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    isPaid?: true
    completedAt?: true
  }

  export type QuizAttemptMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    isPaid?: true
    completedAt?: true
  }

  export type QuizAttemptCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    quizData?: true
    aiContent?: true
    isPaid?: true
    completedAt?: true
    _all?: true
  }

  export type QuizAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizAttempt to aggregate.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizAttempts
    **/
    _count?: true | QuizAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizAttemptMaxAggregateInputType
  }

  export type GetQuizAttemptAggregateType<T extends QuizAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizAttempt[P]>
      : GetScalarType<T[P], AggregateQuizAttempt[P]>
  }




  export type QuizAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizAttemptWhereInput
    orderBy?: QuizAttemptOrderByWithAggregationInput | QuizAttemptOrderByWithAggregationInput[]
    by: QuizAttemptScalarFieldEnum[] | QuizAttemptScalarFieldEnum
    having?: QuizAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizAttemptCountAggregateInputType | true
    _avg?: QuizAttemptAvgAggregateInputType
    _sum?: QuizAttemptSumAggregateInputType
    _min?: QuizAttemptMinAggregateInputType
    _max?: QuizAttemptMaxAggregateInputType
  }

  export type QuizAttemptGroupByOutputType = {
    id: number
    userId: number | null
    sessionId: string | null
    quizData: JsonValue
    aiContent: JsonValue | null
    isPaid: boolean
    completedAt: Date
    _count: QuizAttemptCountAggregateOutputType | null
    _avg: QuizAttemptAvgAggregateOutputType | null
    _sum: QuizAttemptSumAggregateOutputType | null
    _min: QuizAttemptMinAggregateOutputType | null
    _max: QuizAttemptMaxAggregateOutputType | null
  }

  type GetQuizAttemptGroupByPayload<T extends QuizAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], QuizAttemptGroupByOutputType[P]>
        }
      >
    >


  export type QuizAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizData?: boolean
    aiContent?: boolean
    isPaid?: boolean
    completedAt?: boolean
    aiContents?: boolean | QuizAttempt$aiContentsArgs<ExtArgs>
    payments?: boolean | QuizAttempt$paymentsArgs<ExtArgs>
    user?: boolean | QuizAttempt$userArgs<ExtArgs>
    reportViews?: boolean | QuizAttempt$reportViewsArgs<ExtArgs>
    _count?: boolean | QuizAttemptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizAttempt"]>

  export type QuizAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizData?: boolean
    aiContent?: boolean
    isPaid?: boolean
    completedAt?: boolean
    user?: boolean | QuizAttempt$userArgs<ExtArgs>
  }, ExtArgs["result"]["quizAttempt"]>

  export type QuizAttemptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizData?: boolean
    aiContent?: boolean
    isPaid?: boolean
    completedAt?: boolean
    user?: boolean | QuizAttempt$userArgs<ExtArgs>
  }, ExtArgs["result"]["quizAttempt"]>

  export type QuizAttemptSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizData?: boolean
    aiContent?: boolean
    isPaid?: boolean
    completedAt?: boolean
  }

  export type QuizAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "quizData" | "aiContent" | "isPaid" | "completedAt", ExtArgs["result"]["quizAttempt"]>
  export type QuizAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    aiContents?: boolean | QuizAttempt$aiContentsArgs<ExtArgs>
    payments?: boolean | QuizAttempt$paymentsArgs<ExtArgs>
    user?: boolean | QuizAttempt$userArgs<ExtArgs>
    reportViews?: boolean | QuizAttempt$reportViewsArgs<ExtArgs>
    _count?: boolean | QuizAttemptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuizAttemptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | QuizAttempt$userArgs<ExtArgs>
  }
  export type QuizAttemptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | QuizAttempt$userArgs<ExtArgs>
  }

  export type $QuizAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizAttempt"
    objects: {
      aiContents: Prisma.$AiContentPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs> | null
      reportViews: Prisma.$ReportViewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number | null
      sessionId: string | null
      quizData: Prisma.JsonValue
      aiContent: Prisma.JsonValue | null
      isPaid: boolean
      completedAt: Date
    }, ExtArgs["result"]["quizAttempt"]>
    composites: {}
  }

  type QuizAttemptGetPayload<S extends boolean | null | undefined | QuizAttemptDefaultArgs> = $Result.GetResult<Prisma.$QuizAttemptPayload, S>

  type QuizAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizAttemptCountAggregateInputType | true
    }

  export interface QuizAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizAttempt'], meta: { name: 'QuizAttempt' } }
    /**
     * Find zero or one QuizAttempt that matches the filter.
     * @param {QuizAttemptFindUniqueArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizAttemptFindUniqueArgs>(args: SelectSubset<T, QuizAttemptFindUniqueArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizAttemptFindUniqueOrThrowArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptFindFirstArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizAttemptFindFirstArgs>(args?: SelectSubset<T, QuizAttemptFindFirstArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptFindFirstOrThrowArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizAttempts
     * const quizAttempts = await prisma.quizAttempt.findMany()
     * 
     * // Get first 10 QuizAttempts
     * const quizAttempts = await prisma.quizAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizAttemptWithIdOnly = await prisma.quizAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizAttemptFindManyArgs>(args?: SelectSubset<T, QuizAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizAttempt.
     * @param {QuizAttemptCreateArgs} args - Arguments to create a QuizAttempt.
     * @example
     * // Create one QuizAttempt
     * const QuizAttempt = await prisma.quizAttempt.create({
     *   data: {
     *     // ... data to create a QuizAttempt
     *   }
     * })
     * 
     */
    create<T extends QuizAttemptCreateArgs>(args: SelectSubset<T, QuizAttemptCreateArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizAttempts.
     * @param {QuizAttemptCreateManyArgs} args - Arguments to create many QuizAttempts.
     * @example
     * // Create many QuizAttempts
     * const quizAttempt = await prisma.quizAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizAttemptCreateManyArgs>(args?: SelectSubset<T, QuizAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizAttempts and returns the data saved in the database.
     * @param {QuizAttemptCreateManyAndReturnArgs} args - Arguments to create many QuizAttempts.
     * @example
     * // Create many QuizAttempts
     * const quizAttempt = await prisma.quizAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizAttempts and only return the `id`
     * const quizAttemptWithIdOnly = await prisma.quizAttempt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizAttempt.
     * @param {QuizAttemptDeleteArgs} args - Arguments to delete one QuizAttempt.
     * @example
     * // Delete one QuizAttempt
     * const QuizAttempt = await prisma.quizAttempt.delete({
     *   where: {
     *     // ... filter to delete one QuizAttempt
     *   }
     * })
     * 
     */
    delete<T extends QuizAttemptDeleteArgs>(args: SelectSubset<T, QuizAttemptDeleteArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizAttempt.
     * @param {QuizAttemptUpdateArgs} args - Arguments to update one QuizAttempt.
     * @example
     * // Update one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizAttemptUpdateArgs>(args: SelectSubset<T, QuizAttemptUpdateArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizAttempts.
     * @param {QuizAttemptDeleteManyArgs} args - Arguments to filter QuizAttempts to delete.
     * @example
     * // Delete a few QuizAttempts
     * const { count } = await prisma.quizAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizAttemptDeleteManyArgs>(args?: SelectSubset<T, QuizAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizAttempts
     * const quizAttempt = await prisma.quizAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizAttemptUpdateManyArgs>(args: SelectSubset<T, QuizAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizAttempts and returns the data updated in the database.
     * @param {QuizAttemptUpdateManyAndReturnArgs} args - Arguments to update many QuizAttempts.
     * @example
     * // Update many QuizAttempts
     * const quizAttempt = await prisma.quizAttempt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizAttempts and only return the `id`
     * const quizAttemptWithIdOnly = await prisma.quizAttempt.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuizAttemptUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizAttempt.
     * @param {QuizAttemptUpsertArgs} args - Arguments to update or create a QuizAttempt.
     * @example
     * // Update or create a QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.upsert({
     *   create: {
     *     // ... data to create a QuizAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizAttempt we want to update
     *   }
     * })
     */
    upsert<T extends QuizAttemptUpsertArgs>(args: SelectSubset<T, QuizAttemptUpsertArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptCountArgs} args - Arguments to filter QuizAttempts to count.
     * @example
     * // Count the number of QuizAttempts
     * const count = await prisma.quizAttempt.count({
     *   where: {
     *     // ... the filter for the QuizAttempts we want to count
     *   }
     * })
    **/
    count<T extends QuizAttemptCountArgs>(
      args?: Subset<T, QuizAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizAttemptAggregateArgs>(args: Subset<T, QuizAttemptAggregateArgs>): Prisma.PrismaPromise<GetQuizAttemptAggregateType<T>>

    /**
     * Group by QuizAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptGroupByArgs} args - Group by arguments.
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
      T extends QuizAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizAttemptGroupByArgs['orderBy'] }
        : { orderBy?: QuizAttemptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizAttempt model
   */
  readonly fields: QuizAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    aiContents<T extends QuizAttempt$aiContentsArgs<ExtArgs> = {}>(args?: Subset<T, QuizAttempt$aiContentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends QuizAttempt$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, QuizAttempt$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends QuizAttempt$userArgs<ExtArgs> = {}>(args?: Subset<T, QuizAttempt$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reportViews<T extends QuizAttempt$reportViewsArgs<ExtArgs> = {}>(args?: Subset<T, QuizAttempt$reportViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the QuizAttempt model
   */
  interface QuizAttemptFieldRefs {
    readonly id: FieldRef<"QuizAttempt", 'Int'>
    readonly userId: FieldRef<"QuizAttempt", 'Int'>
    readonly sessionId: FieldRef<"QuizAttempt", 'String'>
    readonly quizData: FieldRef<"QuizAttempt", 'Json'>
    readonly aiContent: FieldRef<"QuizAttempt", 'Json'>
    readonly isPaid: FieldRef<"QuizAttempt", 'Boolean'>
    readonly completedAt: FieldRef<"QuizAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuizAttempt findUnique
   */
  export type QuizAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt findUniqueOrThrow
   */
  export type QuizAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt findFirst
   */
  export type QuizAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizAttempts.
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizAttempts.
     */
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * QuizAttempt findFirstOrThrow
   */
  export type QuizAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizAttempts.
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizAttempts.
     */
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * QuizAttempt findMany
   */
  export type QuizAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempts to fetch.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizAttempts.
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * QuizAttempt create
   */
  export type QuizAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizAttempt.
     */
    data: XOR<QuizAttemptCreateInput, QuizAttemptUncheckedCreateInput>
  }

  /**
   * QuizAttempt createMany
   */
  export type QuizAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizAttempts.
     */
    data: QuizAttemptCreateManyInput | QuizAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizAttempt createManyAndReturn
   */
  export type QuizAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * The data used to create many QuizAttempts.
     */
    data: QuizAttemptCreateManyInput | QuizAttemptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizAttempt update
   */
  export type QuizAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizAttempt.
     */
    data: XOR<QuizAttemptUpdateInput, QuizAttemptUncheckedUpdateInput>
    /**
     * Choose, which QuizAttempt to update.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt updateMany
   */
  export type QuizAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizAttempts.
     */
    data: XOR<QuizAttemptUpdateManyMutationInput, QuizAttemptUncheckedUpdateManyInput>
    /**
     * Filter which QuizAttempts to update
     */
    where?: QuizAttemptWhereInput
    /**
     * Limit how many QuizAttempts to update.
     */
    limit?: number
  }

  /**
   * QuizAttempt updateManyAndReturn
   */
  export type QuizAttemptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * The data used to update QuizAttempts.
     */
    data: XOR<QuizAttemptUpdateManyMutationInput, QuizAttemptUncheckedUpdateManyInput>
    /**
     * Filter which QuizAttempts to update
     */
    where?: QuizAttemptWhereInput
    /**
     * Limit how many QuizAttempts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizAttempt upsert
   */
  export type QuizAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizAttempt to update in case it exists.
     */
    where: QuizAttemptWhereUniqueInput
    /**
     * In case the QuizAttempt found by the `where` argument doesn't exist, create a new QuizAttempt with this data.
     */
    create: XOR<QuizAttemptCreateInput, QuizAttemptUncheckedCreateInput>
    /**
     * In case the QuizAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizAttemptUpdateInput, QuizAttemptUncheckedUpdateInput>
  }

  /**
   * QuizAttempt delete
   */
  export type QuizAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter which QuizAttempt to delete.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt deleteMany
   */
  export type QuizAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizAttempts to delete
     */
    where?: QuizAttemptWhereInput
    /**
     * Limit how many QuizAttempts to delete.
     */
    limit?: number
  }

  /**
   * QuizAttempt.aiContents
   */
  export type QuizAttempt$aiContentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    where?: AiContentWhereInput
    orderBy?: AiContentOrderByWithRelationInput | AiContentOrderByWithRelationInput[]
    cursor?: AiContentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiContentScalarFieldEnum | AiContentScalarFieldEnum[]
  }

  /**
   * QuizAttempt.payments
   */
  export type QuizAttempt$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * QuizAttempt.user
   */
  export type QuizAttempt$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * QuizAttempt.reportViews
   */
  export type QuizAttempt$reportViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    where?: ReportViewWhereInput
    orderBy?: ReportViewOrderByWithRelationInput | ReportViewOrderByWithRelationInput[]
    cursor?: ReportViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportViewScalarFieldEnum | ReportViewScalarFieldEnum[]
  }

  /**
   * QuizAttempt without action
   */
  export type QuizAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
  }


  /**
   * Model AiContent
   */

  export type AggregateAiContent = {
    _count: AiContentCountAggregateOutputType | null
    _avg: AiContentAvgAggregateOutputType | null
    _sum: AiContentSumAggregateOutputType | null
    _min: AiContentMinAggregateOutputType | null
    _max: AiContentMaxAggregateOutputType | null
  }

  export type AiContentAvgAggregateOutputType = {
    id: number | null
    quizAttemptId: number | null
  }

  export type AiContentSumAggregateOutputType = {
    id: number | null
    quizAttemptId: number | null
  }

  export type AiContentMinAggregateOutputType = {
    id: number | null
    quizAttemptId: number | null
    contentType: string | null
    contentHash: string | null
    generatedAt: Date | null
    createdAt: Date | null
  }

  export type AiContentMaxAggregateOutputType = {
    id: number | null
    quizAttemptId: number | null
    contentType: string | null
    contentHash: string | null
    generatedAt: Date | null
    createdAt: Date | null
  }

  export type AiContentCountAggregateOutputType = {
    id: number
    quizAttemptId: number
    contentType: number
    content: number
    contentHash: number
    generatedAt: number
    createdAt: number
    _all: number
  }


  export type AiContentAvgAggregateInputType = {
    id?: true
    quizAttemptId?: true
  }

  export type AiContentSumAggregateInputType = {
    id?: true
    quizAttemptId?: true
  }

  export type AiContentMinAggregateInputType = {
    id?: true
    quizAttemptId?: true
    contentType?: true
    contentHash?: true
    generatedAt?: true
    createdAt?: true
  }

  export type AiContentMaxAggregateInputType = {
    id?: true
    quizAttemptId?: true
    contentType?: true
    contentHash?: true
    generatedAt?: true
    createdAt?: true
  }

  export type AiContentCountAggregateInputType = {
    id?: true
    quizAttemptId?: true
    contentType?: true
    content?: true
    contentHash?: true
    generatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type AiContentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiContent to aggregate.
     */
    where?: AiContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiContents to fetch.
     */
    orderBy?: AiContentOrderByWithRelationInput | AiContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiContents
    **/
    _count?: true | AiContentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiContentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiContentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiContentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiContentMaxAggregateInputType
  }

  export type GetAiContentAggregateType<T extends AiContentAggregateArgs> = {
        [P in keyof T & keyof AggregateAiContent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiContent[P]>
      : GetScalarType<T[P], AggregateAiContent[P]>
  }




  export type AiContentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiContentWhereInput
    orderBy?: AiContentOrderByWithAggregationInput | AiContentOrderByWithAggregationInput[]
    by: AiContentScalarFieldEnum[] | AiContentScalarFieldEnum
    having?: AiContentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiContentCountAggregateInputType | true
    _avg?: AiContentAvgAggregateInputType
    _sum?: AiContentSumAggregateInputType
    _min?: AiContentMinAggregateInputType
    _max?: AiContentMaxAggregateInputType
  }

  export type AiContentGroupByOutputType = {
    id: number
    quizAttemptId: number
    contentType: string
    content: JsonValue
    contentHash: string | null
    generatedAt: Date
    createdAt: Date
    _count: AiContentCountAggregateOutputType | null
    _avg: AiContentAvgAggregateOutputType | null
    _sum: AiContentSumAggregateOutputType | null
    _min: AiContentMinAggregateOutputType | null
    _max: AiContentMaxAggregateOutputType | null
  }

  type GetAiContentGroupByPayload<T extends AiContentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiContentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiContentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiContentGroupByOutputType[P]>
            : GetScalarType<T[P], AiContentGroupByOutputType[P]>
        }
      >
    >


  export type AiContentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizAttemptId?: boolean
    contentType?: boolean
    content?: boolean
    contentHash?: boolean
    generatedAt?: boolean
    createdAt?: boolean
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiContent"]>

  export type AiContentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizAttemptId?: boolean
    contentType?: boolean
    content?: boolean
    contentHash?: boolean
    generatedAt?: boolean
    createdAt?: boolean
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiContent"]>

  export type AiContentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizAttemptId?: boolean
    contentType?: boolean
    content?: boolean
    contentHash?: boolean
    generatedAt?: boolean
    createdAt?: boolean
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiContent"]>

  export type AiContentSelectScalar = {
    id?: boolean
    quizAttemptId?: boolean
    contentType?: boolean
    content?: boolean
    contentHash?: boolean
    generatedAt?: boolean
    createdAt?: boolean
  }

  export type AiContentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quizAttemptId" | "contentType" | "content" | "contentHash" | "generatedAt" | "createdAt", ExtArgs["result"]["aiContent"]>
  export type AiContentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
  }
  export type AiContentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
  }
  export type AiContentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
  }

  export type $AiContentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiContent"
    objects: {
      quizAttempt: Prisma.$QuizAttemptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      quizAttemptId: number
      contentType: string
      content: Prisma.JsonValue
      contentHash: string | null
      generatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["aiContent"]>
    composites: {}
  }

  type AiContentGetPayload<S extends boolean | null | undefined | AiContentDefaultArgs> = $Result.GetResult<Prisma.$AiContentPayload, S>

  type AiContentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiContentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiContentCountAggregateInputType | true
    }

  export interface AiContentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiContent'], meta: { name: 'AiContent' } }
    /**
     * Find zero or one AiContent that matches the filter.
     * @param {AiContentFindUniqueArgs} args - Arguments to find a AiContent
     * @example
     * // Get one AiContent
     * const aiContent = await prisma.aiContent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiContentFindUniqueArgs>(args: SelectSubset<T, AiContentFindUniqueArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiContent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiContentFindUniqueOrThrowArgs} args - Arguments to find a AiContent
     * @example
     * // Get one AiContent
     * const aiContent = await prisma.aiContent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiContentFindUniqueOrThrowArgs>(args: SelectSubset<T, AiContentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiContent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentFindFirstArgs} args - Arguments to find a AiContent
     * @example
     * // Get one AiContent
     * const aiContent = await prisma.aiContent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiContentFindFirstArgs>(args?: SelectSubset<T, AiContentFindFirstArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiContent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentFindFirstOrThrowArgs} args - Arguments to find a AiContent
     * @example
     * // Get one AiContent
     * const aiContent = await prisma.aiContent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiContentFindFirstOrThrowArgs>(args?: SelectSubset<T, AiContentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiContents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiContents
     * const aiContents = await prisma.aiContent.findMany()
     * 
     * // Get first 10 AiContents
     * const aiContents = await prisma.aiContent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiContentWithIdOnly = await prisma.aiContent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiContentFindManyArgs>(args?: SelectSubset<T, AiContentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiContent.
     * @param {AiContentCreateArgs} args - Arguments to create a AiContent.
     * @example
     * // Create one AiContent
     * const AiContent = await prisma.aiContent.create({
     *   data: {
     *     // ... data to create a AiContent
     *   }
     * })
     * 
     */
    create<T extends AiContentCreateArgs>(args: SelectSubset<T, AiContentCreateArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiContents.
     * @param {AiContentCreateManyArgs} args - Arguments to create many AiContents.
     * @example
     * // Create many AiContents
     * const aiContent = await prisma.aiContent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiContentCreateManyArgs>(args?: SelectSubset<T, AiContentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiContents and returns the data saved in the database.
     * @param {AiContentCreateManyAndReturnArgs} args - Arguments to create many AiContents.
     * @example
     * // Create many AiContents
     * const aiContent = await prisma.aiContent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiContents and only return the `id`
     * const aiContentWithIdOnly = await prisma.aiContent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiContentCreateManyAndReturnArgs>(args?: SelectSubset<T, AiContentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiContent.
     * @param {AiContentDeleteArgs} args - Arguments to delete one AiContent.
     * @example
     * // Delete one AiContent
     * const AiContent = await prisma.aiContent.delete({
     *   where: {
     *     // ... filter to delete one AiContent
     *   }
     * })
     * 
     */
    delete<T extends AiContentDeleteArgs>(args: SelectSubset<T, AiContentDeleteArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiContent.
     * @param {AiContentUpdateArgs} args - Arguments to update one AiContent.
     * @example
     * // Update one AiContent
     * const aiContent = await prisma.aiContent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiContentUpdateArgs>(args: SelectSubset<T, AiContentUpdateArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiContents.
     * @param {AiContentDeleteManyArgs} args - Arguments to filter AiContents to delete.
     * @example
     * // Delete a few AiContents
     * const { count } = await prisma.aiContent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiContentDeleteManyArgs>(args?: SelectSubset<T, AiContentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiContents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiContents
     * const aiContent = await prisma.aiContent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiContentUpdateManyArgs>(args: SelectSubset<T, AiContentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiContents and returns the data updated in the database.
     * @param {AiContentUpdateManyAndReturnArgs} args - Arguments to update many AiContents.
     * @example
     * // Update many AiContents
     * const aiContent = await prisma.aiContent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiContents and only return the `id`
     * const aiContentWithIdOnly = await prisma.aiContent.updateManyAndReturn({
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
    updateManyAndReturn<T extends AiContentUpdateManyAndReturnArgs>(args: SelectSubset<T, AiContentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiContent.
     * @param {AiContentUpsertArgs} args - Arguments to update or create a AiContent.
     * @example
     * // Update or create a AiContent
     * const aiContent = await prisma.aiContent.upsert({
     *   create: {
     *     // ... data to create a AiContent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiContent we want to update
     *   }
     * })
     */
    upsert<T extends AiContentUpsertArgs>(args: SelectSubset<T, AiContentUpsertArgs<ExtArgs>>): Prisma__AiContentClient<$Result.GetResult<Prisma.$AiContentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiContents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentCountArgs} args - Arguments to filter AiContents to count.
     * @example
     * // Count the number of AiContents
     * const count = await prisma.aiContent.count({
     *   where: {
     *     // ... the filter for the AiContents we want to count
     *   }
     * })
    **/
    count<T extends AiContentCountArgs>(
      args?: Subset<T, AiContentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiContentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiContent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AiContentAggregateArgs>(args: Subset<T, AiContentAggregateArgs>): Prisma.PrismaPromise<GetAiContentAggregateType<T>>

    /**
     * Group by AiContent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiContentGroupByArgs} args - Group by arguments.
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
      T extends AiContentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiContentGroupByArgs['orderBy'] }
        : { orderBy?: AiContentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AiContentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiContentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiContent model
   */
  readonly fields: AiContentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiContent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiContentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quizAttempt<T extends QuizAttemptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuizAttemptDefaultArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AiContent model
   */
  interface AiContentFieldRefs {
    readonly id: FieldRef<"AiContent", 'Int'>
    readonly quizAttemptId: FieldRef<"AiContent", 'Int'>
    readonly contentType: FieldRef<"AiContent", 'String'>
    readonly content: FieldRef<"AiContent", 'Json'>
    readonly contentHash: FieldRef<"AiContent", 'String'>
    readonly generatedAt: FieldRef<"AiContent", 'DateTime'>
    readonly createdAt: FieldRef<"AiContent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiContent findUnique
   */
  export type AiContentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * Filter, which AiContent to fetch.
     */
    where: AiContentWhereUniqueInput
  }

  /**
   * AiContent findUniqueOrThrow
   */
  export type AiContentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * Filter, which AiContent to fetch.
     */
    where: AiContentWhereUniqueInput
  }

  /**
   * AiContent findFirst
   */
  export type AiContentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * Filter, which AiContent to fetch.
     */
    where?: AiContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiContents to fetch.
     */
    orderBy?: AiContentOrderByWithRelationInput | AiContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiContents.
     */
    cursor?: AiContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiContents.
     */
    distinct?: AiContentScalarFieldEnum | AiContentScalarFieldEnum[]
  }

  /**
   * AiContent findFirstOrThrow
   */
  export type AiContentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * Filter, which AiContent to fetch.
     */
    where?: AiContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiContents to fetch.
     */
    orderBy?: AiContentOrderByWithRelationInput | AiContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiContents.
     */
    cursor?: AiContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiContents.
     */
    distinct?: AiContentScalarFieldEnum | AiContentScalarFieldEnum[]
  }

  /**
   * AiContent findMany
   */
  export type AiContentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * Filter, which AiContents to fetch.
     */
    where?: AiContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiContents to fetch.
     */
    orderBy?: AiContentOrderByWithRelationInput | AiContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiContents.
     */
    cursor?: AiContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiContents.
     */
    skip?: number
    distinct?: AiContentScalarFieldEnum | AiContentScalarFieldEnum[]
  }

  /**
   * AiContent create
   */
  export type AiContentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * The data needed to create a AiContent.
     */
    data: XOR<AiContentCreateInput, AiContentUncheckedCreateInput>
  }

  /**
   * AiContent createMany
   */
  export type AiContentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiContents.
     */
    data: AiContentCreateManyInput | AiContentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiContent createManyAndReturn
   */
  export type AiContentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * The data used to create many AiContents.
     */
    data: AiContentCreateManyInput | AiContentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiContent update
   */
  export type AiContentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * The data needed to update a AiContent.
     */
    data: XOR<AiContentUpdateInput, AiContentUncheckedUpdateInput>
    /**
     * Choose, which AiContent to update.
     */
    where: AiContentWhereUniqueInput
  }

  /**
   * AiContent updateMany
   */
  export type AiContentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiContents.
     */
    data: XOR<AiContentUpdateManyMutationInput, AiContentUncheckedUpdateManyInput>
    /**
     * Filter which AiContents to update
     */
    where?: AiContentWhereInput
    /**
     * Limit how many AiContents to update.
     */
    limit?: number
  }

  /**
   * AiContent updateManyAndReturn
   */
  export type AiContentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * The data used to update AiContents.
     */
    data: XOR<AiContentUpdateManyMutationInput, AiContentUncheckedUpdateManyInput>
    /**
     * Filter which AiContents to update
     */
    where?: AiContentWhereInput
    /**
     * Limit how many AiContents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiContent upsert
   */
  export type AiContentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * The filter to search for the AiContent to update in case it exists.
     */
    where: AiContentWhereUniqueInput
    /**
     * In case the AiContent found by the `where` argument doesn't exist, create a new AiContent with this data.
     */
    create: XOR<AiContentCreateInput, AiContentUncheckedCreateInput>
    /**
     * In case the AiContent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiContentUpdateInput, AiContentUncheckedUpdateInput>
  }

  /**
   * AiContent delete
   */
  export type AiContentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
    /**
     * Filter which AiContent to delete.
     */
    where: AiContentWhereUniqueInput
  }

  /**
   * AiContent deleteMany
   */
  export type AiContentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiContents to delete
     */
    where?: AiContentWhereInput
    /**
     * Limit how many AiContents to delete.
     */
    limit?: number
  }

  /**
   * AiContent without action
   */
  export type AiContentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiContent
     */
    select?: AiContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiContent
     */
    omit?: AiContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiContentInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    amount: Decimal | null
    quizAttemptId: number | null
    version: number | null
  }

  export type PaymentSumAggregateOutputType = {
    id: number | null
    userId: number | null
    amount: Decimal | null
    quizAttemptId: number | null
    version: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: number | null
    userId: number | null
    amount: Decimal | null
    currency: string | null
    type: string | null
    stripePaymentIntentId: string | null
    paypalOrderId: string | null
    status: string | null
    quizAttemptId: number | null
    createdAt: Date | null
    completedAt: Date | null
    version: number | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    amount: Decimal | null
    currency: string | null
    type: string | null
    stripePaymentIntentId: string | null
    paypalOrderId: string | null
    status: string | null
    quizAttemptId: number | null
    createdAt: Date | null
    completedAt: Date | null
    version: number | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    userId: number
    amount: number
    currency: number
    type: number
    stripePaymentIntentId: number
    paypalOrderId: number
    status: number
    quizAttemptId: number
    createdAt: number
    completedAt: number
    version: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    quizAttemptId?: true
    version?: true
  }

  export type PaymentSumAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    quizAttemptId?: true
    version?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    type?: true
    stripePaymentIntentId?: true
    paypalOrderId?: true
    status?: true
    quizAttemptId?: true
    createdAt?: true
    completedAt?: true
    version?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    type?: true
    stripePaymentIntentId?: true
    paypalOrderId?: true
    status?: true
    quizAttemptId?: true
    createdAt?: true
    completedAt?: true
    version?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    type?: true
    stripePaymentIntentId?: true
    paypalOrderId?: true
    status?: true
    quizAttemptId?: true
    createdAt?: true
    completedAt?: true
    version?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: number
    userId: number
    amount: Decimal
    currency: string
    type: string
    stripePaymentIntentId: string | null
    paypalOrderId: string | null
    status: string
    quizAttemptId: number | null
    createdAt: Date
    completedAt: Date | null
    version: number
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    stripePaymentIntentId?: boolean
    paypalOrderId?: boolean
    status?: boolean
    quizAttemptId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    version?: boolean
    quizAttempt?: boolean | Payment$quizAttemptArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    refunds?: boolean | Payment$refundsArgs<ExtArgs>
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    stripePaymentIntentId?: boolean
    paypalOrderId?: boolean
    status?: boolean
    quizAttemptId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    version?: boolean
    quizAttempt?: boolean | Payment$quizAttemptArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    stripePaymentIntentId?: boolean
    paypalOrderId?: boolean
    status?: boolean
    quizAttemptId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    version?: boolean
    quizAttempt?: boolean | Payment$quizAttemptArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    stripePaymentIntentId?: boolean
    paypalOrderId?: boolean
    status?: boolean
    quizAttemptId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    version?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "amount" | "currency" | "type" | "stripePaymentIntentId" | "paypalOrderId" | "status" | "quizAttemptId" | "createdAt" | "completedAt" | "version", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | Payment$quizAttemptArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    refunds?: boolean | Payment$refundsArgs<ExtArgs>
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | Payment$quizAttemptArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | Payment$quizAttemptArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      quizAttempt: Prisma.$QuizAttemptPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
      refunds: Prisma.$RefundPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      amount: Prisma.Decimal
      currency: string
      type: string
      stripePaymentIntentId: string | null
      paypalOrderId: string | null
      status: string
      quizAttemptId: number | null
      createdAt: Date
      completedAt: Date | null
      version: number
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
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
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
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
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quizAttempt<T extends Payment$quizAttemptArgs<ExtArgs> = {}>(args?: Subset<T, Payment$quizAttemptArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    refunds<T extends Payment$refundsArgs<ExtArgs> = {}>(args?: Subset<T, Payment$refundsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'Int'>
    readonly userId: FieldRef<"Payment", 'Int'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly type: FieldRef<"Payment", 'String'>
    readonly stripePaymentIntentId: FieldRef<"Payment", 'String'>
    readonly paypalOrderId: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'String'>
    readonly quizAttemptId: FieldRef<"Payment", 'Int'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly completedAt: FieldRef<"Payment", 'DateTime'>
    readonly version: FieldRef<"Payment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment.quizAttempt
   */
  export type Payment$quizAttemptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    where?: QuizAttemptWhereInput
  }

  /**
   * Payment.refunds
   */
  export type Payment$refundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    where?: RefundWhereInput
    orderBy?: RefundOrderByWithRelationInput | RefundOrderByWithRelationInput[]
    cursor?: RefundWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefundScalarFieldEnum | RefundScalarFieldEnum[]
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Refund
   */

  export type AggregateRefund = {
    _count: RefundCountAggregateOutputType | null
    _avg: RefundAvgAggregateOutputType | null
    _sum: RefundSumAggregateOutputType | null
    _min: RefundMinAggregateOutputType | null
    _max: RefundMaxAggregateOutputType | null
  }

  export type RefundAvgAggregateOutputType = {
    id: number | null
    paymentId: number | null
    amount: Decimal | null
    adminUserId: number | null
  }

  export type RefundSumAggregateOutputType = {
    id: number | null
    paymentId: number | null
    amount: Decimal | null
    adminUserId: number | null
  }

  export type RefundMinAggregateOutputType = {
    id: number | null
    paymentId: number | null
    amount: Decimal | null
    currency: string | null
    reason: string | null
    status: string | null
    stripeRefundId: string | null
    paypalRefundId: string | null
    adminUserId: number | null
    adminNote: string | null
    createdAt: Date | null
    processedAt: Date | null
  }

  export type RefundMaxAggregateOutputType = {
    id: number | null
    paymentId: number | null
    amount: Decimal | null
    currency: string | null
    reason: string | null
    status: string | null
    stripeRefundId: string | null
    paypalRefundId: string | null
    adminUserId: number | null
    adminNote: string | null
    createdAt: Date | null
    processedAt: Date | null
  }

  export type RefundCountAggregateOutputType = {
    id: number
    paymentId: number
    amount: number
    currency: number
    reason: number
    status: number
    stripeRefundId: number
    paypalRefundId: number
    adminUserId: number
    adminNote: number
    createdAt: number
    processedAt: number
    _all: number
  }


  export type RefundAvgAggregateInputType = {
    id?: true
    paymentId?: true
    amount?: true
    adminUserId?: true
  }

  export type RefundSumAggregateInputType = {
    id?: true
    paymentId?: true
    amount?: true
    adminUserId?: true
  }

  export type RefundMinAggregateInputType = {
    id?: true
    paymentId?: true
    amount?: true
    currency?: true
    reason?: true
    status?: true
    stripeRefundId?: true
    paypalRefundId?: true
    adminUserId?: true
    adminNote?: true
    createdAt?: true
    processedAt?: true
  }

  export type RefundMaxAggregateInputType = {
    id?: true
    paymentId?: true
    amount?: true
    currency?: true
    reason?: true
    status?: true
    stripeRefundId?: true
    paypalRefundId?: true
    adminUserId?: true
    adminNote?: true
    createdAt?: true
    processedAt?: true
  }

  export type RefundCountAggregateInputType = {
    id?: true
    paymentId?: true
    amount?: true
    currency?: true
    reason?: true
    status?: true
    stripeRefundId?: true
    paypalRefundId?: true
    adminUserId?: true
    adminNote?: true
    createdAt?: true
    processedAt?: true
    _all?: true
  }

  export type RefundAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Refund to aggregate.
     */
    where?: RefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Refunds to fetch.
     */
    orderBy?: RefundOrderByWithRelationInput | RefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Refunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Refunds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Refunds
    **/
    _count?: true | RefundCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RefundAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RefundSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefundMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefundMaxAggregateInputType
  }

  export type GetRefundAggregateType<T extends RefundAggregateArgs> = {
        [P in keyof T & keyof AggregateRefund]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefund[P]>
      : GetScalarType<T[P], AggregateRefund[P]>
  }




  export type RefundGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefundWhereInput
    orderBy?: RefundOrderByWithAggregationInput | RefundOrderByWithAggregationInput[]
    by: RefundScalarFieldEnum[] | RefundScalarFieldEnum
    having?: RefundScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefundCountAggregateInputType | true
    _avg?: RefundAvgAggregateInputType
    _sum?: RefundSumAggregateInputType
    _min?: RefundMinAggregateInputType
    _max?: RefundMaxAggregateInputType
  }

  export type RefundGroupByOutputType = {
    id: number
    paymentId: number
    amount: Decimal
    currency: string
    reason: string
    status: string
    stripeRefundId: string | null
    paypalRefundId: string | null
    adminUserId: number | null
    adminNote: string | null
    createdAt: Date
    processedAt: Date | null
    _count: RefundCountAggregateOutputType | null
    _avg: RefundAvgAggregateOutputType | null
    _sum: RefundSumAggregateOutputType | null
    _min: RefundMinAggregateOutputType | null
    _max: RefundMaxAggregateOutputType | null
  }

  type GetRefundGroupByPayload<T extends RefundGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefundGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefundGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefundGroupByOutputType[P]>
            : GetScalarType<T[P], RefundGroupByOutputType[P]>
        }
      >
    >


  export type RefundSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    paymentId?: boolean
    amount?: boolean
    currency?: boolean
    reason?: boolean
    status?: boolean
    stripeRefundId?: boolean
    paypalRefundId?: boolean
    adminUserId?: boolean
    adminNote?: boolean
    createdAt?: boolean
    processedAt?: boolean
    adminUser?: boolean | Refund$adminUserArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refund"]>

  export type RefundSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    paymentId?: boolean
    amount?: boolean
    currency?: boolean
    reason?: boolean
    status?: boolean
    stripeRefundId?: boolean
    paypalRefundId?: boolean
    adminUserId?: boolean
    adminNote?: boolean
    createdAt?: boolean
    processedAt?: boolean
    adminUser?: boolean | Refund$adminUserArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refund"]>

  export type RefundSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    paymentId?: boolean
    amount?: boolean
    currency?: boolean
    reason?: boolean
    status?: boolean
    stripeRefundId?: boolean
    paypalRefundId?: boolean
    adminUserId?: boolean
    adminNote?: boolean
    createdAt?: boolean
    processedAt?: boolean
    adminUser?: boolean | Refund$adminUserArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refund"]>

  export type RefundSelectScalar = {
    id?: boolean
    paymentId?: boolean
    amount?: boolean
    currency?: boolean
    reason?: boolean
    status?: boolean
    stripeRefundId?: boolean
    paypalRefundId?: boolean
    adminUserId?: boolean
    adminNote?: boolean
    createdAt?: boolean
    processedAt?: boolean
  }

  export type RefundOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "paymentId" | "amount" | "currency" | "reason" | "status" | "stripeRefundId" | "paypalRefundId" | "adminUserId" | "adminNote" | "createdAt" | "processedAt", ExtArgs["result"]["refund"]>
  export type RefundInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    adminUser?: boolean | Refund$adminUserArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }
  export type RefundIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    adminUser?: boolean | Refund$adminUserArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }
  export type RefundIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    adminUser?: boolean | Refund$adminUserArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }

  export type $RefundPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Refund"
    objects: {
      adminUser: Prisma.$UserPayload<ExtArgs> | null
      payment: Prisma.$PaymentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      paymentId: number
      amount: Prisma.Decimal
      currency: string
      reason: string
      status: string
      stripeRefundId: string | null
      paypalRefundId: string | null
      adminUserId: number | null
      adminNote: string | null
      createdAt: Date
      processedAt: Date | null
    }, ExtArgs["result"]["refund"]>
    composites: {}
  }

  type RefundGetPayload<S extends boolean | null | undefined | RefundDefaultArgs> = $Result.GetResult<Prisma.$RefundPayload, S>

  type RefundCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefundFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefundCountAggregateInputType | true
    }

  export interface RefundDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Refund'], meta: { name: 'Refund' } }
    /**
     * Find zero or one Refund that matches the filter.
     * @param {RefundFindUniqueArgs} args - Arguments to find a Refund
     * @example
     * // Get one Refund
     * const refund = await prisma.refund.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefundFindUniqueArgs>(args: SelectSubset<T, RefundFindUniqueArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Refund that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefundFindUniqueOrThrowArgs} args - Arguments to find a Refund
     * @example
     * // Get one Refund
     * const refund = await prisma.refund.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefundFindUniqueOrThrowArgs>(args: SelectSubset<T, RefundFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Refund that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundFindFirstArgs} args - Arguments to find a Refund
     * @example
     * // Get one Refund
     * const refund = await prisma.refund.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefundFindFirstArgs>(args?: SelectSubset<T, RefundFindFirstArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Refund that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundFindFirstOrThrowArgs} args - Arguments to find a Refund
     * @example
     * // Get one Refund
     * const refund = await prisma.refund.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefundFindFirstOrThrowArgs>(args?: SelectSubset<T, RefundFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Refunds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Refunds
     * const refunds = await prisma.refund.findMany()
     * 
     * // Get first 10 Refunds
     * const refunds = await prisma.refund.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refundWithIdOnly = await prisma.refund.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefundFindManyArgs>(args?: SelectSubset<T, RefundFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Refund.
     * @param {RefundCreateArgs} args - Arguments to create a Refund.
     * @example
     * // Create one Refund
     * const Refund = await prisma.refund.create({
     *   data: {
     *     // ... data to create a Refund
     *   }
     * })
     * 
     */
    create<T extends RefundCreateArgs>(args: SelectSubset<T, RefundCreateArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Refunds.
     * @param {RefundCreateManyArgs} args - Arguments to create many Refunds.
     * @example
     * // Create many Refunds
     * const refund = await prisma.refund.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefundCreateManyArgs>(args?: SelectSubset<T, RefundCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Refunds and returns the data saved in the database.
     * @param {RefundCreateManyAndReturnArgs} args - Arguments to create many Refunds.
     * @example
     * // Create many Refunds
     * const refund = await prisma.refund.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Refunds and only return the `id`
     * const refundWithIdOnly = await prisma.refund.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefundCreateManyAndReturnArgs>(args?: SelectSubset<T, RefundCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Refund.
     * @param {RefundDeleteArgs} args - Arguments to delete one Refund.
     * @example
     * // Delete one Refund
     * const Refund = await prisma.refund.delete({
     *   where: {
     *     // ... filter to delete one Refund
     *   }
     * })
     * 
     */
    delete<T extends RefundDeleteArgs>(args: SelectSubset<T, RefundDeleteArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Refund.
     * @param {RefundUpdateArgs} args - Arguments to update one Refund.
     * @example
     * // Update one Refund
     * const refund = await prisma.refund.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefundUpdateArgs>(args: SelectSubset<T, RefundUpdateArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Refunds.
     * @param {RefundDeleteManyArgs} args - Arguments to filter Refunds to delete.
     * @example
     * // Delete a few Refunds
     * const { count } = await prisma.refund.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefundDeleteManyArgs>(args?: SelectSubset<T, RefundDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Refunds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Refunds
     * const refund = await prisma.refund.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefundUpdateManyArgs>(args: SelectSubset<T, RefundUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Refunds and returns the data updated in the database.
     * @param {RefundUpdateManyAndReturnArgs} args - Arguments to update many Refunds.
     * @example
     * // Update many Refunds
     * const refund = await prisma.refund.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Refunds and only return the `id`
     * const refundWithIdOnly = await prisma.refund.updateManyAndReturn({
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
    updateManyAndReturn<T extends RefundUpdateManyAndReturnArgs>(args: SelectSubset<T, RefundUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Refund.
     * @param {RefundUpsertArgs} args - Arguments to update or create a Refund.
     * @example
     * // Update or create a Refund
     * const refund = await prisma.refund.upsert({
     *   create: {
     *     // ... data to create a Refund
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Refund we want to update
     *   }
     * })
     */
    upsert<T extends RefundUpsertArgs>(args: SelectSubset<T, RefundUpsertArgs<ExtArgs>>): Prisma__RefundClient<$Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Refunds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundCountArgs} args - Arguments to filter Refunds to count.
     * @example
     * // Count the number of Refunds
     * const count = await prisma.refund.count({
     *   where: {
     *     // ... the filter for the Refunds we want to count
     *   }
     * })
    **/
    count<T extends RefundCountArgs>(
      args?: Subset<T, RefundCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefundCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Refund.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RefundAggregateArgs>(args: Subset<T, RefundAggregateArgs>): Prisma.PrismaPromise<GetRefundAggregateType<T>>

    /**
     * Group by Refund.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefundGroupByArgs} args - Group by arguments.
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
      T extends RefundGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefundGroupByArgs['orderBy'] }
        : { orderBy?: RefundGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RefundGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefundGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Refund model
   */
  readonly fields: RefundFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Refund.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefundClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    adminUser<T extends Refund$adminUserArgs<ExtArgs> = {}>(args?: Subset<T, Refund$adminUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    payment<T extends PaymentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaymentDefaultArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Refund model
   */
  interface RefundFieldRefs {
    readonly id: FieldRef<"Refund", 'Int'>
    readonly paymentId: FieldRef<"Refund", 'Int'>
    readonly amount: FieldRef<"Refund", 'Decimal'>
    readonly currency: FieldRef<"Refund", 'String'>
    readonly reason: FieldRef<"Refund", 'String'>
    readonly status: FieldRef<"Refund", 'String'>
    readonly stripeRefundId: FieldRef<"Refund", 'String'>
    readonly paypalRefundId: FieldRef<"Refund", 'String'>
    readonly adminUserId: FieldRef<"Refund", 'Int'>
    readonly adminNote: FieldRef<"Refund", 'String'>
    readonly createdAt: FieldRef<"Refund", 'DateTime'>
    readonly processedAt: FieldRef<"Refund", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Refund findUnique
   */
  export type RefundFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * Filter, which Refund to fetch.
     */
    where: RefundWhereUniqueInput
  }

  /**
   * Refund findUniqueOrThrow
   */
  export type RefundFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * Filter, which Refund to fetch.
     */
    where: RefundWhereUniqueInput
  }

  /**
   * Refund findFirst
   */
  export type RefundFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * Filter, which Refund to fetch.
     */
    where?: RefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Refunds to fetch.
     */
    orderBy?: RefundOrderByWithRelationInput | RefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Refunds.
     */
    cursor?: RefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Refunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Refunds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Refunds.
     */
    distinct?: RefundScalarFieldEnum | RefundScalarFieldEnum[]
  }

  /**
   * Refund findFirstOrThrow
   */
  export type RefundFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * Filter, which Refund to fetch.
     */
    where?: RefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Refunds to fetch.
     */
    orderBy?: RefundOrderByWithRelationInput | RefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Refunds.
     */
    cursor?: RefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Refunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Refunds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Refunds.
     */
    distinct?: RefundScalarFieldEnum | RefundScalarFieldEnum[]
  }

  /**
   * Refund findMany
   */
  export type RefundFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * Filter, which Refunds to fetch.
     */
    where?: RefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Refunds to fetch.
     */
    orderBy?: RefundOrderByWithRelationInput | RefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Refunds.
     */
    cursor?: RefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Refunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Refunds.
     */
    skip?: number
    distinct?: RefundScalarFieldEnum | RefundScalarFieldEnum[]
  }

  /**
   * Refund create
   */
  export type RefundCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * The data needed to create a Refund.
     */
    data: XOR<RefundCreateInput, RefundUncheckedCreateInput>
  }

  /**
   * Refund createMany
   */
  export type RefundCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Refunds.
     */
    data: RefundCreateManyInput | RefundCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Refund createManyAndReturn
   */
  export type RefundCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * The data used to create many Refunds.
     */
    data: RefundCreateManyInput | RefundCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Refund update
   */
  export type RefundUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * The data needed to update a Refund.
     */
    data: XOR<RefundUpdateInput, RefundUncheckedUpdateInput>
    /**
     * Choose, which Refund to update.
     */
    where: RefundWhereUniqueInput
  }

  /**
   * Refund updateMany
   */
  export type RefundUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Refunds.
     */
    data: XOR<RefundUpdateManyMutationInput, RefundUncheckedUpdateManyInput>
    /**
     * Filter which Refunds to update
     */
    where?: RefundWhereInput
    /**
     * Limit how many Refunds to update.
     */
    limit?: number
  }

  /**
   * Refund updateManyAndReturn
   */
  export type RefundUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * The data used to update Refunds.
     */
    data: XOR<RefundUpdateManyMutationInput, RefundUncheckedUpdateManyInput>
    /**
     * Filter which Refunds to update
     */
    where?: RefundWhereInput
    /**
     * Limit how many Refunds to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Refund upsert
   */
  export type RefundUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * The filter to search for the Refund to update in case it exists.
     */
    where: RefundWhereUniqueInput
    /**
     * In case the Refund found by the `where` argument doesn't exist, create a new Refund with this data.
     */
    create: XOR<RefundCreateInput, RefundUncheckedCreateInput>
    /**
     * In case the Refund was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefundUpdateInput, RefundUncheckedUpdateInput>
  }

  /**
   * Refund delete
   */
  export type RefundDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
    /**
     * Filter which Refund to delete.
     */
    where: RefundWhereUniqueInput
  }

  /**
   * Refund deleteMany
   */
  export type RefundDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Refunds to delete
     */
    where?: RefundWhereInput
    /**
     * Limit how many Refunds to delete.
     */
    limit?: number
  }

  /**
   * Refund.adminUser
   */
  export type Refund$adminUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Refund without action
   */
  export type RefundDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Refund
     */
    select?: RefundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Refund
     */
    omit?: RefundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefundInclude<ExtArgs> | null
  }


  /**
   * Model UnpaidUserEmail
   */

  export type AggregateUnpaidUserEmail = {
    _count: UnpaidUserEmailCountAggregateOutputType | null
    _avg: UnpaidUserEmailAvgAggregateOutputType | null
    _sum: UnpaidUserEmailSumAggregateOutputType | null
    _min: UnpaidUserEmailMinAggregateOutputType | null
    _max: UnpaidUserEmailMaxAggregateOutputType | null
  }

  export type UnpaidUserEmailAvgAggregateOutputType = {
    id: number | null
  }

  export type UnpaidUserEmailSumAggregateOutputType = {
    id: number | null
  }

  export type UnpaidUserEmailMinAggregateOutputType = {
    id: number | null
    sessionId: string | null
    email: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type UnpaidUserEmailMaxAggregateOutputType = {
    id: number | null
    sessionId: string | null
    email: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type UnpaidUserEmailCountAggregateOutputType = {
    id: number
    sessionId: number
    email: number
    quizData: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type UnpaidUserEmailAvgAggregateInputType = {
    id?: true
  }

  export type UnpaidUserEmailSumAggregateInputType = {
    id?: true
  }

  export type UnpaidUserEmailMinAggregateInputType = {
    id?: true
    sessionId?: true
    email?: true
    createdAt?: true
    expiresAt?: true
  }

  export type UnpaidUserEmailMaxAggregateInputType = {
    id?: true
    sessionId?: true
    email?: true
    createdAt?: true
    expiresAt?: true
  }

  export type UnpaidUserEmailCountAggregateInputType = {
    id?: true
    sessionId?: true
    email?: true
    quizData?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type UnpaidUserEmailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnpaidUserEmail to aggregate.
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnpaidUserEmails to fetch.
     */
    orderBy?: UnpaidUserEmailOrderByWithRelationInput | UnpaidUserEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnpaidUserEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnpaidUserEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnpaidUserEmails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnpaidUserEmails
    **/
    _count?: true | UnpaidUserEmailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UnpaidUserEmailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UnpaidUserEmailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnpaidUserEmailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnpaidUserEmailMaxAggregateInputType
  }

  export type GetUnpaidUserEmailAggregateType<T extends UnpaidUserEmailAggregateArgs> = {
        [P in keyof T & keyof AggregateUnpaidUserEmail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnpaidUserEmail[P]>
      : GetScalarType<T[P], AggregateUnpaidUserEmail[P]>
  }




  export type UnpaidUserEmailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnpaidUserEmailWhereInput
    orderBy?: UnpaidUserEmailOrderByWithAggregationInput | UnpaidUserEmailOrderByWithAggregationInput[]
    by: UnpaidUserEmailScalarFieldEnum[] | UnpaidUserEmailScalarFieldEnum
    having?: UnpaidUserEmailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnpaidUserEmailCountAggregateInputType | true
    _avg?: UnpaidUserEmailAvgAggregateInputType
    _sum?: UnpaidUserEmailSumAggregateInputType
    _min?: UnpaidUserEmailMinAggregateInputType
    _max?: UnpaidUserEmailMaxAggregateInputType
  }

  export type UnpaidUserEmailGroupByOutputType = {
    id: number
    sessionId: string
    email: string
    quizData: JsonValue
    createdAt: Date
    expiresAt: Date
    _count: UnpaidUserEmailCountAggregateOutputType | null
    _avg: UnpaidUserEmailAvgAggregateOutputType | null
    _sum: UnpaidUserEmailSumAggregateOutputType | null
    _min: UnpaidUserEmailMinAggregateOutputType | null
    _max: UnpaidUserEmailMaxAggregateOutputType | null
  }

  type GetUnpaidUserEmailGroupByPayload<T extends UnpaidUserEmailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnpaidUserEmailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnpaidUserEmailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnpaidUserEmailGroupByOutputType[P]>
            : GetScalarType<T[P], UnpaidUserEmailGroupByOutputType[P]>
        }
      >
    >


  export type UnpaidUserEmailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    email?: boolean
    quizData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["unpaidUserEmail"]>

  export type UnpaidUserEmailSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    email?: boolean
    quizData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["unpaidUserEmail"]>

  export type UnpaidUserEmailSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    email?: boolean
    quizData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["unpaidUserEmail"]>

  export type UnpaidUserEmailSelectScalar = {
    id?: boolean
    sessionId?: boolean
    email?: boolean
    quizData?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type UnpaidUserEmailOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "email" | "quizData" | "createdAt" | "expiresAt", ExtArgs["result"]["unpaidUserEmail"]>

  export type $UnpaidUserEmailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UnpaidUserEmail"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      sessionId: string
      email: string
      quizData: Prisma.JsonValue
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["unpaidUserEmail"]>
    composites: {}
  }

  type UnpaidUserEmailGetPayload<S extends boolean | null | undefined | UnpaidUserEmailDefaultArgs> = $Result.GetResult<Prisma.$UnpaidUserEmailPayload, S>

  type UnpaidUserEmailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnpaidUserEmailFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnpaidUserEmailCountAggregateInputType | true
    }

  export interface UnpaidUserEmailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnpaidUserEmail'], meta: { name: 'UnpaidUserEmail' } }
    /**
     * Find zero or one UnpaidUserEmail that matches the filter.
     * @param {UnpaidUserEmailFindUniqueArgs} args - Arguments to find a UnpaidUserEmail
     * @example
     * // Get one UnpaidUserEmail
     * const unpaidUserEmail = await prisma.unpaidUserEmail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnpaidUserEmailFindUniqueArgs>(args: SelectSubset<T, UnpaidUserEmailFindUniqueArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UnpaidUserEmail that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnpaidUserEmailFindUniqueOrThrowArgs} args - Arguments to find a UnpaidUserEmail
     * @example
     * // Get one UnpaidUserEmail
     * const unpaidUserEmail = await prisma.unpaidUserEmail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnpaidUserEmailFindUniqueOrThrowArgs>(args: SelectSubset<T, UnpaidUserEmailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnpaidUserEmail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailFindFirstArgs} args - Arguments to find a UnpaidUserEmail
     * @example
     * // Get one UnpaidUserEmail
     * const unpaidUserEmail = await prisma.unpaidUserEmail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnpaidUserEmailFindFirstArgs>(args?: SelectSubset<T, UnpaidUserEmailFindFirstArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnpaidUserEmail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailFindFirstOrThrowArgs} args - Arguments to find a UnpaidUserEmail
     * @example
     * // Get one UnpaidUserEmail
     * const unpaidUserEmail = await prisma.unpaidUserEmail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnpaidUserEmailFindFirstOrThrowArgs>(args?: SelectSubset<T, UnpaidUserEmailFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UnpaidUserEmails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnpaidUserEmails
     * const unpaidUserEmails = await prisma.unpaidUserEmail.findMany()
     * 
     * // Get first 10 UnpaidUserEmails
     * const unpaidUserEmails = await prisma.unpaidUserEmail.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unpaidUserEmailWithIdOnly = await prisma.unpaidUserEmail.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UnpaidUserEmailFindManyArgs>(args?: SelectSubset<T, UnpaidUserEmailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UnpaidUserEmail.
     * @param {UnpaidUserEmailCreateArgs} args - Arguments to create a UnpaidUserEmail.
     * @example
     * // Create one UnpaidUserEmail
     * const UnpaidUserEmail = await prisma.unpaidUserEmail.create({
     *   data: {
     *     // ... data to create a UnpaidUserEmail
     *   }
     * })
     * 
     */
    create<T extends UnpaidUserEmailCreateArgs>(args: SelectSubset<T, UnpaidUserEmailCreateArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UnpaidUserEmails.
     * @param {UnpaidUserEmailCreateManyArgs} args - Arguments to create many UnpaidUserEmails.
     * @example
     * // Create many UnpaidUserEmails
     * const unpaidUserEmail = await prisma.unpaidUserEmail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnpaidUserEmailCreateManyArgs>(args?: SelectSubset<T, UnpaidUserEmailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UnpaidUserEmails and returns the data saved in the database.
     * @param {UnpaidUserEmailCreateManyAndReturnArgs} args - Arguments to create many UnpaidUserEmails.
     * @example
     * // Create many UnpaidUserEmails
     * const unpaidUserEmail = await prisma.unpaidUserEmail.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UnpaidUserEmails and only return the `id`
     * const unpaidUserEmailWithIdOnly = await prisma.unpaidUserEmail.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UnpaidUserEmailCreateManyAndReturnArgs>(args?: SelectSubset<T, UnpaidUserEmailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UnpaidUserEmail.
     * @param {UnpaidUserEmailDeleteArgs} args - Arguments to delete one UnpaidUserEmail.
     * @example
     * // Delete one UnpaidUserEmail
     * const UnpaidUserEmail = await prisma.unpaidUserEmail.delete({
     *   where: {
     *     // ... filter to delete one UnpaidUserEmail
     *   }
     * })
     * 
     */
    delete<T extends UnpaidUserEmailDeleteArgs>(args: SelectSubset<T, UnpaidUserEmailDeleteArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UnpaidUserEmail.
     * @param {UnpaidUserEmailUpdateArgs} args - Arguments to update one UnpaidUserEmail.
     * @example
     * // Update one UnpaidUserEmail
     * const unpaidUserEmail = await prisma.unpaidUserEmail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnpaidUserEmailUpdateArgs>(args: SelectSubset<T, UnpaidUserEmailUpdateArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UnpaidUserEmails.
     * @param {UnpaidUserEmailDeleteManyArgs} args - Arguments to filter UnpaidUserEmails to delete.
     * @example
     * // Delete a few UnpaidUserEmails
     * const { count } = await prisma.unpaidUserEmail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnpaidUserEmailDeleteManyArgs>(args?: SelectSubset<T, UnpaidUserEmailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnpaidUserEmails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnpaidUserEmails
     * const unpaidUserEmail = await prisma.unpaidUserEmail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnpaidUserEmailUpdateManyArgs>(args: SelectSubset<T, UnpaidUserEmailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnpaidUserEmails and returns the data updated in the database.
     * @param {UnpaidUserEmailUpdateManyAndReturnArgs} args - Arguments to update many UnpaidUserEmails.
     * @example
     * // Update many UnpaidUserEmails
     * const unpaidUserEmail = await prisma.unpaidUserEmail.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UnpaidUserEmails and only return the `id`
     * const unpaidUserEmailWithIdOnly = await prisma.unpaidUserEmail.updateManyAndReturn({
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
    updateManyAndReturn<T extends UnpaidUserEmailUpdateManyAndReturnArgs>(args: SelectSubset<T, UnpaidUserEmailUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UnpaidUserEmail.
     * @param {UnpaidUserEmailUpsertArgs} args - Arguments to update or create a UnpaidUserEmail.
     * @example
     * // Update or create a UnpaidUserEmail
     * const unpaidUserEmail = await prisma.unpaidUserEmail.upsert({
     *   create: {
     *     // ... data to create a UnpaidUserEmail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnpaidUserEmail we want to update
     *   }
     * })
     */
    upsert<T extends UnpaidUserEmailUpsertArgs>(args: SelectSubset<T, UnpaidUserEmailUpsertArgs<ExtArgs>>): Prisma__UnpaidUserEmailClient<$Result.GetResult<Prisma.$UnpaidUserEmailPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UnpaidUserEmails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailCountArgs} args - Arguments to filter UnpaidUserEmails to count.
     * @example
     * // Count the number of UnpaidUserEmails
     * const count = await prisma.unpaidUserEmail.count({
     *   where: {
     *     // ... the filter for the UnpaidUserEmails we want to count
     *   }
     * })
    **/
    count<T extends UnpaidUserEmailCountArgs>(
      args?: Subset<T, UnpaidUserEmailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnpaidUserEmailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnpaidUserEmail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UnpaidUserEmailAggregateArgs>(args: Subset<T, UnpaidUserEmailAggregateArgs>): Prisma.PrismaPromise<GetUnpaidUserEmailAggregateType<T>>

    /**
     * Group by UnpaidUserEmail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnpaidUserEmailGroupByArgs} args - Group by arguments.
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
      T extends UnpaidUserEmailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnpaidUserEmailGroupByArgs['orderBy'] }
        : { orderBy?: UnpaidUserEmailGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UnpaidUserEmailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnpaidUserEmailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UnpaidUserEmail model
   */
  readonly fields: UnpaidUserEmailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UnpaidUserEmail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnpaidUserEmailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UnpaidUserEmail model
   */
  interface UnpaidUserEmailFieldRefs {
    readonly id: FieldRef<"UnpaidUserEmail", 'Int'>
    readonly sessionId: FieldRef<"UnpaidUserEmail", 'String'>
    readonly email: FieldRef<"UnpaidUserEmail", 'String'>
    readonly quizData: FieldRef<"UnpaidUserEmail", 'Json'>
    readonly createdAt: FieldRef<"UnpaidUserEmail", 'DateTime'>
    readonly expiresAt: FieldRef<"UnpaidUserEmail", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UnpaidUserEmail findUnique
   */
  export type UnpaidUserEmailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * Filter, which UnpaidUserEmail to fetch.
     */
    where: UnpaidUserEmailWhereUniqueInput
  }

  /**
   * UnpaidUserEmail findUniqueOrThrow
   */
  export type UnpaidUserEmailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * Filter, which UnpaidUserEmail to fetch.
     */
    where: UnpaidUserEmailWhereUniqueInput
  }

  /**
   * UnpaidUserEmail findFirst
   */
  export type UnpaidUserEmailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * Filter, which UnpaidUserEmail to fetch.
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnpaidUserEmails to fetch.
     */
    orderBy?: UnpaidUserEmailOrderByWithRelationInput | UnpaidUserEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnpaidUserEmails.
     */
    cursor?: UnpaidUserEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnpaidUserEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnpaidUserEmails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnpaidUserEmails.
     */
    distinct?: UnpaidUserEmailScalarFieldEnum | UnpaidUserEmailScalarFieldEnum[]
  }

  /**
   * UnpaidUserEmail findFirstOrThrow
   */
  export type UnpaidUserEmailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * Filter, which UnpaidUserEmail to fetch.
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnpaidUserEmails to fetch.
     */
    orderBy?: UnpaidUserEmailOrderByWithRelationInput | UnpaidUserEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnpaidUserEmails.
     */
    cursor?: UnpaidUserEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnpaidUserEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnpaidUserEmails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnpaidUserEmails.
     */
    distinct?: UnpaidUserEmailScalarFieldEnum | UnpaidUserEmailScalarFieldEnum[]
  }

  /**
   * UnpaidUserEmail findMany
   */
  export type UnpaidUserEmailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * Filter, which UnpaidUserEmails to fetch.
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnpaidUserEmails to fetch.
     */
    orderBy?: UnpaidUserEmailOrderByWithRelationInput | UnpaidUserEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnpaidUserEmails.
     */
    cursor?: UnpaidUserEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnpaidUserEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnpaidUserEmails.
     */
    skip?: number
    distinct?: UnpaidUserEmailScalarFieldEnum | UnpaidUserEmailScalarFieldEnum[]
  }

  /**
   * UnpaidUserEmail create
   */
  export type UnpaidUserEmailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * The data needed to create a UnpaidUserEmail.
     */
    data: XOR<UnpaidUserEmailCreateInput, UnpaidUserEmailUncheckedCreateInput>
  }

  /**
   * UnpaidUserEmail createMany
   */
  export type UnpaidUserEmailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnpaidUserEmails.
     */
    data: UnpaidUserEmailCreateManyInput | UnpaidUserEmailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UnpaidUserEmail createManyAndReturn
   */
  export type UnpaidUserEmailCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * The data used to create many UnpaidUserEmails.
     */
    data: UnpaidUserEmailCreateManyInput | UnpaidUserEmailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UnpaidUserEmail update
   */
  export type UnpaidUserEmailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * The data needed to update a UnpaidUserEmail.
     */
    data: XOR<UnpaidUserEmailUpdateInput, UnpaidUserEmailUncheckedUpdateInput>
    /**
     * Choose, which UnpaidUserEmail to update.
     */
    where: UnpaidUserEmailWhereUniqueInput
  }

  /**
   * UnpaidUserEmail updateMany
   */
  export type UnpaidUserEmailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnpaidUserEmails.
     */
    data: XOR<UnpaidUserEmailUpdateManyMutationInput, UnpaidUserEmailUncheckedUpdateManyInput>
    /**
     * Filter which UnpaidUserEmails to update
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * Limit how many UnpaidUserEmails to update.
     */
    limit?: number
  }

  /**
   * UnpaidUserEmail updateManyAndReturn
   */
  export type UnpaidUserEmailUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * The data used to update UnpaidUserEmails.
     */
    data: XOR<UnpaidUserEmailUpdateManyMutationInput, UnpaidUserEmailUncheckedUpdateManyInput>
    /**
     * Filter which UnpaidUserEmails to update
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * Limit how many UnpaidUserEmails to update.
     */
    limit?: number
  }

  /**
   * UnpaidUserEmail upsert
   */
  export type UnpaidUserEmailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * The filter to search for the UnpaidUserEmail to update in case it exists.
     */
    where: UnpaidUserEmailWhereUniqueInput
    /**
     * In case the UnpaidUserEmail found by the `where` argument doesn't exist, create a new UnpaidUserEmail with this data.
     */
    create: XOR<UnpaidUserEmailCreateInput, UnpaidUserEmailUncheckedCreateInput>
    /**
     * In case the UnpaidUserEmail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnpaidUserEmailUpdateInput, UnpaidUserEmailUncheckedUpdateInput>
  }

  /**
   * UnpaidUserEmail delete
   */
  export type UnpaidUserEmailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
    /**
     * Filter which UnpaidUserEmail to delete.
     */
    where: UnpaidUserEmailWhereUniqueInput
  }

  /**
   * UnpaidUserEmail deleteMany
   */
  export type UnpaidUserEmailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnpaidUserEmails to delete
     */
    where?: UnpaidUserEmailWhereInput
    /**
     * Limit how many UnpaidUserEmails to delete.
     */
    limit?: number
  }

  /**
   * UnpaidUserEmail without action
   */
  export type UnpaidUserEmailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnpaidUserEmail
     */
    select?: UnpaidUserEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnpaidUserEmail
     */
    omit?: UnpaidUserEmailOmit<ExtArgs> | null
  }


  /**
   * Model ReportView
   */

  export type AggregateReportView = {
    _count: ReportViewCountAggregateOutputType | null
    _avg: ReportViewAvgAggregateOutputType | null
    _sum: ReportViewSumAggregateOutputType | null
    _min: ReportViewMinAggregateOutputType | null
    _max: ReportViewMaxAggregateOutputType | null
  }

  export type ReportViewAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    quizAttemptId: number | null
  }

  export type ReportViewSumAggregateOutputType = {
    id: number | null
    userId: number | null
    quizAttemptId: number | null
  }

  export type ReportViewMinAggregateOutputType = {
    id: number | null
    userId: number | null
    sessionId: string | null
    quizAttemptId: number | null
    viewedAt: Date | null
  }

  export type ReportViewMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    sessionId: string | null
    quizAttemptId: number | null
    viewedAt: Date | null
  }

  export type ReportViewCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    quizAttemptId: number
    viewedAt: number
    _all: number
  }


  export type ReportViewAvgAggregateInputType = {
    id?: true
    userId?: true
    quizAttemptId?: true
  }

  export type ReportViewSumAggregateInputType = {
    id?: true
    userId?: true
    quizAttemptId?: true
  }

  export type ReportViewMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    quizAttemptId?: true
    viewedAt?: true
  }

  export type ReportViewMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    quizAttemptId?: true
    viewedAt?: true
  }

  export type ReportViewCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    quizAttemptId?: true
    viewedAt?: true
    _all?: true
  }

  export type ReportViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReportView to aggregate.
     */
    where?: ReportViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportViews to fetch.
     */
    orderBy?: ReportViewOrderByWithRelationInput | ReportViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReportViews
    **/
    _count?: true | ReportViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReportViewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReportViewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportViewMaxAggregateInputType
  }

  export type GetReportViewAggregateType<T extends ReportViewAggregateArgs> = {
        [P in keyof T & keyof AggregateReportView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReportView[P]>
      : GetScalarType<T[P], AggregateReportView[P]>
  }




  export type ReportViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportViewWhereInput
    orderBy?: ReportViewOrderByWithAggregationInput | ReportViewOrderByWithAggregationInput[]
    by: ReportViewScalarFieldEnum[] | ReportViewScalarFieldEnum
    having?: ReportViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportViewCountAggregateInputType | true
    _avg?: ReportViewAvgAggregateInputType
    _sum?: ReportViewSumAggregateInputType
    _min?: ReportViewMinAggregateInputType
    _max?: ReportViewMaxAggregateInputType
  }

  export type ReportViewGroupByOutputType = {
    id: number
    userId: number | null
    sessionId: string | null
    quizAttemptId: number
    viewedAt: Date
    _count: ReportViewCountAggregateOutputType | null
    _avg: ReportViewAvgAggregateOutputType | null
    _sum: ReportViewSumAggregateOutputType | null
    _min: ReportViewMinAggregateOutputType | null
    _max: ReportViewMaxAggregateOutputType | null
  }

  type GetReportViewGroupByPayload<T extends ReportViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportViewGroupByOutputType[P]>
            : GetScalarType<T[P], ReportViewGroupByOutputType[P]>
        }
      >
    >


  export type ReportViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizAttemptId?: boolean
    viewedAt?: boolean
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
    user?: boolean | ReportView$userArgs<ExtArgs>
  }, ExtArgs["result"]["reportView"]>

  export type ReportViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizAttemptId?: boolean
    viewedAt?: boolean
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
    user?: boolean | ReportView$userArgs<ExtArgs>
  }, ExtArgs["result"]["reportView"]>

  export type ReportViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizAttemptId?: boolean
    viewedAt?: boolean
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
    user?: boolean | ReportView$userArgs<ExtArgs>
  }, ExtArgs["result"]["reportView"]>

  export type ReportViewSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    quizAttemptId?: boolean
    viewedAt?: boolean
  }

  export type ReportViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "quizAttemptId" | "viewedAt", ExtArgs["result"]["reportView"]>
  export type ReportViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
    user?: boolean | ReportView$userArgs<ExtArgs>
  }
  export type ReportViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
    user?: boolean | ReportView$userArgs<ExtArgs>
  }
  export type ReportViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizAttempt?: boolean | QuizAttemptDefaultArgs<ExtArgs>
    user?: boolean | ReportView$userArgs<ExtArgs>
  }

  export type $ReportViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReportView"
    objects: {
      quizAttempt: Prisma.$QuizAttemptPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number | null
      sessionId: string | null
      quizAttemptId: number
      viewedAt: Date
    }, ExtArgs["result"]["reportView"]>
    composites: {}
  }

  type ReportViewGetPayload<S extends boolean | null | undefined | ReportViewDefaultArgs> = $Result.GetResult<Prisma.$ReportViewPayload, S>

  type ReportViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportViewCountAggregateInputType | true
    }

  export interface ReportViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReportView'], meta: { name: 'ReportView' } }
    /**
     * Find zero or one ReportView that matches the filter.
     * @param {ReportViewFindUniqueArgs} args - Arguments to find a ReportView
     * @example
     * // Get one ReportView
     * const reportView = await prisma.reportView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportViewFindUniqueArgs>(args: SelectSubset<T, ReportViewFindUniqueArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReportView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportViewFindUniqueOrThrowArgs} args - Arguments to find a ReportView
     * @example
     * // Get one ReportView
     * const reportView = await prisma.reportView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportViewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReportView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewFindFirstArgs} args - Arguments to find a ReportView
     * @example
     * // Get one ReportView
     * const reportView = await prisma.reportView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportViewFindFirstArgs>(args?: SelectSubset<T, ReportViewFindFirstArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReportView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewFindFirstOrThrowArgs} args - Arguments to find a ReportView
     * @example
     * // Get one ReportView
     * const reportView = await prisma.reportView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportViewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReportViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReportViews
     * const reportViews = await prisma.reportView.findMany()
     * 
     * // Get first 10 ReportViews
     * const reportViews = await prisma.reportView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportViewWithIdOnly = await prisma.reportView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportViewFindManyArgs>(args?: SelectSubset<T, ReportViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReportView.
     * @param {ReportViewCreateArgs} args - Arguments to create a ReportView.
     * @example
     * // Create one ReportView
     * const ReportView = await prisma.reportView.create({
     *   data: {
     *     // ... data to create a ReportView
     *   }
     * })
     * 
     */
    create<T extends ReportViewCreateArgs>(args: SelectSubset<T, ReportViewCreateArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReportViews.
     * @param {ReportViewCreateManyArgs} args - Arguments to create many ReportViews.
     * @example
     * // Create many ReportViews
     * const reportView = await prisma.reportView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportViewCreateManyArgs>(args?: SelectSubset<T, ReportViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReportViews and returns the data saved in the database.
     * @param {ReportViewCreateManyAndReturnArgs} args - Arguments to create many ReportViews.
     * @example
     * // Create many ReportViews
     * const reportView = await prisma.reportView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReportViews and only return the `id`
     * const reportViewWithIdOnly = await prisma.reportView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReportViewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReportViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReportView.
     * @param {ReportViewDeleteArgs} args - Arguments to delete one ReportView.
     * @example
     * // Delete one ReportView
     * const ReportView = await prisma.reportView.delete({
     *   where: {
     *     // ... filter to delete one ReportView
     *   }
     * })
     * 
     */
    delete<T extends ReportViewDeleteArgs>(args: SelectSubset<T, ReportViewDeleteArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReportView.
     * @param {ReportViewUpdateArgs} args - Arguments to update one ReportView.
     * @example
     * // Update one ReportView
     * const reportView = await prisma.reportView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportViewUpdateArgs>(args: SelectSubset<T, ReportViewUpdateArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReportViews.
     * @param {ReportViewDeleteManyArgs} args - Arguments to filter ReportViews to delete.
     * @example
     * // Delete a few ReportViews
     * const { count } = await prisma.reportView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportViewDeleteManyArgs>(args?: SelectSubset<T, ReportViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReportViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReportViews
     * const reportView = await prisma.reportView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportViewUpdateManyArgs>(args: SelectSubset<T, ReportViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReportViews and returns the data updated in the database.
     * @param {ReportViewUpdateManyAndReturnArgs} args - Arguments to update many ReportViews.
     * @example
     * // Update many ReportViews
     * const reportView = await prisma.reportView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReportViews and only return the `id`
     * const reportViewWithIdOnly = await prisma.reportView.updateManyAndReturn({
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
    updateManyAndReturn<T extends ReportViewUpdateManyAndReturnArgs>(args: SelectSubset<T, ReportViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReportView.
     * @param {ReportViewUpsertArgs} args - Arguments to update or create a ReportView.
     * @example
     * // Update or create a ReportView
     * const reportView = await prisma.reportView.upsert({
     *   create: {
     *     // ... data to create a ReportView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReportView we want to update
     *   }
     * })
     */
    upsert<T extends ReportViewUpsertArgs>(args: SelectSubset<T, ReportViewUpsertArgs<ExtArgs>>): Prisma__ReportViewClient<$Result.GetResult<Prisma.$ReportViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReportViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewCountArgs} args - Arguments to filter ReportViews to count.
     * @example
     * // Count the number of ReportViews
     * const count = await prisma.reportView.count({
     *   where: {
     *     // ... the filter for the ReportViews we want to count
     *   }
     * })
    **/
    count<T extends ReportViewCountArgs>(
      args?: Subset<T, ReportViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReportView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReportViewAggregateArgs>(args: Subset<T, ReportViewAggregateArgs>): Prisma.PrismaPromise<GetReportViewAggregateType<T>>

    /**
     * Group by ReportView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportViewGroupByArgs} args - Group by arguments.
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
      T extends ReportViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportViewGroupByArgs['orderBy'] }
        : { orderBy?: ReportViewGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReportViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReportView model
   */
  readonly fields: ReportViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReportView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quizAttempt<T extends QuizAttemptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuizAttemptDefaultArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends ReportView$userArgs<ExtArgs> = {}>(args?: Subset<T, ReportView$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ReportView model
   */
  interface ReportViewFieldRefs {
    readonly id: FieldRef<"ReportView", 'Int'>
    readonly userId: FieldRef<"ReportView", 'Int'>
    readonly sessionId: FieldRef<"ReportView", 'String'>
    readonly quizAttemptId: FieldRef<"ReportView", 'Int'>
    readonly viewedAt: FieldRef<"ReportView", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReportView findUnique
   */
  export type ReportViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * Filter, which ReportView to fetch.
     */
    where: ReportViewWhereUniqueInput
  }

  /**
   * ReportView findUniqueOrThrow
   */
  export type ReportViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * Filter, which ReportView to fetch.
     */
    where: ReportViewWhereUniqueInput
  }

  /**
   * ReportView findFirst
   */
  export type ReportViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * Filter, which ReportView to fetch.
     */
    where?: ReportViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportViews to fetch.
     */
    orderBy?: ReportViewOrderByWithRelationInput | ReportViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReportViews.
     */
    cursor?: ReportViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportViews.
     */
    distinct?: ReportViewScalarFieldEnum | ReportViewScalarFieldEnum[]
  }

  /**
   * ReportView findFirstOrThrow
   */
  export type ReportViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * Filter, which ReportView to fetch.
     */
    where?: ReportViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportViews to fetch.
     */
    orderBy?: ReportViewOrderByWithRelationInput | ReportViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReportViews.
     */
    cursor?: ReportViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportViews.
     */
    distinct?: ReportViewScalarFieldEnum | ReportViewScalarFieldEnum[]
  }

  /**
   * ReportView findMany
   */
  export type ReportViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * Filter, which ReportViews to fetch.
     */
    where?: ReportViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportViews to fetch.
     */
    orderBy?: ReportViewOrderByWithRelationInput | ReportViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReportViews.
     */
    cursor?: ReportViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportViews.
     */
    skip?: number
    distinct?: ReportViewScalarFieldEnum | ReportViewScalarFieldEnum[]
  }

  /**
   * ReportView create
   */
  export type ReportViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * The data needed to create a ReportView.
     */
    data: XOR<ReportViewCreateInput, ReportViewUncheckedCreateInput>
  }

  /**
   * ReportView createMany
   */
  export type ReportViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReportViews.
     */
    data: ReportViewCreateManyInput | ReportViewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReportView createManyAndReturn
   */
  export type ReportViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * The data used to create many ReportViews.
     */
    data: ReportViewCreateManyInput | ReportViewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReportView update
   */
  export type ReportViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * The data needed to update a ReportView.
     */
    data: XOR<ReportViewUpdateInput, ReportViewUncheckedUpdateInput>
    /**
     * Choose, which ReportView to update.
     */
    where: ReportViewWhereUniqueInput
  }

  /**
   * ReportView updateMany
   */
  export type ReportViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReportViews.
     */
    data: XOR<ReportViewUpdateManyMutationInput, ReportViewUncheckedUpdateManyInput>
    /**
     * Filter which ReportViews to update
     */
    where?: ReportViewWhereInput
    /**
     * Limit how many ReportViews to update.
     */
    limit?: number
  }

  /**
   * ReportView updateManyAndReturn
   */
  export type ReportViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * The data used to update ReportViews.
     */
    data: XOR<ReportViewUpdateManyMutationInput, ReportViewUncheckedUpdateManyInput>
    /**
     * Filter which ReportViews to update
     */
    where?: ReportViewWhereInput
    /**
     * Limit how many ReportViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReportView upsert
   */
  export type ReportViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * The filter to search for the ReportView to update in case it exists.
     */
    where: ReportViewWhereUniqueInput
    /**
     * In case the ReportView found by the `where` argument doesn't exist, create a new ReportView with this data.
     */
    create: XOR<ReportViewCreateInput, ReportViewUncheckedCreateInput>
    /**
     * In case the ReportView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportViewUpdateInput, ReportViewUncheckedUpdateInput>
  }

  /**
   * ReportView delete
   */
  export type ReportViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
    /**
     * Filter which ReportView to delete.
     */
    where: ReportViewWhereUniqueInput
  }

  /**
   * ReportView deleteMany
   */
  export type ReportViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReportViews to delete
     */
    where?: ReportViewWhereInput
    /**
     * Limit how many ReportViews to delete.
     */
    limit?: number
  }

  /**
   * ReportView.user
   */
  export type ReportView$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ReportView without action
   */
  export type ReportViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportView
     */
    select?: ReportViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportView
     */
    omit?: ReportViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportViewInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetToken
   */

  export type AggregatePasswordResetToken = {
    _count: PasswordResetTokenCountAggregateOutputType | null
    _avg: PasswordResetTokenAvgAggregateOutputType | null
    _sum: PasswordResetTokenSumAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  export type PasswordResetTokenAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type PasswordResetTokenSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type PasswordResetTokenMinAggregateOutputType = {
    id: number | null
    userId: number | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetTokenMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetTokenCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetTokenAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type PasswordResetTokenSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type PasswordResetTokenMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasswordResetTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasswordResetTokenCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetToken to aggregate.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetTokens
    **/
    _count?: true | PasswordResetTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasswordResetTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasswordResetTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type GetPasswordResetTokenAggregateType<T extends PasswordResetTokenAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetToken[P]>
      : GetScalarType<T[P], AggregatePasswordResetToken[P]>
  }




  export type PasswordResetTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithAggregationInput | PasswordResetTokenOrderByWithAggregationInput[]
    by: PasswordResetTokenScalarFieldEnum[] | PasswordResetTokenScalarFieldEnum
    having?: PasswordResetTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetTokenCountAggregateInputType | true
    _avg?: PasswordResetTokenAvgAggregateInputType
    _sum?: PasswordResetTokenSumAggregateInputType
    _min?: PasswordResetTokenMinAggregateInputType
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type PasswordResetTokenGroupByOutputType = {
    id: number
    userId: number
    token: string
    expiresAt: Date
    createdAt: Date
    _count: PasswordResetTokenCountAggregateOutputType | null
    _avg: PasswordResetTokenAvgAggregateOutputType | null
    _sum: PasswordResetTokenSumAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  type GetPasswordResetTokenGroupByPayload<T extends PasswordResetTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type PasswordResetTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "expiresAt" | "createdAt", ExtArgs["result"]["passwordResetToken"]>
  export type PasswordResetTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      token: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["passwordResetToken"]>
    composites: {}
  }

  type PasswordResetTokenGetPayload<S extends boolean | null | undefined | PasswordResetTokenDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetTokenPayload, S>

  type PasswordResetTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetTokenCountAggregateInputType | true
    }

  export interface PasswordResetTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetToken'], meta: { name: 'PasswordResetToken' } }
    /**
     * Find zero or one PasswordResetToken that matches the filter.
     * @param {PasswordResetTokenFindUniqueArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokenFindUniqueArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokenFindFirstArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany()
     * 
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetTokenFindManyArgs>(args?: SelectSubset<T, PasswordResetTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetToken.
     * @param {PasswordResetTokenCreateArgs} args - Arguments to create a PasswordResetToken.
     * @example
     * // Create one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.create({
     *   data: {
     *     // ... data to create a PasswordResetToken
     *   }
     * })
     * 
     */
    create<T extends PasswordResetTokenCreateArgs>(args: SelectSubset<T, PasswordResetTokenCreateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokenCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetTokenCreateManyArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetToken.
     * @param {PasswordResetTokenDeleteArgs} args - Arguments to delete one PasswordResetToken.
     * @example
     * // Delete one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetToken
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetTokenDeleteArgs>(args: SelectSubset<T, PasswordResetTokenDeleteArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetToken.
     * @param {PasswordResetTokenUpdateArgs} args - Arguments to update one PasswordResetToken.
     * @example
     * // Update one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetTokenUpdateArgs>(args: SelectSubset<T, PasswordResetTokenUpdateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokenDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetTokenDeleteManyArgs>(args?: SelectSubset<T, PasswordResetTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetTokenUpdateManyArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens and returns the data updated in the database.
     * @param {PasswordResetTokenUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetTokens.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.updateManyAndReturn({
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
    updateManyAndReturn<T extends PasswordResetTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetToken.
     * @param {PasswordResetTokenUpsertArgs} args - Arguments to update or create a PasswordResetToken.
     * @example
     * // Update or create a PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.upsert({
     *   create: {
     *     // ... data to create a PasswordResetToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokenUpsertArgs>(args: SelectSubset<T, PasswordResetTokenUpsertArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetToken.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetTokenCountArgs>(
      args?: Subset<T, PasswordResetTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PasswordResetTokenAggregateArgs>(args: Subset<T, PasswordResetTokenAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetTokenAggregateType<T>>

    /**
     * Group by PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenGroupByArgs} args - Group by arguments.
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
      T extends PasswordResetTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PasswordResetTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetToken model
   */
  readonly fields: PasswordResetTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PasswordResetToken model
   */
  interface PasswordResetTokenFieldRefs {
    readonly id: FieldRef<"PasswordResetToken", 'Int'>
    readonly userId: FieldRef<"PasswordResetToken", 'Int'>
    readonly token: FieldRef<"PasswordResetToken", 'String'>
    readonly expiresAt: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordResetToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetToken findUnique
   */
  export type PasswordResetTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findUniqueOrThrow
   */
  export type PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findFirst
   */
  export type PasswordResetTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findFirstOrThrow
   */
  export type PasswordResetTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findMany
   */
  export type PasswordResetTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken create
   */
  export type PasswordResetTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
  }

  /**
   * PasswordResetToken createMany
   */
  export type PasswordResetTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetToken createManyAndReturn
   */
  export type PasswordResetTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken update
   */
  export type PasswordResetTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetToken to update.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken updateMany
   */
  export type PasswordResetTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetToken updateManyAndReturn
   */
  export type PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken upsert
   */
  export type PasswordResetTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetToken to update in case it exists.
     */
    where: PasswordResetTokenWhereUniqueInput
    /**
     * In case the PasswordResetToken found by the `where` argument doesn't exist, create a new PasswordResetToken with this data.
     */
    create: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
    /**
     * In case the PasswordResetToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
  }

  /**
   * PasswordResetToken delete
   */
  export type PasswordResetTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter which PasswordResetToken to delete.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken deleteMany
   */
  export type PasswordResetTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetToken without action
   */
  export type PasswordResetTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
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
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    isUnsubscribed: 'isUnsubscribed',
    sessionId: 'sessionId',
    isPaid: 'isPaid',
    isTemporary: 'isTemporary',
    hasUnlockedFirstReport: 'hasUnlockedFirstReport',
    tempQuizData: 'tempQuizData',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const QuizAttemptScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    quizData: 'quizData',
    aiContent: 'aiContent',
    isPaid: 'isPaid',
    completedAt: 'completedAt'
  };

  export type QuizAttemptScalarFieldEnum = (typeof QuizAttemptScalarFieldEnum)[keyof typeof QuizAttemptScalarFieldEnum]


  export const AiContentScalarFieldEnum: {
    id: 'id',
    quizAttemptId: 'quizAttemptId',
    contentType: 'contentType',
    content: 'content',
    contentHash: 'contentHash',
    generatedAt: 'generatedAt',
    createdAt: 'createdAt'
  };

  export type AiContentScalarFieldEnum = (typeof AiContentScalarFieldEnum)[keyof typeof AiContentScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    amount: 'amount',
    currency: 'currency',
    type: 'type',
    stripePaymentIntentId: 'stripePaymentIntentId',
    paypalOrderId: 'paypalOrderId',
    status: 'status',
    quizAttemptId: 'quizAttemptId',
    createdAt: 'createdAt',
    completedAt: 'completedAt',
    version: 'version'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const RefundScalarFieldEnum: {
    id: 'id',
    paymentId: 'paymentId',
    amount: 'amount',
    currency: 'currency',
    reason: 'reason',
    status: 'status',
    stripeRefundId: 'stripeRefundId',
    paypalRefundId: 'paypalRefundId',
    adminUserId: 'adminUserId',
    adminNote: 'adminNote',
    createdAt: 'createdAt',
    processedAt: 'processedAt'
  };

  export type RefundScalarFieldEnum = (typeof RefundScalarFieldEnum)[keyof typeof RefundScalarFieldEnum]


  export const UnpaidUserEmailScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    email: 'email',
    quizData: 'quizData',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type UnpaidUserEmailScalarFieldEnum = (typeof UnpaidUserEmailScalarFieldEnum)[keyof typeof UnpaidUserEmailScalarFieldEnum]


  export const ReportViewScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    quizAttemptId: 'quizAttemptId',
    viewedAt: 'viewedAt'
  };

  export type ReportViewScalarFieldEnum = (typeof ReportViewScalarFieldEnum)[keyof typeof ReportViewScalarFieldEnum]


  export const PasswordResetTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


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
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    isUnsubscribed?: BoolFilter<"User"> | boolean
    sessionId?: StringNullableFilter<"User"> | string | null
    isPaid?: BoolFilter<"User"> | boolean
    isTemporary?: BoolFilter<"User"> | boolean
    hasUnlockedFirstReport?: BoolFilter<"User"> | boolean
    tempQuizData?: JsonNullableFilter<"User">
    expiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    passwordResetTokens?: PasswordResetTokenListRelationFilter
    payments?: PaymentListRelationFilter
    quizAttempts?: QuizAttemptListRelationFilter
    refundsProcessed?: RefundListRelationFilter
    reportViews?: ReportViewListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    isUnsubscribed?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    isTemporary?: SortOrder
    hasUnlockedFirstReport?: SortOrder
    tempQuizData?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordResetTokens?: PasswordResetTokenOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    quizAttempts?: QuizAttemptOrderByRelationAggregateInput
    refundsProcessed?: RefundOrderByRelationAggregateInput
    reportViews?: ReportViewOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    isUnsubscribed?: BoolFilter<"User"> | boolean
    sessionId?: StringNullableFilter<"User"> | string | null
    isPaid?: BoolFilter<"User"> | boolean
    isTemporary?: BoolFilter<"User"> | boolean
    hasUnlockedFirstReport?: BoolFilter<"User"> | boolean
    tempQuizData?: JsonNullableFilter<"User">
    expiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    passwordResetTokens?: PasswordResetTokenListRelationFilter
    payments?: PaymentListRelationFilter
    quizAttempts?: QuizAttemptListRelationFilter
    refundsProcessed?: RefundListRelationFilter
    reportViews?: ReportViewListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    isUnsubscribed?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    isTemporary?: SortOrder
    hasUnlockedFirstReport?: SortOrder
    tempQuizData?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    isUnsubscribed?: BoolWithAggregatesFilter<"User"> | boolean
    sessionId?: StringNullableWithAggregatesFilter<"User"> | string | null
    isPaid?: BoolWithAggregatesFilter<"User"> | boolean
    isTemporary?: BoolWithAggregatesFilter<"User"> | boolean
    hasUnlockedFirstReport?: BoolWithAggregatesFilter<"User"> | boolean
    tempQuizData?: JsonNullableWithAggregatesFilter<"User">
    expiresAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type QuizAttemptWhereInput = {
    AND?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    OR?: QuizAttemptWhereInput[]
    NOT?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    id?: IntFilter<"QuizAttempt"> | number
    userId?: IntNullableFilter<"QuizAttempt"> | number | null
    sessionId?: StringNullableFilter<"QuizAttempt"> | string | null
    quizData?: JsonFilter<"QuizAttempt">
    aiContent?: JsonNullableFilter<"QuizAttempt">
    isPaid?: BoolFilter<"QuizAttempt"> | boolean
    completedAt?: DateTimeFilter<"QuizAttempt"> | Date | string
    aiContents?: AiContentListRelationFilter
    payments?: PaymentListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    reportViews?: ReportViewListRelationFilter
  }

  export type QuizAttemptOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    quizData?: SortOrder
    aiContent?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    completedAt?: SortOrder
    aiContents?: AiContentOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    reportViews?: ReportViewOrderByRelationAggregateInput
  }

  export type QuizAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    OR?: QuizAttemptWhereInput[]
    NOT?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    userId?: IntNullableFilter<"QuizAttempt"> | number | null
    sessionId?: StringNullableFilter<"QuizAttempt"> | string | null
    quizData?: JsonFilter<"QuizAttempt">
    aiContent?: JsonNullableFilter<"QuizAttempt">
    isPaid?: BoolFilter<"QuizAttempt"> | boolean
    completedAt?: DateTimeFilter<"QuizAttempt"> | Date | string
    aiContents?: AiContentListRelationFilter
    payments?: PaymentListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    reportViews?: ReportViewListRelationFilter
  }, "id">

  export type QuizAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    quizData?: SortOrder
    aiContent?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    completedAt?: SortOrder
    _count?: QuizAttemptCountOrderByAggregateInput
    _avg?: QuizAttemptAvgOrderByAggregateInput
    _max?: QuizAttemptMaxOrderByAggregateInput
    _min?: QuizAttemptMinOrderByAggregateInput
    _sum?: QuizAttemptSumOrderByAggregateInput
  }

  export type QuizAttemptScalarWhereWithAggregatesInput = {
    AND?: QuizAttemptScalarWhereWithAggregatesInput | QuizAttemptScalarWhereWithAggregatesInput[]
    OR?: QuizAttemptScalarWhereWithAggregatesInput[]
    NOT?: QuizAttemptScalarWhereWithAggregatesInput | QuizAttemptScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"QuizAttempt"> | number
    userId?: IntNullableWithAggregatesFilter<"QuizAttempt"> | number | null
    sessionId?: StringNullableWithAggregatesFilter<"QuizAttempt"> | string | null
    quizData?: JsonWithAggregatesFilter<"QuizAttempt">
    aiContent?: JsonNullableWithAggregatesFilter<"QuizAttempt">
    isPaid?: BoolWithAggregatesFilter<"QuizAttempt"> | boolean
    completedAt?: DateTimeWithAggregatesFilter<"QuizAttempt"> | Date | string
  }

  export type AiContentWhereInput = {
    AND?: AiContentWhereInput | AiContentWhereInput[]
    OR?: AiContentWhereInput[]
    NOT?: AiContentWhereInput | AiContentWhereInput[]
    id?: IntFilter<"AiContent"> | number
    quizAttemptId?: IntFilter<"AiContent"> | number
    contentType?: StringFilter<"AiContent"> | string
    content?: JsonFilter<"AiContent">
    contentHash?: StringNullableFilter<"AiContent"> | string | null
    generatedAt?: DateTimeFilter<"AiContent"> | Date | string
    createdAt?: DateTimeFilter<"AiContent"> | Date | string
    quizAttempt?: XOR<QuizAttemptScalarRelationFilter, QuizAttemptWhereInput>
  }

  export type AiContentOrderByWithRelationInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
    contentType?: SortOrder
    content?: SortOrder
    contentHash?: SortOrderInput | SortOrder
    generatedAt?: SortOrder
    createdAt?: SortOrder
    quizAttempt?: QuizAttemptOrderByWithRelationInput
  }

  export type AiContentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    quizAttemptId_contentType?: AiContentQuizAttemptIdContentTypeCompoundUniqueInput
    AND?: AiContentWhereInput | AiContentWhereInput[]
    OR?: AiContentWhereInput[]
    NOT?: AiContentWhereInput | AiContentWhereInput[]
    quizAttemptId?: IntFilter<"AiContent"> | number
    contentType?: StringFilter<"AiContent"> | string
    content?: JsonFilter<"AiContent">
    contentHash?: StringNullableFilter<"AiContent"> | string | null
    generatedAt?: DateTimeFilter<"AiContent"> | Date | string
    createdAt?: DateTimeFilter<"AiContent"> | Date | string
    quizAttempt?: XOR<QuizAttemptScalarRelationFilter, QuizAttemptWhereInput>
  }, "id" | "quizAttemptId_contentType">

  export type AiContentOrderByWithAggregationInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
    contentType?: SortOrder
    content?: SortOrder
    contentHash?: SortOrderInput | SortOrder
    generatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: AiContentCountOrderByAggregateInput
    _avg?: AiContentAvgOrderByAggregateInput
    _max?: AiContentMaxOrderByAggregateInput
    _min?: AiContentMinOrderByAggregateInput
    _sum?: AiContentSumOrderByAggregateInput
  }

  export type AiContentScalarWhereWithAggregatesInput = {
    AND?: AiContentScalarWhereWithAggregatesInput | AiContentScalarWhereWithAggregatesInput[]
    OR?: AiContentScalarWhereWithAggregatesInput[]
    NOT?: AiContentScalarWhereWithAggregatesInput | AiContentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AiContent"> | number
    quizAttemptId?: IntWithAggregatesFilter<"AiContent"> | number
    contentType?: StringWithAggregatesFilter<"AiContent"> | string
    content?: JsonWithAggregatesFilter<"AiContent">
    contentHash?: StringNullableWithAggregatesFilter<"AiContent"> | string | null
    generatedAt?: DateTimeWithAggregatesFilter<"AiContent"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"AiContent"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: IntFilter<"Payment"> | number
    userId?: IntFilter<"Payment"> | number
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    type?: StringFilter<"Payment"> | string
    stripePaymentIntentId?: StringNullableFilter<"Payment"> | string | null
    paypalOrderId?: StringNullableFilter<"Payment"> | string | null
    status?: StringFilter<"Payment"> | string
    quizAttemptId?: IntNullableFilter<"Payment"> | number | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    completedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    version?: IntFilter<"Payment"> | number
    quizAttempt?: XOR<QuizAttemptNullableScalarRelationFilter, QuizAttemptWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    refunds?: RefundListRelationFilter
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    stripePaymentIntentId?: SortOrderInput | SortOrder
    paypalOrderId?: SortOrderInput | SortOrder
    status?: SortOrder
    quizAttemptId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    version?: SortOrder
    quizAttempt?: QuizAttemptOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    refunds?: RefundOrderByRelationAggregateInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    stripePaymentIntentId?: string
    paypalOrderId?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    userId?: IntFilter<"Payment"> | number
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    type?: StringFilter<"Payment"> | string
    status?: StringFilter<"Payment"> | string
    quizAttemptId?: IntNullableFilter<"Payment"> | number | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    completedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    version?: IntFilter<"Payment"> | number
    quizAttempt?: XOR<QuizAttemptNullableScalarRelationFilter, QuizAttemptWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    refunds?: RefundListRelationFilter
  }, "id" | "stripePaymentIntentId" | "paypalOrderId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    stripePaymentIntentId?: SortOrderInput | SortOrder
    paypalOrderId?: SortOrderInput | SortOrder
    status?: SortOrder
    quizAttemptId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    version?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Payment"> | number
    userId?: IntWithAggregatesFilter<"Payment"> | number
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Payment"> | string
    type?: StringWithAggregatesFilter<"Payment"> | string
    stripePaymentIntentId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    paypalOrderId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    status?: StringWithAggregatesFilter<"Payment"> | string
    quizAttemptId?: IntNullableWithAggregatesFilter<"Payment"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    version?: IntWithAggregatesFilter<"Payment"> | number
  }

  export type RefundWhereInput = {
    AND?: RefundWhereInput | RefundWhereInput[]
    OR?: RefundWhereInput[]
    NOT?: RefundWhereInput | RefundWhereInput[]
    id?: IntFilter<"Refund"> | number
    paymentId?: IntFilter<"Refund"> | number
    amount?: DecimalFilter<"Refund"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Refund"> | string
    reason?: StringFilter<"Refund"> | string
    status?: StringFilter<"Refund"> | string
    stripeRefundId?: StringNullableFilter<"Refund"> | string | null
    paypalRefundId?: StringNullableFilter<"Refund"> | string | null
    adminUserId?: IntNullableFilter<"Refund"> | number | null
    adminNote?: StringNullableFilter<"Refund"> | string | null
    createdAt?: DateTimeFilter<"Refund"> | Date | string
    processedAt?: DateTimeNullableFilter<"Refund"> | Date | string | null
    adminUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    payment?: XOR<PaymentScalarRelationFilter, PaymentWhereInput>
  }

  export type RefundOrderByWithRelationInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    stripeRefundId?: SortOrderInput | SortOrder
    paypalRefundId?: SortOrderInput | SortOrder
    adminUserId?: SortOrderInput | SortOrder
    adminNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    adminUser?: UserOrderByWithRelationInput
    payment?: PaymentOrderByWithRelationInput
  }

  export type RefundWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RefundWhereInput | RefundWhereInput[]
    OR?: RefundWhereInput[]
    NOT?: RefundWhereInput | RefundWhereInput[]
    paymentId?: IntFilter<"Refund"> | number
    amount?: DecimalFilter<"Refund"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Refund"> | string
    reason?: StringFilter<"Refund"> | string
    status?: StringFilter<"Refund"> | string
    stripeRefundId?: StringNullableFilter<"Refund"> | string | null
    paypalRefundId?: StringNullableFilter<"Refund"> | string | null
    adminUserId?: IntNullableFilter<"Refund"> | number | null
    adminNote?: StringNullableFilter<"Refund"> | string | null
    createdAt?: DateTimeFilter<"Refund"> | Date | string
    processedAt?: DateTimeNullableFilter<"Refund"> | Date | string | null
    adminUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    payment?: XOR<PaymentScalarRelationFilter, PaymentWhereInput>
  }, "id">

  export type RefundOrderByWithAggregationInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    stripeRefundId?: SortOrderInput | SortOrder
    paypalRefundId?: SortOrderInput | SortOrder
    adminUserId?: SortOrderInput | SortOrder
    adminNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    _count?: RefundCountOrderByAggregateInput
    _avg?: RefundAvgOrderByAggregateInput
    _max?: RefundMaxOrderByAggregateInput
    _min?: RefundMinOrderByAggregateInput
    _sum?: RefundSumOrderByAggregateInput
  }

  export type RefundScalarWhereWithAggregatesInput = {
    AND?: RefundScalarWhereWithAggregatesInput | RefundScalarWhereWithAggregatesInput[]
    OR?: RefundScalarWhereWithAggregatesInput[]
    NOT?: RefundScalarWhereWithAggregatesInput | RefundScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Refund"> | number
    paymentId?: IntWithAggregatesFilter<"Refund"> | number
    amount?: DecimalWithAggregatesFilter<"Refund"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Refund"> | string
    reason?: StringWithAggregatesFilter<"Refund"> | string
    status?: StringWithAggregatesFilter<"Refund"> | string
    stripeRefundId?: StringNullableWithAggregatesFilter<"Refund"> | string | null
    paypalRefundId?: StringNullableWithAggregatesFilter<"Refund"> | string | null
    adminUserId?: IntNullableWithAggregatesFilter<"Refund"> | number | null
    adminNote?: StringNullableWithAggregatesFilter<"Refund"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Refund"> | Date | string
    processedAt?: DateTimeNullableWithAggregatesFilter<"Refund"> | Date | string | null
  }

  export type UnpaidUserEmailWhereInput = {
    AND?: UnpaidUserEmailWhereInput | UnpaidUserEmailWhereInput[]
    OR?: UnpaidUserEmailWhereInput[]
    NOT?: UnpaidUserEmailWhereInput | UnpaidUserEmailWhereInput[]
    id?: IntFilter<"UnpaidUserEmail"> | number
    sessionId?: StringFilter<"UnpaidUserEmail"> | string
    email?: StringFilter<"UnpaidUserEmail"> | string
    quizData?: JsonFilter<"UnpaidUserEmail">
    createdAt?: DateTimeFilter<"UnpaidUserEmail"> | Date | string
    expiresAt?: DateTimeFilter<"UnpaidUserEmail"> | Date | string
  }

  export type UnpaidUserEmailOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    email?: SortOrder
    quizData?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UnpaidUserEmailWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    sessionId?: string
    AND?: UnpaidUserEmailWhereInput | UnpaidUserEmailWhereInput[]
    OR?: UnpaidUserEmailWhereInput[]
    NOT?: UnpaidUserEmailWhereInput | UnpaidUserEmailWhereInput[]
    email?: StringFilter<"UnpaidUserEmail"> | string
    quizData?: JsonFilter<"UnpaidUserEmail">
    createdAt?: DateTimeFilter<"UnpaidUserEmail"> | Date | string
    expiresAt?: DateTimeFilter<"UnpaidUserEmail"> | Date | string
  }, "id" | "sessionId">

  export type UnpaidUserEmailOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    email?: SortOrder
    quizData?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: UnpaidUserEmailCountOrderByAggregateInput
    _avg?: UnpaidUserEmailAvgOrderByAggregateInput
    _max?: UnpaidUserEmailMaxOrderByAggregateInput
    _min?: UnpaidUserEmailMinOrderByAggregateInput
    _sum?: UnpaidUserEmailSumOrderByAggregateInput
  }

  export type UnpaidUserEmailScalarWhereWithAggregatesInput = {
    AND?: UnpaidUserEmailScalarWhereWithAggregatesInput | UnpaidUserEmailScalarWhereWithAggregatesInput[]
    OR?: UnpaidUserEmailScalarWhereWithAggregatesInput[]
    NOT?: UnpaidUserEmailScalarWhereWithAggregatesInput | UnpaidUserEmailScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UnpaidUserEmail"> | number
    sessionId?: StringWithAggregatesFilter<"UnpaidUserEmail"> | string
    email?: StringWithAggregatesFilter<"UnpaidUserEmail"> | string
    quizData?: JsonWithAggregatesFilter<"UnpaidUserEmail">
    createdAt?: DateTimeWithAggregatesFilter<"UnpaidUserEmail"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"UnpaidUserEmail"> | Date | string
  }

  export type ReportViewWhereInput = {
    AND?: ReportViewWhereInput | ReportViewWhereInput[]
    OR?: ReportViewWhereInput[]
    NOT?: ReportViewWhereInput | ReportViewWhereInput[]
    id?: IntFilter<"ReportView"> | number
    userId?: IntNullableFilter<"ReportView"> | number | null
    sessionId?: StringNullableFilter<"ReportView"> | string | null
    quizAttemptId?: IntFilter<"ReportView"> | number
    viewedAt?: DateTimeFilter<"ReportView"> | Date | string
    quizAttempt?: XOR<QuizAttemptScalarRelationFilter, QuizAttemptWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ReportViewOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    quizAttemptId?: SortOrder
    viewedAt?: SortOrder
    quizAttempt?: QuizAttemptOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ReportViewWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ReportViewWhereInput | ReportViewWhereInput[]
    OR?: ReportViewWhereInput[]
    NOT?: ReportViewWhereInput | ReportViewWhereInput[]
    userId?: IntNullableFilter<"ReportView"> | number | null
    sessionId?: StringNullableFilter<"ReportView"> | string | null
    quizAttemptId?: IntFilter<"ReportView"> | number
    viewedAt?: DateTimeFilter<"ReportView"> | Date | string
    quizAttempt?: XOR<QuizAttemptScalarRelationFilter, QuizAttemptWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ReportViewOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    quizAttemptId?: SortOrder
    viewedAt?: SortOrder
    _count?: ReportViewCountOrderByAggregateInput
    _avg?: ReportViewAvgOrderByAggregateInput
    _max?: ReportViewMaxOrderByAggregateInput
    _min?: ReportViewMinOrderByAggregateInput
    _sum?: ReportViewSumOrderByAggregateInput
  }

  export type ReportViewScalarWhereWithAggregatesInput = {
    AND?: ReportViewScalarWhereWithAggregatesInput | ReportViewScalarWhereWithAggregatesInput[]
    OR?: ReportViewScalarWhereWithAggregatesInput[]
    NOT?: ReportViewScalarWhereWithAggregatesInput | ReportViewScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ReportView"> | number
    userId?: IntNullableWithAggregatesFilter<"ReportView"> | number | null
    sessionId?: StringNullableWithAggregatesFilter<"ReportView"> | string | null
    quizAttemptId?: IntWithAggregatesFilter<"ReportView"> | number
    viewedAt?: DateTimeWithAggregatesFilter<"ReportView"> | Date | string
  }

  export type PasswordResetTokenWhereInput = {
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    id?: IntFilter<"PasswordResetToken"> | number
    userId?: IntFilter<"PasswordResetToken"> | number
    token?: StringFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PasswordResetTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PasswordResetTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    token?: string
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    userId?: IntFilter<"PasswordResetToken"> | number
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type PasswordResetTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetTokenCountOrderByAggregateInput
    _avg?: PasswordResetTokenAvgOrderByAggregateInput
    _max?: PasswordResetTokenMaxOrderByAggregateInput
    _min?: PasswordResetTokenMinOrderByAggregateInput
    _sum?: PasswordResetTokenSumOrderByAggregateInput
  }

  export type PasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    OR?: PasswordResetTokenScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PasswordResetToken"> | number
    userId?: IntWithAggregatesFilter<"PasswordResetToken"> | number
    token?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptUncheckedCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundUncheckedCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUncheckedUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUncheckedUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAttemptCreateInput = {
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentCreateNestedManyWithoutQuizAttemptInput
    payments?: PaymentCreateNestedManyWithoutQuizAttemptInput
    user?: UserCreateNestedOneWithoutQuizAttemptsInput
    reportViews?: ReportViewCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptUncheckedCreateInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentUncheckedCreateNestedManyWithoutQuizAttemptInput
    payments?: PaymentUncheckedCreateNestedManyWithoutQuizAttemptInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptUpdateInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUpdateManyWithoutQuizAttemptNestedInput
    payments?: PaymentUpdateManyWithoutQuizAttemptNestedInput
    user?: UserUpdateOneWithoutQuizAttemptsNestedInput
    reportViews?: ReportViewUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptCreateManyInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
  }

  export type QuizAttemptUpdateManyMutationInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAttemptUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiContentCreateInput = {
    contentType: string
    content: JsonNullValueInput | InputJsonValue
    contentHash?: string | null
    generatedAt?: Date | string
    createdAt?: Date | string
    quizAttempt: QuizAttemptCreateNestedOneWithoutAiContentsInput
  }

  export type AiContentUncheckedCreateInput = {
    id?: number
    quizAttemptId: number
    contentType: string
    content: JsonNullValueInput | InputJsonValue
    contentHash?: string | null
    generatedAt?: Date | string
    createdAt?: Date | string
  }

  export type AiContentUpdateInput = {
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizAttempt?: QuizAttemptUpdateOneRequiredWithoutAiContentsNestedInput
  }

  export type AiContentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    quizAttemptId?: IntFieldUpdateOperationsInput | number
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiContentCreateManyInput = {
    id?: number
    quizAttemptId: number
    contentType: string
    content: JsonNullValueInput | InputJsonValue
    contentHash?: string | null
    generatedAt?: Date | string
    createdAt?: Date | string
  }

  export type AiContentUpdateManyMutationInput = {
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiContentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    quizAttemptId?: IntFieldUpdateOperationsInput | number
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    quizAttempt?: QuizAttemptCreateNestedOneWithoutPaymentsInput
    user: UserCreateNestedOneWithoutPaymentsInput
    refunds?: RefundCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: number
    userId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    quizAttemptId?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    refunds?: RefundUncheckedCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUpdateInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    quizAttempt?: QuizAttemptUpdateOneWithoutPaymentsNestedInput
    user?: UserUpdateOneRequiredWithoutPaymentsNestedInput
    refunds?: RefundUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    quizAttemptId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    refunds?: RefundUncheckedUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentCreateManyInput = {
    id?: number
    userId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    quizAttemptId?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
  }

  export type PaymentUpdateManyMutationInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    quizAttemptId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type RefundCreateInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
    adminUser?: UserCreateNestedOneWithoutRefundsProcessedInput
    payment: PaymentCreateNestedOneWithoutRefundsInput
  }

  export type RefundUncheckedCreateInput = {
    id?: number
    paymentId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminUserId?: number | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type RefundUpdateInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adminUser?: UserUpdateOneWithoutRefundsProcessedNestedInput
    payment?: PaymentUpdateOneRequiredWithoutRefundsNestedInput
  }

  export type RefundUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    paymentId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminUserId?: NullableIntFieldUpdateOperationsInput | number | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefundCreateManyInput = {
    id?: number
    paymentId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminUserId?: number | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type RefundUpdateManyMutationInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefundUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    paymentId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminUserId?: NullableIntFieldUpdateOperationsInput | number | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UnpaidUserEmailCreateInput = {
    sessionId: string
    email: string
    quizData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type UnpaidUserEmailUncheckedCreateInput = {
    id?: number
    sessionId: string
    email: string
    quizData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type UnpaidUserEmailUpdateInput = {
    sessionId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    quizData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnpaidUserEmailUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    quizData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnpaidUserEmailCreateManyInput = {
    id?: number
    sessionId: string
    email: string
    quizData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type UnpaidUserEmailUpdateManyMutationInput = {
    sessionId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    quizData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnpaidUserEmailUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    quizData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportViewCreateInput = {
    sessionId?: string | null
    viewedAt?: Date | string
    quizAttempt: QuizAttemptCreateNestedOneWithoutReportViewsInput
    user?: UserCreateNestedOneWithoutReportViewsInput
  }

  export type ReportViewUncheckedCreateInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizAttemptId: number
    viewedAt?: Date | string
  }

  export type ReportViewUpdateInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizAttempt?: QuizAttemptUpdateOneRequiredWithoutReportViewsNestedInput
    user?: UserUpdateOneWithoutReportViewsNestedInput
  }

  export type ReportViewUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizAttemptId?: IntFieldUpdateOperationsInput | number
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportViewCreateManyInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizAttemptId: number
    viewedAt?: Date | string
  }

  export type ReportViewUpdateManyMutationInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportViewUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizAttemptId?: IntFieldUpdateOperationsInput | number
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateInput = {
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPasswordResetTokensInput
  }

  export type PasswordResetTokenUncheckedCreateInput = {
    id?: number
    userId: number
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetTokenUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPasswordResetTokensNestedInput
  }

  export type PasswordResetTokenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateManyInput = {
    id?: number
    userId: number
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetTokenUpdateManyMutationInput = {
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type PasswordResetTokenListRelationFilter = {
    every?: PasswordResetTokenWhereInput
    some?: PasswordResetTokenWhereInput
    none?: PasswordResetTokenWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type QuizAttemptListRelationFilter = {
    every?: QuizAttemptWhereInput
    some?: QuizAttemptWhereInput
    none?: QuizAttemptWhereInput
  }

  export type RefundListRelationFilter = {
    every?: RefundWhereInput
    some?: RefundWhereInput
    none?: RefundWhereInput
  }

  export type ReportViewListRelationFilter = {
    every?: ReportViewWhereInput
    some?: ReportViewWhereInput
    none?: ReportViewWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PasswordResetTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefundOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReportViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isUnsubscribed?: SortOrder
    sessionId?: SortOrder
    isPaid?: SortOrder
    isTemporary?: SortOrder
    hasUnlockedFirstReport?: SortOrder
    tempQuizData?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isUnsubscribed?: SortOrder
    sessionId?: SortOrder
    isPaid?: SortOrder
    isTemporary?: SortOrder
    hasUnlockedFirstReport?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    isUnsubscribed?: SortOrder
    sessionId?: SortOrder
    isPaid?: SortOrder
    isTemporary?: SortOrder
    hasUnlockedFirstReport?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
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
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AiContentListRelationFilter = {
    every?: AiContentWhereInput
    some?: AiContentWhereInput
    none?: AiContentWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AiContentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    quizData?: SortOrder
    aiContent?: SortOrder
    isPaid?: SortOrder
    completedAt?: SortOrder
  }

  export type QuizAttemptAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type QuizAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    isPaid?: SortOrder
    completedAt?: SortOrder
  }

  export type QuizAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    isPaid?: SortOrder
    completedAt?: SortOrder
  }

  export type QuizAttemptSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
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
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type QuizAttemptScalarRelationFilter = {
    is?: QuizAttemptWhereInput
    isNot?: QuizAttemptWhereInput
  }

  export type AiContentQuizAttemptIdContentTypeCompoundUniqueInput = {
    quizAttemptId: number
    contentType: string
  }

  export type AiContentCountOrderByAggregateInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
    contentType?: SortOrder
    content?: SortOrder
    contentHash?: SortOrder
    generatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AiContentAvgOrderByAggregateInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
  }

  export type AiContentMaxOrderByAggregateInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
    contentType?: SortOrder
    contentHash?: SortOrder
    generatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AiContentMinOrderByAggregateInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
    contentType?: SortOrder
    contentHash?: SortOrder
    generatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AiContentSumOrderByAggregateInput = {
    id?: SortOrder
    quizAttemptId?: SortOrder
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

  export type QuizAttemptNullableScalarRelationFilter = {
    is?: QuizAttemptWhereInput | null
    isNot?: QuizAttemptWhereInput | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    stripePaymentIntentId?: SortOrder
    paypalOrderId?: SortOrder
    status?: SortOrder
    quizAttemptId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    version?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    quizAttemptId?: SortOrder
    version?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    stripePaymentIntentId?: SortOrder
    paypalOrderId?: SortOrder
    status?: SortOrder
    quizAttemptId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    version?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    stripePaymentIntentId?: SortOrder
    paypalOrderId?: SortOrder
    status?: SortOrder
    quizAttemptId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    version?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    quizAttemptId?: SortOrder
    version?: SortOrder
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

  export type PaymentScalarRelationFilter = {
    is?: PaymentWhereInput
    isNot?: PaymentWhereInput
  }

  export type RefundCountOrderByAggregateInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    stripeRefundId?: SortOrder
    paypalRefundId?: SortOrder
    adminUserId?: SortOrder
    adminNote?: SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrder
  }

  export type RefundAvgOrderByAggregateInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    adminUserId?: SortOrder
  }

  export type RefundMaxOrderByAggregateInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    stripeRefundId?: SortOrder
    paypalRefundId?: SortOrder
    adminUserId?: SortOrder
    adminNote?: SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrder
  }

  export type RefundMinOrderByAggregateInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    stripeRefundId?: SortOrder
    paypalRefundId?: SortOrder
    adminUserId?: SortOrder
    adminNote?: SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrder
  }

  export type RefundSumOrderByAggregateInput = {
    id?: SortOrder
    paymentId?: SortOrder
    amount?: SortOrder
    adminUserId?: SortOrder
  }

  export type UnpaidUserEmailCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    email?: SortOrder
    quizData?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UnpaidUserEmailAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UnpaidUserEmailMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UnpaidUserEmailMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UnpaidUserEmailSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ReportViewCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    quizAttemptId?: SortOrder
    viewedAt?: SortOrder
  }

  export type ReportViewAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    quizAttemptId?: SortOrder
  }

  export type ReportViewMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    quizAttemptId?: SortOrder
    viewedAt?: SortOrder
  }

  export type ReportViewMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    quizAttemptId?: SortOrder
    viewedAt?: SortOrder
  }

  export type ReportViewSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    quizAttemptId?: SortOrder
  }

  export type PasswordResetTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type PasswordResetTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetTokenSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type PasswordResetTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type QuizAttemptCreateNestedManyWithoutUserInput = {
    create?: XOR<QuizAttemptCreateWithoutUserInput, QuizAttemptUncheckedCreateWithoutUserInput> | QuizAttemptCreateWithoutUserInput[] | QuizAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutUserInput | QuizAttemptCreateOrConnectWithoutUserInput[]
    createMany?: QuizAttemptCreateManyUserInputEnvelope
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
  }

  export type RefundCreateNestedManyWithoutAdminUserInput = {
    create?: XOR<RefundCreateWithoutAdminUserInput, RefundUncheckedCreateWithoutAdminUserInput> | RefundCreateWithoutAdminUserInput[] | RefundUncheckedCreateWithoutAdminUserInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutAdminUserInput | RefundCreateOrConnectWithoutAdminUserInput[]
    createMany?: RefundCreateManyAdminUserInputEnvelope
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
  }

  export type ReportViewCreateNestedManyWithoutUserInput = {
    create?: XOR<ReportViewCreateWithoutUserInput, ReportViewUncheckedCreateWithoutUserInput> | ReportViewCreateWithoutUserInput[] | ReportViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutUserInput | ReportViewCreateOrConnectWithoutUserInput[]
    createMany?: ReportViewCreateManyUserInputEnvelope
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
  }

  export type PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type QuizAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<QuizAttemptCreateWithoutUserInput, QuizAttemptUncheckedCreateWithoutUserInput> | QuizAttemptCreateWithoutUserInput[] | QuizAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutUserInput | QuizAttemptCreateOrConnectWithoutUserInput[]
    createMany?: QuizAttemptCreateManyUserInputEnvelope
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
  }

  export type RefundUncheckedCreateNestedManyWithoutAdminUserInput = {
    create?: XOR<RefundCreateWithoutAdminUserInput, RefundUncheckedCreateWithoutAdminUserInput> | RefundCreateWithoutAdminUserInput[] | RefundUncheckedCreateWithoutAdminUserInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutAdminUserInput | RefundCreateOrConnectWithoutAdminUserInput[]
    createMany?: RefundCreateManyAdminUserInputEnvelope
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
  }

  export type ReportViewUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReportViewCreateWithoutUserInput, ReportViewUncheckedCreateWithoutUserInput> | ReportViewCreateWithoutUserInput[] | ReportViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutUserInput | ReportViewCreateOrConnectWithoutUserInput[]
    createMany?: ReportViewCreateManyUserInputEnvelope
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PasswordResetTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type QuizAttemptUpdateManyWithoutUserNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutUserInput, QuizAttemptUncheckedCreateWithoutUserInput> | QuizAttemptCreateWithoutUserInput[] | QuizAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutUserInput | QuizAttemptCreateOrConnectWithoutUserInput[]
    upsert?: QuizAttemptUpsertWithWhereUniqueWithoutUserInput | QuizAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QuizAttemptCreateManyUserInputEnvelope
    set?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    disconnect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    delete?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    update?: QuizAttemptUpdateWithWhereUniqueWithoutUserInput | QuizAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QuizAttemptUpdateManyWithWhereWithoutUserInput | QuizAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
  }

  export type RefundUpdateManyWithoutAdminUserNestedInput = {
    create?: XOR<RefundCreateWithoutAdminUserInput, RefundUncheckedCreateWithoutAdminUserInput> | RefundCreateWithoutAdminUserInput[] | RefundUncheckedCreateWithoutAdminUserInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutAdminUserInput | RefundCreateOrConnectWithoutAdminUserInput[]
    upsert?: RefundUpsertWithWhereUniqueWithoutAdminUserInput | RefundUpsertWithWhereUniqueWithoutAdminUserInput[]
    createMany?: RefundCreateManyAdminUserInputEnvelope
    set?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    disconnect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    delete?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    update?: RefundUpdateWithWhereUniqueWithoutAdminUserInput | RefundUpdateWithWhereUniqueWithoutAdminUserInput[]
    updateMany?: RefundUpdateManyWithWhereWithoutAdminUserInput | RefundUpdateManyWithWhereWithoutAdminUserInput[]
    deleteMany?: RefundScalarWhereInput | RefundScalarWhereInput[]
  }

  export type ReportViewUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReportViewCreateWithoutUserInput, ReportViewUncheckedCreateWithoutUserInput> | ReportViewCreateWithoutUserInput[] | ReportViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutUserInput | ReportViewCreateOrConnectWithoutUserInput[]
    upsert?: ReportViewUpsertWithWhereUniqueWithoutUserInput | ReportViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReportViewCreateManyUserInputEnvelope
    set?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    disconnect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    delete?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    update?: ReportViewUpdateWithWhereUniqueWithoutUserInput | ReportViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReportViewUpdateManyWithWhereWithoutUserInput | ReportViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReportViewScalarWhereInput | ReportViewScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type QuizAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutUserInput, QuizAttemptUncheckedCreateWithoutUserInput> | QuizAttemptCreateWithoutUserInput[] | QuizAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutUserInput | QuizAttemptCreateOrConnectWithoutUserInput[]
    upsert?: QuizAttemptUpsertWithWhereUniqueWithoutUserInput | QuizAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QuizAttemptCreateManyUserInputEnvelope
    set?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    disconnect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    delete?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    update?: QuizAttemptUpdateWithWhereUniqueWithoutUserInput | QuizAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QuizAttemptUpdateManyWithWhereWithoutUserInput | QuizAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
  }

  export type RefundUncheckedUpdateManyWithoutAdminUserNestedInput = {
    create?: XOR<RefundCreateWithoutAdminUserInput, RefundUncheckedCreateWithoutAdminUserInput> | RefundCreateWithoutAdminUserInput[] | RefundUncheckedCreateWithoutAdminUserInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutAdminUserInput | RefundCreateOrConnectWithoutAdminUserInput[]
    upsert?: RefundUpsertWithWhereUniqueWithoutAdminUserInput | RefundUpsertWithWhereUniqueWithoutAdminUserInput[]
    createMany?: RefundCreateManyAdminUserInputEnvelope
    set?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    disconnect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    delete?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    update?: RefundUpdateWithWhereUniqueWithoutAdminUserInput | RefundUpdateWithWhereUniqueWithoutAdminUserInput[]
    updateMany?: RefundUpdateManyWithWhereWithoutAdminUserInput | RefundUpdateManyWithWhereWithoutAdminUserInput[]
    deleteMany?: RefundScalarWhereInput | RefundScalarWhereInput[]
  }

  export type ReportViewUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReportViewCreateWithoutUserInput, ReportViewUncheckedCreateWithoutUserInput> | ReportViewCreateWithoutUserInput[] | ReportViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutUserInput | ReportViewCreateOrConnectWithoutUserInput[]
    upsert?: ReportViewUpsertWithWhereUniqueWithoutUserInput | ReportViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReportViewCreateManyUserInputEnvelope
    set?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    disconnect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    delete?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    update?: ReportViewUpdateWithWhereUniqueWithoutUserInput | ReportViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReportViewUpdateManyWithWhereWithoutUserInput | ReportViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReportViewScalarWhereInput | ReportViewScalarWhereInput[]
  }

  export type AiContentCreateNestedManyWithoutQuizAttemptInput = {
    create?: XOR<AiContentCreateWithoutQuizAttemptInput, AiContentUncheckedCreateWithoutQuizAttemptInput> | AiContentCreateWithoutQuizAttemptInput[] | AiContentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: AiContentCreateOrConnectWithoutQuizAttemptInput | AiContentCreateOrConnectWithoutQuizAttemptInput[]
    createMany?: AiContentCreateManyQuizAttemptInputEnvelope
    connect?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutQuizAttemptInput = {
    create?: XOR<PaymentCreateWithoutQuizAttemptInput, PaymentUncheckedCreateWithoutQuizAttemptInput> | PaymentCreateWithoutQuizAttemptInput[] | PaymentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuizAttemptInput | PaymentCreateOrConnectWithoutQuizAttemptInput[]
    createMany?: PaymentCreateManyQuizAttemptInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutQuizAttemptsInput = {
    create?: XOR<UserCreateWithoutQuizAttemptsInput, UserUncheckedCreateWithoutQuizAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuizAttemptsInput
    connect?: UserWhereUniqueInput
  }

  export type ReportViewCreateNestedManyWithoutQuizAttemptInput = {
    create?: XOR<ReportViewCreateWithoutQuizAttemptInput, ReportViewUncheckedCreateWithoutQuizAttemptInput> | ReportViewCreateWithoutQuizAttemptInput[] | ReportViewUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutQuizAttemptInput | ReportViewCreateOrConnectWithoutQuizAttemptInput[]
    createMany?: ReportViewCreateManyQuizAttemptInputEnvelope
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
  }

  export type AiContentUncheckedCreateNestedManyWithoutQuizAttemptInput = {
    create?: XOR<AiContentCreateWithoutQuizAttemptInput, AiContentUncheckedCreateWithoutQuizAttemptInput> | AiContentCreateWithoutQuizAttemptInput[] | AiContentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: AiContentCreateOrConnectWithoutQuizAttemptInput | AiContentCreateOrConnectWithoutQuizAttemptInput[]
    createMany?: AiContentCreateManyQuizAttemptInputEnvelope
    connect?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutQuizAttemptInput = {
    create?: XOR<PaymentCreateWithoutQuizAttemptInput, PaymentUncheckedCreateWithoutQuizAttemptInput> | PaymentCreateWithoutQuizAttemptInput[] | PaymentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuizAttemptInput | PaymentCreateOrConnectWithoutQuizAttemptInput[]
    createMany?: PaymentCreateManyQuizAttemptInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type ReportViewUncheckedCreateNestedManyWithoutQuizAttemptInput = {
    create?: XOR<ReportViewCreateWithoutQuizAttemptInput, ReportViewUncheckedCreateWithoutQuizAttemptInput> | ReportViewCreateWithoutQuizAttemptInput[] | ReportViewUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutQuizAttemptInput | ReportViewCreateOrConnectWithoutQuizAttemptInput[]
    createMany?: ReportViewCreateManyQuizAttemptInputEnvelope
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
  }

  export type AiContentUpdateManyWithoutQuizAttemptNestedInput = {
    create?: XOR<AiContentCreateWithoutQuizAttemptInput, AiContentUncheckedCreateWithoutQuizAttemptInput> | AiContentCreateWithoutQuizAttemptInput[] | AiContentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: AiContentCreateOrConnectWithoutQuizAttemptInput | AiContentCreateOrConnectWithoutQuizAttemptInput[]
    upsert?: AiContentUpsertWithWhereUniqueWithoutQuizAttemptInput | AiContentUpsertWithWhereUniqueWithoutQuizAttemptInput[]
    createMany?: AiContentCreateManyQuizAttemptInputEnvelope
    set?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    disconnect?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    delete?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    connect?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    update?: AiContentUpdateWithWhereUniqueWithoutQuizAttemptInput | AiContentUpdateWithWhereUniqueWithoutQuizAttemptInput[]
    updateMany?: AiContentUpdateManyWithWhereWithoutQuizAttemptInput | AiContentUpdateManyWithWhereWithoutQuizAttemptInput[]
    deleteMany?: AiContentScalarWhereInput | AiContentScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutQuizAttemptNestedInput = {
    create?: XOR<PaymentCreateWithoutQuizAttemptInput, PaymentUncheckedCreateWithoutQuizAttemptInput> | PaymentCreateWithoutQuizAttemptInput[] | PaymentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuizAttemptInput | PaymentCreateOrConnectWithoutQuizAttemptInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutQuizAttemptInput | PaymentUpsertWithWhereUniqueWithoutQuizAttemptInput[]
    createMany?: PaymentCreateManyQuizAttemptInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutQuizAttemptInput | PaymentUpdateWithWhereUniqueWithoutQuizAttemptInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutQuizAttemptInput | PaymentUpdateManyWithWhereWithoutQuizAttemptInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type UserUpdateOneWithoutQuizAttemptsNestedInput = {
    create?: XOR<UserCreateWithoutQuizAttemptsInput, UserUncheckedCreateWithoutQuizAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuizAttemptsInput
    upsert?: UserUpsertWithoutQuizAttemptsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutQuizAttemptsInput, UserUpdateWithoutQuizAttemptsInput>, UserUncheckedUpdateWithoutQuizAttemptsInput>
  }

  export type ReportViewUpdateManyWithoutQuizAttemptNestedInput = {
    create?: XOR<ReportViewCreateWithoutQuizAttemptInput, ReportViewUncheckedCreateWithoutQuizAttemptInput> | ReportViewCreateWithoutQuizAttemptInput[] | ReportViewUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutQuizAttemptInput | ReportViewCreateOrConnectWithoutQuizAttemptInput[]
    upsert?: ReportViewUpsertWithWhereUniqueWithoutQuizAttemptInput | ReportViewUpsertWithWhereUniqueWithoutQuizAttemptInput[]
    createMany?: ReportViewCreateManyQuizAttemptInputEnvelope
    set?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    disconnect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    delete?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    update?: ReportViewUpdateWithWhereUniqueWithoutQuizAttemptInput | ReportViewUpdateWithWhereUniqueWithoutQuizAttemptInput[]
    updateMany?: ReportViewUpdateManyWithWhereWithoutQuizAttemptInput | ReportViewUpdateManyWithWhereWithoutQuizAttemptInput[]
    deleteMany?: ReportViewScalarWhereInput | ReportViewScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AiContentUncheckedUpdateManyWithoutQuizAttemptNestedInput = {
    create?: XOR<AiContentCreateWithoutQuizAttemptInput, AiContentUncheckedCreateWithoutQuizAttemptInput> | AiContentCreateWithoutQuizAttemptInput[] | AiContentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: AiContentCreateOrConnectWithoutQuizAttemptInput | AiContentCreateOrConnectWithoutQuizAttemptInput[]
    upsert?: AiContentUpsertWithWhereUniqueWithoutQuizAttemptInput | AiContentUpsertWithWhereUniqueWithoutQuizAttemptInput[]
    createMany?: AiContentCreateManyQuizAttemptInputEnvelope
    set?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    disconnect?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    delete?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    connect?: AiContentWhereUniqueInput | AiContentWhereUniqueInput[]
    update?: AiContentUpdateWithWhereUniqueWithoutQuizAttemptInput | AiContentUpdateWithWhereUniqueWithoutQuizAttemptInput[]
    updateMany?: AiContentUpdateManyWithWhereWithoutQuizAttemptInput | AiContentUpdateManyWithWhereWithoutQuizAttemptInput[]
    deleteMany?: AiContentScalarWhereInput | AiContentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutQuizAttemptNestedInput = {
    create?: XOR<PaymentCreateWithoutQuizAttemptInput, PaymentUncheckedCreateWithoutQuizAttemptInput> | PaymentCreateWithoutQuizAttemptInput[] | PaymentUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutQuizAttemptInput | PaymentCreateOrConnectWithoutQuizAttemptInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutQuizAttemptInput | PaymentUpsertWithWhereUniqueWithoutQuizAttemptInput[]
    createMany?: PaymentCreateManyQuizAttemptInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutQuizAttemptInput | PaymentUpdateWithWhereUniqueWithoutQuizAttemptInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutQuizAttemptInput | PaymentUpdateManyWithWhereWithoutQuizAttemptInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type ReportViewUncheckedUpdateManyWithoutQuizAttemptNestedInput = {
    create?: XOR<ReportViewCreateWithoutQuizAttemptInput, ReportViewUncheckedCreateWithoutQuizAttemptInput> | ReportViewCreateWithoutQuizAttemptInput[] | ReportViewUncheckedCreateWithoutQuizAttemptInput[]
    connectOrCreate?: ReportViewCreateOrConnectWithoutQuizAttemptInput | ReportViewCreateOrConnectWithoutQuizAttemptInput[]
    upsert?: ReportViewUpsertWithWhereUniqueWithoutQuizAttemptInput | ReportViewUpsertWithWhereUniqueWithoutQuizAttemptInput[]
    createMany?: ReportViewCreateManyQuizAttemptInputEnvelope
    set?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    disconnect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    delete?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    connect?: ReportViewWhereUniqueInput | ReportViewWhereUniqueInput[]
    update?: ReportViewUpdateWithWhereUniqueWithoutQuizAttemptInput | ReportViewUpdateWithWhereUniqueWithoutQuizAttemptInput[]
    updateMany?: ReportViewUpdateManyWithWhereWithoutQuizAttemptInput | ReportViewUpdateManyWithWhereWithoutQuizAttemptInput[]
    deleteMany?: ReportViewScalarWhereInput | ReportViewScalarWhereInput[]
  }

  export type QuizAttemptCreateNestedOneWithoutAiContentsInput = {
    create?: XOR<QuizAttemptCreateWithoutAiContentsInput, QuizAttemptUncheckedCreateWithoutAiContentsInput>
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutAiContentsInput
    connect?: QuizAttemptWhereUniqueInput
  }

  export type QuizAttemptUpdateOneRequiredWithoutAiContentsNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutAiContentsInput, QuizAttemptUncheckedCreateWithoutAiContentsInput>
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutAiContentsInput
    upsert?: QuizAttemptUpsertWithoutAiContentsInput
    connect?: QuizAttemptWhereUniqueInput
    update?: XOR<XOR<QuizAttemptUpdateToOneWithWhereWithoutAiContentsInput, QuizAttemptUpdateWithoutAiContentsInput>, QuizAttemptUncheckedUpdateWithoutAiContentsInput>
  }

  export type QuizAttemptCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<QuizAttemptCreateWithoutPaymentsInput, QuizAttemptUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutPaymentsInput
    connect?: QuizAttemptWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type RefundCreateNestedManyWithoutPaymentInput = {
    create?: XOR<RefundCreateWithoutPaymentInput, RefundUncheckedCreateWithoutPaymentInput> | RefundCreateWithoutPaymentInput[] | RefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutPaymentInput | RefundCreateOrConnectWithoutPaymentInput[]
    createMany?: RefundCreateManyPaymentInputEnvelope
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
  }

  export type RefundUncheckedCreateNestedManyWithoutPaymentInput = {
    create?: XOR<RefundCreateWithoutPaymentInput, RefundUncheckedCreateWithoutPaymentInput> | RefundCreateWithoutPaymentInput[] | RefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutPaymentInput | RefundCreateOrConnectWithoutPaymentInput[]
    createMany?: RefundCreateManyPaymentInputEnvelope
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type QuizAttemptUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutPaymentsInput, QuizAttemptUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutPaymentsInput
    upsert?: QuizAttemptUpsertWithoutPaymentsInput
    disconnect?: QuizAttemptWhereInput | boolean
    delete?: QuizAttemptWhereInput | boolean
    connect?: QuizAttemptWhereUniqueInput
    update?: XOR<XOR<QuizAttemptUpdateToOneWithWhereWithoutPaymentsInput, QuizAttemptUpdateWithoutPaymentsInput>, QuizAttemptUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    upsert?: UserUpsertWithoutPaymentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentsInput, UserUpdateWithoutPaymentsInput>, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type RefundUpdateManyWithoutPaymentNestedInput = {
    create?: XOR<RefundCreateWithoutPaymentInput, RefundUncheckedCreateWithoutPaymentInput> | RefundCreateWithoutPaymentInput[] | RefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutPaymentInput | RefundCreateOrConnectWithoutPaymentInput[]
    upsert?: RefundUpsertWithWhereUniqueWithoutPaymentInput | RefundUpsertWithWhereUniqueWithoutPaymentInput[]
    createMany?: RefundCreateManyPaymentInputEnvelope
    set?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    disconnect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    delete?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    update?: RefundUpdateWithWhereUniqueWithoutPaymentInput | RefundUpdateWithWhereUniqueWithoutPaymentInput[]
    updateMany?: RefundUpdateManyWithWhereWithoutPaymentInput | RefundUpdateManyWithWhereWithoutPaymentInput[]
    deleteMany?: RefundScalarWhereInput | RefundScalarWhereInput[]
  }

  export type RefundUncheckedUpdateManyWithoutPaymentNestedInput = {
    create?: XOR<RefundCreateWithoutPaymentInput, RefundUncheckedCreateWithoutPaymentInput> | RefundCreateWithoutPaymentInput[] | RefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: RefundCreateOrConnectWithoutPaymentInput | RefundCreateOrConnectWithoutPaymentInput[]
    upsert?: RefundUpsertWithWhereUniqueWithoutPaymentInput | RefundUpsertWithWhereUniqueWithoutPaymentInput[]
    createMany?: RefundCreateManyPaymentInputEnvelope
    set?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    disconnect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    delete?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    connect?: RefundWhereUniqueInput | RefundWhereUniqueInput[]
    update?: RefundUpdateWithWhereUniqueWithoutPaymentInput | RefundUpdateWithWhereUniqueWithoutPaymentInput[]
    updateMany?: RefundUpdateManyWithWhereWithoutPaymentInput | RefundUpdateManyWithWhereWithoutPaymentInput[]
    deleteMany?: RefundScalarWhereInput | RefundScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefundsProcessedInput = {
    create?: XOR<UserCreateWithoutRefundsProcessedInput, UserUncheckedCreateWithoutRefundsProcessedInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefundsProcessedInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentCreateNestedOneWithoutRefundsInput = {
    create?: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutRefundsInput
    connect?: PaymentWhereUniqueInput
  }

  export type UserUpdateOneWithoutRefundsProcessedNestedInput = {
    create?: XOR<UserCreateWithoutRefundsProcessedInput, UserUncheckedCreateWithoutRefundsProcessedInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefundsProcessedInput
    upsert?: UserUpsertWithoutRefundsProcessedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefundsProcessedInput, UserUpdateWithoutRefundsProcessedInput>, UserUncheckedUpdateWithoutRefundsProcessedInput>
  }

  export type PaymentUpdateOneRequiredWithoutRefundsNestedInput = {
    create?: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutRefundsInput
    upsert?: PaymentUpsertWithoutRefundsInput
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutRefundsInput, PaymentUpdateWithoutRefundsInput>, PaymentUncheckedUpdateWithoutRefundsInput>
  }

  export type QuizAttemptCreateNestedOneWithoutReportViewsInput = {
    create?: XOR<QuizAttemptCreateWithoutReportViewsInput, QuizAttemptUncheckedCreateWithoutReportViewsInput>
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutReportViewsInput
    connect?: QuizAttemptWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReportViewsInput = {
    create?: XOR<UserCreateWithoutReportViewsInput, UserUncheckedCreateWithoutReportViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReportViewsInput
    connect?: UserWhereUniqueInput
  }

  export type QuizAttemptUpdateOneRequiredWithoutReportViewsNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutReportViewsInput, QuizAttemptUncheckedCreateWithoutReportViewsInput>
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutReportViewsInput
    upsert?: QuizAttemptUpsertWithoutReportViewsInput
    connect?: QuizAttemptWhereUniqueInput
    update?: XOR<XOR<QuizAttemptUpdateToOneWithWhereWithoutReportViewsInput, QuizAttemptUpdateWithoutReportViewsInput>, QuizAttemptUncheckedUpdateWithoutReportViewsInput>
  }

  export type UserUpdateOneWithoutReportViewsNestedInput = {
    create?: XOR<UserCreateWithoutReportViewsInput, UserUncheckedCreateWithoutReportViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReportViewsInput
    upsert?: UserUpsertWithoutReportViewsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReportViewsInput, UserUpdateWithoutReportViewsInput>, UserUncheckedUpdateWithoutReportViewsInput>
  }

  export type UserCreateNestedOneWithoutPasswordResetTokensInput = {
    create?: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPasswordResetTokensNestedInput = {
    create?: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetTokensInput
    upsert?: UserUpsertWithoutPasswordResetTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPasswordResetTokensInput, UserUpdateWithoutPasswordResetTokensInput>, UserUncheckedUpdateWithoutPasswordResetTokensInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type PasswordResetTokenCreateWithoutUserInput = {
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetTokenUncheckedCreateWithoutUserInput = {
    id?: number
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetTokenCreateOrConnectWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenCreateManyUserInputEnvelope = {
    data: PasswordResetTokenCreateManyUserInput | PasswordResetTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutUserInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    quizAttempt?: QuizAttemptCreateNestedOneWithoutPaymentsInput
    refunds?: RefundCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUncheckedCreateWithoutUserInput = {
    id?: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    quizAttemptId?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    refunds?: RefundUncheckedCreateNestedManyWithoutPaymentInput
  }

  export type PaymentCreateOrConnectWithoutUserInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentCreateManyUserInputEnvelope = {
    data: PaymentCreateManyUserInput | PaymentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type QuizAttemptCreateWithoutUserInput = {
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentCreateNestedManyWithoutQuizAttemptInput
    payments?: PaymentCreateNestedManyWithoutQuizAttemptInput
    reportViews?: ReportViewCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptUncheckedCreateWithoutUserInput = {
    id?: number
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentUncheckedCreateNestedManyWithoutQuizAttemptInput
    payments?: PaymentUncheckedCreateNestedManyWithoutQuizAttemptInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptCreateOrConnectWithoutUserInput = {
    where: QuizAttemptWhereUniqueInput
    create: XOR<QuizAttemptCreateWithoutUserInput, QuizAttemptUncheckedCreateWithoutUserInput>
  }

  export type QuizAttemptCreateManyUserInputEnvelope = {
    data: QuizAttemptCreateManyUserInput | QuizAttemptCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RefundCreateWithoutAdminUserInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
    payment: PaymentCreateNestedOneWithoutRefundsInput
  }

  export type RefundUncheckedCreateWithoutAdminUserInput = {
    id?: number
    paymentId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type RefundCreateOrConnectWithoutAdminUserInput = {
    where: RefundWhereUniqueInput
    create: XOR<RefundCreateWithoutAdminUserInput, RefundUncheckedCreateWithoutAdminUserInput>
  }

  export type RefundCreateManyAdminUserInputEnvelope = {
    data: RefundCreateManyAdminUserInput | RefundCreateManyAdminUserInput[]
    skipDuplicates?: boolean
  }

  export type ReportViewCreateWithoutUserInput = {
    sessionId?: string | null
    viewedAt?: Date | string
    quizAttempt: QuizAttemptCreateNestedOneWithoutReportViewsInput
  }

  export type ReportViewUncheckedCreateWithoutUserInput = {
    id?: number
    sessionId?: string | null
    quizAttemptId: number
    viewedAt?: Date | string
  }

  export type ReportViewCreateOrConnectWithoutUserInput = {
    where: ReportViewWhereUniqueInput
    create: XOR<ReportViewCreateWithoutUserInput, ReportViewUncheckedCreateWithoutUserInput>
  }

  export type ReportViewCreateManyUserInputEnvelope = {
    data: ReportViewCreateManyUserInput | ReportViewCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    update: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    data: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetTokenScalarWhereInput
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetTokenScalarWhereInput = {
    AND?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    OR?: PasswordResetTokenScalarWhereInput[]
    NOT?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    id?: IntFilter<"PasswordResetToken"> | number
    userId?: IntFilter<"PasswordResetToken"> | number
    token?: StringFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUpdateManyWithWhereWithoutUserInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutUserInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: IntFilter<"Payment"> | number
    userId?: IntFilter<"Payment"> | number
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    type?: StringFilter<"Payment"> | string
    stripePaymentIntentId?: StringNullableFilter<"Payment"> | string | null
    paypalOrderId?: StringNullableFilter<"Payment"> | string | null
    status?: StringFilter<"Payment"> | string
    quizAttemptId?: IntNullableFilter<"Payment"> | number | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    completedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    version?: IntFilter<"Payment"> | number
  }

  export type QuizAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: QuizAttemptWhereUniqueInput
    update: XOR<QuizAttemptUpdateWithoutUserInput, QuizAttemptUncheckedUpdateWithoutUserInput>
    create: XOR<QuizAttemptCreateWithoutUserInput, QuizAttemptUncheckedCreateWithoutUserInput>
  }

  export type QuizAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: QuizAttemptWhereUniqueInput
    data: XOR<QuizAttemptUpdateWithoutUserInput, QuizAttemptUncheckedUpdateWithoutUserInput>
  }

  export type QuizAttemptUpdateManyWithWhereWithoutUserInput = {
    where: QuizAttemptScalarWhereInput
    data: XOR<QuizAttemptUpdateManyMutationInput, QuizAttemptUncheckedUpdateManyWithoutUserInput>
  }

  export type QuizAttemptScalarWhereInput = {
    AND?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
    OR?: QuizAttemptScalarWhereInput[]
    NOT?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
    id?: IntFilter<"QuizAttempt"> | number
    userId?: IntNullableFilter<"QuizAttempt"> | number | null
    sessionId?: StringNullableFilter<"QuizAttempt"> | string | null
    quizData?: JsonFilter<"QuizAttempt">
    aiContent?: JsonNullableFilter<"QuizAttempt">
    isPaid?: BoolFilter<"QuizAttempt"> | boolean
    completedAt?: DateTimeFilter<"QuizAttempt"> | Date | string
  }

  export type RefundUpsertWithWhereUniqueWithoutAdminUserInput = {
    where: RefundWhereUniqueInput
    update: XOR<RefundUpdateWithoutAdminUserInput, RefundUncheckedUpdateWithoutAdminUserInput>
    create: XOR<RefundCreateWithoutAdminUserInput, RefundUncheckedCreateWithoutAdminUserInput>
  }

  export type RefundUpdateWithWhereUniqueWithoutAdminUserInput = {
    where: RefundWhereUniqueInput
    data: XOR<RefundUpdateWithoutAdminUserInput, RefundUncheckedUpdateWithoutAdminUserInput>
  }

  export type RefundUpdateManyWithWhereWithoutAdminUserInput = {
    where: RefundScalarWhereInput
    data: XOR<RefundUpdateManyMutationInput, RefundUncheckedUpdateManyWithoutAdminUserInput>
  }

  export type RefundScalarWhereInput = {
    AND?: RefundScalarWhereInput | RefundScalarWhereInput[]
    OR?: RefundScalarWhereInput[]
    NOT?: RefundScalarWhereInput | RefundScalarWhereInput[]
    id?: IntFilter<"Refund"> | number
    paymentId?: IntFilter<"Refund"> | number
    amount?: DecimalFilter<"Refund"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Refund"> | string
    reason?: StringFilter<"Refund"> | string
    status?: StringFilter<"Refund"> | string
    stripeRefundId?: StringNullableFilter<"Refund"> | string | null
    paypalRefundId?: StringNullableFilter<"Refund"> | string | null
    adminUserId?: IntNullableFilter<"Refund"> | number | null
    adminNote?: StringNullableFilter<"Refund"> | string | null
    createdAt?: DateTimeFilter<"Refund"> | Date | string
    processedAt?: DateTimeNullableFilter<"Refund"> | Date | string | null
  }

  export type ReportViewUpsertWithWhereUniqueWithoutUserInput = {
    where: ReportViewWhereUniqueInput
    update: XOR<ReportViewUpdateWithoutUserInput, ReportViewUncheckedUpdateWithoutUserInput>
    create: XOR<ReportViewCreateWithoutUserInput, ReportViewUncheckedCreateWithoutUserInput>
  }

  export type ReportViewUpdateWithWhereUniqueWithoutUserInput = {
    where: ReportViewWhereUniqueInput
    data: XOR<ReportViewUpdateWithoutUserInput, ReportViewUncheckedUpdateWithoutUserInput>
  }

  export type ReportViewUpdateManyWithWhereWithoutUserInput = {
    where: ReportViewScalarWhereInput
    data: XOR<ReportViewUpdateManyMutationInput, ReportViewUncheckedUpdateManyWithoutUserInput>
  }

  export type ReportViewScalarWhereInput = {
    AND?: ReportViewScalarWhereInput | ReportViewScalarWhereInput[]
    OR?: ReportViewScalarWhereInput[]
    NOT?: ReportViewScalarWhereInput | ReportViewScalarWhereInput[]
    id?: IntFilter<"ReportView"> | number
    userId?: IntNullableFilter<"ReportView"> | number | null
    sessionId?: StringNullableFilter<"ReportView"> | string | null
    quizAttemptId?: IntFilter<"ReportView"> | number
    viewedAt?: DateTimeFilter<"ReportView"> | Date | string
  }

  export type AiContentCreateWithoutQuizAttemptInput = {
    contentType: string
    content: JsonNullValueInput | InputJsonValue
    contentHash?: string | null
    generatedAt?: Date | string
    createdAt?: Date | string
  }

  export type AiContentUncheckedCreateWithoutQuizAttemptInput = {
    id?: number
    contentType: string
    content: JsonNullValueInput | InputJsonValue
    contentHash?: string | null
    generatedAt?: Date | string
    createdAt?: Date | string
  }

  export type AiContentCreateOrConnectWithoutQuizAttemptInput = {
    where: AiContentWhereUniqueInput
    create: XOR<AiContentCreateWithoutQuizAttemptInput, AiContentUncheckedCreateWithoutQuizAttemptInput>
  }

  export type AiContentCreateManyQuizAttemptInputEnvelope = {
    data: AiContentCreateManyQuizAttemptInput | AiContentCreateManyQuizAttemptInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutQuizAttemptInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    user: UserCreateNestedOneWithoutPaymentsInput
    refunds?: RefundCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUncheckedCreateWithoutQuizAttemptInput = {
    id?: number
    userId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    refunds?: RefundUncheckedCreateNestedManyWithoutPaymentInput
  }

  export type PaymentCreateOrConnectWithoutQuizAttemptInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutQuizAttemptInput, PaymentUncheckedCreateWithoutQuizAttemptInput>
  }

  export type PaymentCreateManyQuizAttemptInputEnvelope = {
    data: PaymentCreateManyQuizAttemptInput | PaymentCreateManyQuizAttemptInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutQuizAttemptsInput = {
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutQuizAttemptsInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundUncheckedCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutQuizAttemptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutQuizAttemptsInput, UserUncheckedCreateWithoutQuizAttemptsInput>
  }

  export type ReportViewCreateWithoutQuizAttemptInput = {
    sessionId?: string | null
    viewedAt?: Date | string
    user?: UserCreateNestedOneWithoutReportViewsInput
  }

  export type ReportViewUncheckedCreateWithoutQuizAttemptInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    viewedAt?: Date | string
  }

  export type ReportViewCreateOrConnectWithoutQuizAttemptInput = {
    where: ReportViewWhereUniqueInput
    create: XOR<ReportViewCreateWithoutQuizAttemptInput, ReportViewUncheckedCreateWithoutQuizAttemptInput>
  }

  export type ReportViewCreateManyQuizAttemptInputEnvelope = {
    data: ReportViewCreateManyQuizAttemptInput | ReportViewCreateManyQuizAttemptInput[]
    skipDuplicates?: boolean
  }

  export type AiContentUpsertWithWhereUniqueWithoutQuizAttemptInput = {
    where: AiContentWhereUniqueInput
    update: XOR<AiContentUpdateWithoutQuizAttemptInput, AiContentUncheckedUpdateWithoutQuizAttemptInput>
    create: XOR<AiContentCreateWithoutQuizAttemptInput, AiContentUncheckedCreateWithoutQuizAttemptInput>
  }

  export type AiContentUpdateWithWhereUniqueWithoutQuizAttemptInput = {
    where: AiContentWhereUniqueInput
    data: XOR<AiContentUpdateWithoutQuizAttemptInput, AiContentUncheckedUpdateWithoutQuizAttemptInput>
  }

  export type AiContentUpdateManyWithWhereWithoutQuizAttemptInput = {
    where: AiContentScalarWhereInput
    data: XOR<AiContentUpdateManyMutationInput, AiContentUncheckedUpdateManyWithoutQuizAttemptInput>
  }

  export type AiContentScalarWhereInput = {
    AND?: AiContentScalarWhereInput | AiContentScalarWhereInput[]
    OR?: AiContentScalarWhereInput[]
    NOT?: AiContentScalarWhereInput | AiContentScalarWhereInput[]
    id?: IntFilter<"AiContent"> | number
    quizAttemptId?: IntFilter<"AiContent"> | number
    contentType?: StringFilter<"AiContent"> | string
    content?: JsonFilter<"AiContent">
    contentHash?: StringNullableFilter<"AiContent"> | string | null
    generatedAt?: DateTimeFilter<"AiContent"> | Date | string
    createdAt?: DateTimeFilter<"AiContent"> | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutQuizAttemptInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutQuizAttemptInput, PaymentUncheckedUpdateWithoutQuizAttemptInput>
    create: XOR<PaymentCreateWithoutQuizAttemptInput, PaymentUncheckedCreateWithoutQuizAttemptInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutQuizAttemptInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutQuizAttemptInput, PaymentUncheckedUpdateWithoutQuizAttemptInput>
  }

  export type PaymentUpdateManyWithWhereWithoutQuizAttemptInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutQuizAttemptInput>
  }

  export type UserUpsertWithoutQuizAttemptsInput = {
    update: XOR<UserUpdateWithoutQuizAttemptsInput, UserUncheckedUpdateWithoutQuizAttemptsInput>
    create: XOR<UserCreateWithoutQuizAttemptsInput, UserUncheckedCreateWithoutQuizAttemptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutQuizAttemptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutQuizAttemptsInput, UserUncheckedUpdateWithoutQuizAttemptsInput>
  }

  export type UserUpdateWithoutQuizAttemptsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutQuizAttemptsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUncheckedUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ReportViewUpsertWithWhereUniqueWithoutQuizAttemptInput = {
    where: ReportViewWhereUniqueInput
    update: XOR<ReportViewUpdateWithoutQuizAttemptInput, ReportViewUncheckedUpdateWithoutQuizAttemptInput>
    create: XOR<ReportViewCreateWithoutQuizAttemptInput, ReportViewUncheckedCreateWithoutQuizAttemptInput>
  }

  export type ReportViewUpdateWithWhereUniqueWithoutQuizAttemptInput = {
    where: ReportViewWhereUniqueInput
    data: XOR<ReportViewUpdateWithoutQuizAttemptInput, ReportViewUncheckedUpdateWithoutQuizAttemptInput>
  }

  export type ReportViewUpdateManyWithWhereWithoutQuizAttemptInput = {
    where: ReportViewScalarWhereInput
    data: XOR<ReportViewUpdateManyMutationInput, ReportViewUncheckedUpdateManyWithoutQuizAttemptInput>
  }

  export type QuizAttemptCreateWithoutAiContentsInput = {
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    payments?: PaymentCreateNestedManyWithoutQuizAttemptInput
    user?: UserCreateNestedOneWithoutQuizAttemptsInput
    reportViews?: ReportViewCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptUncheckedCreateWithoutAiContentsInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutQuizAttemptInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptCreateOrConnectWithoutAiContentsInput = {
    where: QuizAttemptWhereUniqueInput
    create: XOR<QuizAttemptCreateWithoutAiContentsInput, QuizAttemptUncheckedCreateWithoutAiContentsInput>
  }

  export type QuizAttemptUpsertWithoutAiContentsInput = {
    update: XOR<QuizAttemptUpdateWithoutAiContentsInput, QuizAttemptUncheckedUpdateWithoutAiContentsInput>
    create: XOR<QuizAttemptCreateWithoutAiContentsInput, QuizAttemptUncheckedCreateWithoutAiContentsInput>
    where?: QuizAttemptWhereInput
  }

  export type QuizAttemptUpdateToOneWithWhereWithoutAiContentsInput = {
    where?: QuizAttemptWhereInput
    data: XOR<QuizAttemptUpdateWithoutAiContentsInput, QuizAttemptUncheckedUpdateWithoutAiContentsInput>
  }

  export type QuizAttemptUpdateWithoutAiContentsInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUpdateManyWithoutQuizAttemptNestedInput
    user?: UserUpdateOneWithoutQuizAttemptsNestedInput
    reportViews?: ReportViewUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptUncheckedUpdateWithoutAiContentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptCreateWithoutPaymentsInput = {
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentCreateNestedManyWithoutQuizAttemptInput
    user?: UserCreateNestedOneWithoutQuizAttemptsInput
    reportViews?: ReportViewCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptUncheckedCreateWithoutPaymentsInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentUncheckedCreateNestedManyWithoutQuizAttemptInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptCreateOrConnectWithoutPaymentsInput = {
    where: QuizAttemptWhereUniqueInput
    create: XOR<QuizAttemptCreateWithoutPaymentsInput, QuizAttemptUncheckedCreateWithoutPaymentsInput>
  }

  export type UserCreateWithoutPaymentsInput = {
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPaymentsInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptUncheckedCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundUncheckedCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
  }

  export type RefundCreateWithoutPaymentInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
    adminUser?: UserCreateNestedOneWithoutRefundsProcessedInput
  }

  export type RefundUncheckedCreateWithoutPaymentInput = {
    id?: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminUserId?: number | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type RefundCreateOrConnectWithoutPaymentInput = {
    where: RefundWhereUniqueInput
    create: XOR<RefundCreateWithoutPaymentInput, RefundUncheckedCreateWithoutPaymentInput>
  }

  export type RefundCreateManyPaymentInputEnvelope = {
    data: RefundCreateManyPaymentInput | RefundCreateManyPaymentInput[]
    skipDuplicates?: boolean
  }

  export type QuizAttemptUpsertWithoutPaymentsInput = {
    update: XOR<QuizAttemptUpdateWithoutPaymentsInput, QuizAttemptUncheckedUpdateWithoutPaymentsInput>
    create: XOR<QuizAttemptCreateWithoutPaymentsInput, QuizAttemptUncheckedCreateWithoutPaymentsInput>
    where?: QuizAttemptWhereInput
  }

  export type QuizAttemptUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: QuizAttemptWhereInput
    data: XOR<QuizAttemptUpdateWithoutPaymentsInput, QuizAttemptUncheckedUpdateWithoutPaymentsInput>
  }

  export type QuizAttemptUpdateWithoutPaymentsInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUpdateManyWithoutQuizAttemptNestedInput
    user?: UserUpdateOneWithoutQuizAttemptsNestedInput
    reportViews?: ReportViewUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptUncheckedUpdateWithoutPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutQuizAttemptNestedInput
  }

  export type UserUpsertWithoutPaymentsInput = {
    update: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserUpdateWithoutPaymentsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUncheckedUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUncheckedUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RefundUpsertWithWhereUniqueWithoutPaymentInput = {
    where: RefundWhereUniqueInput
    update: XOR<RefundUpdateWithoutPaymentInput, RefundUncheckedUpdateWithoutPaymentInput>
    create: XOR<RefundCreateWithoutPaymentInput, RefundUncheckedCreateWithoutPaymentInput>
  }

  export type RefundUpdateWithWhereUniqueWithoutPaymentInput = {
    where: RefundWhereUniqueInput
    data: XOR<RefundUpdateWithoutPaymentInput, RefundUncheckedUpdateWithoutPaymentInput>
  }

  export type RefundUpdateManyWithWhereWithoutPaymentInput = {
    where: RefundScalarWhereInput
    data: XOR<RefundUpdateManyMutationInput, RefundUncheckedUpdateManyWithoutPaymentInput>
  }

  export type UserCreateWithoutRefundsProcessedInput = {
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptCreateNestedManyWithoutUserInput
    reportViews?: ReportViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefundsProcessedInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptUncheckedCreateNestedManyWithoutUserInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefundsProcessedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefundsProcessedInput, UserUncheckedCreateWithoutRefundsProcessedInput>
  }

  export type PaymentCreateWithoutRefundsInput = {
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
    quizAttempt?: QuizAttemptCreateNestedOneWithoutPaymentsInput
    user: UserCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutRefundsInput = {
    id?: number
    userId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    quizAttemptId?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
  }

  export type PaymentCreateOrConnectWithoutRefundsInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
  }

  export type UserUpsertWithoutRefundsProcessedInput = {
    update: XOR<UserUpdateWithoutRefundsProcessedInput, UserUncheckedUpdateWithoutRefundsProcessedInput>
    create: XOR<UserCreateWithoutRefundsProcessedInput, UserUncheckedCreateWithoutRefundsProcessedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefundsProcessedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefundsProcessedInput, UserUncheckedUpdateWithoutRefundsProcessedInput>
  }

  export type UserUpdateWithoutRefundsProcessedInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUpdateManyWithoutUserNestedInput
    reportViews?: ReportViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefundsProcessedInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUncheckedUpdateManyWithoutUserNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PaymentUpsertWithoutRefundsInput = {
    update: XOR<PaymentUpdateWithoutRefundsInput, PaymentUncheckedUpdateWithoutRefundsInput>
    create: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutRefundsInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutRefundsInput, PaymentUncheckedUpdateWithoutRefundsInput>
  }

  export type PaymentUpdateWithoutRefundsInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    quizAttempt?: QuizAttemptUpdateOneWithoutPaymentsNestedInput
    user?: UserUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutRefundsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    quizAttemptId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type QuizAttemptCreateWithoutReportViewsInput = {
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentCreateNestedManyWithoutQuizAttemptInput
    payments?: PaymentCreateNestedManyWithoutQuizAttemptInput
    user?: UserCreateNestedOneWithoutQuizAttemptsInput
  }

  export type QuizAttemptUncheckedCreateWithoutReportViewsInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
    aiContents?: AiContentUncheckedCreateNestedManyWithoutQuizAttemptInput
    payments?: PaymentUncheckedCreateNestedManyWithoutQuizAttemptInput
  }

  export type QuizAttemptCreateOrConnectWithoutReportViewsInput = {
    where: QuizAttemptWhereUniqueInput
    create: XOR<QuizAttemptCreateWithoutReportViewsInput, QuizAttemptUncheckedCreateWithoutReportViewsInput>
  }

  export type UserCreateWithoutReportViewsInput = {
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundCreateNestedManyWithoutAdminUserInput
  }

  export type UserUncheckedCreateWithoutReportViewsInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptUncheckedCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundUncheckedCreateNestedManyWithoutAdminUserInput
  }

  export type UserCreateOrConnectWithoutReportViewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReportViewsInput, UserUncheckedCreateWithoutReportViewsInput>
  }

  export type QuizAttemptUpsertWithoutReportViewsInput = {
    update: XOR<QuizAttemptUpdateWithoutReportViewsInput, QuizAttemptUncheckedUpdateWithoutReportViewsInput>
    create: XOR<QuizAttemptCreateWithoutReportViewsInput, QuizAttemptUncheckedCreateWithoutReportViewsInput>
    where?: QuizAttemptWhereInput
  }

  export type QuizAttemptUpdateToOneWithWhereWithoutReportViewsInput = {
    where?: QuizAttemptWhereInput
    data: XOR<QuizAttemptUpdateWithoutReportViewsInput, QuizAttemptUncheckedUpdateWithoutReportViewsInput>
  }

  export type QuizAttemptUpdateWithoutReportViewsInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUpdateManyWithoutQuizAttemptNestedInput
    payments?: PaymentUpdateManyWithoutQuizAttemptNestedInput
    user?: UserUpdateOneWithoutQuizAttemptsNestedInput
  }

  export type QuizAttemptUncheckedUpdateWithoutReportViewsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutQuizAttemptNestedInput
  }

  export type UserUpsertWithoutReportViewsInput = {
    update: XOR<UserUpdateWithoutReportViewsInput, UserUncheckedUpdateWithoutReportViewsInput>
    create: XOR<UserCreateWithoutReportViewsInput, UserUncheckedCreateWithoutReportViewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReportViewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReportViewsInput, UserUncheckedUpdateWithoutReportViewsInput>
  }

  export type UserUpdateWithoutReportViewsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUpdateManyWithoutAdminUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReportViewsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUncheckedUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUncheckedUpdateManyWithoutAdminUserNestedInput
  }

  export type UserCreateWithoutPasswordResetTokensInput = {
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPasswordResetTokensInput = {
    id?: number
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    isUnsubscribed?: boolean
    sessionId?: string | null
    isPaid?: boolean
    isTemporary?: boolean
    hasUnlockedFirstReport?: boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    quizAttempts?: QuizAttemptUncheckedCreateNestedManyWithoutUserInput
    refundsProcessed?: RefundUncheckedCreateNestedManyWithoutAdminUserInput
    reportViews?: ReportViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPasswordResetTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
  }

  export type UserUpsertWithoutPasswordResetTokensInput = {
    update: XOR<UserUpdateWithoutPasswordResetTokensInput, UserUncheckedUpdateWithoutPasswordResetTokensInput>
    create: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPasswordResetTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPasswordResetTokensInput, UserUncheckedUpdateWithoutPasswordResetTokensInput>
  }

  export type UserUpdateWithoutPasswordResetTokensInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPasswordResetTokensInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    isUnsubscribed?: BoolFieldUpdateOperationsInput | boolean
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    isTemporary?: BoolFieldUpdateOperationsInput | boolean
    hasUnlockedFirstReport?: BoolFieldUpdateOperationsInput | boolean
    tempQuizData?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    quizAttempts?: QuizAttemptUncheckedUpdateManyWithoutUserNestedInput
    refundsProcessed?: RefundUncheckedUpdateManyWithoutAdminUserNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PasswordResetTokenCreateManyUserInput = {
    id?: number
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PaymentCreateManyUserInput = {
    id?: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    quizAttemptId?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
  }

  export type QuizAttemptCreateManyUserInput = {
    id?: number
    sessionId?: string | null
    quizData: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: boolean
    completedAt?: Date | string
  }

  export type RefundCreateManyAdminUserInput = {
    id?: number
    paymentId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type ReportViewCreateManyUserInput = {
    id?: number
    sessionId?: string | null
    quizAttemptId: number
    viewedAt?: Date | string
  }

  export type PasswordResetTokenUpdateWithoutUserInput = {
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutUserInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    quizAttempt?: QuizAttemptUpdateOneWithoutPaymentsNestedInput
    refunds?: RefundUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    quizAttemptId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    refunds?: RefundUncheckedUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    quizAttemptId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type QuizAttemptUpdateWithoutUserInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUpdateManyWithoutQuizAttemptNestedInput
    payments?: PaymentUpdateManyWithoutQuizAttemptNestedInput
    reportViews?: ReportViewUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiContents?: AiContentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutQuizAttemptNestedInput
    reportViews?: ReportViewUncheckedUpdateManyWithoutQuizAttemptNestedInput
  }

  export type QuizAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizData?: JsonNullValueInput | InputJsonValue
    aiContent?: NullableJsonNullValueInput | InputJsonValue
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefundUpdateWithoutAdminUserInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    payment?: PaymentUpdateOneRequiredWithoutRefundsNestedInput
  }

  export type RefundUncheckedUpdateWithoutAdminUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    paymentId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefundUncheckedUpdateManyWithoutAdminUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    paymentId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReportViewUpdateWithoutUserInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizAttempt?: QuizAttemptUpdateOneRequiredWithoutReportViewsNestedInput
  }

  export type ReportViewUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizAttemptId?: IntFieldUpdateOperationsInput | number
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportViewUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    quizAttemptId?: IntFieldUpdateOperationsInput | number
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiContentCreateManyQuizAttemptInput = {
    id?: number
    contentType: string
    content: JsonNullValueInput | InputJsonValue
    contentHash?: string | null
    generatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PaymentCreateManyQuizAttemptInput = {
    id?: number
    userId: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    type: string
    stripePaymentIntentId?: string | null
    paypalOrderId?: string | null
    status?: string
    createdAt?: Date | string
    completedAt?: Date | string | null
    version?: number
  }

  export type ReportViewCreateManyQuizAttemptInput = {
    id?: number
    userId?: number | null
    sessionId?: string | null
    viewedAt?: Date | string
  }

  export type AiContentUpdateWithoutQuizAttemptInput = {
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiContentUncheckedUpdateWithoutQuizAttemptInput = {
    id?: IntFieldUpdateOperationsInput | number
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiContentUncheckedUpdateManyWithoutQuizAttemptInput = {
    id?: IntFieldUpdateOperationsInput | number
    contentType?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutQuizAttemptInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneRequiredWithoutPaymentsNestedInput
    refunds?: RefundUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateWithoutQuizAttemptInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    refunds?: RefundUncheckedUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateManyWithoutQuizAttemptInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    stripePaymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ReportViewUpdateWithoutQuizAttemptInput = {
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutReportViewsNestedInput
  }

  export type ReportViewUncheckedUpdateWithoutQuizAttemptInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportViewUncheckedUpdateManyWithoutQuizAttemptInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefundCreateManyPaymentInput = {
    id?: number
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    reason: string
    status?: string
    stripeRefundId?: string | null
    paypalRefundId?: string | null
    adminUserId?: number | null
    adminNote?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type RefundUpdateWithoutPaymentInput = {
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adminUser?: UserUpdateOneWithoutRefundsProcessedNestedInput
  }

  export type RefundUncheckedUpdateWithoutPaymentInput = {
    id?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminUserId?: NullableIntFieldUpdateOperationsInput | number | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefundUncheckedUpdateManyWithoutPaymentInput = {
    id?: IntFieldUpdateOperationsInput | number
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stripeRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    paypalRefundId?: NullableStringFieldUpdateOperationsInput | string | null
    adminUserId?: NullableIntFieldUpdateOperationsInput | number | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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