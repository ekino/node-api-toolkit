# @ekino/express-validation

[![version](https://img.shields.io/npm/v/@ekino/express-validation.svg?style=flat-square)](https://www.npmjs.com/package/@ekino/express-validation)

This package helps validating/normalizing incoming express API requests
using [Joi](https://github.com/hapijs/joi) schemas in the form of express middlewares.

It's written in TypeScript, so there's no need to install external types
if you're working on a TypeScript based project.
However TypeScript is not required as the published package contains
a compiled version.

It supports several _sources_:

* [request body](#validating-request-body)
* [request path](#validating-request-path)
* [request query](#validating-request-query)
* [request headers](#validating-request-headers)

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

javascript:

```js
const { withBodyValidation } = require('@ekino/express-validation')

app.post('/post', withBodyValidation(), (req, res) => {

})
```

TypeScript:

```typescript
import { withBodyValidation } from '@ekino/express-validation'

app.post('/post', withBodyValidation(), (req, res) => {

})
```

### Validating request path

javascript:

```js
const { withPathValidation } = require('@ekino/express-validation')

app.get('/post/:id', withPathValidation(), (req, res) => {

})
```

TypeScript:

```typescript
import { withPathValidation } from '@ekino/express-validation'

app.get('/post/:id', withPathValidation(), (req, res) => {

})
```

### Validating request query

javascript:

```js
const { withQueryValidation } = require('@ekino/express-validation')

app.get('/posts', withQueryValidation(), (req, res) => {

})
```

TypeScript:

```typescript
import { withQueryValidation } from '@ekino/express-validation'

app.get('/posts', withQueryValidation(), (req, res) => {

})
```

### Validating request headers

javascript:

```js
const { withHeadersValidation } = require('@ekino/express-validation')

app.get('/posts', withHeadersValidation(), (req, res) => {

})
```

TypeScript:

```typescript
import { withHeadersValidation } from '@ekino/express-validation'

app.get('/posts', withHeadersValidation(), (req, res) => {

})
```

## Configuration