import {Component, OnInit} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Repository } from '../models/repository';
@Component({
templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent implements OnInit {
    constructor(public authService: AuthenticationService, private repo: Repository) {
        if (!repo.reLogin) {
            this.authService.getLogedIn().subscribe(response => {
                if (response) {
                    this.authService.logedIn = response;
                    this.authService.name = this.authService.logedIn.logedinUser;
                    this.authService.password = this.authService.logedIn.logedinPassword;
                    this.authService.getAuthorizations().subscribe(authorizations => {
                        if (authorizations) {
                            this.repo.authorizations = authorizations;
                        }
                        this.authService.getUserRole().subscribe(role => {
                            if (role) {
                                this.repo.userRole = role;
                            }
                            this.authService.getStore().subscribe(result => {
                                if (result) {
                                    this.repo.selecttedStore = result;
                                    this.repo.setStoreDto();
                                }
                                this.authService.loggedIn();
                            });
                        });
                    });
                }
            });
        }
    }
    showError = false;
    ngOnInit() {}
    login() {
        this.showError = false;
        this.authService.login().subscribe(result => {this.showError = !result; });
    }
}
