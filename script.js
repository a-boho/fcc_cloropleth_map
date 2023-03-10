let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

let educationData
let countyData

let width = 1200
let height = 600
let padding = 75

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr('class', 'county')
          .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if (percentage <= 10) {
                    return '#eb2f06' //tomato red
                } else if (percentage <= 20) {
                    return '#ffaf40' //mandarin sorbet
                } else if (percentage <= 30) {
                    return '#fff200' //dorn yellow
                } else if (percentage <= 40) {
                    return '#18dcff' //neon blue
                } else if (percentage <= 50) {
                    return '#7efff5' //electric blue
                } else {
                    return '#32ff7e' //wintergreen
                }
          })
          .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
          })
          .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
          })
          .on('mouseover', (event, countyDataItem) => {
                tooltip.transition()
                       .style('visibility', 'visible')

                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })

                tooltip.text(
                    county['fips'] + 
                    ' - ' + 
                    county['area_name'] + 
                    ', ' + 
                    county['state'] + 
                    ' : ' + 
                    county['bachelorsOrHigher'] + 
                    '%')
                tooltip.attr('data-education', county['bachelorsOrHigher'])
          })
          .on('mouseout', (event, countyDataItem) => {
                tooltip.transition()
                       .style('visibility', 'hidden')
          })
}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(log)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)