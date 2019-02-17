import { Request, Response, RequestHandler, NextFunction } from 'express'
import { Logger } from '@ekino/logger'
import * as onFinished from 'on-finished'
import * as uuid from 'uuid'

export interface RequestLogInfo {
    method: string
    url: string
    originalUrl: string
    query: { [name: string]: string | string[] }
    responseCode: number
    responseTime: number
}

export default (
    logger: Logger,
    {
        extractInfo = () => ({})
    }: {
        extractInfo?: (req: Request, res: Response) => object
    } = {}
): RequestHandler => (
    // req: Request & { state: any; user?: User },
    req: Request & { state: any },
    res: Response,
    next: NextFunction
) => {
    req.state = req.state || {}
    req.state.requestTime = Date.now()

    const logRequest = () => {
        const responseTime: number = req.state.requestTime ? Date.now() - req.state.requestTime : 0

        const requestInfo: RequestLogInfo & object = {
            method: req.method,
            url: req.url,
            originalUrl: req.originalUrl,
            query: req.query,
            responseCode: res.statusCode,
            responseTime,
            ...extractInfo(req, res)
        }

        logger.info(
            req.state.context ? req.state.context.id : uuid.v4(),
            `HTTP ${req.method} ${req.originalUrl || req.url}`,
            requestInfo
        )
    }

    onFinished(res, logRequest)

    next()
}
