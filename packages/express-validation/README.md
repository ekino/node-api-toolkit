# @ekino/express-validation

This package helps validating/normalizing incoming express API requests
using Joi schemas in the form of express middlewares.

It's written in TypeScript, so there's no need to install external types
if you're working on a TypeScript based project.
However TypeScript is not required as the published package contains
a compiled version.

It supports several _sources_:

* [body](#validating-request-body)
* [path](#validating-request-path)
* [query](#validating-request-query)
* [headers](#validating-request-headers)

You can easily adapt it to your needs using the [configuration object](#configuration).

> Please be aware that the provided middlewares mutate the request data.

## Installation

```sh
yarn add @ekino/express-validation
```

## Usage

### Validating request body

```js
const { withBodyValidation } = require('@ekino/express-validation')

app.post('/post', withBodyValidation(), (req, res) => {

})
```

### Validating request path

```js
const { withPathValidation } = require('@ekino/express-validation')

app.get('/post/:id', withPathValidation(), (req, res) => {

})
```

### Validating request query

```js
const { withQueryValidation } = require('@ekino/express-validation')

app.get('/posts', withQueryValidation(), (req, res) => {

})
```

### Validating request headers

```js
const { withHeadersValidation } = require('@ekino/express-validation')

app.get('/posts', withHeadersValidation(), (req, res) => {

})
```

## Configuration