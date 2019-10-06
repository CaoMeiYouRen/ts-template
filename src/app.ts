import bodyParser = require('body-parser')
import express = require('express')
import path = require('path')
import { registerApiModel, SwaggerInfoProperty, swaggerJSDoc, SwaggerOptions } from 'swagger-ts-doc'
import swaggerUi = require('swagger-ui-express')
import compression = require('compression')
import { router } from './routes'
import { rootUrl } from './config'
import './db'
export class Server {
    /**
     * expressd的app对象
     *
     * @type {express.Application}
     * @memberof Server
     */
    public readonly app: express.Application
    constructor() {
        this.app = express()
        this.config()
    }
    /**
     *配置
     *
     * @author CaoMeiYouRen
     * @date 2019-08-20
     * @private
     * @memberof Server
     */
    private config(): void {
        this.app.use(compression())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.initSwagger()
        this.routes()
    }
    /**
     * 路由
     *
     * @author CaoMeiYouRen
     * @date 2019-08-20
     * @private
     * @memberof Server
     */
    private routes(): void {
        this.app.use('/', router)
    }
    /**
     *初始化Swagger
     *
     * @author CaoMeiYouRen
     * @date 2019-08-20
     * @private
     * @memberof Server
     */
    private initSwagger(): void {
        const options = new SwaggerOptions()
        options.info = new SwaggerInfoProperty()
        options.info.version = '1.0.0'
        options.info.title = '草梅TS模板'

        const jsDoc = swaggerJSDoc(options)
        const swaggerUiOptions = {
            swaggerUrl: `${rootUrl}/docs.json`,
        }

        if (process.env.NODE_ENV === 'dev') {
            this.app.get(`${rootUrl}/docs.json`, (req, res) => {
                res.json(JSON.parse(jsDoc))
            })
            this.app.use(`${rootUrl}/docs`, swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions))
        }

    }
}