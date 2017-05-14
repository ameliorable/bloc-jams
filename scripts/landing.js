var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
    var revealPoint = function(index) {
        points[index].style.opacity = 1;
        points[index].style.transform = "scaleX(1) translateY(0)";
        points[index].style.msTransform = "scaleX(1) translateY(0)";
        points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
        };
        points.forEach(revealPoint());
        // I am getting this error "landing.js:5 Uncaught TypeError: Cannot read property 'style' of undefined//
    // at revealPoint (landing.js:5) //
  //  at animatePoints (landing.js:10) //
  //  at landing.js:24" //
// existing for loop below //
  //for (var i = 0; i < points.length; i++) { //
  //    revealPoint(i); //
  //    } //
};

window.onload = function() {

    if (window.innerHeight > 950) {
      animatePoints(pointsArray);
    }

    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

    window.addEventListener('scroll', function(event) {
      if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
        animatePoints(pointsArray);
      }
    });
}
