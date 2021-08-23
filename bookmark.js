//this file contains the code that will be in the bookmark
//javascript:
(async function() {
    fetch('https://raw.githubusercontent.com/PCS24/Google-Classroom-Info-Downloader/testing/is-code-running/script.js').then((res)=>res.text()).then(text=>eval(text));
  
}());
