import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import axios from "axios";

export default function Chart(props) {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (props.trades.length > 0) {
            const chart = createChart(chartContainerRef.current,
                {
                    layout: { textColor: 'white', background: { type: 'solid', color: '#171B26' } },
                    grid: {
                        vertLines: { color: '#242733' },
                        horzLines: { color: '#242733' },
                    },
                    crosshair: {
                        mode: 1,
                    },
                    rightPriceScale: {
                        visible: true,
                    },
                    timeScale: {
                        timeVisible: true,
                        secondsVisible: true,
                    },
                    
                });

            const lineSeries = chart.addAreaSeries({ lineColor: '#2962FF', topColor: '#2962FF', bottomColor: 'rgba(41, 98, 255, 0.28)' });

            // Format trade data for Lightweight Charts
            const chartData = formatChartData();
            const sampleData = [{ value: 0, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }];
            const sampleData2 = [{ value: 0, time: 1714522347781 }, { value: 8, time: 1714518411447 }, { value: 10, time: 1714518381419 }, { value: 20, time: 1714517174683 }]


            const sampleData2InSeconds = sampleData2.map(dataPoint => ({
                value: dataPoint.value,
                time: Math.floor(dataPoint.time / 1000), // Convert milliseconds to seconds if necessary
            }));
            // Add data to the series
            lineSeries.setData(chartData);

            chart.timeScale().fitContent();


            return () => chart.remove();
        }
    }, [props.trades]);

    // Format trade data for Lightweight Charts
    const formatChartData = () => {
        return props.trades.map(trade => ({
            time: Math.floor(new Date(trade.createdAt).getTime()), // Convert timestamp to seconds
            value: (trade.lastPrice * 3100),
        }));
    };


    return (
        <div>
            <div id="dextools-widget" ref={chartContainerRef} />
        </div>
    );
}
