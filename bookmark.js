//this file contains the code that will be in the bookmark
//javascript:
(function() {
    fetch('https://raw.githubusercontent.com/PCS24/Google-Classroom-Info-Downloader/main/script.js').then((res)=>res.text()).then(text=>console.log(eval(text)));
  
}());
