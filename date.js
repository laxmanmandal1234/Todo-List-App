
//exporting getdate function expression
exports.getDate = function() {
  let today = new Date();
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  return today.toLocaleDateString("en-US", options);  //returning date in required format
}
