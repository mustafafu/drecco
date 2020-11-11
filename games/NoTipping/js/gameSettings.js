function initInfo(name, group, desc) {
    $("#gameName").append(name);
    $("#groupName").append(group);
    $("#gameDesc").append(desc);
}

function newWindowBtn(width, height, url, id) {
    var container = $('<div>', {class:'form-group'});
    var space = $('<p>');
    var button = $('<button>', {class: 'btn btn-default', type:'button', name:'btnPopup'});
    button.append("POPUP");
    button.on('click', function () {
        var popup = window.open(url, "_blank", "width="+width+", height="+height);
        popup.onload = function () {
            for (i=0;i<id.length;i++) {
                console.log(document.getElementById(id[i]).innerHTML);
                popup.document.getElementById(id[i]).innerHTML = document.getElementById(id[i]).innerHTML;
                // popup.document.getElementById(id[i]).innerHTML = window.frames[0].document.getElementById(id[i]).innerHTML;
                // popup.document.write("<p>TEST</p>");
            }
        };
    });
    container.append(button);
    $("#gameSettings").append(container);
    $("#gameSettings").append(space);
}

function newTextBox(title, id) {
    var container = $('<div>', {class:'form-group'});
    var label = $('<label>');
    var space = $('<p>');
    var val = $('<div>')
    val.attr('id',id);
    val.hide();
    label.attr('for',title);
    label.append(title);
    var box = $('<input>', {type:'text', id:title, name:title, class:'form-control'});
    box.on('keyup',function () {
        window.frames[0].document.getElementById(id).innerHTML = box.val();
        document.getElementById(id).innerHTML = $(this).val();
    })
    container.append(label);
    container.append(box);
    $("#gameSettings").append(container);
    $("#gameSettings").append(val);
    $("#gameSettings").append(space);
};

function newButtonGroup(title, choices, id) {
    var container = $('<div>',{class: 'btn-group', id:title});
    var space = $('<p>');
    var val = $('<div>')
    val.attr('id',id);
    val.hide();
    for (i=0;i<choices.length;i++) {
        var button = $('<button>', {class: 'btn btn-primary', type:'button', value:choices[i]});
        button.append(choices[i]);
        button.on('click',function () {
           window.frames[0].document.getElementById(id).innerHTML = $(this).val();
           document.getElementById(id).innerHTML = $(this).val();
        });
        container.append(button);
    }
    $("#gameSettings").append(container);
    $("#gameSettings").append(val);
    $("#gameSettings").append(space);
}

function newSelect(title, choices, id) {
    var container = $('<div>', {class: 'form-group'});
    var space = $('<p>');
    var label = $('<label>');
    label.attr('for', title);
    label.append(title);
    var val = $('<div>')
    val.attr('id',id);
    val.hide();
    $("#gameSettings").append(val);
    var select = $('<select>', {class: 'form-control', id:title})
    for (i=0;i<choices.length;i++) {
        var item = $('<option>');
        item.append(choices[i]);
        select.append(item);
        if (i == 0) {
            console.log("selected")
            item.attr('selected','selected')
            document.getElementById(id).innerHTML = item.val();
        }
    }
    select.change(function () {
        window.frames[0].document.getElementById(id).innerHTML = $(this).val();
        document.getElementById(id).innerHTML = $(this).val();
    });
    container.append(label);
    container.append(select);
    $("#gameSettings").append(container);
    $("#gameSettings").append(space);
}
