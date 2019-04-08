import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MenuService implements OnInit {

    private suffix = 'MENU';
    constructor(private http: HttpClient) { }
    ngOnInit(): void {

    }

    getMenu(username: string): any {
        localStorage.getItem(username + '-' + this.suffix);
    }


}
