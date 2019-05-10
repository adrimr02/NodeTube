$('#btn-like').click(function(e) {
    e.preventDefault();
    let videoId = $(this).data('id');
    
    $.post(`/video/${videoId}/like`)
        .done( data => {
            $('.likes-count').text(' ' + data.likes);
        });
});

$('#description').hide();
$('#btn-toggle-description').click(function(e) {
    e.preventDefault();
    if($('#description').is(':visible')) {
        $('#description-btn').text('Mostrar describción');
    } else {
        $('#description-btn').text('Ocultar describción');
    }
    $('#description').slideToggle();
    
})

$('#post-comment').hide();
$('#btn-toggle-comment').click(function(e) {
    e.preventDefault();
    $('#post-comment').slideToggle();
})

$('#subscribe-channel').click(function(e) {
    e.preventDefault();
    let channelName = $(this).data('id');
    
    $.post(`/channel/${channelName}/subscribe`)
        .done( data => {
            console.log('subscribed');
        });
});

$('#delete-video').click(function (e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('¿Eliminar definitivamente?');
    if (response) {
        let videoId = $this.data('id');
        $.ajax({
            url: `/video/delete/${videoId}`,
            type: 'DELETE'
        })
            .done(function (results) {
                console.log(results);
            });
    }
});