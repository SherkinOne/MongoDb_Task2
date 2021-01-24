window.addEventListener("load", function () {
  // const addNewAnswerButton=document.getElementById('addNewAnswer');

  // ADD NEW ANSWER PAGE FUNCTIONS

  // add new answer
  //   addNewAnswerButton.addEventListener('click', function(e) {
  // document.getElementById("newAnswerSection").innerHTML+='<label class="">  Other Answer 2 </label> <input class="answers  w-80 mb-4 border-4 border-blue-500 border-opacity-50" />'
  //   });


  //  ---        - end of enser page functions --

  const button = document.getElementById("answerButton");

  button.addEventListener("click", function (e) {
    console.log("button was clicked");

    fetch("/answer", { method: "GET" })
      .then(function (response) {
        if (response.ok) {
          console.log("Click was recorded");

          return;
        }
        throw new Error("Request failed.");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // changeButton.addEventListener('click', function(e) {
  //   console.log('button was clicked');

  //   fetch('/change', {method: 'GET'})
  //     .then(function(response) {
  //       if(response.ok) {
  //         console.log('Click was recorded');

  //         return;
  //       }
  //       throw new Error('Request failed.');
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // });
});
