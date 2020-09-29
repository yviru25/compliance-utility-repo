import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { group } from 'console';
@Component({
  selector: 'app-feedback-b',
  templateUrl: './feedback-b.component.html',
  styleUrls: ['./feedback-b.component.scss']
})
export class FeedbackBComponent implements OnInit {
  form: FormGroup;
  fieldName: any;
  fieldValue: any;
  @Input() metaInfo: any;
  @Input() selectedDataList: any;
  date: any;
  constructor() {
   }

  ngOnInit() {
    console.log(this.metaInfo);
     // tslint:disable-next-line:no-shadowed-variable
     const group = {};
     for (let mi = 0; mi < this.metaInfo.length; mi++) {
         for (let sld = 0; sld < this.selectedDataList.length; sld++) {
           // console.log(this.metaInfo[mi].label_id + ' :- ' + this.selectedDataList[sld][this.metaInfo[mi].label_id]);
            group[this.metaInfo[mi].field] = new FormControl(this.selectedDataList[sld][this.metaInfo[mi].field]);
         }
     }
     console.log(group);
     this.form = new FormGroup(group);
     /* console.log(this.selectedDataList[0].date_of_payment);
     this.date = new Date(this.selectedDataList[0].date_of_payment);
     console.log(this.date); */
  }

  submitData() {
    const jsonToBeUsed = [];
    const json = this.form.value;
    const firstKey = Object.keys(json)[0];
    const firstValue = Object.values(json)[0];
    console.log(firstKey + ' : ' + firstValue);
    const feedbackJson = {
        smmry_id: 1.0,
        firstKey: firstValue,
        feedback_lvl: 'L1',
        feedback: {
          optn_chosen: 'B',
          response_data: {
              row: []
          }
        }
    };
    // tslint:disable-next-line:forin
    for (const keys in json) {
          const jsonKeyValue = {
            key: keys,
            value: json[keys]
        };
        jsonToBeUsed.push(jsonKeyValue);
    }
    const jsonCol = { col: jsonToBeUsed};
    feedbackJson.feedback.response_data.row.push(jsonCol);
    console.log(JSON.stringify(feedbackJson));
  }

}
