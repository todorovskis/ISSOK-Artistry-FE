import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/user';
import { AuthService } from 'services/user-service';

@Component({
  selector: 'user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {

  user: User | undefined

  constructor(private service: AuthService,private http:HttpClient) {

  }

  ngOnInit(): void {

  }

  // getUserByUsername(username: string) {
  //   this.service.getUserByUsername(username)
  //     .subscribe(user => this.user = user)
  // }


fileChange(event:any) {
  const fileList: FileList = event.target.files;

  if (fileList.length < 1) {
    return;
  }
  
  const file: File = fileList[0];
  const formData: FormData = new FormData();
  formData.append('portfolioFile', file, file.name)
  
  const headers = new HttpHeaders();
  // Don't include Content-Type header, it's automatically set by FormData
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'multipart/form-data');
  this.http.post(`http://localhost:8080/api/users`, formData, { headers: headers })
    .subscribe(
      data => console.log('success'),
      error => console.log(error)
    );
}

  
}
