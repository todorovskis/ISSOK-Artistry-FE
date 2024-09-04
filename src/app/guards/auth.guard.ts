// import { Injectable, inject } from "@angular/core";
// import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
// import { Observable } from "rxjs";
// import { AuthService } from "services/user-service";

// @Injectable({
//   providedIn: 'root',
// })
// class AdminGuard {
//   constructor(private authenticationService: AuthService, private router: Router) {
//   }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | UrlTree {
//     const requiredRoles: string[] = route.data['requiredRoles'];

//     const userRoles = this.authenticationService.getRoles() || [];

//     const hasRequiredRoles = requiredRoles.some((role) => userRoles.includes(role));

//     if (!hasRequiredRoles) {
//       const errorMessage = "Unauthorized Access! You need role admin to proceed."
//       return this.router.parseUrl(`/login?errorMessage=${errorMessage}`);
//     }

//     return true;
//   }
// }

// export const IsAdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
//   return inject(AdminGuard).canActivate(route, state);
// }