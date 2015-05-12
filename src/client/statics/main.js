import page from 'page';
import pagesConfig from 'common/pagesConfig';
import {ComponentAnnotation as Component, ViewAnnotation as View, bootstrap} from "angular2/angular2"

@Component({
    selector:"app"
})
@View({
    template: '<br>Current page: {{currentPage.context.path}} ({{currentPage.definition.path}})<br><a href="/">Home</a>'
})
class Main {
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

bootstrap(Main);
