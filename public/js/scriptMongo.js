const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = '<div class="col s4 center-align">'+
                '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="../'+item.path+'">'+
                '</div><div class="card-content">'+
                '<span class="card-title activator grey-text text-darken-4">'+item.title+'<i class="material-icons right">more_vert</i></span><p><a href="#"></a></p></div>'+
                '<div class="card-reveal">'+
                '<span class="card-title grey-text text-darken-4">'+item.subTitle+'<i class="material-icons right">close</i></span>'+
                '<p class="card-text">'+item.description+'</p>'+
                '</div></div></div>';
        $("#card-section").append(itemToAppend)
    });
}

function validateFormData(formData) {
    for (const key in formData) {
        if (formData[key] === '' || formData[key] === undefined) {
            console.error(`Validation Error: ${key} is missing or empty`);
            return false;
        }
    }
    return true;
}

const formSubmitted = () => {
    let formData = {};
    formData.title = $('#title').val();
    formData.subTitle = $('#subTitle').val();
    formData.path = $('#path').val();
    formData.description = $('#description').val();

    if (!validateFormData(formData)) {

    alert('Please fill all fields');
    } else {
        adddog(formData);  // Changed from postdog to adddog
        var instance = M.Modal.getInstance($('#modal1'));
        instance.close();
    }

}

function adddog(cat) {
    addCards([cat]);

    $.ajax({
        url: '/api/cat',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cat),
        success: (result) => {
            console.log("POST DOG RESPONSE::::::::::", result);
            if (result.statusCode === 201) {
      
                alert('dog post successful');
            }
        },
        error: (xhr, status, error) => {
            console.error("Error posting dog:", status, error);
        }
    });
}



function getAlldogs(){
    console.log("FRONTEND GET ALL CATS");
    
    $.get('/api/cats', (response)=>{
        console.log("FRONTEND GET ALL CATS RESPONSE::::::::::", response);
        
        // response's data is in array format, so we can use it
        if (response.statusCode === 200) {
            console.log("DATA::::::::::", response.data);
            
            addCards(response.data);
        }
    });
}

$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('#formSubmit').click(()=>{
        formSubmitted();
    });
    $('.modal').modal();
    getAlldogs();
});