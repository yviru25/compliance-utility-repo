import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: []
})
export class DashboardComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  ecompaignModule() {
     this.route.navigate(['dashboard/ecompaign']);
  }

  importJsonFile(moduleCode) {
    this.route.navigate(['dashboard/fileimport']);
  }

}
