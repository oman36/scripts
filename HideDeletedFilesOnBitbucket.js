$('.file-removed').remove();
$('section.iterable-item').each(function(n,el){
        var type = $('.diff-entry-lozenge', el).text();
        if (-1 === ['Modified','Added'].indexOf(type)) {
                    $(el).remove();
                }

});
