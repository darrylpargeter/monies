console.log('hello')

const svg = d3.select('svg');
const m = { top: 20, right: 20, bottom: 30, left: 50 };
const width = +svg.attr('width') - m.left - m.right;
const height = +svg.attr('height') -m.top - m.bottom;
const g = svg.append('g').attr('transform', `translate(${m.left}, ${m.top})`);

const parseTime = d3.timeParse('%d-%b-%y');

const x = d3.scaleTime()
  .rangeRound([0, width]);

const y = d3.scaleLinear()
  .rangeRound([height, 0]);

const line = d3.line()
  .x(d => x(d.timestamp))
  .y(d => y(d.current_kwh));

d3.json('/api/chart', ({ data }) => {
  data = data.map(v => {
    v.timestamp = new Date(v.timestamp);
    return v;
  });
  console.log('here');

  x.domain(d3.extent(data, d => d.timestamp));
  y.domain(d3.extent(data, d => d.current_kwh));

  g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))
   .select('.domain')
    .remove();

  g.append('g')
    .call(d3.axisLeft(y))
  .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('KwH');

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);
});
