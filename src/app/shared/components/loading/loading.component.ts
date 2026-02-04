import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [
        MatProgressSpinnerModule
    ],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss',
})
export class LoadingComponent {
    private readonly loadingService = inject(LoadingService);

    readonly isLoading: Signal<boolean>;

    constructor() {
        this.isLoading = toSignal(this.loadingService.isLoading$, {
            initialValue: false
        });
    }
}