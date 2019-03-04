var formulario;

// elimina todas las filas de la tabla, menos la principal
function removeNews(){
    $('#newslist1').children('li').remove();
    $('#newslist2').children('div').remove();
};

function addNews(news){
    for (var i=0; i < news.length; i++) {
        if(i==0){
            $("#newslist1").append('<li class="active" data-target="#carouselExampleIndicators" data-slide-to='+i+'></li>');
        }else{
            $("#newslist1").append('<li data-target="#carouselExampleIndicators" data-slide-to='+i+'></li>');
        }
    }
    
    for (var i=0; i < news.length; i++) {
        if(i==0){
            $("#newslist2").append(`  <div class="carousel-item active" style="background-image: url(${news[i].image.imageURL});">
                                            <div class="carousel-caption d-none d-md-block">
                                                <div class="fondo">
                                                    <h3>${news[i].title}</h3>
                                                    <p style="font-size:1.3vw;">${news[i].body}</p>
                                                </div>    
                                            </div>
                                        </div>`);
        }else{
            $("#newslist2").append(`  <div class="carousel-item" style="background-image: url(${news[i].image.imageURL});">
                                            <div class="carousel-caption d-none d-md-block">
                                                <div class="fondo">     
                                                    <h3>${news[i].title}</h3>
                                                    <p style="font-size:1.3vw;">${news[i].body}</p>
                                                </div>        
                                            </div>
                                        </div>`);
        }
    }
    
}

function getNews(){
    $.ajax({
        url: '/n/getnews/',
        type: 'POST',
        success : function(data) {
            console.log(data)
            removeNews()
            addNews(data.news)
            // remove options
            //removeOption('forDelegation')
            // add options
            //addOptions('forDelegation', data.delegations)
        }
    });
}

$(function(){ 
    var minutes = 10
    
    // refreshing
    setInterval(function(){
        try{
            getNews()
        } catch (error){
            console.log(error)
        }
    }, minutes * 1000 * 60); // time in minutes

});