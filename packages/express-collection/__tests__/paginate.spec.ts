import { Request } from 'express'
import { paginate } from '../src/paginate'
import mockResponse from './mock_express_response'

type RequestWithState = Request & { state?: any }

test('should append a rest.pagination parameters to the request by default', () => {
    const req = { query: {} } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate()(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('pagination', {
        page: 1,
        perPage: 10,
        offset: 0
    })
    expect(next).toHaveBeenCalled()
})

test('should compute limit and offset according to page and perPage query parameters', () => {
    const req = { query: { page: 2, perPage: 5 } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate()(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('pagination', {
        page: 2,
        perPage: 5,
        offset: 5
    })
    expect(next).toHaveBeenCalled()
})

test('should allow to customize page query parameter', () => {
    const req = { query: { p: 1 } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate({ pageKey: 'p' })(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('pagination', {
        page: 1,
        perPage: 10,
        offset: 0
    })
    expect(next).toHaveBeenCalled()
})

test('should allow to customize perPage query parameter', () => {
    const req = { query: { size: 3 } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate({ perPageKey: 'size' })(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('pagination', {
        page: 1,
        perPage: 3,
        offset: 0
    })
    expect(next).toHaveBeenCalled()
})

test('should issue a 400 response if page parameter is not a number', () => {
    const req = {
        query: { page: 'invalid' }
        // state: { contextId: '1' },
    } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate()(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: VALIDATION_ERROR,
        message: `Pagination validation failed`,
        errors: [
            {
                message: `"page" must be a number`,
                path: 'page',
                type: 'number.base',
            },
        ],
    })
    */
    expect(next).not.toHaveBeenCalled()
})

test('should issue a 400 response if perPage parameter is not a number', () => {
    const req = {
        query: { perPage: 'invalid' }
        // state: { contextId: '1' },
    } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate()(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: VALIDATION_ERROR,
        message: `Pagination validation failed`,
        errors: [
            {
                message: `"perPage" must be a number`,
                path: 'perPage',
                type: 'number.base',
            },
        ],
    })
    */
    expect(next).not.toHaveBeenCalled()
})

test('should issue a 400 response if perPage parameter exceed allowed limit', () => {
    const req = {
        query: { perPage: 11000 }
        // state: { contextId: '1' },
    } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate()(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: VALIDATION_ERROR,
        message: `Pagination validation failed`,
        errors: [
            {
                message: `"perPage" must be less than or equal to 10000`,
                path: 'perPage',
                type: 'number.max',
            },
        ],
    })
    */
    expect(next).not.toHaveBeenCalled()
})

test('should issue a 400 response if perPage parameter is below minimum', () => {
    const req = {
        query: { perPage: 0 }
        // state: { contextId: '1' },
    } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate()(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    /*
    expect(res.json).toHaveBeenCalledWith({
        type: VALIDATION_ERROR,
        message: `Pagination validation failed`,
        errors: [
            {
                message: `"perPage" must be larger than or equal to 1`,
                path: 'perPage',
                type: 'number.min',
            },
        ],
    })
    */
    expect(next).not.toHaveBeenCalled()
})

test('should allow to customize perPage max limit', () => {
    const req = { query: { perPage: 1000000 } } as RequestWithState
    const res = mockResponse()
    const next = jest.fn()

    paginate({ perPageMax: 1000000 })(req, res, next)

    expect(req).toHaveProperty('state')
    expect(req.state).toHaveProperty('pagination', {
        page: 1,
        perPage: 1000000,
        offset: 0
    })
    expect(next).toHaveBeenCalled()
})
