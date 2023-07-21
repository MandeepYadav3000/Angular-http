import {Injectable} from "@angular/core";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {Post} from "./post.model";
import {Subject, tap, throwError,} from "rxjs";
import {catchError, map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, contents: string) {
    const postData: Post = {title: title, content: contents};
    this.http.post<{ name: string }>('https://starting-angular-83ac7-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json '
      , postData
      ,{
      observe: 'response'
      })
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error);
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print','pretty');
    searchParams = searchParams.append('custom','key');
    return this.http.get<{ [key: string]: Post }>('https://starting-angular-83ac7-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello'}),
        params: searchParams
      })
      .pipe(map((response) => {
        const postsArray: Post[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key))
            postsArray.push({...response[key], id: key});
        }
        return postsArray;
      }),
    catchError(errorResponse => {
      return throwError(errorResponse);
    })
  )
    ;
  }

  deletePosts() {
    return this.http.delete('https://starting-angular-83ac7-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json'
    , {
      observe: 'events',
        responseType: 'json'
      })
      .pipe(tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Response)
          console.log(event.body);
      }));
  }
}
