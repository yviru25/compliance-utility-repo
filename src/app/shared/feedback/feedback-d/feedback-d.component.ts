import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-d',
  templateUrl: './feedback-d.component.html',
  styleUrls: ['./feedback-d.component.scss']
})
export class FeedbackDComponent implements OnInit {

  @Input() nestedData: any;
  @Input() selectedDataList: any;
  duplicateDataList = [];
  checkedDuplicateList = [];
  constructor() { }

  ngOnInit() {
    console.log(this.nestedData);
    console.log(this.selectedDataList);
     /* console.log(this.l1header);
     console.log(this.selectedDataList);
     this.activeTrans.forEach(el => {
         if (this.selectedDataList[0].tsn_id !== el.tsn_id) {
              this.duplicateDataList.push(el);
         }
     }); */
    // console.log(this.activeTrans);
  }

  isChecked(event, checkedData) {
    if (event.checked) {
      this.checkedDuplicateList.push(checkedData);
    } else {
       for (let i = 0; i < this.checkedDuplicateList.length; i++) {
             if (this.checkedDuplicateList[i].tsn_id === checkedData.tsn_id) {
               this.checkedDuplicateList.splice(i, 1);
        }
       }
    }
    console.log(this.checkedDuplicateList);
  }

}
