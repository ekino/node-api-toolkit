# @ekino/express-validation

[![version](https://img.shields.io/npm/v/@ekino/express-validation.svg?style=flat-square)](https://www.npmjs.com/package/@ekino/express-validation)

:warning: Work in progress :warning:

This package helps validating/normalizing incoming express API requests
using [Joi](https://github.com/hapijs/joi) schemas in the form of express middlewares.
When you add one of the provided middelwares to your app, it will try to validate
the given source (body, path, query, headers) against a Joi schema,
replace the source data with the validated data if validation passes
or send back the validation errors along with a `400` HTTP status code otherwise.

> Please be aware that the provided middlewares mutate the request's source data.

It can be used for several purposes, for example:

-   validating payload when attempting to write to your API
-   validating pagination/filters/sorting when retrieving a list of items
-   validating path parameters such as ids
-   validating tokens present in request headers (not the fact that they actually exists)

It's written in TypeScript, so there's no need to install external types
if you're working on a TypeScript based project.
However TypeScript is not required as the published package contains
a compiled version.

It supports several _sources_:

-   [request body](#validating-request-body)
-   [request path](#validating-request-path)
-   [request query](#validating-request-query)
-   [request headers](#validating-request-headers)

You can easily adapt it to your needs using the [configuration object](#configuration).

## Installation

You also have to install [Joi](https://github.com/hapijs/joi) as it's a peer dependency
of this package.

```sh
yarn add joi @ekino/express-validation
```

## Usage

### Validating request body

```typescript
import * as Joi from 'joi'
import { validateRequestBody } from '@ekino/express-validation'

app.post('/post', validateRequestBody(schema), (req, res) => {})
```

### Validating request path

```typescript
import * as Joi from 'joi'
import { validateRequestPath } from '@ekino/express-validation'

const schema = Joi.object().keys({
    id: Joi.number().required()
})

app.get('/post/:id', validateRequestPath(schema), (req, res) => {
    // now you're sure that `id` is a number,
    // it also have been casted to a number
    const { id } = req.params
})
```

### Validating request query

```typescript
import * as Joi from 'joi'
import { validateRequestQuery } from '@ekino/express-validation'

const schema = Joi.object().keys({
    sort: Joi.string().required()
})

app.get('/posts', validateRequestQuery(schema), (req, res) => {
    // assuming you made a request such as `GET /posts?sort=title`
    // now you're sure that `sort` exists
    const { sort } = req.query
})
```

### Validating request headers

```typescript
import * as Joi from 'joi'
import { validateRequestHeaders } from '@ekino/express-validation'

app.get('/posts', validateRequestHeaders(), (req, res) => {})
```

## Configuration

You can completely customize the behaviour of the middlewares,
this module can act as a simple bridge between Joi & express.

The available options are:

-   joiOptions
-   logger
-   errorStatusCode
-   errorBody
-   errorHandler

Let's now see which use cases can be covered using those options.

### Customizing Joi options

### Adding logging support

### Customizing error response status code

By default, all the middlewares issue a `400` HTTP status code,
the `errorStatusCode` option allows you to use another one.

```typescript
app.get('/post/:id', validateRequestPath(schema, { errorStatusCode: 404 }), (req, res) => {
    // ...
})
```

Now, if the provided `:id` doesn't conform to `schema`, the client will receive a `404` HTTP status code.

You can also use a function to determine response status code, which can be useful
if you have to add some extra logic to define it.

```typescript
app.get(
    '/post/:id',
    validateRequestPath(schema, {
        errorStatusCode: (req: Request, error: ValidationError) => 401
    }),
    (req, res) => {
        /* ... */
    }
)
```

### Customizing error response body

### Using your own error handler
