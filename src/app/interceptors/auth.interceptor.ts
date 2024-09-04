import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from 'services/user-service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("called authInterceptor")
  const token = localStorage.getItem("jwt")
  if(token){
    req = req.clone({
      setHeaders: {'Authorization': `Bearer ${token}`}
    })
  }
  return next(req)
};