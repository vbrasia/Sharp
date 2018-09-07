import { NgModule } from '@angular/core';
import { Repository } from './repository';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
@NgModule({
    imports: [LocalStorageModule],
    providers: [Repository]
})
export class ModelModule {}
