import ReactDOMServer from 'react-dom/server';
import { RoutingContext } from 'react-router';
import pkg from '../../package.json';

let safeStringify = function(data) {
    return JSON.stringify(data).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
};

export default function(renderProps, clientData) {
    let dataScript = {
        __html: 'startApp(' + safeStringify(clientData || {}) + ');'
    };
    let rootNode = {
        __html: ReactDOMServer.renderToString(<RoutingContext {...renderProps}/>)
    };
    let html = <html>
               <head>
                   <title>
                       { pkg.name }
                   </title>
                   <meta name="viewport" content="width=device-width, initial-scale=1" />
                   <link rel="stylesheet" type="text/css" href="/statics/bootstrap/css/bootstrap.min.css" />
                   <link rel="stylesheet" type="text/css" href="/statics/bootstrap/css/bootstrap-theme.min.css" />
               </head>
               <body>
                   <div id="root" dangerouslySetInnerHTML={ rootNode }></div>
                   <script src="/statics/app.min.js" />
                   <script dangerouslySetInnerHTML={ dataScript } />
               </body>
               </html>;
    return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(html);
}
