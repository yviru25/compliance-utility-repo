import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup , FormControl, FormArray, FormBuilder, Validators} from '@angular/forms';
import { FormData } from './../interface/form-data';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() formData: any;
  optionCForm: FormGroup;
  optCformArray: FormArray;
  mode: boolean;
  touchedRows: any;
  constructor(private fb: FormBuilder) { }

  formGroup = {};
  ngOnInit(): void {
   // console.log(this.formData);
    this.touchedRows = [];
    this.optionCForm = this.fb.group({
      tableRows: this.fb.array([])
    });
   for (let index = 0; index < this.formData.length; index++) {
    this.formGroup[this.formData[index].labelId] = new FormControl('');
   }
   // this.optCformArray =  this.optionCForm.get('tableRows') as FormArray;
   // console.log(this.formGroup);
   this.addRow();
  }

  createForm(): FormGroup {
    return this.fb.group(this.formGroup);
  }

  get getFormControls() {
    const control = this.optionCForm.get('tableRows') as FormArray;
    return control;
  }

 /*  ngAfterOnInit() {
    this.control = this.optionCForm.get('tableRows') as FormArray;
  } */

  addRow() {
    // this.optionCForm.reset(this.formGroup);
    this.optCformArray =  this.optionCForm.get('tableRows') as FormArray;
    this.optCformArray.push(this.createForm());
  }

  deleteRow(index: number) {
    const control =  this.optionCForm.get('tableRows') as FormArray;
    this.optCformArray.removeAt(index);
  }

  onSubmit() {
    const jsonToBeUsed = [];
    const jsonc: any = this.optionCForm.value;
    const firstKey = Object.keys(jsonc.tableRows)[0];
    const firstValue = Object.values(jsonc.tableRows)[0];
    console.log(firstKey + ' : ' + firstValue);
    let jsonCol;
    const feedbackJson = {
        smmry_id: 1.0,
        firstKey: firstValue,
        feedback_lvl: 'L1',
        feedback: {
          optn_chosen: 'C',
          response_data: {
              row: []
          }
        }
    };
    for (let index = 0; index < jsonc.tableRows.length; index++) {
      const jsonarray = [];
      // tslint:disable-next-line:forin
      for (const keys in jsonc.tableRows[index]) {
          if (keys !== 'tsn_id') {
            const jsonKeyValue = {
              key: keys,
              value: jsonc.tableRows[index][keys]
            };
            jsonarray.push(jsonKeyValue);
          }
      }
      jsonToBeUsed.push(jsonarray);
   }
   jsonCol = { col: jsonToBeUsed};
   for (let i = 0; i < jsonCol.col.length; i++) {
     const js = {
        col: jsonCol.col[i]
     };
     feedbackJson.feedback.response_data.row.push(js);
   }
   // feedbackJson.feedback.response_data.row.push(jsonCol);
   console.log(JSON.stringify(feedbackJson));
  }

}
