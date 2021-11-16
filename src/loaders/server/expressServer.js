const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const multer = require('multer');

const config = require('../../config');
const logger = require('../logger');
const storageMulter = require('../../helpers/multerImage');

class ExpressServer {

    constructor() {
        this.app = express();
        this.port = config.port;
        this.basePath = `${config.api.prefix}`

        this._settings();

        this._middlewares();

        this._routes();

        this._notFound();
        this._errorHandler();

    }

    // view engine setup
    _settings() {
        this.app.set('views', path.join(__dirname, '../../views'));
        this.app.set('view engine', 'ejs');
    }

    _middlewares() {
        this.app.use(express.json());
        this.app.use(morgan('tiny'));
        this.app.use(urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, '../../public')));
        this.app.use(methodOverride('_method'));
        this.app.use(multer({ storage: storageMulter }).single('image'));
    }

    _routes() {

        this.app.head('/status', (req, res) => {
            res.status(200).end();
        });

        this.app.use(require('../../routes/index'));
        this.app.use('/admin', require('../../routes/admin'));
    }

    _notFound() {
        this.app.use((req, res, next) => {
            const err = new Error('Not found');
            err.code = 404;
            next(err);
        });
    }

    _errorHandler() {
        this.app.use((err, req, res, next) => {
            const code = err.code || 500;

            logger.error(`${code} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            logger.error(err.stack);

            const body = {
                error: {
                    code,
                    msg: err.message
                }
            }
            res.json(body);
        });
    }

    _swaggerConfig() {
        this.app.use(
            config.swagger.path, 
            swaggerUi.serve, 
            swaggerUi.setup(require('../swagger/swagger.json')));
    }

    async start() {
        this.app.listen(this.port, (error) => {
            if(error) {
                logger.error(error);
                process.exit(1);
                return;
            }
        });
    }


}

module.exports = ExpressServer;