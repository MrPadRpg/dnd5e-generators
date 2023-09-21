console.log('Client-side code running');

//const button = document.getElementById('relaunchButton');
const div_result = document.getElementById('dice_result');
const div_detail = document.getElementById('dice_detail');
const div_time = document.getElementById('dice_time');
let dice_form = document.querySelector('#dice_form');

dice_form.addEventListener( 'submit', e => {
  e.preventDefault()
  const o = {}
  new FormData( dice_form ).forEach( ( value, key ) => o[ key ] = value )
  fetch( `/launch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( o )
  })
  .then((response) => response.json())
  .then( data => {
    //console.log( data )

    const timeElapsed = Date.now();
    const now = new Date(timeElapsed);

    div_result.innerHTML=data.result;

    if(data.bonus != "0"){
      div_detail.innerHTML="["+data.detail+"] + "+data.bonus;
    }
    else{
      div_detail.innerHTML="["+data.detail+"]";
    }
    
    const yyyy = now.getFullYear();
    let mm = now.getMonth() + 1; // Months start at 0!
    let dd = now.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let hh = now.getHours();
    let MM = now.getMinutes();
    let ss = now.getSeconds();

    if (hh < 10) hh = '0' + hh;
    if (MM < 10) MM = '0' + MM;
    if (ss < 10) ss = '0' + ss;

    const formattedToday = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + MM + ':' + ss;
    
    div_time.innerHTML=formattedToday;

  })
  .catch( err => console.log( err ))
})
;
