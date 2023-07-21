import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Subscription} from "rxjs";
import {Post} from "./post.model";
import {PostsService} from "./posts.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  loadedPosts: Post[] = [];
  isFetching = false;

  error = null;

  private errorSub: Subscription;

  constructor(private http: HttpClient,
              private postService: PostsService) {}

  ngOnInit() {

    this.errorSub = this.postService.error.subscribe(error => {

    })
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(posts => {
        this.isFetching=false;
        this.loadedPosts = posts;
      },
        error => {
          this.isFetching=false;
          this.error = error;
        });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title,postData.content);

  }

  onFetchPosts() {
    // Send Http request
    this.isFetching =true;
    this.postService.fetchPosts()
      .subscribe(posts => {
        this.isFetching=false;
        this.loadedPosts = posts;
      } ,
        error => {
          this.isFetching=false;
          this.error = error;
        });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  onHandleError() {
    this.error = null;
  }
  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}
