import React, { useEffect } from 'react';
import { styled } from '@stitches/react';
import { v4 as uuid} from 'uuid';
import Highcharts from 'highcharts';
import { GraphDataSeries } from '../../interfaces/Graph';

/* Styling */
import styles from './index.module.scss';

const GraphWrapper = styled('div', {
  background: '$teal1',
  boxShadow: '$small',
  border: '1px solid $sage_3',
  borderRadius: '7px',
  display: 'flex',
  alignItems: 'center',
  padding: '18px',

  variants: {
    size: {
      'small': {
        width: '100%',
        height: '250px',
      },
      'big': {
        width: '100%',
        height: '518px',
      }
    }
  }
});

const Graph = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

interface Props {
  data?: GraphDataSeries[];
  className?: string;
  size: 'small' | 'big';
  type?: 'line' | 'pie' | 'bar';
}

const SmallGraph = (props: Props) => {
  const { data, className, size, type = 'line'} = props;
  const graphId = uuid();
  let CHART_DATA;
  
  if (type === 'pie') {
  CHART_DATA = [
    {
      name: 'Emissions Over Time',
      type: 'pie',
      data: [{name: 'Emissions', y: 1}, {name: 'No Emissions', y: 2}]
    }
  ];
  } else if (type === 'bar') {
    CHART_DATA = [{
      name: 'Emissions Over Time',
      type: 'bar',
      data: [1,2,3,4,5,6,7,8,9,10]
    }]
  
  } else {
    CHART_DATA = [{
      name: 'Emissions Over Time',
      type: 'line',
      data: [1,2,3,4,5,6,7,8,9,10]
    }];
  }
  const dataWithAxisInfo = CHART_DATA.map((item: any, index) => {
    return {
      ...item,
      yAxis: index,
    };
  });
  useEffect(() => {
    const chartMount = document.getElementById(graphId);
    if (chartMount) {
      Highcharts.chart({
        chart: {
          renderTo: graphId,
          type: type,
          backgroundColor: 'none',
        },

        title: {
          text: '',
        },

        yAxis: [
          {
            // left y axis
            title: {
              text: null,
            },
            labels: {
              align: 'left',
              x: 3,
              y: 16,
            },
            showFirstLabel: false,
          },
          {
            // right y axis
            gridLineWidth: 0,
            opposite: true,
            title: {
              text: null,
            },
            labels: {
              align: 'right',
              x: 3,
              y: 16,
            },
            showFirstLabel: false,
          },
        ],

        xAxis: {
          type: 'datetime',
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            pointStart: new Date().getTime(),
            pointInterval: 1,
            pointIntervalUnit: 'day',
          },
        },

        series: dataWithAxisInfo,

        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 1000,
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                },
              },
            },
          ],
        },
      });
    }
  }, [data]);

  return (
    <GraphWrapper className={className} size={size}>
      <Graph id={graphId}/>
    </GraphWrapper>
  );
};

export default SmallGraph;
