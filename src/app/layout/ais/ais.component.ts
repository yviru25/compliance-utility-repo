import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../../shared/shared-service';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DynamicDialogComponent } from '../../shared/dyanmic-dialog/dynamic-dialog.component';
import { PopupMsgDialogComponent } from '../../shared/feedback/popup-msg-dialog/popup-msg-dialog.component';
import { BulkDialogComponent } from '../../shared/bulk-dialog/bulk-dialog.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';
export let selectedInfoCode: any;
@Component({
  selector: 'app-ais',
  templateUrl: './ais.component.html',
  styleUrls: ['./ais.component.scss'],
  providers: [SharedServices]
})
export class AisComponent implements OnInit {
  public aisPartBDetails: any;
  public aisSubPartBDetails: any;
  public aisPartADetails: any;
  public aisPartBJsonDetail = {};
  public groupByPartLabel = {};
  public  sourceInfoMetaData = [];
  public selectedKeyInfo: any;
  public expanded: Boolean;
  public feedbackOption: any;
  public a2 = [
                {
                  'key': 'infoCode',
                  'value': 'TDS-192'
                },
                {
                  'key': 'infoCategory',
                  'value': 'Salaries'
                },
                {
                  'key': 'infoSource',
                  'value': 'Punjab National Bank (TANXXXXXXX)'
                }
          ];
  public a1 =
            [
              {
                'key': 'infoCode',
                'value': 'TDS-193'
              },
              {
                'key': 'infoCategory',
                'value': 'Salaries'
              },
              {
                'key': 'infoSource',
                'value': 'Punjab National Bank (TANXXXXXXX)'
              }
          ];
    constructor(private service: SharedServices, private route: Router,
      private dialog: MatDialog, private dbService: NgxIndexedDBService) {
        this.checkIfObjectsAreSame(this.a1, this.a2);
    }

    ngOnInit() {
      this.dbService.getAll('file_import_data').then( res => {
        this.aisPartBDetails = res[0]['data']['ais']['parts'];
        this.aisPartADetails = this.aisPartBDetails[0];
        this.aisSubPartBDetails = this.aisPartBDetails[1].subParts;
        this.aisSubPartBDetails.forEach(el => {
         this.groupByPartLabel [el.label] = this.groupByPartLabel [el.label] || [];
        if (el.infoDtls !== null && el.infoDtls.nestedInformation !== null) {
          this.groupByPartLabel [el.label].push(
            {
                type: el.type,
                description: el.description,
                label: el.label,
                labelDescription: el.labelDescription,
                formInfo: el.formInfo,
                columnDefs: el.infoDtls.columnDefs,
                columnDisplayed: this.convertJsonObjectToString(el.infoDtls.columnDefs),
                nestedInformation: el.infoDtls.nestedInformation,
                mappingKey: el.infoDtls.nestedInformation.data.sourceData,
                // tslint:disable-next-line:max-line-length
                rowData: this.convertSpecficJsonLayout(el.infoDtls.data, el.infoDtls.nestedInformation.metaData, el.infoDtls.nestedInformation.data),
                subParts: el.subParts
            }
          );
        } else if (el.infoDtls !== null && el.infoDtls.nestedInformation === null) {
          this.groupByPartLabel [el.label].push(
            {
                type: el.type,
                description: el.description,
                label: el.label,
                labelDescription: el.labelDescription,
                formInfo: el.formInfo,
                columnDefs: el.infoDtls.columnDefs,
                columnDisplayed: this.convertJsonObjectToString(el.infoDtls.columnDefs),
                nestedInformation: el.infoDtls.nestedInformation,
                rowData: this.ConvertJsonArrayToObjectKeyValue(el.infoDtls.data),
                subParts: el.subParts
            }
          );
        } else {
          this.groupByPartLabel [el.label].push(
            {
              type: el.type,
              description: el.description,
              label: el.label,
              labelDescription: el.labelDescription,
              formInfo: el.formInfo,
              columnDefs: null,
              nestedInformation: null,
              rowData: null,
              subParts: this.convertSubPartJsonArray(el.subParts)
            }
          );
        }
        });
        console.log(this.groupByPartLabel);
      });

      this.service.getInternalHttpRequest('assets/info_metadata.json').subscribe( res => {
          this.sourceInfoMetaData = res.sourceInfoMetaData;
          // console.log(this.sourceInfoMetaData);
      });
    }
    ConvertArrayToObjectKeyValue(jsonArray: any): any {
      const jsonObject = {};
      for (let i = 0; i < jsonArray.length; i++) {
        const elem = jsonArray[i];
        jsonObject[elem.keyId] = elem.keyValue;
      }
      return jsonObject;
    }
    ConvertJsonArrayToObjectKeyValue(jsonArrayData: any): any {
      const returnArrayObject = [];
      for (let i = 0; i < jsonArrayData.length; i++) {
        const jsonObject = {};
        for (let j = 0; j < jsonArrayData[i].colData.length; j++) {
          const elem = jsonArrayData[i].colData[j];
          jsonObject[elem.field] = elem.value;
        }
        returnArrayObject.push(jsonObject);
      }
      return returnArrayObject;
    }

