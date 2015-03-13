import page from 'page';
import pagesConfig from 'common/pagesConfig';
import {Component, Template, bootstrap} from 'angular2/angular2';

@Component({
    selector:"app"
})
@Template({
    inline: '<br>Current page: {{currentPage.context.path}} ({{currentPage.definition.path}})<br><a href="/">Home</a>'
})
class MainClass {
    currentPage = {};
    constructor() {
        pagesConfig.forEach((curPage) => {
            page(curPage.path, (ctx) => {
                this.currentPage.definition = curPage;
                this.currentPage.context = ctx;
            });
        });
        page();
    }
}

import {ShadowDomStrategy, EmulatedUnscopedShadowDomStrategy} from "angular2/src/core/compiler/shadow_dom_strategy";
import {StyleUrlResolver} from "angular2/src/core/compiler/style_url_resolver";
import {bind} from "angular2/di";
bootstrap(MainClass, [bind(ShadowDomStrategy).toFactory((styleUrlResolver) => {
    return new EmulatedUnscopedShadowDomStrategy(styleUrlResolver,document.head);
},[StyleUrlResolver])]);
