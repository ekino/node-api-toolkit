import { Request } from 'express'
import { sort } from '../src/sort'
import mockResponse from './mock_express_response'

type RequestWithState = Request & { state?: any }

test('should throw if no field provided', () => {
    expect(() => {
        sort([])
    }).toThrow(
        'You should define at least one field in order to use the collection.sort middleware'
    )
})

test('should throw if provided fields argument is not an array', () => {
    expect(() => {
        // @ts-ignore
        sort('createdAt')
    }).toThrow(
        'You should define at least one field in order to use the collection.sort middleware'
    )
})

test('should append a rest.sort object to the request which is an empty object by default', () => {
    const req = { query: {} } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['name'])(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['name', 'asc']])
    expect(next).toHaveBeenCalled()
})

test('should have default behaviour if query parameter is empty', () => {
    const req = { query: { sort: '' } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['name'])(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['name', 'asc']])
    expect(next).toHaveBeenCalled()
})

test('should append a sort object to request state composed of parsed directives', () => {
    const req = { query: { sort: 'firstName' } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['firstName'])(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['firstName', 'asc']])
    expect(next).toHaveBeenCalled()
})

test('should support multiple directives', () => {
    const req = { query: { sort: 'firstName,lastName' } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['firstName', 'lastName'])(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['firstName', 'asc'], ['lastName', 'asc']])
    expect(next).toHaveBeenCalled()
})

test('should support descending sorting', () => {
    const req = { query: { sort: 'firstName,-lastName' } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['firstName', 'lastName'])(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['firstName', 'asc'], ['lastName', 'desc']])
    expect(next).toHaveBeenCalled()
})

test('should issue a 400 response if a field is not allowed', () => {
    const req = {
        query: { sort: 'firstName' },
        state: { contextId: '1' }
    } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['createdAt'])(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: VALIDATION_ERROR,
        message: `Invalid sort field: 'firstName', must be one of: 'createdAt'`,
        errors: [],
    })
    */
    expect(next).not.toHaveBeenCalled()
})

test('should allow to specify query parameter name', () => {
    const req = { query: { custom: 'firstName,-lastName' } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['firstName', 'lastName'], { key: 'custom' })(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['firstName', 'asc'], ['lastName', 'desc']])
    expect(next).toHaveBeenCalled()
})

test('should allow to specify custom separator', () => {
    const req = { query: { sort: 'firstName:lastName' } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    sort(['firstName', 'lastName'], { separator: ':' })(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('sort', [['firstName', 'asc'], ['lastName', 'asc']])
    expect(next).toHaveBeenCalled()
})
