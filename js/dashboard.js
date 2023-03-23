const chart = document.querySelector('#chart').getContext('2d');

// create a new chart instance

new Chart(chart,{
    type: 'line',
    data: {
        lables:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'],

        datasets: [
            {
                lable:'BTC',
                data: [1,2,3,4,5,6,7,8,90],
                borderColor: 'red',
                borderWidth: 2
            },

            {
                lable:'EHT',
                data: [9,6,58,4,2,6,7,1,3],
                borderColor: 'green',
                borderWidth: 2
            },
        ]
    },
    options: {
        responsive: true
    }
})