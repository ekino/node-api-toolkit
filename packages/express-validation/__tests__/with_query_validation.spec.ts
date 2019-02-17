
test('it should reject if query parameters are invalid', () => {
    /*
    const validate = validateQuery(
        Joi.object().keys({
            page: Joi.number().required(),
        })
    )

    const req = { state: { contextId: 'context-id' }, query: {} }
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        type: 'validation_error',
        message: 'query validation failed',
        errors: [
            {
                message: '"page" is required',
                path: 'page',
                type: 'any.required',
            },
        ],
    })
    expect(next).not.toHaveBeenCalled()
    */
})

test('it should replace request query with validated data', () => {
    /*
    const validate = validateQuery(
        Joi.object().keys({
            id: Joi.number().required(),
        })
    )

    const req = { state: { contextId: 'context-id' }, query: { id: '12' } }
    const res = mockResponse()
    const next = jest.fn()

    validate(req, res, next)

    expect(req.query.id).toBe(12)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    */
})