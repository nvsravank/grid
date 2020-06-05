import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { GridsterItem, GridsterConfig } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import * as Highcharts from 'highcharts';

class DataPoint {
  date: Date;
  value: number;
}

class Series {
  name: string;
  data: Array<DataPoint>;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnDestroy {
  @Input()
  widget: GridsterItem;
  @Input()
  resizeEvent : EventEmitter<any>;
  @Input()
  portraitOrientation: boolean;
  @Input()
  gridOptions: GridsterConfig;
  @Input()
  footerHeight: number;
  @Input()
  private rawData: Array<Series>;
  resizeSub: Subscription;
  tooSmall: boolean = false;
  dataTablesForSeries = [];
  componentWidth  = 500;
  componentHeight = 300;

  Highcharts = Highcharts;
  updateFlag = false;
  public options: any;

  // use getter setter to define the property
  get RawData(): any { 
    return this.rawData;
  }
  
  @Input()
  set RawData(val: any) {
    this.rawData = val;
    this.setupChartDataFromRawData();
  }
  constructor() {
    if(! this.rawData || !this.rawData.length || this.rawData.length === 0) {
      // Setup the raw data table with dummay data
      this.setupDummyRawData();
    }
    this.setupHighChartsOptions();
    this.setupChartDataFromRawData()
  }

  setupDummyRawData() {
    this.rawData = [];
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const currentDate = new Date(year, month, day)
    const startDate = new Date(year - 10, month, day);

    let dummyData = this.generateDummyData(startDate, currentDate);
    this.rawData = [{
      name: "Portfolio",
      data: dummyData[0]
    }, {
      name: "Benchmark 1",
      data: dummyData[1]
    }, {
      name: "Benchmark 2",
      data: dummyData[2]
    }, {
      name: "Beginning Value + Investments",
      data: dummyData[3]
    }];
  }

  generateDummyData(fromDate: Date, toDate: Date) {
    const dataArray = [[],[],[],[]];
    let dataForDate = fromDate;
    let i=0;
    let randomPercentage = Math.random() / 20;

    while (dataForDate < toDate) {
      // console.log(dataForDate.valueOf());
      i++;
      let portfolioValueForDate = 0;
      let startingValue = ((dataForDate.valueOf() - fromDate.valueOf()) / (toDate.valueOf() - fromDate.valueOf())) * 30;
      randomPercentage = Math.random() / 5;
      portfolioValueForDate = startingValue * (1 + randomPercentage - 0.1);
      let value1 = startingValue * ( 0.8  - randomPercentage - (Math.random() / 10));
      let value2 = startingValue * (0.7 - randomPercentage - (Math.random() / 10));
      let value3 = startingValue * (0.5 - randomPercentage - (Math.random() / 10));
      let value = [portfolioValueForDate, value1,value2, value3];
      for (let index = 0; index < dataArray.length; index++) {
        const series = dataArray[index];
        series.push({
          date: dataForDate,
          value: value[index]
        });
      }
      // Setup done. Move to next date.
      const year = dataForDate.getFullYear();
      const month = dataForDate.getMonth();
      const day = dataForDate.getDate();
      dataForDate = new Date(year, month, day + 1)
    }
    return dataArray;
  }

  setupChartDataFromRawData() {
    let dataForSeries = [];
    for (let index = 0; index < this.rawData.length; index++) {
      const series = this.rawData[index];
      let data = []
      for (let index = 0; index < series.data.length; index++) {
        const dateDataPoint = series.data[index];
        let dataPoint = [
          dateDataPoint.date.valueOf(),
          dateDataPoint.value
        ];
        data.push(dataPoint);
      }
      dataForSeries.push(data);
    }
    for (let index = 0; index < dataForSeries.length && index < this.rawData.length; index++) {
      this.dataTablesForSeries.push({
        type: "line",
        name:this.rawData[index].name,
        data: dataForSeries[index]
      });
    }
    this.options.series = this.dataTablesForSeries;
    this.updateFlag = true;
  }

  setupHighChartsOptions() {
    this.options = {
      chart: {
          zoomType: 'x',
          width: this.componentWidth,
          height: this.componentHeight,
          marginLeft: 35,
          marginRight: 5,
      },
      title: {
          text: ''
      },
      subtitle: {
          text: ''
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Exchange rate'
          }
      },
      legend: {
          enabled: true
      },
      credits: {
        enabled: false
      },
      plotOptions: {
          area: {
              fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
              },
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },

      series: []
    }
  }

  ngOnInit() {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) { // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log("Old Size:\nRows: " + widget.rows + "\nColumns: " + widget.cols);
        setTimeout(this.sizing.bind(this), 1000);
      }
    });
    this.sizing();
    this.updateFlag = true;
  }
  sizing() {
    // console.log("New Size:\nRows: " + this.widget.rows + "\nColumns: " + this.widget.cols);
    if(!this.gridOptions) {
      this.tooSmall = true;
      return;
    }
    this.componentWidth = (this.widget.cols * 85) + 25;
    this.componentHeight = (this.widget.rows * 27) - 35;
    this.options.chart.width = this.componentWidth-25;
    this.options.chart.height = this.componentHeight;
    this.updateFlag = true;
  }
  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }
}