    convertJsonArrayToObject(dataArray: any): any {
      const returnArrayObject = [];
      for (let i = 0; i < dataArray.length; i++) {
        const jsonObject = {};
        for (let j = 0; j < dataArray[i].mappingKey.key.length; j++) {
          const elem = dataArray[i].mappingKey.key[j];
          jsonObject[elem.keyId] = elem.keyValue;
          jsonObject['sourceData'] = this.ConvertJsonArrayToObjectKeyValue(dataArray[i].sourceData);
        }
        returnArrayObject.push(jsonObject);
      }
      return returnArrayObject;
    }
    convertJsonArrayToObjectColumn(dataArray: any): any {
      const returnArrayObject = [];
      for (let i = 0; i < dataArray.length; i++) {
        const jsonObject = {};
        for (let j = 0; j < dataArray[i].mappingKey.key.length; j++) {
          const elem = dataArray[i].mappingKey.key[j];
          jsonObject[elem.keyId] = elem.keyValue;
          jsonObject['columnDefs'] = dataArray[i].columnDefs;
        }
        returnArrayObject.push(jsonObject);
      }
      return returnArrayObject;
    }

    convertSpecficJsonLayout(rowData: any, childColDefs: any, childRowData: any) {
        const dataR = this.ConvertJsonArrayToObjectKeyValue(rowData);
        const chldCol = this.convertJsonArrayToObjectColumn(childColDefs);
        const chldDataR = this.convertJsonArrayToObject(childRowData);
        const jsonArray = [];
        for (let pd = 0; pd < dataR.length; pd++) {
              for (let ccol = 0; ccol < chldCol.length; ccol++) {
                  if (dataR[pd].infoCode === chldCol[ccol].infoCode && dataR[pd].infoCategory === chldCol[ccol].infoCategory) {
                           const jb = {
                              nestedInformation: {}
                           };
                          // tslint:disable-next-line:forin
                          for (const key in dataR[pd]) {
                              jb[key] = dataR[pd][key];
                          }
                          jb.nestedInformation['columnDefs'] = chldCol[ccol].columnDefs;
                          for (let cd = 0; cd < chldDataR.length; cd++) {
                            if (dataR[cd].infoCode === chldDataR[cd].infoCode &&
                                // tslint:disable-next-line:max-line-length
                                dataR[pd].infoCategory === chldDataR[cd].infoCategory && dataR[pd].infoSource === chldDataR[cd].infoSource) {
                                  jb.nestedInformation['rowData'] = chldDataR[cd].sourceData;
                            }
                          }
                          jsonArray.push(jb);
                       // return jb;
                  }
              }
        }
        return jsonArray;
    }

