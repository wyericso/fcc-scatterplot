'use strict';

const w = 800;
const h = 600;
const padding = 40;

const svg = d3.select('#container')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('viewBox', '0 0 ' + w + ' ' + h);

svg.append('title')
    .attr('id', 'title')
    .text('Doping in Professional Bicycle Racing');

svg.append('text')
    .text('Doping in Professional Bicycle Racing')
    .attr('text-anchor', 'middle')
    .attr('x', w / 2)
    .attr('y', padding);

d3.select('#container')
    .append('div')
    .attr('id', 'legend')
    .attr('style',
        'top: 200px;' +
        'left: 600px;'
    )
    .html(`
        <span style="color: red; opacity: 0.3;">&block;</span> Record with doping allegation
        <br>
        <span style="color: blue; opacity: 0.3;">&block;</span> Record without doping allegation
    `);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then((dataset) => {
        const xParseTime = d3.timeParse('%Y');
        const xScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, (d) => xParseTime(d.Year - 1)),
                                d3.max(dataset, (d) => xParseTime(d.Year + 1))
                            ])
                            .range([padding, w - padding]);
        const yParseTime = d3.timeParse('%M:%S');
        const yScale = d3.scaleTime()
                            .domain([
                                d3.min(dataset, (d) => yParseTime(d.Time)),
                                d3.max(dataset, (d) => yParseTime(d.Time))
                            ])
                            .range([padding, h - padding]);
                    
        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('fill', (d) => d.Doping ? 'red' : 'blue')
            .attr('data-xvalue', (d) => xParseTime(d.Year))
            .attr('data-yvalue', (d) => yParseTime(d.Time))
            .attr('cx', (d) => xScale(xParseTime(d.Year)))
            .attr('cy', (d) => yScale(yParseTime(d.Time)))
            .attr('r', 5)
            .attr('opacity', 0.3)
            .on('mouseover', (d) => {
                const tooltip = d3.select('#container')
                                    .append('div')
                                    .attr('id', 'tooltip')
                                    .attr('data-year', xParseTime(d.Year));
                tooltip.append('div').text(d.Name + ' from ' + d.Nationality);
                tooltip.append('div').text('Year: ' + d.Year);
                tooltip.append('div').text('Time (mm:ss): ' + d.Time);;
                if (d.Doping) {
                    tooltip.append('div').text(d.Doping);
                }
                else {
                    tooltip.append('div').append('i').text('No doping allegation');
                }
                tooltip.attr('style',
                    'top: ' + (yScale(yParseTime(d.Time)) - document.getElementById('tooltip').offsetHeight) + 'px;' +
                    'left: ' + (xScale(xParseTime(d.Year)) - document.getElementById('tooltip').offsetWidth) + 'px;'
                );
            })
            .on('mouseout', () => {
                d3.select('#tooltip').remove();
            });

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale)
                        .tickFormat(d3.timeFormat('%M:%S'));

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0, ' + (h - padding) + ')')
            .call(xAxis);
        svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + padding + ', 0)')
            .call(yAxis);
    });
