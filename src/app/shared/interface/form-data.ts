export interface FormData {
    labelId: any;
    id?: number;
    seqId?: number;
    controlName: string;
    controlType: string;
    valueType?: string;
    currentValue?: string;
    placeholder?: string;
    enum?: Array<{
      optionName: string;
      value: string;
     }>;
    validators?: {
      required?: boolean;
      minlength?: number;
      maxlength?: number;
      regx?: string;
    };
  }
