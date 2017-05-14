var pointsArray = document.getElementsByClassName('point');

function forEach() {
    for(var i=0; i < pointsArray.length; i++) {
       callback(i);
    }
};

//not sure if this is right, I tried to follow the syntax provided for callback functions, but I'm still a little fuzzy on them //
