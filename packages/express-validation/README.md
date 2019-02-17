# @ekino/express-validation

[![version](https://img.shields.io/npm/v/@ekino/express-validation.svg?style=flat-square)](https://www.npmjs.com/package/@ekino/express-validation)

This package helps validating/normalizing incoming express API requests
using [Joi](https://github.com/hapijs/joi) schemas in the form of express middlewares.

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

> Please be aware that the provided middlewares mutate the request data.

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
import { withBodyValidation } from '@ekino/express-validation'

app.post('/post', withBodyValidation(), (req, res) => {})
```

### Validating request path

```typescript
import * as Joi from 'joi'
import { withPathValidation } from '@ekino/express-validation'

const schema = Joi.object().keys({
    id: Joi.number().required()
})

app.get('/post/:id', withPathValidation(schema), (req, res) => {
    // now you're sure that `id` is a number,
    // it also have been casted to a number
    const { id } = req.params
})
```

### Validating request query

```typescript
import * as Joi from 'joi'
import { withQueryValidation } from '@ekino/express-validation'

const schema = Joi.object().keys({
    sort: Joi.string().required()
})

app.get('/posts', withQueryValidation(schema), (req, res) => {
    // assuming you made a request such as `GET /posts?sort=title`
    // now you're sure that `sort` exists
    const { sort } = req.query
})
```

### Validating request headers

```typescript
import * as Joi from 'joi'
import { withHeadersValidation } from '@ekino/express-validation'

app.get('/posts', withHeadersValidation(), (req, res) => {})
```

## Configuration

You can completely customize the behaviour of the middlewares,
this module can act as a simple bridge between Joi & express.

The available options are:

-   errorStatusCode
-   joiOptions
-   errorOverride
-   logger

Let's now see which use cases can be covered using those options.

### Customizing errorStatusCode

By default, all the middlewares issue a `400` HTTP status code,
this option allows you to use another one.

```typescript
app.get('/post/:id', withPathValidation(schema, { errorStatusCode: 404 }), (req, res) => {
    // ...
})
```

Now, if the provided `:id` doesn't conform to `schema`, the client will receive a `404` HTTP status code.

### Customizing Joi options

### Customizing the response error

### Adding logging support
