var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point) {
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)";
};

var animatePoints = function(points) {
      forEach(points, revealPoint);
};
//I updated my code to match what was listed in the solution video, but I am still getting an error:
//"Uncaught ReferenceError: forEach is not defined//
//    at animatePoints (landing.js:11)//
//    at landing.js:33"//

// existing for loop below //
  //for (var i = 0; i < points.length; i++) { //
  //    revealPoint(i); //
  //    } //

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
