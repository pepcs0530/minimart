import {Component} from '@angular/core';
import {BreadcrumbService} from '../../_services/breadcrumb.service';

@Component({
    templateUrl: './emptydemo.component.html'
})
export class EmptyDemoComponent {

    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            {label: 'Empty Page'},
        ]);
    }

}
