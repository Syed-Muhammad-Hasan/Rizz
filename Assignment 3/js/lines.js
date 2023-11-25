$( '#SelectState' ).select2( {
    // theme: "bootstrap-5"
} );

$( '#SelectYear' ).select2( {
    theme: "bootstrap-5",
    maximumSelectionLength: 10,
    closeOnSelect: false,
} );
fetch("../data/States.json")
      .then(response => response.json())
      .then(data => {
        const citySelect = document.getElementById('SelectState');
        Object.entries(data).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = key; 
            option.textContent = value; 
            citySelect.appendChild(option);
            console.log(`Key: ${key}, Value: ${value}`);
        });
      })
      .catch(error => console.error('Error fetching data:', error));

const yearSelect = document.getElementById('SelectYear');
var year = new Date().getFullYear() ;
for(var i=1895 ;i< year+1; i++){
    const option = document.createElement('option');
    option.value = i; 
    option.textContent = i; 
    yearSelect.appendChild(option);
    
};