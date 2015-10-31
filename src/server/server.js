import path from 'path';
import koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import { match } from 'react-router';
import routes from '../client/routes';
import html from './html';
import clientDataStore from '../client/dataStore';

export default class Server {
    constructor(database) {
        this.database = database;

        let app = this.app = koa();
        let router = this.router = new Router();
        router.get('/statics/*', serve(path.join(__dirname, '..', 'public')));
        router.get('/*', function* (next) {
            if (this.method === 'GET') {
                yield new Promise((resolve) => {
                    match({
                        routes,
                        location: this.url
                    }, (error, redirectLocation, renderProps) => {
                        if (error) {
                            this.status = 500;
                            this.body = error.message;
                        } else if (redirectLocation) {
                            this.status = 302;
                            this.redirect(302, redirectLocation.pathname + redirectLocation.search);
                        } else if (renderProps) {
                            try {
                                clientDataStore.data = this.clientData || {};
                                this.body = html(renderProps, this.clientData);
                            } finally {
                                clientDataStore.data = null;
                            }
                        }
                        resolve();
                    });
                });
                if (this.status !== 404) {
                    return;
                }
            }
            yield next;
        });
        app.use(router.routes());
    }

    attachTo(httpServer) {
        httpServer.on('request', this.app.callback());
    }
}
