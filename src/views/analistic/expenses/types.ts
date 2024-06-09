export interface ILineChartExpProps {
  labels: string[];
  datasets: {
    label: string;
    data: { staff_count: number | string }[];
    borderColor: string;
  }[];
}

export interface ISecondLineDataMulti {
  [x: string]: any;
  purpose: [
    {
      colors: string;
      staff: (string | number)[];
      per_staff: (string | number)[][];
    }
  ];
  types: [
    {
      colors: string;
      staff: (string | number)[];
      per_staff: (string | number)[][];
    }
  ];
  subtypes: [
    {
      colors: string;
      staff: (string | number)[];
      per_staff: (string | number)[][];
    }
  ];
}
