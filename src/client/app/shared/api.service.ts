import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, Response } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../environments/environment';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
// import { _throw } from 'rxjs/observable/throw';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: Http, private auth: AuthService) { }

  get(url: string) {
    return this.request(url, RequestMethod.Get);
  }

  post(url: string, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }

  put(url: string, body: Object) {
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url: string) {
    return this.request(url, RequestMethod.Delete);
  }

  request(url: string, method: RequestMethod, body?: Object) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.auth.getToken()}`);

    const requestOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);

    return this.http.request(request)
      .pipe(map((res: Response) => res.json()))
      .catch((res: Response) => this.onRequestError(res));
  }
  onRequestError(res: Response){
    const statusCode = res.status;
    const body = res.json();

    const error = {
      statusCode: statusCode,
      error: body.error
    };


    return throwError(error);
  }

}
// couponCode: "20PERCENTOFF"
// couponID: "5bef674d381a3a75eec794b3"
// data: {_id: "5bef674d381a3a75eec794b3", couponValue: "20PERCENTOFF", discountType: "percent", discountValue: "20", vendorUsername: "newAdmin"}
// discountType: "percent"
// discountValue: "20"
// message: "Success Coupon found!"
// vendorUsername: "newAdmin"
