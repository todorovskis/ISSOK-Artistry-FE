import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'services/user-service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthenticationGuard implements CanActivate{
  constructor(private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return new Promise<boolean | UrlTree>(
      (resolve, reject) => {
        this.authService.isUserLoggedIn().subscribe(
          val => {
            if(val){
              resolve(true);
            }else{
              resolve(false)
            }
          },
          error => {
            console.error(error)
            reject(error)
          }
        )
      }
    )
  }
}