    convertSubPartJsonArray(subPartArrayList: any): any {
          const returnArray = [];
          for (let index = 0; index < subPartArrayList.length; index++) {
            const jsonObject = {};
            jsonObject['type'] = subPartArrayList[index].type;
            jsonObject['description'] = subPartArrayList[index].description;
            jsonObject['label'] = subPartArrayList[index].label;
            jsonObject['labelDescription'] = subPartArrayList[index].labelDescription;
            jsonObject['formInfo'] = subPartArrayList[index].formInfo;
            jsonObject['columnDefs'] = subPartArrayList[index].infoDtls.columnDefs;
            jsonObject['nestedInformation'] = subPartArrayList[index].infoDtls.nestedInformation;
            jsonObject['rowData'] = this.ConvertJsonArrayToObjectKeyValue(subPartArrayList[index].infoDtls.data);
            jsonObject['subParts'] = subPartArrayList[index].subParts;
            returnArray.push(jsonObject);
          }
          return returnArray;
    }

    convertJsonObjectToString(dataList: any): any {
          const arrayOfString = [];
          for (let index = 0; index < dataList.length; index++) {
            arrayOfString.push(dataList[index].name);
          }
          return arrayOfString;
    }

    getFieldOfSourceMetaDataInfo(metaData: any, selectedDataMapping: any) {
         let returnObject: any = [];
         for (let index = 0; index < metaData.length; index++) {
             if (this.checkIfObjectsAreSame(selectedDataMapping, metaData[index].mappingKey)) {
                returnObject = metaData[index].field;
             }
         }
         // console.log(returnObject);
        return returnObject;
    }

    checkIfObjectsAreSame(obj1: any, obj2: any): Boolean {
        const x = this.ConvertArrayToObjectKeyValue(obj1);
        const y = this.ConvertArrayToObjectKeyValue(obj2);
        const returnObject: boolean = Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(p => x[p] === y[p]);
        return returnObject;
    }

    openDialog(parentColumnDefs, parentRowData, childColumnDef, mappingKey, nestedInfo) {
       if (this.selectedKeyInfo.length > 0) {
        if (this.selectedKeyInfo.length === 1) {
          this.service.getInternalHttpRequest('assets/options.json').subscribe( res => {
                this.feedbackOption = res.ais_options.feedbackoption;
                const dialogRef = this.dialog.open(DynamicDialogComponent , {
                  width: 'auto',
                  maxWidth: 'none !important',
                  data: {
                    feedback: this.feedbackOption,
                    parentColumnDefs: parentColumnDefs,
                    parentRowData: parentRowData,
                    childColumnDef: childColumnDef,
                    selectedDataList: this.selectedKeyInfo,
                    parentMappingKeys: mappingKey.key,
                    nestedInformation: nestedInfo,
                    sourceMetaData: this.getFieldOfSourceMetaDataInfo(this.sourceInfoMetaData, mappingKey.key)
                  }
                });
                dialogRef.afterClosed().subscribe(result => {
                  console.log(`Dialog result: ${result}`);
                });
          });
        }
      }
      /*  } else {
            const dialogRef = this.dialog.open(BulkDialogComponent , {
              width: 'auto',
              maxWidth: 'none !important',
              height: 'auto',
              data: {
                feedback: this.feedbackOption,
                metaDataInfoField: this.infoMetaData[0].field,
                checkedInfoList: this.l1CheckedDataList,
                l1headerList: selectedL1Header,
                activeTransList: actvTrnsList
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
            });
        }
      } else {
        const dialogRef = this.dialog.open(PopupMsgDialogComponent , {
          width: 'auto',
          maxWidth: 'none !important',
          data: {
            message: 'Please select atleast one row',
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      } */
    }

    expandRow(isExpande) {
      this.expanded = isExpande;
      console.log(this.expanded);
      if (this.expanded) {
          this.selectedKeyInfo = [];
      }
     // console.log(this.selectedKeyInfo);
    }
}
