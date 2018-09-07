import { Component } from '@angular/core';
import { Repository } from '../models/repository';
@Component({
    selector: 'app-user',
    templateUrl: 'user.component.html'
    })
    export class UserComponent {
        constructor(private repo: Repository) {}

        get loggedInUser(): string {
            if (this.repo.logedinUser) {
                return this.repo.logedinUser;
            } else {
                return null;
            }
        }
    }
